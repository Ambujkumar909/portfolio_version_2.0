
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Menu, 
  X,
  Terminal,
  Zap,
  Layers,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Code2,
  FastForward,
  Activity,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { SKILLS, PROJECTS, AUTOMATION_TOOLS } from './constants';

// --- Precise Logo Component (Refined Spacing, No Italics) ---
const BrandIdentity: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="flex items-center gap-5">
    <div className="w-10 h-10 md:w-11 md:h-11 bg-brand flex items-center justify-center shrink-0 shadow-lg shadow-brand/10">
      <span className="text-white font-extrabold text-xl md:text-2xl font-display">A</span>
    </div>
    <div className="flex flex-col justify-center text-left">
      <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight uppercase leading-none mb-1.5">
        Ambuj Kumar
      </span>
      <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.25em] leading-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        Systems & Automation Engineer
      </span>
    </div>
  </div>
);

const Navbar: React.FC<{ isDark: boolean; setIsDark: (v: boolean) => void }> = ({ isDark, setIsDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  const links = [
    { name: 'Arsenal', href: '#arsenal' },
    { name: 'Exhibition', href: '#work' },
    { name: 'Infrastructure', href: '#systems' },
    { name: 'Connect', href: '#connect' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] h-20 md:h-28 flex items-center px-6 md:px-12">
      <motion.div style={{ opacity: bgOpacity }} className={`absolute inset-0 backdrop-blur-xl border-b ${isDark ? 'bg-black/80 border-slate-900' : 'bg-white/70 border-slate-200'}`} />
      
      <div className="relative w-full max-w-[1400px] mx-auto flex justify-between items-center">
        <BrandIdentity isDark={isDark} />

        <div className="hidden lg:flex items-center gap-12">
          <div className="flex gap-10">
            {links.map(link => (
              <a key={link.name} href={link.href} className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-brand transition-all">
                {link.name}
              </a>
            ))}
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-full border transition-all ${isDark ? 'border-slate-800 bg-slate-900 text-brand' : 'border-slate-200 bg-white text-brand shadow-sm'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className="p-2 text-brand">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(true)} className={`p-2 rounded-xl border ${isDark ? 'border-slate-800' : 'border-slate-200 bg-white'}`}>
            <Menu size={20} className="text-brand" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[110] p-10 flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="flex justify-between items-center mb-16">
              <BrandIdentity isDark={isDark} />
              <button onClick={() => setIsOpen(false)} className="p-3 bg-brand text-white rounded-full shadow-lg"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-8 flex-1">
              {links.map((link, i) => (
                <motion.a initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={link.name} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-4xl font-display font-extrabold tracking-tighter hover:text-brand transition-colors uppercase">
                  {link.name}
                </motion.a>
              ))}
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
               Engineering Excellence — 2025
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ProjectCarousel: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFast, setIsFast] = useState(false);
  const displayProjects = [...PROJECTS, ...PROJECTS, ...PROJECTS];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Manual Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 md:left-16 z-30 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hidden md:block">
        <button onClick={() => handleManualScroll('left')} className="p-6 bg-white dark:bg-zinc-900 text-brand rounded-full shadow-2xl hover:bg-brand hover:text-white transition-all transform hover:scale-110 active:scale-95">
          <ChevronLeft size={28} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-6 md:right-16 z-30 opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hidden md:block">
        <button onClick={() => handleManualScroll('right')} className="p-6 bg-white dark:bg-zinc-900 text-brand rounded-full shadow-2xl hover:bg-brand hover:text-white transition-all transform hover:scale-110 active:scale-95">
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Fast Forward Toggle */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <button 
          onClick={() => setIsFast(!isFast)}
          className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg border ${
            isFast ? 'bg-brand text-white border-brand' : 'bg-white/80 dark:bg-black/80 text-slate-500 border-slate-200 dark:border-slate-800'
          }`}
        >
          <FastForward size={14} className={isFast ? 'animate-pulse' : ''} /> {isFast ? 'Slow Down' : 'Fast Forward'}
        </button>
      </div>

      <div 
        ref={scrollRef} 
        className={`relative w-full overflow-x-auto no-scrollbar py-10 md:py-20`}
      >
        <div className={`flex scroll-content gap-6 md:gap-12 w-max px-6 md:px-12 ${isFast ? 'animate-fast-scroll' : 'animate-infinite-scroll'} pause-scroll`}>
          {displayProjects.map((project, idx) => (
            <div key={`${project.id}-${idx}`} 
              className={`flex-none w-[90vw] md:w-[750px] group/card transition-all duration-700 ${
                isDark ? 'bg-[#0A0A0A] border border-slate-900' : 'bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-100/50'
              } overflow-hidden`}>
              <div className="aspect-[21/9] overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-1000 group-hover/card:scale-105" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
                   <a href={project.link} target="_blank" className="p-6 bg-white text-black rounded-full hover:bg-brand hover:text-white transition-all shadow-2xl scale-0 group-hover/card:scale-100 duration-500">
                      <ExternalLink size={28} />
                   </a>
                </div>
              </div>

              <div className="p-10 md:p-14 text-left">
                {/* Header Meta & Impact */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                        <Cpu size={16} className="text-brand" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">System Diagnostic</span>
                      <div className={`hidden md:block w-8 h-px ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`} />
                   </div>
                   
                   {project.impact && (
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-3 bg-brand text-white px-6 py-2.5 rounded-full shadow-lg shadow-brand/20 border border-brand/50"
                     >
                        <Activity size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{project.impact}</span>
                     </motion.div>
                   )}
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-extrabold mb-12 tracking-tighter uppercase leading-[0.9]">{project.title}</h3>

                {/* Challenges & Solution Section */}
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-14">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldAlert size={14} className="text-slate-400" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Problem Vector</h4>
                    </div>
                    <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                      {project.context}
                    </p>
                    <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={14} className="text-brand" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">Engineered Solution</h4>
                    </div>
                    <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {project.solution}
                    </p>
                    <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-brand rounded-full" />
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-900">
                  {project.tech.map(t => (
                    <span key={t} className={`px-5 py-2 text-[9px] font-bold uppercase tracking-widest ${isDark ? 'bg-slate-900 border border-slate-800 text-slate-500' : 'bg-slate-50 border border-slate-100 text-slate-400 rounded-full'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isDark, setIsDark] = useState<boolean>(false); // Default to Light Mode (Cream)

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDark]);

  return (
    <div className="min-h-screen transition-colors duration-700 selection:bg-brand selection:text-white">
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_75%)]" />
        </div>

        <div className="max-w-[1400px] mx-auto text-center md:text-left w-full relative z-10">
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-5 mb-12 justify-center md:justify-start">
                 <div className="w-12 h-px bg-brand" />
                 <span className="text-brand text-[11px] font-black uppercase tracking-[0.6em]">Systems Engineering</span>
              </div>
              
              <h1 className="text-5xl md:text-[10rem] font-display font-extrabold tracking-tighter leading-[0.8] mb-20 uppercase">
                Architecting <br /> <span className="text-brand">Autonomy.</span>
              </h1>

              <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-end">
                <p className="text-2xl md:text-[2.6rem] md:leading-[1.1] font-medium tracking-tight text-slate-500 dark:text-slate-400 max-w-3xl">
                  Specializing in bridging the gap between <span className="text-slate-900 dark:text-white font-extrabold">complex backend architecture</span> and <span className="text-slate-900 dark:text-white font-extrabold">intelligent agentic workflows.</span>
                </p>
                
                <div className="flex flex-wrap gap-8 lg:justify-end pb-4">
                  <a href="#work" className="px-16 py-8 bg-brand text-white font-extrabold uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-2xl shadow-brand/30 text-xs">
                    View Exhibition
                  </a>
                  <a href="#connect" className={`px-16 py-8 border font-extrabold uppercase tracking-[0.3em] transition-all text-xs ${isDark ? 'border-slate-800 text-white hover:bg-white hover:text-black' : 'border-slate-200 text-slate-900 hover:bg-black hover:text-white rounded-full bg-white shadow-xl'}`}>
                    Initiate Connection
                  </a>
                </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="arsenal" className={`py-48 px-6 ${isDark ? 'bg-[#050505]' : 'bg-white border-y border-slate-100 shadow-sm'}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-32 flex flex-col lg:flex-row lg:items-end justify-between gap-16">
            <div className="max-w-2xl">
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-brand mb-8 block">Capabilities</span>
              <h2 className="text-5xl md:text-[8rem] font-display font-extrabold tracking-tighter uppercase leading-none">The Arsenal.</h2>
            </div>
            <p className={`text-xl md:text-2xl font-medium max-w-md ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Mastering high-throughput systems architecture and autonomous decision logic.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {Array.from(new Set(SKILLS.map(s => s.category))).map(cat => (
              <div key={cat} className={`p-12 border transition-all group ${isDark ? 'bg-black border-slate-900' : 'bg-cream/40 border-slate-100 rounded-[3rem] hover:bg-white hover:shadow-2xl'}`}>
                <div className="mb-10 w-16 h-16 flex items-center justify-center bg-brand/10 text-brand rounded-3xl group-hover:scale-110 transition-transform duration-500">
                  <Code2 size={32} />
                </div>
                <h3 className="text-2xl font-display font-extrabold mb-10 tracking-tight uppercase leading-tight">{cat}</h3>
                <ul className="space-y-5">
                  {SKILLS.filter(s => s.category === cat).map(s => (
                    <li key={s.name} className={`flex items-center gap-4 text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                      <div className="w-2 h-2 rounded-full bg-brand" /> {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-48 overflow-hidden bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12">
           <div>
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-brand mb-8 block">Selected Work</span>
              <h2 className="text-6xl md:text-9xl font-display font-extrabold tracking-tighter uppercase leading-none">Systems.</h2>
           </div>
           <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              <Monitor size={18} className="text-brand" /> Interactive Stream
           </div>
        </div>
        <ProjectCarousel isDark={isDark} />
      </section>

      {/* Infrastructure Section - Optimized for All Screens */}
      <section id="systems" className={`py-48 px-6 ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-24 lg:mb-32">
             <span className="text-[11px] font-black uppercase tracking-[0.6em] text-brand mb-8 block">Infrastructure</span>
             <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-display font-extrabold tracking-tighter uppercase leading-[0.9] break-words">Logic Matrix.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {AUTOMATION_TOOLS.map((tool, i) => (
              <a key={tool.title} href={tool.link} target="_blank" className={`p-10 md:p-14 border transition-all group flex flex-col ${isDark ? 'bg-black border-slate-900 rounded-none' : 'bg-cream/40 border-slate-100 rounded-[4rem] hover:bg-white hover:shadow-2xl'}`}>
                <div className="w-16 md:w-20 h-16 md:h-20 flex items-center justify-center bg-brand/10 text-brand rounded-3xl mb-12 group-hover:scale-110 transition-transform duration-500">
                  {i === 0 ? <Terminal size={32} /> : i === 1 ? <Zap size={32} /> : <Layers size={32} />}
                </div>
                <h4 className="text-2xl md:text-3xl font-display font-extrabold mb-8 tracking-tight uppercase group-hover:text-brand transition-colors leading-tight">{tool.title}</h4>
                <p className={`text-base md:text-lg leading-relaxed mb-16 flex-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                  {tool.description}
                </p>
                <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.4em] text-brand group-hover:gap-10 transition-all">
                   Audit System <ArrowRight size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Redesigned to be Minimalist, Stylish & Professional */}
      <footer id="connect" className={`pt-48 pb-20 px-6 ${isDark ? 'bg-black' : 'bg-[#FAFAFA]'}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-32">
             <div className="flex-1">
                <span className="text-[11px] font-black uppercase tracking-[0.8em] text-brand mb-10 block">Connection Protocol</span>
                <h2 className="text-6xl md:text-[10rem] font-display font-extrabold tracking-tighter leading-[0.8] uppercase mb-16">
                  Let's <br /> <span className="text-brand">Engineer.</span>
                </h2>
                <a href="mailto:ambujkr8@gmail.com" className="inline-flex items-center gap-6 md:gap-10 text-3xl md:text-6xl font-display font-extrabold uppercase tracking-tighter hover:text-brand transition-all group">
                   Get in touch <ArrowRight size={48} className="text-brand group-hover:translate-x-4 transition-transform hidden md:block" />
                   <ArrowRight size={32} className="text-brand group-hover:translate-x-2 transition-transform md:hidden" />
                </a>
             </div>
             
             <div className="flex flex-col gap-12 lg:items-end">
                <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-brand lg:text-right">Social Network</span>
                <div className="flex gap-4 md:gap-6">
                   {[
                     { icon: <Github size={24} />, href: 'https://github.com/Ambujkumar909/', label: 'Github' },
                     { icon: <Linkedin size={24} />, href: 'https://www.linkedin.com/in/ambuj-kumar-80144b200/', label: 'LinkedIn' },
                     { icon: <Mail size={24} />, href: 'mailto:ambujkr8@gmail.com', label: 'Email' }
                   ].map((social, i) => (
                     <a key={i} href={social.href} target="_blank" aria-label={social.label} 
                        className={`p-6 md:p-8 border transition-all ${
                          isDark 
                          ? 'border-zinc-800 bg-zinc-900 text-white hover:border-brand hover:bg-brand/10' 
                          : 'border-slate-200 bg-white text-slate-900 hover:border-brand hover:shadow-xl shadow-sm'
                        } rounded-full group`}>
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          {social.icon}
                        </div>
                     </a>
                   ))}
                </div>
                <div className="mt-8 lg:text-right">
                  <p className={`text-xs font-bold uppercase tracking-widest leading-loose ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    Open for high-density <br /> systems architecture and <br /> agentic workflow inquiries.
                  </p>
                </div>
             </div>
          </div>
          
          <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-12 text-[10px] font-bold uppercase tracking-[0.6em] ${isDark ? 'border-zinc-900 text-zinc-700' : 'border-slate-200 text-slate-400'}`}>
            <BrandIdentity isDark={isDark} />
            
            <div className="flex gap-16 order-3 md:order-2">
               <span className="flex items-center gap-3">Deployment v2.5 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /></span>
               <span>© 2025 Ambuj Kumar</span>
            </div>

            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
              className="flex items-center gap-4 group hover:text-brand transition-colors order-2 md:order-3"
            >
               Return Origin <ArrowRight size={14} className="-rotate-90 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
