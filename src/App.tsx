import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_CASES } from './content';
import { EASE_INOUT, prefersReducedMotion, ReadyContext, scrollToId, scrollTop, takePendingHash, usePath } from './lib';
import { Cursor, DevGrid, Footer, Nav, Preloader } from './components/Chrome';
import { Monogram } from './components/ui';
import Home from './pages/Home';

const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Route({ path }: { path: string }) {
  if (path === '/') return <Home />;
  if (path === '/resume' || path === '/resume/') {
    location.replace('/resume.pdf');
    return null;
  }
  const m = path.match(/^\/work\/([\w-]+)\/?$/);
  if (m && ALL_CASES.some((f) => f.slug === m[1])) return <CaseStudy slug={m[1]} />;
  return <NotFound />;
}

const INTRO_KEY = 'ak-intro';

export default function App() {
  const path = usePath();
  const [shown, setShown] = useState(path);
  const [curtain, setCurtain] = useState(false);
  const [intro, setIntro] = useState(() => {
    try { return !prefersReducedMotion() && !sessionStorage.getItem(INTRO_KEY); } catch { return false; }
  });
  const [ready, setReady] = useState(!intro);
  const main = useRef<HTMLElement>(null);

  // deep link to a section on first load
  useEffect(() => {
    if (ready && location.hash) setTimeout(() => scrollToId(location.hash.slice(1), true), 60);
  }, [ready]);

  // route change: curtain wipe → swap → reveal
  useEffect(() => {
    if (path === shown) return;
    const swap = () => {
      setShown(path);
      scrollTop();
      const h = takePendingHash();
      requestAnimationFrame(() => {
        if (h) scrollToId(h, true);
        main.current?.focus({ preventScroll: true });
      });
    };
    if (prefersReducedMotion()) return swap();
    setCurtain(true);
    const t = setTimeout(() => { swap(); setCurtain(false); }, 450);
    return () => clearTimeout(t);
  }, [path, shown]);

  return (
    <ReadyContext.Provider value={ready}>
      <a href="#main" className="sr-only z-[200] rounded-md bg-ink px-4 py-3 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Route path={shown} />
        </Suspense>
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden />
      {import.meta.env.DEV && <DevGrid />}

      <AnimatePresence>
        {curtain && (
          <motion.div key="curtain" aria-hidden className="pointer-events-none fixed inset-0 z-[98]">
            <motion.div className="absolute inset-0 bg-accent"
              initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }}
              transition={{ duration: 0.42, ease: EASE_INOUT }} />
            <motion.div className="absolute inset-0 flex items-center justify-center bg-elevated text-accent"
              initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }}
              transition={{ duration: 0.42, ease: EASE_INOUT, delay: 0.04 }}>
              <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                <Monogram size={36} />
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {intro && (
        <Preloader onDone={() => {
          try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }
          setReady(true);
          setTimeout(() => setIntro(false), 700);
        }} />
      )}
    </ReadyContext.Provider>
  );
}
