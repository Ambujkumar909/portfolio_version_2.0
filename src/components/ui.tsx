import { useRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { EASE_EXPO, finePointer, navigate } from '../lib';

/**
 * Line-by-line mask-up reveal with blur → sharp, staggered 70ms.
 * `play` drives it explicitly (hero, after the preloader); otherwise it plays on scroll-in.
 */
export function Reveal({ lines, as: Tag = 'div', className, lineClassName = '', delay = 0, play }: {
  lines: ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  lineClassName?: string;
  delay?: number;
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const on = play ?? inView;
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        // pb/-mb keep italic descenders inside the mask
        <span key={i} className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] [perspective:900px] ${lineClassName}`}>
          <motion.span
            className="block origin-[50%_100%] will-change-transform"
            initial={reduce ? { opacity: 0 } : { y: '100%', rotateX: -70, opacity: 0 }}
            animate={on ? (reduce ? { opacity: 1 } : { y: '0%', rotateX: 0, opacity: 1 }) : undefined}
            transition={{ duration: reduce ? 0.6 : 1.2, ease: EASE_EXPO, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Simple fade-up for blocks (paragraphs, cards). */
export function Fade({ children, className, delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduce ? 0.6 : 0.9, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Mono eyebrow `01 / WORK` + serif title + optional aside. */
export function SectionHead({ index, label, title, aside }: { index: string; label: string; title: ReactNode[]; aside?: ReactNode }) {
  return (
    <header className="grid gap-8 md:grid-cols-12 md:items-end mb-16 md:mb-24">
      <div className="md:col-span-8">
        <p className="label text-faint mb-6">
          <span className="text-accent">{index}</span> / {label}
        </p>
        <Reveal as="h2" lines={title} className="font-display text-h2" />
      </div>
      {aside && <Fade className="md:col-span-4 text-muted leading-relaxed max-w-sm md:justify-self-end">{aside}</Fade>}
    </header>
  );
}

/** Anchor that routes internally (SPA) and opens externals in a new tab. */
export function A({ href = '', children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith('.pdf');
  if (external) {
    const web = href.startsWith('http') || href.endsWith('.pdf');
    return (
      <a href={href} {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a
      {...rest}
      href={href}
      onClick={(e) => {
        rest.onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

/** Magnetic wrapper: element leans toward the pointer (fine pointers only). */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.6 });
  const live = !reduce && finePointer();
  return (
    <motion.span
      className={`inline-block ${className ?? ''}`}
      style={{ x, y }}
      onPointerMove={live ? (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      } : undefined}
      onPointerLeave={live ? () => { x.set(0); y.set(0); } : undefined}
    >
      {children}
    </motion.span>
  );
}

/** 3D tilt surface: leans toward the pointer with a moving specular sheen (fine pointers only). */
export function Tilt({ children, className = '', max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50), gy = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(40% 50% at ${gx}% ${gy}%, var(--wash-a), transparent 70%)`;
  const live = !reduce && finePointer();
  return (
    <div className={`[perspective:1400px] ${className}`}>
      <motion.div
        className="relative h-full preserve-3d"
        style={live ? { rotateX: rx, rotateY: ry } : undefined}
        onPointerMove={live ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * max * 2); rx.set(-(py - 0.5) * max * 2);
          gx.set(px * 100); gy.set(py * 100);
        } : undefined}
        onPointerLeave={live ? () => { rx.set(0); ry.set(0); } : undefined}
      >
        {children}
        {live && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: sheen }} />}
      </motion.div>
    </div>
  );
}

export const btnSolid =
  'inline-flex items-center gap-3 h-12 px-6 rounded-md bg-ink text-bg text-sm font-medium tracking-tight transition-colors duration-200 hover:bg-accent';
export const btnLine =
  'inline-flex items-center gap-3 h-12 px-6 rounded-md border border-line-strong text-ink text-sm font-medium tracking-tight transition-colors duration-200 hover:border-accent hover:text-accent';

export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className={className}>
    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" />
  </svg>
);

/** AK monogram; `draw` animates the gold stroke (preloader). */
export function Monogram({ size = 28, draw = false, className = '' }: { size?: number; draw?: boolean; className?: string }) {
  const paths = ['M6 40 L18 8 L30 40', 'M10.5 28 H25.5', 'M38 8 V40', 'M38 26 L52 8', 'M42.5 21 L54 40'];
  return (
    <svg viewBox="0 0 60 48" width={size * 1.25} height={size} aria-hidden className={className}>
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={draw ? 1.6 : 2.4}
          strokeLinecap="square"
          initial={draw ? { pathLength: 0 } : false}
          animate={draw ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.1 + i * 0.1 }}
        />
      ))}
    </svg>
  );
}
