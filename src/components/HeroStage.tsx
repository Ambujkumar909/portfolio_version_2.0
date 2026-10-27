import { useEffect, useRef } from 'react';
import { isLowPower, token, useTheme } from '../lib';

/**
 * Keynote stage: a warm spotlight beam from above, a lit floor, and dust drifting slowly
 * through the light. Pure CSS + one tiny 2D canvas (~60 motes); pauses off-screen.
 */
export function HeroStage() {
  const cv = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext('2d')!;
    const [r, g, b] = (token('--accent').match(/[0-9a-f]{2}/gi) ?? ['cd', 'ae', '7a']).map((x) => parseInt(x, 16));
    const motes = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), s: 0.4 + Math.random() * 1.4, v: 0.004 + Math.random() * 0.012, p: Math.random() * 6.28 }));
    let w = 0, h = 0, raf = 0, visible = true;
    const still = isLowPower();
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };
    // beam centre follows the figure: right third on desktop, centre on phones
    const beamX = () => (w >= 1024 ? 0.74 : 0.5);
    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      const bx = beamX() * w;
      for (const m of motes) {
        const y = ((m.y - t * m.v) % 1 + 1) % 1;
        const x = bx + (m.x - 0.5) * w * 0.42 * (0.35 + y * 0.65) + Math.sin(t * 0.6 + m.p) * 8;
        // only visible inside the cone of light
        const inBeam = 1 - Math.min(1, Math.abs(x - bx) / (w * 0.21 * (0.35 + y * 0.65)));
        const a = inBeam * (0.25 + 0.35 * Math.sin(m.p + t * 0.4) ** 2) * (theme === 'dark' ? 1 : 0.7);
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath(); ctx.arc(x, y * h, m.s, 0, 6.283); ctx.fill();
      }
    }
    const t0 = performance.now();
    const loop = (now: number) => { draw((now - t0) / 1000); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!still && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const ro = new ResizeObserver(resize); ro.observe(c); resize();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }); io.observe(c);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    start();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [theme]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* spotlight cone from above, centred on the figure */}
      <div className="absolute left-1/2 top-[-10%] h-[115%] w-[90%] -translate-x-1/2 lg:left-[74%] lg:w-[46%]"
        style={{
          background: 'linear-gradient(to bottom, var(--wash-a), transparent 85%)',
          clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
          filter: 'blur(28px)',
        }} />
      {/* lit floor under the figure */}
      <div className="absolute bottom-[4%] left-1/2 h-[18%] w-[110%] -translate-x-1/2 lg:left-[74%] lg:w-[52%]"
        style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--wash-a), transparent 70%)' }} />
      {/* soft ambient key on the headline side */}
      <div className="absolute -left-[20%] -top-[30%] h-[90%] w-[70%]"
        style={{ background: 'radial-gradient(50% 50% at 40% 40%, var(--wash-a), transparent 70%)', opacity: 0.6 }} />
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
