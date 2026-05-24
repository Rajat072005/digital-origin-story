import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

/* ── Types & Data ── */
type TabId = "frontend" | "backend" | "neural";
interface Skill { name: string; level: number; color: string; desc: string; cat: string; }

// Spider-Verse Color Palette
const SPIDER_CYAN = "#00f0ff";
const SPIDER_MAGENTA = "#ff007f";
const SPIDER_YELLOW = "#ffe600";

const MODES: { id: TabId; label: string; accent: string; code: string }[] = [
  { id: "frontend", label: "WEB SYNERGY", accent: SPIDER_CYAN, code: "TRGT-01" },
  { id: "backend", label: "CORE SYSTEMS", accent: SPIDER_MAGENTA, code: "TRGT-02" },
  { id: "neural", label: "NEURAL SYSTEMS", accent: SPIDER_YELLOW, code: "TRGT-03" },
];

const DATA: Record<TabId, Skill[]> = {
  frontend: [
    { name: "React.js & Three.js", level: 95, color: SPIDER_CYAN, desc: "Interactive Reality Engine", cat: "FRONTEND" },
    { name: "Tailwind & GSAP", level: 88, color: SPIDER_MAGENTA, desc: "System Design Language", cat: "FRONTEND" },
    { name: "JavaScript", level: 92, color: SPIDER_YELLOW, desc: "Multiversal Logic Core", cat: "FRONTEND" },
    { name: "Node.js", level: 85, color: SPIDER_MAGENTA, desc: "Runtime Env", cat: "BACKEND" },
    { name: "Express.js", level: 88, color: SPIDER_CYAN, desc: "API Framework", cat: "BACKEND" },
    { name: "MongoDB", level: 92, color: SPIDER_YELLOW, desc: "Distributed Memory Storage", cat: "DATABASE" },
  ],
  backend: [
    { name: "REST APIs", level: 88, color: SPIDER_YELLOW, desc: "Protocol Communication", cat: "BACKEND" },
    { name: "Python", level: 85, color: SPIDER_MAGENTA, desc: "AI/ML Applications", cat: "AI/ML" },
    { name: "OOP", level: 90, color: SPIDER_CYAN, desc: "Object-Oriented Programming", cat: "CORE" },
    { name: "DSA(C++)", level: 90, color: SPIDER_MAGENTA, desc: "200+ Problems", cat: "CORE" },
    { name: "OS & DBMS", level: 80, color: SPIDER_YELLOW, desc: "System Fundamentals", cat: "CORE" },
    { name: "Git & Postman", level: 85, color: SPIDER_CYAN, desc: "API Testing", cat: "TOOLS" },
  ],
  neural: [
    { name: "TensorFlow", level: 75, color: SPIDER_MAGENTA, desc: "Neural Networks", cat: "AI/ML" },
    { name: "OpenCV", level: 78, color: SPIDER_CYAN, desc: "Computer Vision", cat: "AI/ML" },
    { name: "FER System", level: 80, color: SPIDER_YELLOW, desc: "Emotion Recognition", cat: "AI/ML" },
    { name: "Deep Learning", level: 85, color: SPIDER_MAGENTA, desc: "Multi-Layer Cognitive Training", cat: "AI/ML" },
    { name: "AI Agents", level: 82, color: SPIDER_YELLOW, desc: "Self-Directed AI Protocols", cat: "AI/ML" },
    { name: "Generative AI", level: 85, color: SPIDER_CYAN, desc: "Synthetic Content Intelligence", cat: "AI/ML" },
  ],
};

/* ── Components ── */

function HexagonIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
      <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3" fill={color} />
      {/* Target crosshairs inside hex */}
      <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth="1" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1" />
      <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth="1" />
      <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function ProjectedSkill({ skill, align, delay, offset }: { skill: Skill; align: "left" | "right"; delay: number, offset: number }) {
  const isLeft = align === "left";

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: isLeft ? offset : -offset, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 1, 0.3, 1] }}
      className={`relative flex items-center gap-10 ${isLeft ? "justify-end flex-row" : "justify-end flex-row-reverse"} group cursor-none`}
    >
      {/* Text Data */}
      <div className={`flex flex-col ${isLeft ? "items-end text-right" : "items-start text-left"}`}>
        <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40 mb-0.5 transition-all duration-300 group-hover:text-white group-hover:tracking-[0.5em]">
          SYS.{skill.cat}
        </div>

        <div className="relative font-display text-xl sm:text-2xl font-bold uppercase tracking-widest text-white transition-all duration-300 group-hover:scale-[1.02] group-hover:tracking-[0.25em]"
          style={{ textShadow: `2px 0 0 ${SPIDER_MAGENTA}80, -2px 0 0 ${SPIDER_CYAN}80, 0 0 15px ${skill.color}` }}>

          {/* Target Brackets that snap outward on hover */}
          <span className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#ff007f] text-sm font-light ${isLeft ? '-left-2 group-hover:-left-5' : '-left-2 group-hover:-left-5'}`}>[</span>
          {skill.name}
          <span className={`absolute top-1/2 -translate-y-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 text-[#00f0ff] text-sm font-light ${isLeft ? '-right-2 group-hover:-right-5' : '-right-2 group-hover:-right-5'}`}>]</span>
        </div>

        <div className="font-mono text-[10px] text-white/60 mt-1 uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-white">
          {skill.desc} <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:font-bold" style={{ color: skill.color }}>[{skill.level}%]</span>
        </div>

        {/* Curved Progress Arc (Simulated with skewed lines) - Sequential Hover Effect */}
        <div className={`mt-2 flex gap-1 w-[120px] sm:w-[160px] ${isLeft ? 'justify-end' : 'justify-start'}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 skew-x-[-20deg] transition-all duration-300 group-hover:scale-y-[2] group-hover:-translate-y-0.5"
              style={{
                background: i < (skill.level / 100 * 12) ? skill.color : 'rgba(255,255,255,0.1)',
                boxShadow: i < (skill.level / 100 * 12) ? `0 0 8px ${skill.color}` : 'none',
                transitionDelay: `${isLeft ? (11 - i) * 15 : i * 15}ms`
              }} />
          ))}
        </div>
      </div>

      {/* Hexagon Node attached to the imaginary curve */}
      <div className="relative flex items-center justify-center">

        {/* Connecting faint line (Base state) */}
        <div className={`absolute top-1/2 ${isLeft ? 'right-[-40px]' : 'left-[-40px]'} w-[40px] h-px bg-white/10 transition-opacity duration-300 group-hover:opacity-0`} />

        {/* Connecting bright tether (Hover state) */}
        <div className={`absolute top-1/2 ${isLeft ? 'right-[-40px]' : 'left-[-40px]'} w-[40px] h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300`}
          style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}` }} />

        {/* Sonar Ping Ring */}
        <div className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:animate-ping pointer-events-none"
          style={{ borderColor: skill.color }} />

        <motion.div
          animate={{ rotate: isLeft ? 360 : -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="transition-transform duration-500 group-hover:scale-125"
        >
          <HexagonIcon color={skill.color} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function SpiderVerseLens() {
  return (
    <div className="relative size-[280px] sm:size-[360px] flex items-center justify-center opacity-90 pointer-events-none">

      {/* Multiple rotating curved arcs mimicking the web-shooter dial projections */}

      {/* Outer Cyan Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-t-[#00f0ff] border-b-[#00f0ff] border-l-transparent border-r-transparent"
        style={{ borderWidth: "2px", filter: "drop-shadow(0 0 10px #00f0ff)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Outer Magenta Ring */}
      <motion.div
        className="absolute inset-2 rounded-full border border-r-[#ff007f] border-l-[#ff007f] border-t-transparent border-b-transparent"
        style={{ borderWidth: "1px", filter: "drop-shadow(0 0 8px #ff007f)" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Yellow Tick Marks (Dashed ring) */}
      <motion.div
        className="absolute inset-8 rounded-full border border-[#ffe600]/40"
        style={{ borderStyle: "dashed", borderWidth: "2px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Concentric Circles */}
      <div className="absolute inset-16 rounded-full border border-white/10" />
      <div className="absolute inset-24 rounded-full border border-white/5 bg-black/20 backdrop-blur-sm" />

      {/* Center Hexagonal Core */}
      <div className="size-16 flex items-center justify-center relative">
        <motion.svg width="100%" height="100%" viewBox="0 0 24 24" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="transparent" stroke={SPIDER_CYAN} strokeWidth="0.5" />
        </motion.svg>
        <motion.div
          className="absolute size-3 bg-[#ff007f] rounded-full"
          animate={{ scale: [1, 1.8, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ boxShadow: "0 0 20px #ff007f" }}
        />
      </div>

      {/* Glitching Text inside Lens */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-[#00f0ff] tracking-widest text-center" style={{ textShadow: "1px 0 0 #ff007f" }}>
        WEB_PROTOCOL<br />ENGAGED
      </div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-[#ff007f] tracking-widest text-center">
        CAPABILITY<br />SCAN_1610
      </div>
    </div>
  );
}

function GlobalHUDOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Spider-Verse Vignette (Dark + Chromatic Aberration tint) */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      <div className="absolute inset-0 bg-[#04040a]/50 backdrop-blur-[4px]" />

      {/* Spider-Verse Halftone Pattern (Subtle) */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "4px 4px" }} />

      {/* Top Left System Info */}
      <div className="absolute top-8 left-8 font-mono text-[8px] tracking-[0.3em] text-white/60 uppercase">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-[#ff007f] animate-pulse rounded-full" style={{ boxShadow: "0 0 8px #ff007f" }} />
          HUD_ACTIVE
        </div>
        EARTH_1610<br />
        ANOMALY_DETECTED
      </div>

      {/* Top Right Coordinates */}
      <div className="absolute top-8 right-8 font-mono text-[8px] tracking-[0.3em] text-[#00f0ff]/60 uppercase text-right">
        DIMENSION: MULTIVERSE<br />
        SYNC: OPTIMAL
      </div>
    </div>
  );
}

export function TacticalArsenal() {
  const [activeTab, setActiveTab] = useState<TabId>("frontend");
  const [rebooting, setRebooting] = useState(false);

  const handleModeChange = (id: TabId) => {
    if (id === activeTab) return;
    setRebooting(true);
    setTimeout(() => {
      setActiveTab(id);
      setRebooting(false);
    }, 200); // Slightly longer for the glitch effect
  };

  const currentSkills = DATA[activeTab];
  const leftSkills = currentSkills.slice(0, 3);
  const rightSkills = currentSkills.slice(3, 6);

  // Set offsets to wrap around the central radar
  const curveOffsets = [60, 0, 60];

  return (
    <section id="skills" className="relative min-h-screen py-24 flex flex-col justify-center overflow-hidden">

      <GlobalHUDOverlay />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12 relative z-20"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white mb-4 animate-spider-glitch">
            Suit Capabilities
          </h2>
          <p className="font-mono text-xs text-white/50 tracking-widest uppercase">
             // Analyzing Multiversal Skill Sets //
          </p>
        </motion.div>

        {/* Central Mode Selector */}
        <div className="flex flex-col items-center mb-16 relative z-20">
          <div className="flex items-center gap-2 sm:gap-4 border border-white/10 bg-black/20 backdrop-blur-md p-1.5 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            {MODES.map((mode) => {
              const isActive = activeTab === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className="relative px-4 sm:px-8 py-2.5 rounded-full cursor-none transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="projection-mode-active"
                      className="absolute inset-0 bg-white/5 border border-white/20 rounded-full"
                      style={{ boxShadow: `inset 0 0 20px ${mode.accent}20` }}
                    />
                  )}
                  <span className="relative z-10 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-colors"
                    style={{ color: isActive ? mode.accent : "rgba(255,255,255,0.4)", textShadow: isActive ? `0 0 10px ${mode.accent}` : "none" }}>
                    {mode.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HUD Projection Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-4 items-center">

          {/* Left Projected Targets */}
          <div className="flex flex-col justify-center gap-8 lg:gap-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {!rebooting && leftSkills.map((skill, i) => (
                <ProjectedSkill key={`l-${skill.name}`} skill={skill} align="left" delay={i * 0.1} offset={curveOffsets[i]} />
              ))}
            </AnimatePresence>
          </div>

          {/* Center Projection Rings */}
          <div className="hidden lg:flex justify-center items-center relative">

            <motion.div
              animate={rebooting ? { scale: 0.8, opacity: 0, rotate: 90, filter: "blur(10px)" } : { scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            >
              <SpiderVerseLens />
            </motion.div>
            {/* Faint connecting horizontal line crossing behind the lens */}
            <div className="absolute top-1/2 left-[-150px] right-[-150px] h-[2px] bg-white/20 -translate-y-1/2 pointer-events-none" style={{ boxShadow: "0 0 10px #00f0ff" }} />
          </div>

          {/* Right Projected Targets */}
          <div className="flex flex-col justify-center gap-8 lg:gap-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {!rebooting && rightSkills.map((skill, i) => (
                <ProjectedSkill key={`r-${skill.name}`} skill={skill} align="right" delay={i * 0.1 + 0.15} offset={curveOffsets[i]} />
              ))}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
