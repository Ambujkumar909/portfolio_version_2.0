import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ABOUT, EXPERIENCE, PERSON, RECOGNITION } from '../content';
import { EASE_EXPO, useMeta, useReady } from '../lib';
import { A, Arrow, Fade, Magnetic, Reveal, SectionHead, Tilt, btnLine, btnSolid } from '../components/ui';
import { Capabilities, Featured, IndexTable } from '../components/Work';

const gold = (w: string) => <em className="italic text-accent">{w}</em>;

// Narrative order (by design): claim → the work (peak attention, with its numbers) → the person →
// track record → depth → capability → recognition → ask. One photograph, in the hero only.

// ── 01 · Hero ─────────────────────────────────────────────────────────────
// The one photograph on the site: framed like a print, revealed once, floating on a champagne glow.
function Portrait({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const chip = 'absolute z-10 flex items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-bg/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink backdrop-blur-md [box-shadow:var(--shadow)] sm:px-3.5 sm:py-2 sm:text-[11px]';
  const pop = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12, scale: 0.96 },
    animate: ready ? { opacity: 1, y: 0, scale: 1 } : undefined,
    transition: { duration: 0.9, ease: EASE_EXPO, delay: d },
  } as const);
  return (
    <figure className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
      {/* champagne glow + offset hairline frame (passe-partout) */}
      <div aria-hidden className="absolute -inset-[12%] -z-10" style={{ background: 'radial-gradient(closest-side, var(--wash-a), transparent)' }} />
      <motion.div aria-hidden className="absolute -inset-2.5 rounded-[26px] border border-accent/35 sm:-inset-3.5 sm:rounded-[30px]"
        initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.7 }} />
      <Tilt max={4} className="rounded-[20px]">
        <motion.div
          className="relative aspect-square overflow-hidden rounded-[18px] border border-line-strong bg-raised [box-shadow:var(--shadow)] sm:aspect-[4/3] sm:rounded-[20px] md:aspect-[4/5] lg:aspect-[5/4]"
          initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0% round 20px)' }}
          animate={ready ? { clipPath: 'inset(0% 0% 0% 0% round 20px)' } : undefined}
          transition={{ duration: 1.3, ease: EASE_EXPO, delay: 0.15 }}
        >
          <motion.img
            src="/hero.webp" srcSet="/hero-960.webp 960w, /hero.webp 1536w" sizes="(min-width: 1024px) 48vw, (min-width: 768px) 42vw, 100vw"
            width={1536} height={1024} alt="Ambuj Kumar at his desk, working on a laptop" fetchPriority="high" decoding="async"
            className="hero-img absolute inset-0 h-full w-full object-cover object-[46%_40%] lg:object-[40%_42%]"
            initial={reduce ? false : { scale: 1.16 }} animate={ready ? { scale: 1 } : undefined}
            transition={{ duration: 2.2, ease: EASE_EXPO, delay: 0.15 }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </motion.div>
        {/* chips float above the print (3D depth inside the tilt) */}
        <motion.p {...pop(1.1)} className={`${chip} right-3 top-3 sm:-right-4 sm:top-6`} style={{ translateZ: 40 }}>
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" /><span className="h-1.5 w-1.5 rounded-full bg-accent" /></span>
          4 systems replaced
        </motion.p>
        <motion.p {...pop(1.25)} className={`${chip} bottom-3 left-3 sm:-left-5 sm:bottom-8`} style={{ translateZ: 60 }}>
          <span className="text-accent">{PERSON.name}</span><span className="text-faint">·</span>Jaipur, IN
        </motion.p>
      </Tilt>
    </figure>
  );
}

