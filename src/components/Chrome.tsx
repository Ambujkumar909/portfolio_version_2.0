import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { NAV, PERSON } from '../content';
import { EASE_EXPO, EASE_INOUT, finePointer, navigate, toggleTheme, useIST, usePath, useTheme } from '../lib';
import { A, Arrow, Monogram } from './ui';

function Clock({ className = '' }: { className?: string }) {
  const t = useIST();
  return (
    <span className={`font-mono text-[11px] tabular text-muted ${className}`}>
      <span className="sr-only">Local time in India: </span>
      {t} <span className="text-faint">IST</span>
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
      className="relative grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-raised hover:text-accent"
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

const Pulse = () => (
  <span className="relative flex h-1.5 w-1.5" aria-hidden>
    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60 [animation-duration:2.4s]" />
    <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
  </span>
);

/** Two hairlines that cross into an ✕. */
function MenuIcon({ open }: { open: boolean }) {
  const t = { duration: 0.45, ease: EASE_EXPO };
  return (
    <span aria-hidden className="relative block h-3 w-4">
      <motion.span className="absolute left-0 top-[2px] h-px w-4 bg-current" initial={false} animate={open ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }} transition={t} />
      <motion.span className="absolute bottom-[2px] left-0 h-px w-4 bg-current" initial={false} animate={open ? { y: -4, rotate: -45, width: 16 } : { y: 0, rotate: 0, width: 11 }} transition={t} />
    </span>
  );
}

/**
 * One floating capsule. Links share a sliding highlight (hover, else the section in view);
 * the bar condenses once you scroll, tucks away while reading down, returns on the way up.
 * On phones the capsule opens into a glass sheet directly beneath it.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (y > 520 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 520) setHidden(false);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const r = () => innerWidth >= 1024 && setOpen(false);
    addEventListener('keydown', k); addEventListener('resize', r);
    return () => { removeEventListener('keydown', k); removeEventListener('resize', r); };
  }, [open]);

  const lit = hover ?? active;
  const close = () => setOpen(false);
  // menu links: release the scroll lock first, then travel
  const go = (href: string) => (e: React.MouseEvent) => { e.preventDefault(); close(); requestAnimationFrame(() => navigate(href)); };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-4">
      <motion.nav
        aria-label="Primary"
        className={`pointer-events-auto flex h-14 w-full items-center justify-between gap-2 rounded-full border p-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 lg:w-auto ${scrolled || open ? 'border-line-strong bg-bg/80 [box-shadow:var(--shadow)]' : 'border-line bg-bg/50'}`}
        initial={false}
        animate={{ y: hidden && !open && !reduce ? -96 : 0 }}
        transition={{ duration: 0.55, ease: EASE_EXPO }}
      >
        <A href="/" onClick={close} className="group flex items-center gap-3 rounded-full pr-3 text-ink" aria-label="Ambuj Kumar, home">
          <span className="grid size-11 place-items-center rounded-full bg-ink text-bg transition-colors duration-300 group-hover:bg-accent">
            <Monogram size={13} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[13px] font-medium tracking-tight">Ambuj Kumar</span>
            <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-faint min-[380px]:block">Systems architect</span>
          </span>
        </A>

        <span aria-hidden className="mx-2 hidden h-6 w-px bg-line lg:block" />

        <ul className="hidden items-center lg:flex" onPointerLeave={() => setHover(null)}>
          {NAV.map((n) => {
            const here = active === n.id;
            return (
              <li key={n.id} className="relative">
                {lit === n.id && (
                  <motion.span layoutId="nav-pill" aria-hidden className="absolute inset-0 rounded-full bg-raised ring-1 ring-line"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} />
                )}
                <A href={`/#${n.id}`} onPointerEnter={() => setHover(n.id)} onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
                  aria-current={here ? 'true' : undefined}
                  className={`relative flex h-11 items-center gap-1.5 rounded-full px-4 text-[13px] transition-colors duration-200 ${lit === n.id || here ? 'text-ink' : 'text-muted'}`}>
                  {here && <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />}
                  {n.label}
                </A>
              </li>
            );
          })}
        </ul>

        <span aria-hidden className="mx-2 hidden h-6 w-px bg-line lg:block" />

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <A href="/#contact" className="hidden h-11 items-center gap-2.5 rounded-full bg-ink pl-4 pr-5 text-[13px] font-medium text-bg transition-colors duration-300 hover:bg-accent sm:flex">
            <Pulse /> Let’s talk
          </A>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`grid size-11 place-items-center rounded-full border transition-colors duration-200 lg:hidden ${open ? 'border-accent text-accent' : 'border-line text-ink'}`}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="scrim" aria-hidden onClick={close}
              className="pointer-events-auto fixed inset-0 -z-10 bg-bg/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
            <motion.div
              key="sheet" id="menu" role="dialog" aria-modal="true" aria-label="Menu"
              className="pointer-events-auto absolute inset-x-3 top-[64px] max-h-[calc(100svh-88px)] origin-top overflow-y-auto rounded-[28px] border border-line-strong bg-elevated/95 p-2 backdrop-blur-xl [box-shadow:var(--shadow)] md:top-[68px] lg:hidden"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97, clipPath: 'inset(0% 0% 100% 0% round 28px)' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98, clipPath: 'inset(0% 0% 100% 0% round 28px)' }}
              transition={{ duration: 0.55, ease: EASE_EXPO }}
            >
              <ul>
                {NAV.map((n, i) => {
                  const here = active === n.id;
                  return (
                    <motion.li key={n.id} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.045, duration: 0.6, ease: EASE_EXPO }}>
                      <A href={`/#${n.id}`} onClick={go(`/#${n.id}`)} aria-current={here ? 'true' : undefined}
                        className={`group flex items-center justify-between rounded-[20px] px-4 py-3 transition-colors duration-200 ${here ? 'bg-raised' : 'hover:bg-raised/60'}`}>
                        <span className="flex items-baseline gap-4">
                          <span className="w-5 font-mono text-[10px] text-accent">{n.n}</span>
                          <span className="font-display text-[2rem] leading-none text-ink">{n.label}</span>
                        </span>
                        <Arrow className={`transition-all duration-300 group-hover:translate-x-0.5 ${here ? 'text-accent' : 'text-faint group-hover:text-accent'}`} />
                      </A>
                    </motion.li>
                  );
                })}
              </ul>
              <motion.div className="mt-2 border-t border-line px-2 pb-2 pt-4"
                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
                <A href="/#contact" onClick={go('/#contact')} className="flex h-12 items-center justify-center gap-2.5 rounded-full bg-ink text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent">
                  <Pulse /> Let’s talk
                </A>
                <div className="mt-4 flex items-center justify-between px-2">
                  <Clock />
                  <span className="font-mono text-[11px] text-muted">Open to opportunities</span>
                </div>
              </motion.div>
            </motion.div>
          </>
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

