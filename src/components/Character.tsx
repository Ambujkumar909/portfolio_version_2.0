import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { finePointer, isLowPower, token, useTheme } from '../lib';

// Cut from the supplied character turnaround sheet (new design/) + an offline depth map per pose.
// The WebGL pass turns each cut-out into a lit 2.5D figure: depth parallax and a 3D turn toward the
// pointer, light that sweeps across face and suit, idle breathing/sway, cinematic fades.
// Only the hero moves; every other placement is a still that fades in.
//
// Real limb motion (walking, folding arms, waving) needs footage. Drop alpha clips into
// /public/character/ as <clip>.webm (VP9 alpha) + <clip>.mov (HEVC alpha, Safari), list them in
// CLIPS, and they replace the still automatically.
export type Pose = 'hero' | 'about' | 'present' | 'think' | 'contact' | 'shrug';

type Asset = { file: string; w: number; h: number; alt: string; portrait?: boolean; fade: [number, number] };

const POSES: Record<Pose, Asset> = {
  hero: { file: 'front', w: 386, h: 1005, alt: 'Ambuj Kumar standing, hands in pockets', fade: [0.8, 0.99] },
  present: { file: 'profile', w: 219, h: 994, alt: 'Ambuj Kumar in profile, walking toward the work', fade: [0.8, 0.99] },
  shrug: { file: 'back', w: 386, h: 1002, alt: 'Ambuj Kumar seen from behind, walking off', fade: [0.78, 0.99] },
  about: { file: 'three-quarter', w: 344, h: 1006, alt: 'Ambuj Kumar, relaxed, one hand in pocket', fade: [0.9, 1] },
  think: { file: 'face-think', w: 720, h: 522, alt: 'Ambuj Kumar thinking, hand on chin', portrait: true, fade: [0.55, 0.97] },
  contact: { file: 'face-excited', w: 765, h: 522, alt: 'Ambuj Kumar smiling, looking toward the email', portrait: true, fade: [0.55, 0.97] },
};

// TODO(ambuj): e.g. { hero: 'hero-walk-fold' } once /public/character/hero-walk-fold.webm + .mov exist.
const CLIPS: Partial<Record<Pose, string>> = {};

const E = [0.16, 1, 0.3, 1] as const;

// back → side → three-quarter → front: the turnaround frames, played as a spin-in
const TURN = ['back', 'profile', 'three-quarter'];

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
const FRAG = `precision mediump float;
uniform sampler2D T, D; uniform vec2 P, X, F; uniform float t, I, R; uniform vec3 RIM, KEY;
varying vec2 v;
const float PAD = .05;
void main(){
  vec2 uv = (v - .5) * (1. + 2.*PAD) + .5;
  float h = 1. - uv.y;
  uv.y += sin(t*1.3) * .006 * h*h;                        // breathing
  uv.x += sin(t*.55) * .005 * h*h*h;                      // weight shift, pivot at the feet
  uv.x += sin(t*.9 + 1.) * .004 * smoothstep(.75, 1., h); // head settles
  float d = texture2D(D, uv).r;
  uv -= P * vec2(.045, .02) * (d - .25);                  // depth parallax: near moves more
  vec4 c = texture2D(T, uv);                              // premultiplied
  float m = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
  float dx = texture2D(D, uv + vec2(X.x*3.,0.)).r - texture2D(D, uv - vec2(X.x*3.,0.)).r;
  float dy = texture2D(D, uv + vec2(0.,X.y*3.)).r - texture2D(D, uv - vec2(0.,X.y*3.)).r;
  vec3 n = normalize(vec3(-dx*8., dy*8., 1.));
  vec3 L = normalize(vec3(-.35 - P.x*1.1, .5 + P.y*.7, .8));  // key light follows the pointer
  float diff = clamp(dot(n, L), 0., 1.);
  vec3 col = c.rgb * (.7 + .5*diff);
  float rim = pow(1. - n.z, 1.5) * clamp(dot(normalize(n.xy + 1e-4), -L.xy)*.5 + .5, 0., 1.);
  col += (RIM * rim * .55 + KEY * pow(diff, 6.) * .1) * c.a;
  m *= 1. - smoothstep(F.x, F.y, v.y);
  if (R > .5) { float vx = abs(v.x - .5) * 2.; m *= 1. - smoothstep(.72, 1., vx); }
  m *= 1. - smoothstep(I*1.15 - .15, I*1.15, 1. - v.y);   // rises from the floor
  gl_FragColor = vec4(col * m, c.a * m);
}`;