function Hero() {
  const ready = useReady();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const show = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_EXPO, delay: d },
  });

  return (
    <section id="top" ref={ref} aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 wash-tr" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[30%] bg-gradient-to-t from-bg to-transparent" />

      <div className="wrap grid items-center gap-12 pb-8 pt-28 md:grid-cols-12 md:gap-8 md:pb-16 md:pt-36 lg:min-h-[100svh] lg:gap-10 lg:pt-28">
        <motion.div style={{ y: contentY, opacity: contentO }} className="relative z-10 md:col-span-7 lg:col-span-6">
          <motion.p {...show(0)} className="label mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted md:mb-8">
            <span className="h-px w-8 bg-accent" aria-hidden />
            <span>AI Systems Architect</span> <span className="hidden text-faint xl:inline">·</span> <span className="w-full pl-11 xl:w-auto xl:pl-0">Generative AI / LLM Engineer</span>
          </motion.p>
          <Reveal
            as="h1"
            play={ready}
            delay={0.08}
            lines={[<span id="hero-title">I build the systems</span>, <>companies stop</>, <>paying {gold('licences')} for.</>]}
            className="font-display text-hero md:text-[clamp(3rem,6.6vw,5.5rem)] lg:text-[clamp(3.5rem,5.3vw,7rem)]"
          />
          <motion.p {...show(0.5)} className="mt-8 max-w-[38ch] text-lg leading-relaxed text-muted md:mt-10">
            Enterprise software, designed end to end and run in production. Built to replace the licence, then owned by you.
          </motion.p>
          <motion.div {...show(0.6)} className="mt-8 flex flex-wrap gap-3">
            <Magnetic><A href="/#work" className={btnSolid}>View the work <Arrow /></A></Magnetic>
            <Magnetic><A href={PERSON.resume} className={btnLine}>Download résumé</A></Magnetic>
          </motion.div>
        </motion.div>

        <div className="md:col-span-5 lg:col-span-6 lg:pl-4 xl:pl-8">
          <Portrait ready={ready} />
        </div>
      </div>
    </section>
  );
}

// ── 02 · About ────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 wash-tl" />
      <div className="wrap grid gap-6 py-24 md:grid-cols-12 md:gap-8 md:py-40">
        <div className="md:col-span-4">
          <p className="label text-faint md:sticky md:top-28"><span className="text-accent">02</span> / About</p>
        </div>
        <div className="md:col-span-8">
          <h2 id="about-title" className="sr-only">About Ambuj Kumar</h2>
          <Reveal as="p" className="font-display text-h3 text-ink"
            lines={[<>I start from the business problem,</>, <>work out what it {gold('costs')} today,</>, <>then build the system that removes it.</>]} />
          <div className="mt-10 grid gap-6 leading-relaxed text-muted md:mt-12 lg:grid-cols-2 lg:gap-8">
            {ABOUT.body.map((p, i) => <Fade key={i} delay={i * 0.08}><p>{p}</p></Fade>)}
          </div>
          <Fade delay={0.15} className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            <div className="bg-elevated p-5">
              <p className="label mb-3 flex items-center gap-2 text-faint"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden /> Currently</p>
              <p className="text-ink">{ABOUT.current.degree}</p>
              <p className="mt-1 text-sm text-muted">{ABOUT.current.school} · {ABOUT.current.years}</p>
            </div>
            <div className="bg-elevated p-5">
              <p className="label mb-3 text-faint">Reach</p>
              <A href={`mailto:${PERSON.email}`} className="block text-ink link-draw w-fit">{PERSON.email}</A>
              <A href={`tel:${PERSON.tel}`} className="mt-1 block w-fit text-sm text-muted link-draw">{PERSON.phone}</A>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

