import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

// ── Router: History API, three route shapes; not worth a dependency ─────────
const sub = (cb: () => void) => {
  addEventListener('popstate', cb);
  return () => removeEventListener('popstate', cb);
};
export const usePath = () => useSyncExternalStore(sub, () => location.pathname);

export function navigate(to: string) {
  const [path, hash] = to.split('#');
  if (path && path !== location.pathname) {
    history.pushState(null, '', to);
    dispatchEvent(new PopStateEvent('popstate'));
    if (hash) pendingHash = hash;
  } else if (hash) {
    history.replaceState(null, '', `#${hash}`);
    scrollToId(hash);
  }
}

// Set by navigate() when the target section lives on another route; App consumes it after the swap.
export let pendingHash: string | null = null;
export const takePendingHash = () => {
  const h = pendingHash;
  pendingHash = null;
  return h;
};

// ── Scrolling: native (CSS smooth-scroll); no scroll hijacking ─────────────
export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + scrollY - 16;
  window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? 'instant' : 'smooth' });
}

export function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Theme: dark / light, persisted; first paint is set by an inline script in index.html ──
export type Theme = 'dark' | 'light';
const themeSub = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
export const useTheme = () => useSyncExternalStore(themeSub, readTheme);

/** Switch theme with a circular light sweep from (x, y) where supported. */
export function toggleTheme(x = innerWidth / 2, y = 0) {
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#07080A' : '#F4F1EC');
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
  };
  const d = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!d.startViewTransition || prefersReducedMotion()) return apply();
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  d.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

/** Reads a theme token (e.g. "--signal") as a string; re-read when the theme changes. */
export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// ── Environment ──────────────────────────────────────────────────────────
const mq = (q: string) => typeof matchMedia !== 'undefined' && matchMedia(q).matches;
export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const finePointer = () => mq('(hover: hover) and (pointer: fine)');

/** Low-power devices get static posters instead of live canvases. */
export function isLowPower() {
  const n = navigator as Navigator & { deviceMemory?: number };
  return prefersReducedMotion() || (n.hardwareConcurrency ?? 8) <= 4 || (n.deviceMemory ?? 8) <= 4;
}

// ── Intro gate: hero choreography waits for the preloader ──────────────────
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);

// ── IST clock ────────────────────────────────────────────────────────────
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
export function useIST() {
  const [t, setT] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

// ── Per-route document metadata ────────────────────────────────────────────
export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [title, description]);
}

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;
