import { A, Arrow, Fade, Magnetic, Reveal, btnSolid } from '../components/ui';
import { useMeta } from '../lib';

export default function NotFound() {
  useMeta('404 – Ambuj Kumar', "This route isn't in production yet.");
  return (
    <section className="wrap flex min-h-[100svh] flex-col items-center justify-center gap-10 pt-32 pb-24 text-center">
      <div>
        <p className="label mb-6 text-accent">404</p>
        <Reveal
          as="h1"
          className="font-display text-h2"
          lines={['This route isn’t in', <><em className="italic text-accent">production</em> yet.</>]}
        />
        <Fade>
          <p className="mx-auto mt-6 max-w-md text-muted">The page you asked for doesn’t exist, or hasn’t shipped.</p>
        </Fade>
        <Fade delay={0.1} className="mt-10">
          <Magnetic>
            <A href="/" className={btnSolid}>
              Back to the work <Arrow />
            </A>
          </Magnetic>
        </Fade>
      </div>
    </section>
  );
}