// ── 03 · Experience ───────────────────────────────────────────────────────
function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  return (
    <section id="experience" aria-labelledby="exp-title" className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 wash-tr" />
      <div className="wrap py-24 md:py-40">
        <SectionHead index="03" label="Experience" title={[<span id="exp-title">Track {gold('record')}.</span>]}
          aside="Each row is a cost the business was paying, and the system that removed it. Open one for the detail." />
        <div ref={ref} className="relative pl-6 md:pl-10">
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
          <motion.div aria-hidden className="absolute left-0 top-0 h-full w-px origin-top bg-accent" style={{ scaleY: scrollYProgress }} />
          {EXPERIENCE.map((job, j) => (
            <article key={job.company} className={`grid gap-8 lg:grid-cols-12 ${j ? 'mt-20 md:mt-28' : ''}`}>
              <div className="relative lg:col-span-4">
                <span aria-hidden className="absolute -left-6 top-2 h-2 w-2 -translate-x-1/2 rounded-full border border-accent bg-bg md:-left-10" />
                <div className="lg:sticky lg:top-28">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{job.period}</p>
                  <h3 className="mt-3 font-display text-h3">{job.company}</h3>
                  <p className="mt-2 text-ink">{job.role}</p>
                  <p className="mt-1 text-sm text-muted">{job.note} · {job.place}</p>
                  {'link' in job && job.link && (
                    <A href={job.link.href} className="mt-4 inline-flex items-center gap-2 text-sm text-muted link-draw hover:text-ink">{job.link.label} <Arrow className="-rotate-45" /></A>
                  )}
                </div>
              </div>
              <ul className="border-t border-line lg:col-span-8">
                {job.rows.map((r) => (
                  <li key={r.name} className="border-b border-line">
                    <details className="row group">
                      <summary className="flex cursor-pointer items-baseline gap-4 py-5 md:gap-6">
                        <span className="w-full min-w-0 md:grid md:grid-cols-[minmax(0,13rem)_1fr] md:gap-6">
                          <span className="block text-ink transition-colors duration-200 group-hover:text-accent">{r.name}</span>
                          <span className="mt-1 block text-sm text-muted md:mt-0">{r.problem}</span>
                        </span>
                        <span aria-hidden className="shrink-0 font-mono text-faint transition-transform duration-300 group-open:rotate-45">+</span>
                      </summary>
                      <div className="pb-6 md:grid md:grid-cols-[minmax(0,13rem)_1fr] md:gap-6">
                        <span className="label text-accent">Built →</span>
                        <p className="mt-2 max-w-[60ch] leading-relaxed text-ink md:mt-0">
                          {r.built}
                          {'slug' in r && r.slug && <> <A href={`/work/${r.slug}`} className="ml-1 inline-flex items-center gap-1 text-accent link-draw">Case study <Arrow /></A></>}
                        </p>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Recognition & education ──────────────────────────────────────────
function Recognition() {
  return (
    <section aria-labelledby="rec-title" className="wrap py-24 md:py-32">
      <p className="label mb-10 text-faint"><span className="mr-3 inline-block h-px w-6 bg-accent align-middle" aria-hidden />Recognition &amp; education</p>
      <h2 id="rec-title" className="sr-only">Recognition and education</h2>
      <ul className="border-t border-line">
        {RECOGNITION.map((r, i) => (
          <li key={r.title} className="border-b border-line">
            <Fade delay={i * 0.08} className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
              <span className="label text-accent md:col-span-2">{r.label}</span>
              <span className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-tight md:col-span-6">{r.title}</span>
              <span className="text-sm leading-relaxed text-muted md:col-span-4">{r.detail}</span>
            </Fade>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 06 · Contact ──────────────────────────────────────────────────────────
function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PERSON.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      location.href = `mailto:${PERSON.email}`;
    }
  };
  const links = [
    { k: 'Phone', v: PERSON.phone, href: `tel:${PERSON.tel}` },
    { k: 'LinkedIn', v: PERSON.linkedinLabel, href: PERSON.linkedin },
    { k: 'GitHub', v: PERSON.githubLabel, href: PERSON.github },
    { k: 'Résumé', v: 'Download PDF', href: PERSON.resume },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line">
      <div aria-hidden className="absolute inset-0 -z-10 wash-b" />
      <div className="wrap py-24 md:py-40">
        <div>
          <p className="label mb-8 text-faint"><span className="text-accent">06</span> / Let’s build the next one</p>
          <Reveal as="h2" className="font-display text-hero" lines={[<span id="contact-title">Have a system</span>, <>worth {gold('owning?')}</>]} />
          <div className="mt-10 md:mt-14">
            <Magnetic strength={0.15}>
              <button type="button" onClick={copy} className="group inline-flex max-w-full flex-wrap items-baseline gap-x-4 gap-y-2 text-left">
                <span className="link-draw break-all font-display text-[clamp(1.75rem,4.6vw,4rem)] leading-none text-ink transition-colors group-hover:text-accent">{PERSON.email}</span>
                <span className="label text-muted" aria-live="polite">{copied ? 'Copied ✓' : 'Click to copy'}</span>
              </button>
            </Magnetic>
            <p className="mt-4 text-sm text-muted">
              Or <A href={`mailto:${PERSON.email}`} className="text-ink link-draw">open your mail app</A>.
            </p>
          </div>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
            {links.map((l) => (
              <div key={l.k} className="bg-bg">
                <A href={l.href} className="group flex h-full flex-col gap-2 p-5 transition-colors duration-200 hover:bg-elevated">
                  <dt className="label text-faint">{l.k}</dt>
                  <dd className="flex items-center justify-between gap-2 break-all text-sm text-ink group-hover:text-accent">{l.v} <Arrow className="shrink-0 -rotate-45" /></dd>
                </A>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useMeta(
    'Ambuj Kumar — AI Systems Architect',
    'I build the systems companies stop paying licences for. Enterprise software, designed end to end and run in production.',
  );
  return (
    <>
      <Hero />
      <Featured />
      <About />
      <Experience />
      <IndexTable />
      <Capabilities />
      <Recognition />
      <Contact />
    </>
  );
}
