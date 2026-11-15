// Vercel serverless function: GET /api/nasa
// Server-side proxy to the NASA Technical Reports Server (NTRS) public API, which does not send CORS headers.
// Returns the top NASA reports for each health risk ASCLEPIUS monitors. Cached at the edge for a day.
const Q = {
  hypoxia: 'hypoxia extravehicular activity',
  hyperthermia: 'thermal stress extravehicular activity',
  fever: 'immune dysregulation spaceflight',
  arrhythmia: 'cardiac rhythm problems spaceflight',
  dehydration: 'orthostatic intolerance spaceflight',
  co2: 'carbon dioxide exposure crew',
  radiation: 'space radiation exposure Mars mission',
  bone: 'bone loss long duration spaceflight',
  sans: 'spaceflight associated neuro-ocular syndrome',
};

const wait = ms => new Promise(r => setTimeout(r, ms));
async function search(q) {
  let r;
  for (let attempt = 0; attempt < 3; attempt++) {
    r = await fetch('https://ntrs.nasa.gov/api/citations/search?page.size=8&q=' + encodeURIComponent(q), { headers: { accept: 'application/json' } });
    if (r.ok) break;
    await wait(600 * (attempt + 1));   // NTRS rate-limits bursts (HTTP 503)
  }
  if (!r.ok) throw new Error('NTRS HTTP ' + r.status);
  const j = await r.json();
  const seen = new Set();
  return (j.results || [])
    .filter(x => x.title && !seen.has(x.title.trim().toLowerCase()) && seen.add(x.title.trim().toLowerCase()))
    .slice(0, 3)
    .map(x => ({
      id: x.id,
      title: x.title.replace(/\s+/g, ' ').trim(),
      year: ((x.publications && x.publications[0] && x.publications[0].publicationDate) || x.submittedDate || '').slice(0, 4),
      center: (x.center && x.center.name) || '',
      abstract: (x.abstract || '').replace(/\s+/g, ' ').trim().slice(0, 260),
      url: 'https://ntrs.nasa.gov/citations/' + x.id,
    }));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const items = {}, errors = {};
  for (const [k, q] of Object.entries(Q)) {          // sequential: NTRS rejects parallel bursts
    try { items[k] = await search(q); } catch (e) { errors[k] = String(e && e.message || e); }
    await wait(150);
  }
  if (!Object.keys(items).length) return res.status(502).json({ error: 'NTRS unavailable', errors });
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
  res.status(200).json({ source: 'NASA Technical Reports Server (live)', fetched: new Date().toISOString(), queries: Q, items, errors });
};
