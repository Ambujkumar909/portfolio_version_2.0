import { useEffect, useRef, useState, type JSX } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Flagship } from '../content';
import { EASE_EXPO } from '../lib';

/** In-view + reduced-motion gate shared by every visual. */
function useLive<T extends Element>() {
  const ref = useRef<T>(null);
  const reduce = !!useReducedMotion();
  const inView = useInView(ref, { margin: '0px 0px -5% 0px' });
  return { ref, reduce, inView, live: inView && !reduce };
}

const frame = 'relative w-full h-full overflow-hidden rounded-lg border border-line bg-elevated';

// ── ITSM: fleet console: compliance gauge, live-health trace, 17 sites ─────

// one heartbeat period (0..100 wide), tiled for a seamless glide
const BEAT = 'M0 30 L28 30 L33 26 L37 30 L44 30 L47 12 L51 44 L55 22 L58 30 L72 30 L77 25 L83 30 L100 30';
const TRACE = Array.from({ length: 4 }, (_, i) => BEAT.replace(/(\d+(?:\.\d+)?) (\d+)/g, (_, x, y) => `${+x + i * 100} ${y}`)).join(' ').replace(/ M/g, ' L');

export function ItsmVisual() {
  const { ref, reduce, inView, live } = useLive<HTMLDivElement>();
  const on = inView || reduce;
  return (
    <div ref={ref} className={`${frame} flex flex-col`} role="img" aria-label="Fleet console: 554 machines across 17 sites, patch compliance at 92.4%, live health trace">
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-4 p-4 sm:gap-6 sm:p-6">
        {/* gauge */}
        <div className="relative mx-auto aspect-square w-full max-w-[240px]">
          <svg viewBox="0 0 120 120" aria-hidden className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="itsm-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-signal)" />
                <stop offset="100%" stopColor="var(--color-accent)" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-line-strong)" strokeWidth="6" strokeDasharray="1 2.2" />
            <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#itsm-g)" strokeWidth="6" strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: on ? 0.924 : 0 }} transition={{ duration: 2, ease: EASE_EXPO }} />
          </svg>
          <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-lg tabular text-ink sm:text-2xl">92.4<span className="text-faint">%</span></span>
            <span className="mt-1 font-mono text-[10px] uppercase leading-tight tracking-[0.12em] text-faint">patched</span>
          </div>
        </div>
        {/* console */}
        <div aria-hidden className="flex min-w-0 flex-col gap-4">
          <div className="rounded-md border border-line bg-bg/40 p-3">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-signal" />Live health</span>
              <span className="tabular text-muted">554</span>
            </div>
            <div className="mt-2 h-10 overflow-hidden">
              <motion.svg viewBox="0 0 200 50" preserveAspectRatio="none" className="h-full w-[200%]"
                animate={live ? { x: ['0%', '-50%'] } : undefined} transition={{ duration: 6, ease: 'linear', repeat: Infinity }}>
                <path d={TRACE} fill="none" stroke="var(--color-signal)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" transform="scale(0.5 1)" />
              </motion.svg>
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-faint"><span>Sites</span><span className="tabular text-muted">17</span></div>
            <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-[3px]">
              {Array.from({ length: 17 }, (_, i) => (
                <motion.span key={i} className="h-5 rounded-[2px] bg-accent"
                  initial={reduce ? false : { opacity: 0.15, scaleY: 0.4 }} animate={on ? { opacity: 0.85, scaleY: 1 } : undefined}
                  transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.4 + i * 0.05 }} style={{ originY: 1 }} />
              ))}
            </div>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
            <span>Tested to</span><span className="tabular text-ink">5,000 agents</span>
          </div>
        </div>
      </div>
      <p aria-hidden className="label border-t border-line px-4 py-3 text-faint sm:px-6">554 machines · 17 sites · Windows + macOS</p>
    </div>
  );
}

