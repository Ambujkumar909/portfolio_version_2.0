
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
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
  Brain,
  Cpu,
  Database,
  Bot,
  ChevronDown,
  Code,
  Box,
  Globe,
  Activity,
  Search,
  Settings,
  LineChart
} from 'lucide-react';
import { SKILLS, PROJECTS, AUTOMATION_TOOLS } from './constants';
import { Project } from './types';

// --- Global UI Components ---

const Magnetic = ({ children, strength = 0.3 }: { children: React.ReactNode, strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setPosition({ x: (clientX - centerX) * strength, y: (clientY - centerY) * strength });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive, .project-card')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-5 h-5 rounded-full border border-[#E50914] pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{ 
        x: mousePos.x - 10, 
        y: mousePos.y - 10,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? 'rgba(229, 9, 20, 0.5)' : 'transparent',
        borderWidth: isHovering ? '0px' : '1px'
      }}
      transition={{ type: 'spring', damping: 35, stiffness: 350, mass: 0.5 }}
    />
  );
};

const SectionHeader = ({ title, subtitle, tag }: { title: string, subtitle: string, tag: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="mb-20 md:mb-32">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        className="flex items-center gap-4 mb-6"
      >
        <span className="text-[10px] font-black text-[#E50914] font-mono tracking-[0.4em] uppercase">{tag}</span>
        <div className="h-px flex-1 bg-white/5"></div>
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-4xl md:text-7xl font-black font-display uppercase italic tracking-tighter text-white mb-6"
      >
        {title}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="text-gray-500 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

const TechCard = ({ cat, idx, skills }: { cat: string, idx: number, skills: any[] }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const getIcon = (category: string) => {
    if (category.includes('GenAI')) return <Bot size={24} />;
    if (category.includes('Backend')) return <Cpu size={24} />;
    if (category.includes('Automation')) return <Terminal size={24} />;
    if (category.includes('Intelligence')) return <Brain size={24} />;
    return <Database size={24} />;
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX: rotate.x,
        rotateY: rotate.y
      }}
      transition={{ delay: idx * 0.1, duration: 0.8, ease: "circOut" }}
      className={`relative p-8 md:p-12 bg-zinc-950 border border-white/5 overflow-hidden group hover:border-[#E50914]/60 transition-colors duration-500 shadow-2xl
        ${idx === 0 || idx === 3 ? 'md:col-span-7' : 'md:col-span-5'}
      `}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(229, 9, 20, 0.12), transparent 40%)`
        }}
      />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700" 
           style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent animate-[scan_6s_linear_infinite] pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col" style={{ transform: 'translateZ(50px)' }}>
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-[#E50914] font-bold tracking-widest uppercase bg-[#E50914]/5 px-2 py-0.5 rounded-sm">MODULE_0{idx + 1}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            </div>
            <h4 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter text-white italic group-hover:text-[#E50914] transition-colors leading-none">
              {cat}
            </h4>
          </div>
          <div className="w-14 h-14 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-[#E50914] group-hover:border-[#E50914]/40 group-hover:scale-110 transition-all bg-black shadow-inner">
            {getIcon(cat)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 mt-auto">
          {skills.map(s => (
            <div 
              key={s.name} 
              className="px-4 py-2.5 bg-black border border-white/5 text-[10px] uppercase font-black text-gray-400 group-hover:text-white hover:border-[#E50914]/70 hover:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all cursor-default relative overflow-hidden"
            >
              <div className="relative z-10">{s.name}</div>
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#E50914] group-hover:w-full transition-all duration-700 delay-100 opacity-50"></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBackground = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(3,3,3,0.98)']);
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.08)']);

  const links = [
    { name: 'Technical Arsenal', href: '#arsenal', icon: <Cpu size={14}/>, label: '01' },
    { name: 'Featured Work', href: '#work', icon: <Box size={14}/>, label: '02' },
    { name: 'System Automation', href: '#automation', icon: <Terminal size={14}/>, label: '03' },
    { name: 'Contact Protocol', href: '#connect', icon: <Globe size={14}/>, label: '04' },
  ];

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <motion.nav 
      style={{ backgroundColor: navBackground, borderBottom: `1px solid ${navBorder.get()}`, backdropFilter: 'blur(12px)' }}
      className="fixed top-0 w-full z-[100] py-4 md:py-6 px-6 md:px-16 flex justify-between items-center transition-all duration-300"
    >
      <div className="flex items-center gap-4 relative z-[101]">
        <div className="w-5 h-5 flex items-center justify-center">
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full transition-transform duration-700 hover:rotate-180"
    xmlns="http://www.w3.org/2000/svg"
  >
    
    <rect x="0" y="0" width="100" height="100" fill="#E50914" />

    
    <path
      d="M50 10 L90 90 H75 L65 70 H35 L25 90 H10 Z M42 55 H58 L50 30 Z"
      fill="#000000"
    />
  </svg>
</div>

        <div className="flex flex-col">
          <span className="font-display font-black text-sm md:text-base tracking-tighter uppercase italic text-white leading-none">Ambuj Kumar</span>
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">Systems & Automation Engineer</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-10">
        <div className="flex gap-8 text-[9px] font-bold uppercase tracking-[0.4em] text-gray-500">
          {links.map(item => (
            <a key={item.name} href={item.href} className="hover:text-[#E50914] transition-colors relative group flex items-center gap-2">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E50914]">{item.icon}</span>
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E50914] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
        <Magnetic strength={0.2}>
          <a href="mailto:ambujkr8@gmail.com" className="bg-white/5 hover:bg-[#E50914]/10 border border-white/10 hover:border-[#E50914]/40 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white transition-all rounded-sm block">
            Hire System
          </a>
        </Magnetic>
      </div>

      <button className="md:hidden text-white relative z-[101] p-2 hover:text-[#E50914] transition-colors" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-screen w-screen bg-[#030303] z-[100] flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-10 w-full max-w-xl">
              {links.map((item, i) => (
                <motion.a 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, y: 40, skewY: 5 }}
                  animate={{ opacity: 1, y: 0, skewY: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col items-center text-center py-2"
                >
                  <span className="text-[#E50914] font-mono text-[10px] md:text-xs font-black tracking-[0.5em] mb-2 md:mb-4 group-hover:scale-110 transition-transform">
                    {item.label}
                  </span>
                  <span className="text-4xl sm:text-5xl md:text-7xl font-black font-display uppercase italic tracking-tighter text-white group-hover:text-[#E50914] transition-all duration-300">
                    {item.name}
                  </span>
                  <div className="absolute bottom-0 h-px w-0 bg-[#E50914] group-hover:w-full transition-all duration-500 opacity-50" />
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 flex flex-col items-center gap-6"
            >
              <div className="flex gap-10">
                <a href="https://github.com/Ambujkumar909/" target="_blank" className="text-white hover:text-[#E50914] transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://www.linkedin.com/in/ambuj-kumar-80144b200/" target="_blank" className="text-white hover:text-[#E50914] transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="mailto:ambujkr8@gmail.com" className="text-white hover:text-[#E50914] transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const titleLines = ["AMBUJ KUMAR |", "ENGINEERING", "AUTONOMY."];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black text-center pt-20">
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.1)_0%,transparent_60%)]"></div>
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-5xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-8 px-4 py-1 border border-[#E50914]/20 rounded-sm bg-[#E50914]/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse shadow-[0_0_10px_rgba(229,9,20,0.5)]"></span>
          <span className="text-[8px] md:text-[9px] font-black text-[#E50914] uppercase tracking-[0.6em]">Core Intelligence Active</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black font-display tracking-tighter leading-[0.95] mb-8 md:mb-12 uppercase italic text-white flex flex-col items-center">
          {titleLines.map((line, i) => (
            <motion.span 
              key={line}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: "circOut" }}
              className={line.includes("AUTONOMY") ? "text-[#E50914]" : ""}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-gray-400 text-sm md:text-xl lg:text-2xl font-light leading-relaxed">
            Specializing in bridging the gap between <span className="text-white font-bold">complex backend architecture</span> and <span className="text-white font-bold italic text-[#E50914]">intelligent agentic workflows</span>.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
          <Magnetic strength={0.3}>
            <a href="#work" className="w-full sm:w-auto px-10 py-4 bg-[#E50914] text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#B20710] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(229,9,20,0.2)]">
              Active Projects <ArrowRight size={14} />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a href="#arsenal" className="w-full sm:w-auto px-10 py-4 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 transition-all flex items-center justify-center">
              Inspect Tech
            </a>
          </Magnetic>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-800 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-[7px] uppercase font-bold tracking-[1em]">Deploy Scroll</span>
        <ChevronDown size={12} />
      </motion.div>
    </section>
  );
};

const SkillBento = () => {
  const categories = Array.from(new Set(SKILLS.map(s => s.category)));

  return (
    <section id="arsenal" className="py-24 md:py-40 px-6 md:px-16 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#E50914]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          tag="Intelligence Matrix" 
          title="The Technical Core." 
          subtitle="A high-density diagnostic of my architectural capabilities focused on generative systems and automated pipelines." 
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 lg:gap-6">
          {categories.map((cat, idx) => (
            <TechCard key={cat} cat={cat} idx={idx} skills={SKILLS.filter(s => s.category === cat)} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectFeature: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen flex items-center py-20 md:py-32 border-b border-white/5 relative overflow-hidden">
      <div ref={ref} className={`max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 md:gap-20 items-center px-6 md:px-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: "circOut" }}
          className={`relative aspect-video bg-zinc-900 group overflow-hidden border border-white/10 ${index % 2 !== 0 ? 'lg:order-last' : ''}`}
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
          <div className="absolute top-4 left-4 p-3 bg-black/80 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black uppercase text-[#E50914] tracking-[0.4em]">DEPLOYMENT_ACTIVE</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="text-[9px] font-black text-[#E50914] font-mono tracking-widest uppercase">Protocol: AK_CS_{index + 1}</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-black font-display uppercase italic tracking-tighter text-white leading-tight">
              {project.title}
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-4 mb-8">{project.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 border-l border-[#E50914]/30 pl-8">
            <div className="space-y-3">
               <h4 className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Context</h4>
               <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed">{project.context}</p>
            </div>
            <div className="space-y-3">
               <h4 className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Architecture</h4>
               <p className="text-gray-300 font-medium text-sm md:text-base leading-relaxed">{project.solution}</p>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-8">
             <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                   <span key={t} className="px-3 py-1 bg-white/5 border border-white/5 text-[8px] font-black text-gray-500 uppercase">{t}</span>
                ))}
             </div>
             {project.link && (
                <Magnetic strength={0.2}>
                  <a href={project.link} target="_blank" className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#E50914] transition-colors border-b border-transparent hover:border-[#E50914] pb-1">
                    VIEW LIVE <ExternalLink size={12} />
                  </a>
                </Magnetic>
             )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Automation = () => (
  <section id="automation" className="py-24 md:py-40 px-6 md:px-16 bg-[#050505]">
    <div className="max-w-7xl mx-auto">
      <SectionHeader 
        tag="Functional Systems" 
        title="Proof of Utility." 
        subtitle="A high-throughput list of micro-services and business automations engineered to solve scalability bottlenecks."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {AUTOMATION_TOOLS.map((tool, idx) => (
          <motion.a 
            key={tool.title} 
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, borderColor: 'rgba(229,9,20,0.3)' }}
            className="p-10 md:p-12 bg-black border border-white/5 group transition-all block relative"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
               <ExternalLink size={14} className="text-[#E50914]" />
            </div>
            
            <div className="text-[#E50914] mb-8 w-10 h-10 flex items-center justify-center border border-white/5 group-hover:border-[#E50914] transition-all bg-zinc-950">
               {idx === 0 ? <Terminal size={20} /> : idx === 1 ? <Zap size={20} /> : <Layers size={20} />}
            </div>
            
            <h4 className="text-xl font-black font-display uppercase italic tracking-tighter mb-4 text-white group-hover:text-[#E50914] transition-colors">{tool.title}</h4>
            
            <p className="text-gray-500 leading-relaxed font-medium text-xs md:text-sm group-hover:text-gray-400 mb-6">
              {tool.description}
            </p>

            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E50914]/40 group-hover:text-[#E50914] transition-colors flex items-center gap-2">
               <span>INSPECT_PROTOCOL</span> <ArrowRight size={10} />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="connect" className="py-32 md:py-48 px-6 md:px-16 bg-black border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent"></div>
    
    <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
      <SectionHeader 
        tag="Contact Protocol" 
        title="Start the Conversation." 
        subtitle="Looking for a developer who can automate your bottleneck? Let's initiate the communication sequence."
      />
      
      <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-24">
        {[
          { name: 'Email', icon: <Mail size={14}/>, href: 'mailto:ambujkr8@gmail.com' },
          { name: 'LinkedIn', icon: <Linkedin size={14}/>, href: 'https://www.linkedin.com/in/ambuj-kumar-80144b200/' },
          { name: 'GitHub', icon: <Github size={14}/>, href: 'https://github.com/Ambujkumar909/' },
        ].map(social => (
          <Magnetic key={social.name} strength={0.4}>
            <a href={social.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 px-6 py-3 hover:bg-white/5 hover:border-[#E50914]/50 transition-all">
              {social.icon} {social.name}
            </a>
          </Magnetic>
        ))}
      </div>

      <div className="w-full pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">© {new Date().getFullYear()} Ambuj Kumar — System_Deployed</p>
        <div className="flex gap-8 text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">
           <span className="flex items-center gap-2"><Activity size={10} className="text-green-500"/> Core: Online</span>
        </div>
      </div>
    </div>
  </section>
);

const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="selection:bg-[#E50914] selection:text-white bg-black min-h-screen text-white">
      <CustomCursor />
      <Navbar />
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[1.5px] bg-[#E50914] z-[100] origin-left shadow-[0_0_10px_rgba(229,9,20,0.5)]"
        style={{ scaleX }}
      />

      <main className="relative">
        <Hero />
        <SkillBento />
        
        <section id="work" className="bg-black">
          <div className="max-w-7xl mx-auto px-6 md:px-16 pt-32">
            <SectionHeader 
              tag="Featured Work" 
              title="Field Evidence." 
              subtitle="Deep dives into spatial optimization, market intelligence, and reasoning agent architectures built for real-world impact."
            />
          </div>
          {PROJECTS.map((p, i) => (
            <ProjectFeature key={p.id} project={p} index={i} />
          ))}
        </section>

        <Automation />
        
        <section className="py-24 md:py-40 px-6 md:px-16 bg-zinc-950/50 border-y border-white/5">
           <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 items-center">
              <div className="space-y-12">
                 <div>
                    <h3 className="text-3xl md:text-5xl font-black font-display uppercase italic tracking-tighter text-white mb-6">Philosophy.</h3>
                    <p className="text-gray-400 font-light text-base md:text-xl leading-relaxed italic">
                      "If it’s repeatable, it’s automatable. If it’s complex, it’s an <span className="text-white">AI use-case</span>."
                    </p>
                 </div>
                 <div className="space-y-8">
                    <div className="border-l border-[#E50914] pl-8 transition-all hover:pl-10">
                       <h4 className="text-[9px] font-black text-[#E50914] uppercase tracking-[0.3em] mb-3 italic">Production Readiness</h4>
                       <p className="text-gray-500 font-light text-sm leading-relaxed">Building systems with meaningful commit history, defensive error handling, and documentation that survives the test of scale.</p>
                    </div>
                 </div>
              </div>
              <div className="relative p-10 bg-black border border-white/5 overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-[#E50914]/30 group-hover:text-[#E50914]/60 transition-colors">TERMINAL_OVRD.V4</div>
                 <div className="space-y-4 font-mono text-[10px] md:text-[11px]">
                    <div className="flex gap-3">
                       <span className="text-[#E50914]">~</span>
                       <span className="text-white">init --autonomous-mode</span>
                    </div>
                    <p className="text-gray-500">[INFO] Verifying Neural Context Architecture...</p>
                    <p className="text-gray-500">[INFO] Syncing RAG Databases with System Ops...</p>
                    <div className="w-full h-px bg-white/5 relative my-6">
                       <motion.div 
                         initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5, ease: "easeInOut" }}
                         className="absolute top-0 left-0 h-full bg-[#E50914] pointer-events-none"
                       />
                    </div>
                    <p className="text-white font-black tracking-widest uppercase">[DEPLOYMENT READY] AMBUJ_PROTOCOL_LOADED</p>
                 </div>
              </div>
           </div>
        </section>

        <Contact />
      </main>
    </div>
  );
};

export default App;
