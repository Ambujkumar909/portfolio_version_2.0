import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { DOMAINS, FLAGSHIPS, INDEX, LANGUAGES, ORBITS, type Domain, type Flagship, type IndexItem } from '../content';
import { EASE_EXPO, finePointer } from '../lib';
import { VISUALS } from './visuals';
import { A, Arrow, Fade, Reveal, SectionHead, Tilt, btnLine } from './ui';

const gold = (w: string) => <em className="italic text-accent">{w}</em>;

// ── 03 · Featured systems ("Replaced") ─────────────────────────────────────
// Sticky stacking cards: native scroll, no hijacking.

function Panel({ f, i }: { f: Flagship; i: number }) {
  const V = VISUALS[f.slug];
  return (
    <Tilt max={3} className="h-full">
      <article
        aria-labelledby={`p-${f.slug}`}
        className="grid h-full gap-8 rounded-lg border border-line bg-elevated p-5 [box-shadow:var(--shadow)] sm:p-8 xl:grid-cols-[1fr_1.05fr] xl:gap-10 xl:p-10"
      >
        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline justify-between gap-4">
            <p className="label text-accent">{f.kicker}</p>
            <span className="font-mono text-[11px] text-faint">0{i + 1} / 0{FLAGSHIPS.length}</span>
          </div>
          <h3 id={`p-${f.slug}`} className="mt-6 font-display text-[clamp(2.75rem,4.6vw,4.75rem)] leading-[0.95] tracking-[-0.02em]">{f.name}</h3>
          <p className="mt-2 text-sm text-muted">{f.full}</p>
          <p className="mt-5 max-w-[44ch] leading-relaxed text-ink">{f.pitch}</p>
          <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-5">
            {f.metrics.map((m) => (
              <div key={m.label} className="flex min-w-0 flex-col">
                <dt className="order-2 mt-2 text-[11px] leading-snug text-muted">{m.label}</dt>
                <dd className="order-1 font-mono text-[clamp(1.125rem,1.8vw,1.625rem)] tabular leading-none text-ink">{m.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
            {f.stack.map((s) => <li key={s} className="rounded-sm border border-line px-2 py-1 font-mono text-[10px] text-muted">{s}</li>)}
          </ul>
          <div className="mt-7 xl:mt-auto xl:pt-6">
            <A href={`/work/${f.slug}`} className={btnLine}>Read the case study <Arrow /></A>
          </div>
        </div>
        <div className="aspect-[4/3] min-h-0 xl:aspect-auto xl:min-h-[320px]">
          <V />
        </div>
      </article>
    </Tilt>
  );
}

export function Featured() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 wash-c opacity-70" />
      <div className="wrap py-24 md:py-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="label mb-6 text-faint"><span className="text-accent">01</span> / Featured systems</p>
              <Reveal as="h2" className="font-display text-h2" lines={[<span id="work-title">Four systems,</span>, <>{gold('replaced')}.</>]} />
              <Fade className="mt-8 max-w-[40ch] text-lg leading-relaxed text-muted">
                Each one started as a licence, a workaround or a blind spot. Each one now runs on software the company owns.
              </Fade>
            </div>
          </div>
          <div className="lg:col-span-8">
          <ol className="grid gap-6 lg:gap-10">
            {FLAGSHIPS.map((f, i) => (
              <li key={f.slug} className="lg:[@media(min-height:760px)]:sticky" style={{ top: `${96 + i * 18}px` }}>
                <Fade><Panel f={f} i={i} /></Fade>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 06 · The wider body of work ────────────────────────────────────────────

function Dots({ seed }: { seed: string }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (
    <svg viewBox="0 0 160 64" className="h-16 w-full" aria-hidden>
      {Array.from({ length: 60 }, (_, i) => {
        h = (h * 1103515245 + 12345) >>> 0;
        const on = h % 7 === 0;
        return <circle key={i} cx={8 + (i % 15) * 10.4} cy={10 + Math.floor(i / 15) * 14.5} r={on ? 2 : 1.2} fill={on ? 'var(--color-signal)' : 'var(--color-line-strong)'} />;
      })}
    </svg>
  );
}

function Row({ item, n }: { item: IndexItem; n: number }) {
  const body = (
    <>
      <span className="font-mono text-[11px] tabular text-faint md:col-span-1">{String(n).padStart(2, '0')}</span>
      <span className="flex items-center gap-2 text-ink transition-colors duration-200 group-hover:text-accent md:col-span-3">
        {item.name}
        <Arrow className="shrink-0 text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
      </span>
      <span className="col-span-2 text-sm leading-relaxed text-muted md:col-span-4">{item.line}</span>
      <span className="label row-start-1 col-start-3 justify-self-end text-muted md:col-span-2 md:col-start-auto md:row-start-auto md:justify-self-start">{item.domain}</span>
      <span className="col-span-2 font-mono text-[11px] text-faint md:col-span-2 md:text-right">{item.stack.join(' · ')}</span>
    </>
  );
  const cls = 'group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 gap-y-2 py-5 md:grid-cols-12 md:gap-6 md:py-6 transition-colors duration-200 hover:bg-elevated/60 -mx-3 px-3 rounded-sm [&>*:nth-child(3)]:col-start-2 [&>*:nth-child(5)]:col-start-2 md:[&>*:nth-child(3)]:col-start-auto md:[&>*:nth-child(5)]:col-start-auto';
  return <A href={`/work/${item.slug}`} className={cls}>{body}</A>;
}

export function IndexTable() {
  const [filter, setFilter] = useState<Domain | 'All'>('All');
  const [hover, setHover] = useState<IndexItem | null>(null);
  const items = filter === 'All' ? INDEX : INDEX.filter((i) => i.domain === filter);
  const px = useMotionValue(0), py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 260, damping: 30 }), sy = useSpring(py, { stiffness: 260, damping: 30 });
  const [fine] = useState(() => finePointer());

  return (
    <section id="index" aria-labelledby="index-title" className="wrap py-24 md:py-40"
      onPointerMove={fine ? (e) => { px.set(e.clientX + 24); py.set(e.clientY + 24); } : undefined}>
      <SectionHead index="04" label="Index" title={[<span id="index-title">The {gold('wider')} body</span>, <>of work.</>]}
        aside="Eighteen systems across six domains. Most of them replaced a licence, a register or a workaround." />

      <div role="group" aria-label="Filter by domain" className="mb-8 flex flex-wrap gap-2">
        {(['All', ...DOMAINS] as const).map((d) => {
          const count = d === 'All' ? INDEX.length : INDEX.filter((i) => i.domain === d).length;
          const on = filter === d;
          return (
            <button key={d} type="button" aria-pressed={on} onClick={() => setFilter(d)}
              className={`h-9 rounded-sm border px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-200 ${on ? 'border-accent text-accent' : 'border-line text-muted hover:border-line-strong hover:text-ink'}`}>
              {d} <span className="text-faint">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden grid-cols-12 gap-6 border-b border-line pb-3 label text-faint md:grid" aria-hidden>
        <span className="col-span-1">No.</span><span className="col-span-3">System</span><span className="col-span-4">What it does</span><span className="col-span-2">Domain</span><span className="col-span-2 text-right">Stack</span>
      </div>
      <ul aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.li key={item.name} layout="position" className="border-b border-line"
              onPointerEnter={fine ? () => setHover(item) : undefined} onPointerLeave={fine ? () => setHover(null) : undefined}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE_EXPO }}>
              <Row item={item} n={INDEX.indexOf(item) + 1} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {fine && (
        <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {hover && (
              <motion.div key={hover.name} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }} className="w-56 rounded-md border border-line-strong bg-elevated/95 p-4 backdrop-blur">
                <p className="label text-accent">{hover.domain}</p>
                <p className="mt-2 font-display text-2xl leading-tight">{hover.name}</p>
                <Dots seed={hover.name} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

// ── 07 · Capabilities ─────────────────────────────────────────────────────

const RADII = [272, 226, 180, 134, 88]; // AI/ML outermost → Frontend inner

export function Capabilities() {
  const [active, setActive] = useState(0);
  const group = ORBITS[active];
  return (
    <section id="stack" aria-labelledby="stack-title" className="relative isolate"><div aria-hidden className="absolute inset-0 -z-10 wash-tl opacity-80" /><div className="wrap py-24 md:py-40">
      <SectionHead index="05" label="Capabilities" title={[<span id="stack-title">The {gold('stack')},</span>, <>in orbit.</>]}
        aside="Five orbits around the languages underneath them. Choose one to bring it forward." />

      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <svg viewBox="0 0 600 300" className="w-full overflow-visible" role="img" aria-label={`Technology orbits; ${group.name} highlighted`}>
            <defs>
              <radialGradient id="core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity=".35" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g transform="translate(300 150) scale(1 .42)">
              {ORBITS.map((o, i) => {
                const on = i === active;
                const r = RADII[i];
                return (
                  <g key={o.name}>
                    <circle r={r} fill="none" stroke={on ? 'var(--color-accent)' : 'var(--color-line-strong)'} strokeOpacity={on ? 0.7 : 1} strokeWidth={on ? 1.6 : 1} vectorEffect="non-scaling-stroke" style={{ transition: 'stroke 400ms' }} />
                    <g className="orbit-spin" style={{ animationDuration: `${60 + i * 14}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}>
                      {o.tools.map((t, j) => {
                        const a = (j / o.tools.length) * Math.PI * 2 + i;
                        return <circle key={t} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={on ? 4.5 : 3}
                          fill={on ? 'var(--color-signal)' : 'var(--color-faint)'} opacity={on ? 1 : 0.5} style={{ transition: 'all 400ms' }} />;
                      })}
                    </g>
                  </g>
                );
              })}
              <circle r="80" fill="url(#core)" />
              <circle r="5" fill="var(--color-accent)" />
            </g>
            <text x="300" y="176" textAnchor="middle" className="fill-[var(--color-muted)] font-mono text-[11px] uppercase tracking-[0.14em]">{LANGUAGES.length} languages</text>
          </svg>
          <p className="mt-6 text-center font-mono text-[11px] leading-relaxed text-muted">{LANGUAGES.join(' · ')}</p>
        </div>

        <div className="lg:col-span-5">
          <div role="group" aria-label="Capability groups" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:border-t lg:border-line">
            {ORBITS.map((o, i) => {
              const on = i === active;
              return (
                <button key={o.name} type="button" aria-pressed={on}
                  onClick={() => setActive(i)} onPointerEnter={() => finePointer() && setActive(i)} onFocus={() => setActive(i)}
                  className={`flex items-baseline justify-between gap-6 rounded-sm border px-3 py-2 text-left transition-colors duration-200 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-4 ${on ? 'border-accent text-ink' : 'border-line text-muted hover:text-ink'}`}>
                  <span className="lg:font-display lg:text-3xl">{o.name}</span>
                  <span className={`hidden font-mono text-[11px] lg:inline ${on ? 'text-accent' : 'text-faint'}`}>{String(o.tools.length).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.ul key={group.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE_EXPO }}
              className="mt-6 flex flex-wrap gap-1.5" aria-label={`${group.name} tools`}>
              {group.tools.map((t) => <li key={t} className="rounded-sm border border-line px-2 py-1 font-mono text-[11px] text-ink">{t}</li>)}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>

      <details className="row mt-16 border-y border-line">
        <summary className="flex cursor-pointer items-center justify-between py-4 label text-muted hover:text-ink">
          Full stack as a plain list <span aria-hidden>+</span>
        </summary>
        <dl className="grid gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3">
          {[{ name: 'Languages', tools: LANGUAGES }, ...ORBITS].map((o) => (
            <div key={o.name}>
              <dt className="label text-accent">{o.name}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{o.tools.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
    </section>
  );
}