const rgb = (hex: string): [number, number, number] => {
  const m = hex.replace('#', '').match(/.{2}/g);
  return m ? (m.map((x) => parseInt(x, 16) / 255) as [number, number, number]) : [0.8, 0.68, 0.48];
};

// one shared pointer for every character
const ptr = { x: 0, y: 0, active: false };
if (typeof window !== 'undefined') {
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    ptr.x = (e.clientX / innerWidth) * 2 - 1;
    ptr.y = (e.clientY / innerHeight) * 2 - 1;
    ptr.active = true;
  }, { passive: true });
}

const load = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
  const i = new Image();
  i.onload = () => res(i);
  i.onerror = rej;
  i.src = src;
});

export function Character({ pose, className = '', priority = false, floor = !POSES[pose].portrait, play = true }: {
  pose: Pose;
  className?: string; // sets height (or width); aspect ratio is kept
  priority?: boolean;
  floor?: boolean;
  play?: boolean; // gate for the hero intro (after the preloader)
}) {
  const a = POSES[pose];
  const clip = CLIPS[pose];
  const live = pose === 'hero'; // the only figure with motion
  const turnIn = live;
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState(false);
  const reduce = !!useReducedMotion();
  const theme = useTheme();
  const colors = useRef({ rim: [0.8, 0.68, 0.48], key: [1, 0.95, 0.86] });
  const [frame, setFrame] = useState(turnIn && !reduce ? 0 : TURN.length);
  const settled = frame >= TURN.length;

  // whole-figure 3D turn toward the pointer (CSS), on top of the shader's depth parallax
  const ry = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });
  const rx = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });

  useEffect(() => {
    colors.current = { rim: rgb(token('--accent')), key: theme === 'dark' ? [1, 0.95, 0.86] : [1, 0.98, 0.94] };
  }, [theme]);

  // hero: spin in through the turnaround frames
  useEffect(() => {
    if (!turnIn || reduce || !play || settled) return;
    const id = setTimeout(() => setFrame((f) => f + 1), frame === 0 ? 320 : 200);
    return () => clearTimeout(id);
  }, [turnIn, reduce, play, frame, settled]);

  useEffect(() => {
    if (!live || isLowPower() || clip) return;
    let cleanup = () => {};
    const pre = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { pre.disconnect(); cleanup = init() ?? (() => {}); }
    }, { rootMargin: '400px' });
    pre.observe(box.current!);
    return () => { pre.disconnect(); cleanup(); };

    function init() {
      const canvas = cv.current!, el = box.current!;
      const g = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
      if (!g) return;
      let raf = 0, visible = false, started = false, dead = false, introStarted = false;
      const intro = { v: turnIn ? 1 : 0 };
      const sp = { x: 0, y: 0 };
      const sh = (type: number, src: string) => { const s = g.createShader(type)!; g.shaderSource(s, src); g.compileShader(s); return s; };
      const prog = g.createProgram()!;
      g.attachShader(prog, sh(g.VERTEX_SHADER, VERT));
      g.attachShader(prog, sh(g.FRAGMENT_SHADER, FRAG));
      g.linkProgram(prog);
      if (!g.getProgramParameter(prog, g.LINK_STATUS)) return;
      g.useProgram(prog);
      g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
      const loc = g.getAttribLocation(prog, 'p');
      g.enableVertexAttribArray(loc);
      g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
      const U = Object.fromEntries(['T', 'D', 'P', 'X', 'F', 't', 'I', 'R', 'RIM', 'KEY'].map((n) => [n, g.getUniformLocation(prog, n)]));

      const tex = (img: HTMLImageElement, unit: number) => {
        g.activeTexture(g.TEXTURE0 + unit);
        g.bindTexture(g.TEXTURE_2D, g.createTexture());
        g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img);
        for (const [k, v] of [[g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR], [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE]]) g.texParameteri(g.TEXTURE_2D, k, v);
      };
      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
        g.viewport(0, 0, canvas.width, canvas.height);
      };

      const fine = finePointer();
      const t0 = performance.now();
      const draw = (now: number) => {
        const t = (now - t0) / 1000;
        // pointer on desktop; a slow orbit on touch so the depth always reads
        const tx = fine && ptr.active ? ptr.x : Math.sin(t * 0.4) * 0.7;
        const ty = fine && ptr.active ? ptr.y : Math.sin(t * 0.27) * 0.3;
        sp.x += (tx - sp.x) * 0.07; sp.y += (ty - sp.y) * 0.07;
        ry.set(sp.x * 10); rx.set(-sp.y * 4);
        g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
        g.uniform2f(U.P, sp.x, sp.y);
        g.uniform1f(U.t, t);
        g.uniform1f(U.I, intro.v);
        g.uniform3fv(U.RIM, colors.current.rim);
        g.uniform3fv(U.KEY, colors.current.key);
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
        raf = visible && !document.hidden ? requestAnimationFrame(draw) : 0;
      };
      const run = () => { if (!raf && visible && !document.hidden && started) raf = requestAnimationFrame(draw); };

      Promise.all([load(`/character/${a.file}.webp`), load(`/character/${a.file}.depth.webp`)]).then(([img, dep]) => {
        if (dead) return;
        tex(img, 0); tex(dep, 1);
        g.uniform1i(U.T, 0); g.uniform1i(U.D, 1);
        g.uniform2f(U.X, 1 / img.width, 1 / img.height);
        g.uniform2f(U.F, a.fade[0], a.fade[1]);
        g.uniform1f(U.R, a.portrait ? 1 : 0);
        resize();
        started = true;
        setGl(true);
        run();
      }).catch(() => {});

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !introStarted) { introStarted = true; animate(intro, { v: 1 }, { duration: 1.6, ease: E }); }
        run();
      }, { rootMargin: '60px' });
      io.observe(el);
      const onVis = () => run();
      document.addEventListener('visibilitychange', onVis);
      return () => {
        dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        g.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }
  }, [a, clip, live, turnIn, rx, ry]);

  const mask = a.portrait
    ? `linear-gradient(to bottom, #000 ${a.fade[0] * 100}%, transparent ${a.fade[1] * 100}%), linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)`
    : `linear-gradient(to bottom, #000 ${a.fade[0] * 100}%, transparent ${a.fade[1] * 100}%)`;
  const maskStyle = { maskImage: mask, WebkitMaskImage: mask, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' } as const;
  const still = 'absolute inset-[5%] h-[90%] w-[90%] select-none object-contain object-bottom';

  return (
    <div ref={box} className={`relative isolate [perspective:1100px] ${className}`} style={{ aspectRatio: `${a.w} / ${a.h}` }}>
      {floor && (
        <>
          <div aria-hidden className="absolute bottom-[3%] left-1/2 -z-10 h-[10%] w-[200%] -translate-x-1/2"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--wash-a), transparent 70%)' }} />
          <div aria-hidden className="absolute bottom-[4.5%] left-1/2 -z-10 h-[3%] w-[85%] -translate-x-1/2 blur-[6px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.5), transparent 75%)' }} />
        </>
      )}
      <motion.div
        className="absolute inset-0"
        initial={live ? false : { opacity: 0 }}
        whileInView={live ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.2, ease: E }}
      >
        <motion.div className="absolute inset-0 origin-bottom preserve-3d" style={live ? { rotateY: ry, rotateX: rx } : undefined}>
          {clip ? (
            <video autoPlay muted loop playsInline poster={`/character/${a.file}.webp`} className={still} aria-label={a.alt}>
              <source src={`/character/${clip}.mov`} type='video/mp4; codecs="hvc1"' />
              <source src={`/character/${clip}.webm`} type="video/webm" />
            </video>
          ) : (
            <>
              {turnIn && !settled && TURN.map((f, i) => (
                <img key={f} src={`/character/${f}.webp`} alt="" aria-hidden className={`${still} transition-[opacity,filter] duration-150`}
                  style={{ ...maskStyle, opacity: play && i === frame ? 1 : 0, filter: i === frame ? 'blur(0px)' : 'blur(6px)' }} />
              ))}
              <img
                src={`/character/${a.file}.webp`}
                width={a.w}
                height={a.h}
                alt={a.alt}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding="async"
                draggable={false}
                className={`${still} transition-opacity duration-500 ${gl || !settled ? 'opacity-0' : 'opacity-100'}`}
                style={maskStyle}
              />
              {live && <canvas ref={cv} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${gl && settled ? 'opacity-100' : 'opacity-0'}`} />}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
