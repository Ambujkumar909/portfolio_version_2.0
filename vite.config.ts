import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ALL_CASES } from './src/content';

// TODO(ambuj): switch to the custom domain if/when one is attached in Firebase.
const SITE = 'https://portfolio-33ac0.web.app';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Emits dist/work/<slug>/index.html with route-specific title / description / OG, for crawlers that don't run JS. */
function routeMeta(): Plugin {
  return {
    name: 'route-meta',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE),
    closeBundle() {
      const base = readFileSync('dist/index.html', 'utf8');
      for (const f of ALL_CASES) {
        const title = esc(`${f.name} — ${f.full} · Ambuj Kumar`);
        const desc = esc(f.pitch);
        const url = `${SITE}/work/${f.slug}`;
        const html = base
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/(name="description" content=")[^"]*/, `$1${desc}`)
          .replace(/(property="og:title" content=")[^"]*/, `$1${title}`)
          .replace(/(name="twitter:title" content=")[^"]*/, `$1${title}`)
          .replace(/(property="og:description" content=")[^"]*/, `$1${desc}`)
          .replace(/(name="twitter:description" content=")[^"]*/, `$1${desc}`)
          .replace(/(property="og:url" content=")[^"]*/, `$1${url}`)
          .replace(/(rel="canonical" href=")[^"]*/, `$1${url}`)
          .replace(/<link rel="preload" href="\/character\/front.webp"[^>]*>\s*/, '');
        mkdirSync(`dist/work/${f.slug}`, { recursive: true });
        writeFileSync(`dist/work/${f.slug}/index.html`, html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routeMeta()],
  server: { port: 5173, host: true },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] } },
    },
  },
});
