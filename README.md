# Ambuj Kumar — Portfolio

**I build the systems companies stop paying licences for.**

A cinematic, dual-theme portfolio: Obsidian & Champagne (dark), Ivory & Bronze (light).

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 (tokens in `src/index.css`) · Framer Motion · Firebase Hosting.

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
| `src/components/visuals.tsx` | Bespoke animated visuals for ITSM, Aether, Velocity, Recon OS |
| `src/pages/CaseStudy.tsx` | `/work/:slug` template |
| `public/hero.webp` | The one photograph (hero); favicon, touch icon and `og.png` are cut from it |
| `public/resume.pdf` | Public résumé (references removed) |

© Ambuj Kumar