// ── Aether: four-node call with packet streams + bytes-per-call bars ────────

const PEERS: [number, number][] = [[70, 40], [250, 40], [70, 140], [250, 140]];
const LINKS: [number, number][] = [[0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]];
const BARS = [
  { name: 'Baseline', mb: 365, cls: 'bg-line-strong' },
  { name: 'Aether', mb: 224, cls: 'bg-signal' },
];

export function AetherVisual() {
  const { ref, reduce, inView, live } = useLive<HTMLDivElement>();
  return (
    <div ref={ref} className={`${frame} flex flex-col`} role="img" aria-label="Four call participants exchanging packet streams; a 15-minute call sends 224 MB instead of 365 MB">
      <svg viewBox="0 0 320 180" aria-hidden className="min-h-0 w-full flex-1 px-4 pt-4">
        {LINKS.map(([a, b], i) => {
          const [x1, y1] = PEERS[a]; const [x2, y2] = PEERS[b];
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-line-strong)" strokeWidth="1" />
              <motion.line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.01 12" opacity={0.75}
                animate={live ? { strokeDashoffset: i % 2 ? [0, 24.02] : [0, -24.02] } : { strokeDashoffset: 0 }}
                transition={live ? { duration: 1.6 + (i % 3) * 0.5, ease: 'linear', repeat: Infinity } : { duration: 0 }}
              />
            </g>
          );
        })}
        {PEERS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="19" fill="var(--color-elevated)" stroke="var(--color-line-strong)" strokeWidth="1" />
            <circle cx={x} cy={y - 7} r="1.8" fill="var(--color-signal)" />
            <text x={x} y={y + 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="12" fill="var(--color-muted)">P{i + 1}</text>
          </g>
        ))}
      </svg>
      <div aria-hidden className="space-y-2.5 border-t border-line px-4 py-4 sm:px-6">
        <div className="label flex justify-between text-faint">
          <span>4 people · 15 min</span>
          <span className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-signal" />live</span>
        </div>
        {BARS.map((b, i) => (
          <div key={b.name} className="grid grid-cols-[56px_1fr_52px] items-center gap-3 font-mono text-[10px]">
            <span className="text-muted">{b.name}</span>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className={`h-full origin-left rounded-full ${b.cls}`}
                style={{ width: `${(b.mb / 365) * 100}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: inView || reduce ? 1 : 0 }}
                transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.2 + i * 0.15 }}
              />
            </div>
            <span className="text-right text-ink tabular">{b.mb} MB</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Velocity: 12 tool nodes collapse into one DuckDB query ──────────────────

const TOOLS = ['Input', 'Filter', 'Join', 'Formula', 'Summarize', 'Sort', 'Sample', 'Union', 'Select', 'Forecast', 'Report', 'Output'];
const XS = [14, 38, 62, 86];
const YS = [20, 50, 80];
// snake layout, left→right then right→left, like a wired canvas
const SPOTS = TOOLS.map((_, i) => {
  const row = Math.floor(i / 4); const col = i % 4;
  return { x: XS[row % 2 ? 3 - col : col], y: YS[row] };
});
const WIRE = SPOTS.map((p) => `${p.x},${p.y}`).join(' ');

export function VelocityVisual() {
  const { ref, reduce, inView } = useLive<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setTimeout(() => setCollapsed((c) => !c), collapsed ? 3600 : 2400);
    return () => clearTimeout(id);
  }, [collapsed, inView, reduce]);

  const done = reduce || collapsed;
  return (
    <div ref={ref} className={`${frame} flex flex-col`} role="img" aria-label="A twelve-tool analytics pipeline that compiles into a single DuckDB query">
      <div aria-hidden className="relative min-h-0 flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <motion.polyline
            points={WIRE} fill="none" stroke="var(--color-line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke"
            animate={{ opacity: done ? (reduce ? 0.5 : 0) : 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          />
        </svg>
        {SPOTS.map((p, i) => (
          <motion.div
            key={TOOLS[i]}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-sm border border-line-strong bg-raised px-1 py-1 sm:px-1.5 font-mono text-[10px] text-muted"
            initial={false}
            animate={reduce
              ? { left: `${p.x}%`, top: `${p.y}%`, opacity: 0.35 }
              : { left: collapsed ? '50%' : `${p.x}%`, top: collapsed ? '50%' : `${p.y}%`, opacity: collapsed ? 0 : 1, scale: collapsed ? 0.5 : 1 }}
            transition={{ duration: 1.1, ease: EASE_EXPO, delay: (collapsed ? i : TOOLS.length - i) * 0.035 }}
          >
            <span className="hidden size-1 rounded-full bg-signal/70 sm:block" />
            {TOOLS[i]}
          </motion.div>
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border border-signal/40 bg-elevated px-4 py-2.5 text-center font-mono"
          style={{ boxShadow: '0 0 36px color-mix(in oklab, var(--color-signal) 26%, transparent)' }}
          initial={false}
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.7 }}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: done && !reduce ? 0.45 : 0 }}
        >
          <span className="block text-sm text-ink">1 query</span>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-signal">DuckDB</span>
        </motion.div>
      </div>
      <p aria-hidden className="label flex justify-between border-t border-line px-4 py-3 text-faint sm:px-6">
        <span>12 tools</span><span>→ 1 query</span>
      </p>
    </div>
  );
}

// ── Recon OS: ledger scan, mismatches traced to source ───────────────────────
// Illustrative values only.

const LEDGER: { id: string; exp: string; got: string; trace?: string }[] = [
  { id: 'ORD-1041', exp: '412', got: '412' },
  { id: 'ORD-1042', exp: '1,180', got: '1,180' },
  { id: 'ORD-1043', exp: '97', got: '132', trace: '§4.2 · fee × qty · row 1043' },
  { id: 'ORD-1044', exp: '640', got: '640' },
  { id: 'ORD-1045', exp: '58', got: '58' },
  { id: 'ORD-1046', exp: '−220', got: '0', trace: '§2.1 · return credit · row 1046' },
  { id: 'ORD-1047', exp: '306', got: '306' },
  { id: 'ORD-1048', exp: '1,912', got: '1,874', trace: '§6.3 · Σ settlement · row 1048' },
  { id: 'ORD-1049', exp: '77', got: '77' },
];

export function ReconVisual() {
  const { ref, reduce, inView } = useLive<HTMLDivElement>();
  const N = LEDGER.length;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setTimeout(() => setIdx((i) => (i >= N ? 0 : i + 1)), idx >= N ? 2800 : 380);
    return () => clearTimeout(id);
  }, [idx, inView, reduce, N]);

  const shown = reduce ? N : idx;
  return (
    <div ref={ref} className={`${frame} flex flex-col justify-center`} role="img" aria-label="A ledger scanned line by line; three mismatched charges are highlighted and traced to their source row, contract clause and formula">
      <div aria-hidden className="relative px-3 py-4 sm:px-5">
        <div className="label mb-2 grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] text-faint">
          <span className="grid grid-cols-[1.3fr_1fr_1fr] gap-1.5 px-1.5 sm:gap-2 sm:px-2"><span>Order</span><span className="text-right">Expected</span><span className="text-right">Charged</span></span>
          <span className="pl-3">Trace</span>
        </div>
        <div className="relative">
          {LEDGER.map((r, i) => {
            const flagged = !!r.trace && i < shown;
            return (
              <div key={r.id} className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center">
                <span className={`grid grid-cols-[1.3fr_1fr_1fr] gap-1.5 rounded-sm px-1.5 py-[5px] sm:gap-2 sm:px-2 font-mono text-[10px] tabular transition-colors duration-300 ${flagged ? 'bg-accent-soft' : ''} ${i < shown ? 'text-muted' : 'text-faint'}`}>
                  <span>{r.id}</span>
                  <span className="text-right">₹{r.exp}</span>
                  <span className={`text-right ${flagged ? 'text-accent' : ''}`}>₹{r.got}</span>
                </span>
                <span className="flex min-w-0 items-center">
                  {r.trace && (
                    <>
                      <motion.span
                        className="h-px w-3 shrink-0 origin-left bg-accent sm:w-6"
                        initial={false}
                        animate={{ scaleX: flagged ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE_EXPO }}
                      />
                      <motion.span
                        className="min-w-0 truncate rounded-sm border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent"
                        initial={false}
                        animate={{ opacity: flagged ? 1 : 0, x: flagged ? 0 : -6 }}
                        transition={{ duration: 0.5, ease: EASE_EXPO, delay: flagged ? 0.2 : 0 }}
                      >
                        {r.trace}
                      </motion.span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-px bg-signal/70"
              style={{ boxShadow: '0 0 10px var(--color-signal)' }}
              animate={{ top: `${(shown / N) * 100}%`, opacity: shown > 0 && shown < N ? 1 : 0 }}
              transition={{ duration: 0.38, ease: 'linear' }}
            />
          )}
        </div>
      </div>
      <p aria-hidden className="label border-t border-line px-4 py-3 text-faint sm:px-6">
        {LEDGER.filter((r, i) => r.trace && i < shown).length} mismatches · traced to source
      </p>
    </div>
  );
}

export const VISUALS: Record<Flagship['slug'], () => JSX.Element> = {
  itsm: ItsmVisual,
  aether: AetherVisual,
  velocity: VelocityVisual,
  'recon-os': ReconVisual,
};

// ── Any project without a bespoke visual: its stack, as a 3D isometric build ─
// Each technology is a slab; they rise into place and stack up, top slab in gold.

export function StackVisual({ name, stack }: { name: string; stack: string[] }) {
  const { ref, reduce, inView } = useLive<HTMLDivElement>();
  const on = inView || reduce;
  const layers = stack.slice(0, 6);
  // slab spacing scales with the panel so the stack fits from phones to wide screens
  const [gap, setGap] = useState(40);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setGap(Math.max(12, Math.min(40, el.clientWidth * 0.032))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return (
    <div ref={ref} className={`${frame} grid place-items-center`} role="img" aria-label={`${name} stack: ${stack.join(', ')}`}>
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(45% 55% at 50% 58%, var(--wash-a), transparent 72%)' }} />
      <div aria-hidden className="relative aspect-square w-[min(64%,400px)] [perspective:1400px]" style={{ marginTop: `${layers.length * gap * 0.35}px` }}>
        <div className="absolute inset-0 preserve-3d" style={{ transform: 'rotateX(58deg) rotateZ(-40deg)' }}>
          {layers.map((s, i) => {
            const top = i === layers.length - 1;
            return (
              <motion.div
                key={s}
                className={`absolute inset-[14%] flex items-end justify-start rounded-md border px-3 py-2 preserve-3d ${top ? 'border-accent bg-accent-soft' : 'border-line-strong bg-elevated/90'}`}
                style={{ boxShadow: top ? '0 0 40px var(--wash-a)' : undefined }}
                initial={reduce ? false : { z: -40, opacity: 0 }}
                animate={on ? { z: i * gap, opacity: 1 } : undefined}
                transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.15 + i * 0.12 }}
              >
                {(top || gap >= 22) && <span className={`font-mono text-[10px] uppercase tracking-[0.12em] sm:text-[11px] ${top ? 'text-accent' : 'text-muted'}`}>{s}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
      <p aria-hidden className="label absolute bottom-4 left-5 text-faint">{name} · stack</p>
      <p aria-hidden className="label absolute bottom-4 right-5 text-faint">{String(stack.length).padStart(2, '0')} layers</p>
    </div>
  );
}
