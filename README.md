# Ambuj Kumar — Portfolio

**I build the systems companies stop paying licences for.**

A cinematic, dual-theme portfolio: Obsidian & Champagne (dark), Ivory & Bronze (light).

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 (tokens in `src/index.css`) · Framer Motion · raw WebGL for the character · Firebase Hosting.

## Run

```bash
npm install
npm run dev       # http://localhost:5173  (press G for the 12-column grid overlay)
npm run build     # type-check + build to dist/ (also writes per-case-study meta pages)
firebase deploy   # serves dist/
```

## Where things live

| Path | What |
|---|---|
| `src/content.ts` | Every word on the site: profile, stats, case studies, experience, index, stack |
| `src/components/Character.tsx` | 2.5D WebGL character: depth parallax, pointer-lit, breathing, per-placement entrances; video-clip ready |
| `src/components/HeroStage.tsx` | Keynote spotlight + drifting dust |
| `src/components/visuals.tsx` | Bespoke animated visuals for ITSM, Aether, Velocity, Recon OS |
| `src/pages/CaseStudy.tsx` | `/work/:slug` template |
| `public/character/` | Cut-outs + depth maps from the character sheet |
| `public/resume.pdf` | Public résumé (references removed) |

## Adding character motion clips

Export alpha clips as `public/character/<name>.webm` (VP9 alpha) and `<name>.mov` (HEVC alpha, Safari), then map a pose to the clip in `CLIPS` inside `Character.tsx`.

© Ambuj Kumar
