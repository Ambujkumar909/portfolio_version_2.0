import type { ReactNode } from 'react';
import { ALL_CASES, INDEX } from '../content';
import { useMeta } from '../lib';
import ArchDiagram from '../components/ArchDiagram';
import { StackVisual, VISUALS } from '../components/visuals';
import { A, Arrow, Fade, Reveal, SectionHead } from '../components/ui';
import NotFound from './NotFound';

const pad = (i: number) => String(i + 1).padStart(2, '0');
const Gold = ({ children }: { children: ReactNode }) => <em className="italic text-accent">{children}</em>;

function Block({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-line">
      <div className="wrap py-24 md:py-40">{children}</div>
    </section>
  );
}

export default function CaseStudy({ slug }: { slug: string }) {
  const f = ALL_CASES.find((c) => c.slug === slug);
  useMeta(f ? `${f.name} – Ambuj Kumar` : '404 – Ambuj Kumar', f?.pitch ?? "This route isn't in production yet.");
  if (!f) return <NotFound />;

  // next project follows the index order, wrapping around
  const order = INDEX.map((i) => i.slug);
  const nextSlug = order[(order.indexOf(f.slug) + 1) % order.length];
  const next = ALL_CASES.find((c) => c.slug === nextSlug)!;
  const Visual = (VISUALS as Record<string, (() => ReactNode) | undefined>)[f.slug];

  // sections only appear when there is something true to say; numbering follows
  const sections: { label: string; title: ReactNode[]; body: ReactNode }[] = [];
  if (f.cost.length) sections.push({
    label: 'Problem', title: [<>The cost <Gold>today</Gold></>],
    body: (
      <>
        <Fade><p className="max-w-4xl font-display text-h3">{f.cost[0]}</p></Fade>
        {f.cost.slice(1).map((c) => <Fade key={c}><p className="mt-8 max-w-2xl leading-relaxed text-muted">{c}</p></Fade>)}
      </>
    ),
  });
  sections.push({
    label: 'Build', title: [<>What I <Gold>built</Gold></>],
    body: (
      <ol>
        {f.built.map((b, k) => (
          <Fade key={b}>
            <li className="grid gap-4 border-t border-line py-8 md:grid-cols-12">
              <span className="font-mono text-sm text-accent md:col-span-2">{pad(k)}</span>
              <span className="text-lg leading-snug md:col-span-10 md:text-2xl">{b}</span>
            </li>
          </Fade>
        ))}
      </ol>
    ),
  });
  if (f.arch) sections.push({ label: 'Architecture', title: [<>How it <Gold>fits</Gold></>], body: <ArchDiagram arch={f.arch} /> });
  if (f.decisions.length) sections.push({
    label: 'Decisions', title: ['Engineering', <Gold>decisions</Gold>],
    body: (
      <div className="grid gap-x-16 sm:grid-cols-2">
        {f.decisions.map((d, k) => (
          <Fade key={d.title} delay={(k % 2) * 0.08}>
            <div className="border-t border-line pt-8 pb-12">
              <p className="font-mono text-sm text-faint">{pad(k)}</p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">{d.title}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted">{d.body}</p>
            </div>
          </Fade>
        ))}
      </div>
    ),
  });
  if (f.outcome.length || f.outcomeNote) sections.push({
    label: 'Outcome', title: [<>The <Gold>outcome</Gold></>],
    body: (
      <>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {f.outcome.map((o) => (
            <div key={o.label} className="flex flex-col-reverse justify-end border-t border-line pt-6 pb-10">
              <dt className="label mt-4 text-faint">{o.label}</dt>
              <dd className="tabular font-mono text-[clamp(2rem,3.6vw,3.5rem)] leading-none tracking-tight">{o.value}</dd>
            </div>
          ))}
        </dl>
        {f.outcomeNote && (
          <ul className="mt-12 grid gap-4">
            {f.outcomeNote.map((n) => (
              <li key={n} className="flex gap-4 text-lg">
                <span aria-hidden className="mt-[0.8em] h-px w-6 shrink-0 bg-accent" />
                {n}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
  });

  return (
    <article key={f.slug}>
      <header className="wrap pt-40 pb-24 md:pb-32">
        <A href="/#index" className="label link-draw text-muted hover:text-accent">← All work</A>
        <p className="label mt-16 mb-6 text-accent">{f.kicker}</p>
        <Reveal as="h1" lines={[f.name]} className="break-words font-display text-hero" />
        <Reveal as="p" lines={[<em className="italic text-muted">{f.full}</em>]} className="mt-4 font-display text-h3" delay={0.08} />
        <Fade delay={0.15}>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed break-words md:text-xl">{f.pitch}</p>
        </Fade>
        <Fade delay={0.2}>
          <dl className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <dt className="label mb-3 text-faint">Role</dt>
              <dd className="text-sm">{f.role}</dd>
            </div>
            <div className="lg:col-span-3">
              <dt className="label mb-3 text-faint">Context</dt>
              <dd className="text-sm">{f.context}</dd>
              {f.link && <dd className="mt-2"><A href={f.link.href} className="inline-flex items-center gap-1.5 text-sm text-accent link-draw">{f.link.label} <Arrow className="-rotate-45" /></A></dd>}
            </div>
            <div className="sm:col-span-2 lg:col-span-6">
              <dt className="label mb-3 text-faint">Stack</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {f.stack.map((s) => (
                    <li key={s} className="rounded-sm border border-line px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted">{s}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Fade>
        <Fade className="mt-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-elevated md:aspect-[16/10]">
            {Visual ? <Visual /> : <StackVisual name={f.name} stack={f.stack} />}
          </div>
        </Fade>
      </header>

      {sections.map((s, k) => (
        <Block key={s.label}>
          <SectionHead index={pad(k)} label={s.label} title={s.title} />
          {s.body}
        </Block>
      ))}

      <Block>
        <p className="label mb-8 text-faint">
          <span className="text-accent">Next</span> / Project
        </p>
        <A href={`/work/${next.slug}`} className="group block">
          <span className="label mb-6 block text-accent">{next.kicker}</span>
          <span className="flex items-end justify-between gap-8">
            <span className="min-w-0 break-words font-display text-hero transition-colors duration-400 group-hover:text-accent">{next.name}</span>
            <Arrow className="mb-[2vw] h-8 w-8 shrink-0 transition-transform duration-400 ease-expo group-hover:translate-x-2 md:h-12 md:w-12" />
          </span>
          <span className="mt-6 block max-w-xl text-muted">{next.pitch}</span>
        </A>
      </Block>
    </article>
  );
}
