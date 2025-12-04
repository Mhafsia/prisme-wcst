# WCST (MVP)

A minimal Wisconsin Card Sorting Test implemented as a web app (React + TypeScript + Vite). Runs on desktop and iPad. Includes deterministic rule engine, trial-by-trial logging, and CSV export.

## Quick start

```powershell
# From this folder
npm install
npm run dev
# To allow iPad on your LAN to access your PC dev server
# (replace with your PC's LAN IP; Vite prints it when using --host)
npm run dev -- --host
```

Then open the local URL shown in the terminal.

## Features
- Rules: color → shape → number, shift after 10 consecutive correct
- Deck: all 64 combinations (4 colors × 4 shapes × 4 numbers), shuffled by seed
- Error types: perseverative vs non-perseverative; set-maintenance flag
- Metrics in CSV: trial index, correctness, error type, RT ms, rule in force, categories achieved, device info, seed, timestamps
- Determinism: seed captured per session; deck order is reproducible
- Audio: Countdown beeps + optional correct/incorrect beeps (toggle "Son")

## Usage
- Fill Participant ID (optional), Session ID, and Seed (auto-filled) and click "Démarrer"
- Tap/click one of the four key cards to respond
- Feedback appears immediately (green/red)
- End condition: 6 categories completed or 128 trials
- Click "Exporter CSV" to download trial-level data

### Configurable trials
- In the header, set "Max essais" to the number of trials you want for the session.

## Notes
- This MVP is for research/prototyping; not a clinical device.
- For iPad, add to Home Screen for full-screen experience. Guided Access recommended.

## Documentation
📖 **[MECHANICS.md](./MECHANICS.md)** — Mécanique de jeu détaillée, classification des erreurs, calcul des scores, formules de post-traitement (Python/R)

## Tech
- React 18, TypeScript 5, Vite 5

## iPad setup
- Fastest: run locally with `--host`, then on iPad Safari open `http://<PC_LAN_IP>:5173` (or the port Vite prints). Add to Home Screen for a fuller experience. Consider iOS Guided Access to lock the app during testing.
- Shareable: deploy to Vercel/Netlify/GitHub Pages, open the URL on iPad, then Add to Home Screen.
- Kiosk: we can add a PWA manifest + service worker for offline/install; ask me to wire it up.

## Next steps (nice-to-haves)
- Practice block and instructions screen
- Offline caching (PWA service worker)
- Admin screen for session management and export filters
- More robust psychometric reporting
