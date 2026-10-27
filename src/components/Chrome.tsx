import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { NAV, PERSON } from '../content';
import { EASE_EXPO, EASE_INOUT, finePointer, toggleTheme, useIST, usePath, useTheme } from '../lib';
import { A, Monogram } from './ui';

function Clock({ className = '' }: { className?: string }) {
  const t = useIST();
  return (
    <span className={`font-mono text-[11px] tabular text-muted ${className}`}>
      <span className="sr-only">Local time in India: </span>
      {t} <span className="text-faint">IST</span>
    </span>
  );
}

function Status({ short = false }: { short?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] text-muted">
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50 [animation-duration:2.4s]" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {short ? 'Open' : 'Open to opportunities'}
    </span>
  );
}

export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); toggleTheme(r.left + r.width / 2, r.top + r.height / 2); }}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
        <motion.g initial={false} animate={{ rotate: dark ? 0 : 90, scale: dark ? 1 : 0.6, opacity: dark ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE_EXPO }} style={{ originX: '12px', originY: '12px' }}>
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </motion.g>
        <motion.g initial={false} animate={{ rotate: dark ? -90 : 0, scale: dark ? 0.6 : 1, opacity: dark ? 0 : 1 }} transition={{ duration: 0.5, ease: EASE_EXPO }} style={{ originX: '12px', originY: '12px' }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </motion.g>
      </svg>
    </button>
  );
}

function useActiveSection() {
  const [active, setActive] = useState('');
  const path = usePath();
  useEffect(() => {
    if (path !== '/') return setActive('');
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    const t = setTimeout(() => ['top', ...NAV.map((n) => n.id)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); }), 50);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return active;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-4 md:px-6">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-site items-center justify-between gap-4 rounded-lg border border-line bg-bg/70 pl-3 pr-2 backdrop-blur-xl md:pl-4">
        <A href="/" className="flex items-center gap-3 text-ink" aria-label="Ambuj Kumar, home">
          <img src="/character/avatar.webp" alt="" width={28} height={28} className="h-7 w-7 rounded-full bg-raised object-cover ring-1 ring-line-strong" />
          <Monogram size={16} className="text-ink" />
        </A>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <A href={`/#${n.id}`} className={`group flex items-baseline gap-1.5 rounded-sm px-3 py-2 text-[13px] transition-colors duration-200 ${active === n.id ? 'text-ink' : 'text-muted hover:text-ink'}`} aria-current={active === n.id ? 'true' : undefined}>
                <span className={`font-mono text-[10px] ${active === n.id ? 'text-accent' : 'text-faint'}`}>{n.n}</span>
                {n.label}
              </A>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-5">
          <Clock className="hidden md:inline" />
          <span className="hidden sm:inline-flex"><Status /></span>
          <span className="hidden min-[400px]:inline sm:hidden"><Status short /></span>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 items-center gap-2 rounded-md border border-line px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu"
          >
            Menu
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-bg px-4 pb-8 pt-3"
            initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE_INOUT }}
          >
            <div className="flex h-14 items-center justify-between pl-3 pr-2">
              <Monogram size={16} />
              <div className="flex items-center gap-2">
              <ThemeToggle />
              <button type="button" autoFocus onClick={() => setOpen(false)} className="flex h-10 items-center rounded-md border border-line px-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                Close
              </button>
              </div>
            </div>
            <ul className="mt-12 flex flex-1 flex-col gap-2 px-3">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: EASE_EXPO }}>
                  <A href={`/#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-line py-4 font-display text-5xl">
                    <span className="font-mono text-xs text-accent">{n.n}</span>
                    {n.label}
                  </A>
                </motion.li>
              ))}
            </ul>
            <div className="flex items-center justify-between px-3">
              <Clock />
              <Status />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-8 py-12 md:grid-cols-12 md:items-center">
        <div className="flex items-center gap-4 md:col-span-4">
          <Monogram size={18} className="text-accent" />
          <p className="text-sm text-muted">Designed &amp; engineered by {PERSON.name}</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted md:col-span-5 md:justify-center">
          <li><A className="link-draw hover:text-ink" href={`mailto:${PERSON.email}`}>Email</A></li>
          <li><A className="link-draw hover:text-ink" href={`tel:${PERSON.tel}`}>{PERSON.phone}</A></li>
          <li><A className="link-draw hover:text-ink" href={PERSON.linkedin}>LinkedIn</A></li>
          <li><A className="link-draw hover:text-ink" href={PERSON.github}>GitHub</A></li>
        </ul>
        <div className="flex items-center justify-between gap-6 md:col-span-3 md:justify-end">
          <span className="font-mono text-[11px] text-faint">© {new Date().getFullYear()}</span>
          <Clock />
        </div>
      </div>
    </footer>
  );
}

/** Ring cursor: grows over links. Fine pointers only. */
export function Cursor() {
  const [on] = useState(() => finePointer());
  const reduce = useReducedMotion();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [link, setLink] = useState(false);
  useEffect(() => {
    if (!on) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target as Element | null;
      setLink(!!t?.closest?.('a,button,summary,[role="button"]'));
    };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, [on, x, y]);
  if (!on) return null;
  const size = link ? 40 : 22;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block" style={{ x: reduce ? x : sx, y: reduce ? y : sy }}>
      <motion.div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-200 ${link ? 'border-accent' : 'border-ink/40'}`}
        animate={{ width: size, height: size }}
        transition={{ duration: 0.4, ease: EASE_EXPO }}
      />
    </motion.div>
  );
}

/** 0 → 100 counter + AK monogram drawn in gold, then a curtain lifts. Once per session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(onDone);
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const c = animate(0, 100, { duration: 0.75, ease: EASE_INOUT, onUpdate: (v) => setN(Math.round(v)), onComplete: () => {
      setLeaving(true);
      done.current();
      document.documentElement.style.overflow = '';
    } });
    return () => c.stop();
  }, []);
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg p-4 md:p-10"
      initial={{ y: '0%' }}
      animate={leaving ? { y: '-100%' } : { y: '0%' }}
      transition={{ duration: 0.6, ease: EASE_INOUT }}
    >
      <div className="flex justify-between label text-faint"><span>Ambuj Kumar</span><span>Systems, owned</span></div>
      <div className="flex justify-center text-accent"><Monogram size={56} draw /></div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-stat tabular text-ink">{String(n).padStart(3, '0')}</span>
        <span className="label text-faint">Loading</span>
      </div>
    </motion.div>
  );
}

/** Dev-only 12-column overlay, toggled with G. */
export function DevGrid() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey && !/INPUT|TEXTAREA/.test(t.tagName)) setOn((v) => !v);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);
  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[99]">
      <div className="wrap grid h-full grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
        {Array.from({ length: 12 }, (_, i) => <div key={i} className={`h-full bg-[rgba(255,0,80,.06)] ${i >= 4 ? 'hidden md:block' : ''}`} />)}
      </div>
    </div>
  );
}

