# ASCLEPIUS: Space Apps 2026 submission text

**Challenge:** Create Health Monitoring Software for Astronauts on Space Missions

Copy each section into the matching field of the Space Apps project form.

---

## Project name
ASCLEPIUS: Autonomous crew health monitoring for deep-space missions

## High-level summary (short)
On the way to Mars, a message to a flight surgeon takes up to 22 minutes each way, so the crew must detect and handle medical problems alone. Today's alarms use fixed hospital limits. They fire on every workout and stay silent while a fever or slow dehydration builds. ASCLEPIUS learns each astronaut's own normal for every activity and time of day: sleep, work, exercise and EVA. It watches six vital signs every minute, flags deviations early, explains them in plain numbers, ranks the likely cause, and gives the onboard protocol immediately while it queues an Earth consult with a light-time-aware ETA. It also tracks cabin CO₂, live space radiation from GOES satellites, live ISS South Atlantic Anomaly crossings, and long-term risks (career radiation dose against NASA's 600 mSv limit, bone loss and SANS). In a 400-trial Monte Carlo validation, it detected about 100% of injected medical events with about 0 false alarms per crew-day. Standard fixed limits caught 64% with 0.47 false alarms per day. ASCLEPIUS was twice as fast (median 24 min vs 48 min) and named the correct cause 87% of the time.

## Project details (long description)

**The problem.** NASA's Mars plans require Earth-independent medical operations. The crew and their software must detect, triage and act without real-time help from the ground. Wearable sensors already exist, but the alarm logic behind them is hospital-style fixed thresholds. In space this fails in two ways:
1. **False alarms.** Astronauts exercise about 2 hours a day, so fixed heart-rate limits either fire constantly or get muted.
2. **Late detection.** Early warnings such as a rising temperature, a creeping heart rate or falling blood pressure stay "in range" for a long time.

**What ASCLEPIUS does.**
- **Personalised expected band.** For each astronaut and vital (heart rate, HRV, SpO₂, respiration, core temperature, systolic BP), it predicts the expected value right now from:
  - their personal baseline,
  - the crew timeline (activity response with physiological lag),
  - their circadian phase,
  - a slow adaptive bias.

  The uncertainty band widens during exertion and transitions. The dashboard shows each vital against its band.
- **Detection.** A smoothed multivariate deviation score catches acute events, a two-sided CUSUM catches slow drifts, and hard safety floors cover critical values. The CUSUM is corrected for autocorrelated physiological noise.
- **Explainable differential diagnosis.** The deviation pattern is matched against physiological signatures of hypoxia, heat stress, infection or fever, cardiac arrhythmia (AF), orthostatic intolerance or dehydration, and hypercapnia (cabin CO₂). Cabin sensor data feeds into the match. The output is a ranked differential with % match, plus the exact numbers behind it, for example "SpO₂ 89.3% (expected 98.6, −13.3σ)".
- **Act now, consult later.** Every alert carries the onboard protocol. An Earth consult is queued with a reply ETA that includes the round-trip light time (Mars about 12.5 min each way in our scenario).
- **Space environment.**
  - Live GOES ≥10 MeV proton flux with the NOAA S-scale.
  - Live ISS position, flagging South Atlantic Anomaly passes.
  - A solar-particle-event scenario with a storm-shelter workflow.
  - Cabin ppCO₂ and the other habitat sensors.
- **Long-duration outlook.**
  - Career dose against NASA's 600 mSv limit, with a mission-end projection. A conjunction-class Mars mission comes to about 1.1 Sv, which exceeds the limit and is flagged.
  - Hip bone mineral density loss, scaled by exercise compliance and gravity.
  - SANS risk by mission day.
  - Mission profiles for the ISS, the Artemis lunar surface and Mars transit.
- **Live demo.** You can inject events (CO₂ scrubber failure, EVA cooling failure, suit O₂ fault, new-onset AF, fever, dehydration, solar particle event) and watch the system respond in real time.

**Validation.** The Validation tab runs, live in the browser:
- 400 simulated 10-hour shifts with random physiology, a random exercise time and realistic autocorrelated sensor noise.
- In 60% of trials, a random event at a random time with severity randomised between 50% and 110%.
- A detector that is deliberately imperfect: calibration error, wrong time constants and circadian phase error.

| Event | Detected (ours / fixed) | Median latency (ours / fixed) | Correct diagnosis |
|---|---|---|---|
| Hypoxia | 100% / 95% | 6 / 10 min | 100% |
| Heat stress | 100% / 100% | 13 / 24 min | 57% |
| Infection / fever | 100% / 100% | 41 / 86 min | 73% |
| Cardiac arrhythmia (AF) | 100% / 33% | 4 / 96 min | 100% |
| Orthostatic / dehydration | 100% / 35% | 77 / 88 min | 98% |
| Hypercapnia (CO₂) | 97% / 18% | 45 / 137 min | 100% |
| **Overall** | **100% / 64%** | **24 / 48 min** | **87%** |

False alarms: 0.00 per crew-day for ASCLEPIUS and 0.47 for fixed limits, even with the fixed limits muted during exercise. The results are reproducible (seed 2026) and stable across seeds.

We are open about the limits. Crew vitals are simulated because real astronaut medical telemetry is not public. The detector and the simulator share a model family, so these figures are an upper bound. Real validation is the first roadmap item.

During development the validation also caught our own bug. The first version produced about 4 false alarms per day because its drift detector treated autocorrelated physiological noise as independent. We found it, fixed it with an effective-sample-size correction, and the false-alarm rate fell to about 0.

**Roadmap.**
- Ingest real wearable streams (ECG R-R intervals, PPG, ingestible temperature sensors).
- Train the signature library on analog-mission data (HERA, CHAPEA) and NASA Life Sciences Data Archive datasets.
- Add sleep, cognitive and behavioural-health modules.
- Drive radiation-shelter scheduling from DONKI solar particle event forecasts.

**Tools.** HTML, CSS and JavaScript with Chart.js. Runs fully client-side, needs no install, and runs about 1 ms per crew-minute, which suits low-power onboard hardware.

## Space agency data used
- **NOAA SWPC / GOES** (NOAA–NASA satellites): live integral proton flux at ≥10 MeV and ≥100 MeV. https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json
- **NASA GIBS**: Blue Marble Shaded Relief and Bathymetry imagery for the ISS ground-track map. https://earthdata.nasa.gov/gibs
- **ISS live ephemeris** (NORAD 25544) via the wheretheiss.at API.
- **NASA research parameters**:
  - NASA-STD-3001: 600 mSv career radiation limit and the CO₂ crew-health target.
  - NASA Human Research Program risks: SANS, bone loss, cardiac rhythm, radiation, in-flight medical conditions.

## References
- Zeitlin C. et al. (2013), *Science* 340: Curiosity RAD cruise dose of about 1.84 mSv/day.
- Hassler D.M. et al. (2014), *Science* 343: Mars surface radiation of about 0.64 mSv/day.
- Zhang S. et al. (2020), *Science Advances* 6: Chang'e-4 LND lunar surface dose of about 1.37 mSv/day.
- LeBlanc A. et al. (2000), *J Musculoskelet Neuronal Interact*: about 1–1.5% bone mineral density loss per month.
- Stahn A.C. et al. (2017), *Scientific Reports* 7: core body temperature rise in long-duration spaceflight.
- NASA-STD-3001 Vol. 1 and 2 (Crew Health; Human Factors, Habitability and Environmental Health).
- NASA Human Research Program, Human Research Roadmap (risk definitions).
- Page E.S. (1954), *Biometrika*: CUSUM.

## Use of artificial intelligence
We used an AI coding assistant (Claude) to help write and debug the application code and to draft this text. The detection method, the validation design and all results are produced by the code at runtime and can be reproduced in the Validation tab. No AI-generated data or images are presented as real.

---

## 30-second demo video script (screen recording)

| Time | On screen | Voice-over |
|---|---|---|
| 0–5 s | Mission control, Mars transit, "12.5 min one-way to Earth" | "On the way to Mars, the doctor is 25 minutes away. The crew's software has to be the first responder." |
| 5–11 s | Select an astronaut; show the 6 vitals inside their expected bands | "ASCLEPIUS learns each astronaut's own normal for sleep, work, exercise and EVA. A workout isn't an alarm." |
| 11–19 s | Inject "Suit O₂ regulator fault"; the SpO₂ line breaks out, the card turns red, the alert appears | "A suit oxygen fault. Within minutes it flags hypoxia with a 99% match, shows why, and gives the onboard protocol right away." |
| 19–24 s | Point at live GOES flux and the ISS SAA map | "It also tracks live space radiation and lifetime dose against NASA's limit." |
| 24–30 s | Validation tab cards | "Across 400 simulated shifts: about 100% of events caught, near-zero false alarms, twice as fast as standard alarms." |
