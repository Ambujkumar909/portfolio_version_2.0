import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ABOUT, EXPERIENCE, PERSON, RECOGNITION } from '../content';
import { EASE_EXPO, useMeta, useReady } from '../lib';
import { Character } from '../components/Character';
import { HeroStage } from '../components/HeroStage';
import { A, Arrow, Fade, Magnetic, Reveal, SectionHead, btnLine, btnSolid } from '../components/ui';
import { Capabilities, Featured, IndexTable } from '../components/Work';

const gold = (w: string) => <em className="italic text-accent">{w}</em>;

// Narrative order (by design): claim → the work (peak attention, with its numbers) → the person →
// track record → depth → capability → recognition → ask. Portraits are placed so their
// gaze points at what the reader should look at next.

// ── 01 · Hero ─────────────────────────────────────────────────────────────
function Hero() {
  const ready = useReady();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const contentO = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const show = (d: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EASE_EXPO, delay: d },
  });

  return (
    <section id="top" ref={ref} aria-labelledby="hero-title" className="relative isolate overflow-hidden lg:min-h-[100svh]">
      <div aria-hidden className="absolute inset-0 -z-10">
        <HeroStage />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      </div>

      <div className="wrap relative flex flex-col pt-28 md:pt-36 lg:min-h-[100svh] lg:justify-center lg:pb-16 lg:pt-32">
        {/* the figure faces the reader (eye contact) on the right, planted on the floor (no scroll drift) */}
        <div className="pointer-events-none order-last -mb-8 mt-4 flex justify-center sm:justify-end lg:absolute lg:bottom-0 lg:right-[3%] lg:z-0 lg:mb-0 lg:mt-0 xl:right-[7%]">
          <Character pose="hero" priority play={ready} className="h-[min(64svh,560px)] lg:h-[min(88svh,860px)]" />
        </div>

        <motion.div style={{ y: contentY, opacity: contentO }} className="relative z-10">
          <motion.p {...show(0)} className="label mb-6 flex max-w-[34ch] flex-wrap items-center gap-x-3 gap-y-1 text-muted md:mb-8 md:max-w-none">
            <span className="h-px w-8 bg-accent" aria-hidden />
            AI Systems Architect <span className="text-faint">·</span> Generative AI / LLM Engineer
          </motion.p>
          <Reveal
            as="h1"
            play={ready}
            delay={0.08}
            lines={[<span id="hero-title">I build the systems</span>, <>companies stop</>, <>paying {gold('licences')} for.</>]}
            className="font-display text-hero"
          />
          <motion.p {...show(0.5)} className="mt-8 max-w-[38ch] text-lg leading-relaxed text-muted md:mt-10">
            Enterprise software, designed end to end and run in production. Built to replace the licence, then owned by you.
          </motion.p>
          <motion.div {...show(0.6)} className="mt-8 flex flex-wrap gap-3">
            <Magnetic><A href="/#work" className={btnSolid}>View the work <Arrow /></A></Magnetic>
            <Magnetic><A href={PERSON.resume} className={btnLine}>Download résumé</A></Magnetic>
          </motion.div>
          <motion.a {...show(0.9)} href="#work" className="mt-14 hidden items-center gap-3 label text-faint transition-colors hover:text-ink lg:inline-flex">
            <span className="relative block h-8 w-px overflow-hidden bg-line">
              <motion.span className="absolute inset-x-0 top-0 h-3 bg-accent" animate={reduce ? undefined : { y: [-12, 32] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
            </span>
            Scroll
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ── 02 · About ────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate">
      <div aria-hidden className="absolute inset-0 -z-10 wash-tl" />
      <div className="wrap grid items-center gap-12 py-24 md:grid-cols-12 md:gap-8 md:py-40">
        {/* portrait left, looking at the words */}
        <Fade className="md:col-span-5 lg:col-span-5">
          {/* framed studio portrait: relaxed three-quarter pose, waist-up; backdrop follows the theme */}
          {/* phones: free-standing figure on the floor glow, like the other placements */}
          <div className="flex justify-center md:hidden">
            <Character pose="about" className="h-[min(56svh,460px)]" />
          </div>
          <div className="relative mx-auto hidden aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-t-full border border-line [box-shadow:var(--shadow)] md:block"
            style={{ background: 'var(--studio)' }}>
            <div className="absolute left-1/2 top-[7%] h-[175%] -translate-x-[46%]">
              <Character pose="about" floor={false} className="h-full" />
            </div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[38%]" style={{ background: 'linear-gradient(to top, var(--studio-end) 18%, transparent)' }} />
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap label text-muted">Jaipur · IST</span>
          </div>
        </Fade>
        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <p className="label mb-6 text-faint"><span className="text-accent">02</span> / About</p>
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
      <div className="wrap grid items-end gap-10 py-24 md:py-40 lg:grid-cols-12 lg:gap-8">
        {/* portrait left; his gaze leads to the email */}
        <Fade className="flex justify-center lg:col-span-4 lg:justify-start">
          <Character pose="contact" className="w-full max-w-[300px] sm:max-w-[380px] lg:max-w-none" />
        </Fade>
        <div className="lg:col-span-8">
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
