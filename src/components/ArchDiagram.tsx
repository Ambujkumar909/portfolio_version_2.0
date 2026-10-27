import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { ArchNode, Flagship } from '../content';

const W = 1000;
const H = 520;
const NODE_H = 64;

// Box width from text length; good enough for Geist at 14px / Geist Mono at 10px.
const boxW = (n: ArchNode) => Math.max(n.label.length * 7.6, (n.sub?.length ?? 0) * 6.4, 120) + 32;
const centerX = (n: ArchNode) => Math.min(Math.max(n.x, boxW(n) / 2 + 4), W - boxW(n) / 2 - 4);

/** Cubic from the facing sides of two boxes: horizontal links leave left/right, vertical ones top/bottom. */
function edgePath(a: ArchNode, b: ArchNode) {
  const ax = centerX(a), bx = centerX(b);
  const dx = bx - ax, dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy) * 0.6) {
    const s = Math.sign(dx) || 1;
    const x1 = ax + (s * boxW(a)) / 2, x2 = bx - (s * boxW(b)) / 2;
    const mx = (x1 + x2) / 2;
    return { d: `M${x1} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${x2} ${b.y}`, mid: [mx, (a.y + b.y) / 2] as const };
  }
  const s = Math.sign(dy) || 1;
  const y1 = a.y + (s * NODE_H) / 2, y2 = b.y - (s * NODE_H) / 2;
  const my = (y1 + y2) / 2;
  return { d: `M${ax} ${y1} C${ax} ${my} ${bx} ${my} ${bx} ${y2}`, mid: [(ax + bx) / 2, my] as const };
}

function Edge({ d, mid, label, progress, range, reduce }: {
  d: string; mid: readonly [number, number]; label?: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean;
}) {
  const pathLength = useTransform(progress, range, [0, 1]);
  const done = useTransform(progress, [range[1] - 0.02, range[1]], [0, 1]);
  return (
    <g>
      <path d={d} fill="none" className="stroke-line" strokeWidth={1} />
      <motion.path d={d} fill="none" className="stroke-signal" strokeOpacity={0.55} strokeWidth={1.25} style={reduce ? undefined : { pathLength }} />
      {label && (
        <motion.text x={mid[0]} y={mid[1] - 8} textAnchor="middle" className="fill-faint font-mono" fontSize={10} letterSpacing="0.12em" style={reduce ? undefined : { opacity: done }}>
          {label.toUpperCase()}
        </motion.text>
      )}
      {!reduce && (
        <motion.circle r={2.5} className="fill-signal" style={{ opacity: done }}>
          <animateMotion dur="2.6s" repeatCount="indefinite" path={d} />
        </motion.circle>
      )}
    </g>
  );
}

export default function ArchDiagram({ arch }: { arch: Flagship['arch'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] });
  const byId = Object.fromEntries(arch.nodes.map((n) => [n.id, n]));
  const n = arch.edges.length;

  return (
    <div ref={ref}>
    <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 md:mx-0 md:overflow-visible md:px-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full min-w-[720px] md:min-w-0"
        role="img"
        aria-label={`Architecture: ${arch.nodes.map((x) => x.label + (x.sub ? ` (${x.sub})` : '')).join(', ')}`}
      >
        {arch.edges.map(([a, b, label], i) => {
          const { d, mid } = edgePath(byId[a], byId[b]);
          const start = (i / n) * 0.55;
          return <Edge key={`${a}-${b}`} d={d} mid={mid} label={label} progress={scrollYProgress} range={[start, start + 0.45]} reduce={reduce} />;
        })}
        {arch.nodes.map((node) => {
          const w = boxW(node);
          const x = centerX(node) - w / 2;
          return (
            <g key={node.id}>
              <rect x={x} y={node.y - NODE_H / 2} width={w} height={NODE_H} rx={8} className={`fill-elevated ${node.accent ? 'stroke-accent' : 'stroke-line-strong'}`} strokeWidth={1} />
              <text x={centerX(node)} y={node.y - (node.sub ? 4 : -5)} textAnchor="middle" className="fill-ink font-sans" fontSize={14}>
                {node.label}
              </text>
              {node.sub && (
                <text x={centerX(node)} y={node.y + 16} textAnchor="middle" className="fill-faint font-mono" fontSize={10} letterSpacing="0.04em">
                  {node.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
    <p aria-hidden className="label mt-4 text-faint md:hidden">Scroll →</p>
    </div>
  );
}
