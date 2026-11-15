# LinkedIn post (copy and paste)

Attach `docs/asclepius-demo.mp4` (or the pitch video) as native video. LinkedIn plays native video far more than links.

---

🚀 On the way to Mars, a message to a doctor on Earth takes up to 22 minutes. Each way.

So who's the doctor on board?

For the #NASASpaceApps Challenge 2026, I built ASCLEPIUS, autonomous health-monitoring software for astronauts on deep-space missions. The challenge: "Create Health Monitoring Software for Astronauts on Space Missions".

🩺 The problem
Astronaut health alarms still use fixed, hospital-style limits. They go off every time the crew exercises (about 2 hours a day), and they stay silent while a fever or dehydration slowly builds.

🧠 What ASCLEPIUS does
• Learns each astronaut's own "normal" for sleep, work, exercise and spacewalks
• Flags deviations early and explains them in plain numbers
• Ranks the likely cause: hypoxia, heat stress, infection, arrhythmia, dehydration or cabin CO₂
• Gives the crew the onboard action immediately, and queues an Earth consult with a light-delay-aware ETA
• Tracks LIVE space radiation (NOAA GOES satellites), the live ISS position over the South Atlantic Anomaly, and lifetime dose against NASA's 600 mSv limit

📊 Does it work?
In 400 simulated crew shifts against standard fixed alarms:
✅ 100% of medical events detected (fixed alarms: 64%)
✅ ≈0 false alarms per crew-day (fixed: 0.47)
✅ 2× faster detection (median 24 vs 48 min)
✅ 87% correct diagnosis

My favourite moment: the validation caught a bug in my own detector. The first version raised about 4 false alarms a day because it treated autocorrelated physiological noise as independent. Fixing that properly is what made the numbers above possible.

(Honest caveat: crew vitals are simulated, because real astronaut medical telemetry isn't public. Validating on real analog-mission data is next.)

It runs entirely in the browser, with no install. Try the guided demo:
🔗 Live: https://asclepius-crew-health.vercel.app
💻 Code: https://github.com/UnknownEng/asclepius-crew-health

Thanks to NASA and the Space Apps Islamabad organisers 🇵🇰

#NASASpaceApps #SpaceAppsChallenge #SpaceApps2026 #NASA #SpaceTech #DigitalHealth #HealthTech #Mars #Artemis #Astronauts #Pakistan #Islamabad #Hackathon #BuildInPublic
