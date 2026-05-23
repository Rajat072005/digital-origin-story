import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { SleekSpiderSVG } from "./SpiderCrawl";

/* ── Geometry ── */
const W = 560, H = 560, CX = 280, CY = 280, MAX_R = 236;

function nGonPath(n: number, r: number, rot = 0): string {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rot;
    return `${i === 0 ? "M" : "L"} ${(CX + Math.cos(a) * r).toFixed(1)} ${(CY + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ") + " Z";
}
function spoke(total: number, idx: number, r: number, rot = 0) {
  const a = (idx / total) * Math.PI * 2 + rot;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, a };
}

/* ── Types & Data ── */
type TabId = "frontend" | "backend" | "neural";
interface Skill { name: string; level: number; color: string; desc: string; cat: string; }

const TABS = [
  { id: "frontend" as TabId, num: "01", label: "FRONTEND & LANGUAGES" },
  { id: "backend" as TabId, num: "02", label: "BACKEND & CORE CS" },
  { id: "neural" as TabId, num: "03", label: "AI/ML & TACTICAL TOOLS" },
];

const DATA: Record<TabId, Skill[]> = {
  frontend: [
    { name: "React.js", level: 92, color: "#5fb6ff", desc: "UI Synthesizer", cat: "FRONTEND" },
    { name: "Redux", level: 85, color: "#a78bfa", desc: "State Management", cat: "FRONTEND" },
    { name: "JavaScript", level: 90, color: "#ffcc00", desc: "Core Logic", cat: "LANGUAGE" },
    { name: "C++", level: 88, color: "#ff2b5e", desc: "System Language", cat: "LANGUAGE" },
    { name: "Python", level: 85, color: "#5fb6ff", desc: "Scripting & AI", cat: "LANGUAGE" },
    { name: "HTML / CSS", level: 90, color: "#ff9500", desc: "Structure & Style", cat: "FRONTEND" },
  ],
  backend: [
    { name: "Node.js", level: 88, color: "#00ed64", desc: "Runtime Env", cat: "BACKEND" },
    { name: "Express.js", level: 85, color: "#ff2b5e", desc: "API Framework", cat: "BACKEND" },
    { name: "MongoDB", level: 82, color: "#00ed64", desc: "NoSQL Database", cat: "DATABASE" },
    { name: "DSA", level: 90, color: "#a78bfa", desc: "160+ Problems", cat: "CORE" },
    { name: "OOP", level: 85, color: "#5fb6ff", desc: "Design Patterns", cat: "CORE" },
    { name: "OS & DBMS", level: 80, color: "#ff9500", desc: "System Fundamentals", cat: "CORE" },
  ],
  neural: [
    { name: "TensorFlow", level: 75, color: "#ff9500", desc: "Neural Networks", cat: "AI/ML" },
    { name: "OpenCV", level: 78, color: "#5fb6ff", desc: "Computer Vision", cat: "AI/ML" },
    { name: "FER System", level: 80, color: "#ff2b5e", desc: "Emotion Recognition", cat: "AI/ML" },
    { name: "Git", level: 85, color: "#ff2b5e", desc: "Version Control", cat: "TOOLS" },
    { name: "Postman", level: 82, color: "#ff9500", desc: "API Testing", cat: "TOOLS" },
    { name: "REST APIs", level: 85, color: "#a78bfa", desc: "System Integration", cat: "ARCHITECTURE" },
  ],
};

const CFG = {
  frontend: { rot: -Math.PI / 2, rings: [58, 108, 162, MAX_R], shape: 8, shapeRot: -Math.PI / 8, accent: "#5fb6ff" },
  backend: { rot: -Math.PI / 6, rings: [65, 132, MAX_R], shape: 6, shapeRot: -Math.PI / 6, accent: "#ff2b5e" },
  neural: { rot: -Math.PI / 2, rings: [70, 148, MAX_R], shape: 0, shapeRot: 0, accent: "#a78bfa" },
};

function nodeRadius(level: number, rings: number[]) {
  return rings[0] + (rings[rings.length - 1] - rings[0]) * Math.max(0, Math.min(1, (level - 60) / 40));
}

/* ── Tooltip ── */
function Tooltip({ skill, x, y }: { skill: Skill; x: number; y: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="pointer-events-none absolute z-40 w-44"
      style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, transform: "translate(-50%, -110%)" }}
    >
      <div className="rounded-2xl border px-4 py-3 text-center backdrop-blur-3xl overflow-hidden relative"
        style={{
          borderColor: `${skill.color}50`,
          background: "rgba(4,4,14,0.88)",
          boxShadow: `0 0 32px ${skill.color}25, inset 0 0 24px ${skill.color}08`,
        }}>
        {/* Subtle halftone in tooltip */}
        <div className="absolute inset-0 halftone opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <div className="font-mono text-[7px] uppercase tracking-[0.5em] mb-1" style={{ color: `${skill.color}80` }}>{skill.cat}</div>
          <div className="font-display text-sm font-bold text-white mb-0.5">{skill.name}</div>
          <div className="font-mono text-[8px] tracking-wide mb-2.5" style={{ color: `${skill.color}70` }}>{skill.desc}</div>
          <div className="h-[3px] w-full rounded-full overflow-hidden bg-white/8">
            <motion.div className="h-full rounded-full relative" style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}` }}
              initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 0.5 }}>
              {/* Shimmer effect inside the bar */}
              <motion.div className="absolute top-0 bottom-0 left-0 w-4 bg-white/40"
                animate={{ x: [-20, 100] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ filter: "blur(2px)" }} />
            </motion.div>
          </div>
          <div className="mt-1 flex justify-between font-mono text-[7px] text-white/30">
            <span>POWER</span><span style={{ color: skill.color }}>{skill.level}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Removed Tiny Web Spider per request ── */

/* ── Web SVG ── */
function WebViz({ tab, onActiveChange }: { tab: TabId; onActiveChange: (i: number | null) => void }) {
  const cfg = CFG[tab];
  const skills = DATA[tab];
  const [active, setActive] = useState<number | null>(null);

  const nodes = skills.map((s, i) => {
    const r = nodeRadius(s.level, cfg.rings);
    const pos = spoke(6, i, r, cfg.rot);
    const floatX = Math.sin(i * 1.9) * 3.5;
    const floatY = Math.cos(i * 2.5) * 3.5;
    return { ...s, ...pos, r, floatX, floatY };
  });

  const handleHover = (i: number | null) => { setActive(i); onActiveChange(i); };

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow-sm"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="glow-lg"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="core-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2b5e" stopOpacity="1" />
            <stop offset="100%" stopColor="#60010f" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Rings */}
        {cfg.rings.map((r, ri) =>
          cfg.shape === 0
            ? <motion.circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke={cfg.accent}
              strokeOpacity={0.15 + ri * 0.06} strokeWidth={ri === cfg.rings.length - 1 ? 1.4 : 0.8}
              strokeDasharray={ri === 0 ? "4 8" : "6 10"}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: ri * 0.14, ease: "easeOut" }} />
            : <motion.path key={r} d={nGonPath(cfg.shape, r, cfg.shapeRot)} fill="none"
              stroke={cfg.accent} strokeOpacity={0.15 + ri * 0.06}
              strokeWidth={ri === cfg.rings.length - 1 ? 1.4 : 0.8}
              strokeDasharray={ri === 0 ? "3 6" : "5 9"}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: ri * 0.14, ease: "easeOut" }} />
        )}

        {/* Spokes */}
        {Array.from({ length: 6 }, (_, i) => {
          const end = spoke(6, i, MAX_R, cfg.rot);
          const isAct = active === i;

          // Bendy spoke math when active (magnetic pull effect)
          let spokePath = `M ${CX} ${CY} L ${end.x} ${end.y}`;
          if (isAct && nodes[i]) {
            const midX = (CX + nodes[i].x) / 2;
            const midY = (CY + nodes[i].y) / 2;
            // Bend it slightly outward
            const bendAmt = 15;
            const normX = -(nodes[i].y - CY) / nodes[i].r;
            const normY = (nodes[i].x - CX) / nodes[i].r;
            spokePath = `M ${CX} ${CY} Q ${midX + normX * bendAmt} ${midY + normY * bendAmt} ${end.x} ${end.y}`;
          }

          return (
            <g key={i}>
              <motion.path d={spokePath} fill="none"
                stroke={isAct ? nodes[i]?.color ?? cfg.accent : cfg.accent}
                strokeWidth={isAct ? 2 : 0.8} strokeOpacity={isAct ? 0.9 : 0.22}
                strokeDasharray={isAct ? "0" : "5 8"}
                style={isAct ? { filter: `drop-shadow(0 0 6px ${nodes[i]?.color})` } : {}}
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1, d: spokePath }}
                transition={{ pathLength: { duration: 0.8, delay: i * 0.08 }, d: { type: "spring", stiffness: 300, damping: 15 } }} />

              {/* Flowing Data Particles along spokes */}
              {!isAct && (
                <motion.circle r={1.5} fill={cfg.accent}
                  animate={{
                    cx: [end.x, CX],
                    cy: [end.y, CY],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5 + Math.random(),
                    ease: "linear"
                  }}
                  style={{ filter: `drop-shadow(0 0 3px ${cfg.accent})` }}
                />
              )}
            </g>
          );
        })}

        {/* Backend mesh cross-links */}
        {tab === "backend" && nodes.map((n, i) => {
          const nxt = nodes[(i + 1) % 6];
          return <motion.line key={`m${i}`} x1={n.x} y1={n.y} x2={nxt.x} y2={nxt.y}
            stroke="#ff2b5e" strokeOpacity={0.12} strokeWidth={0.7} strokeDasharray="3 5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.08 }} />;
        })}

        {/* Neural diagonal links */}
        {tab === "neural" && nodes.map((n, i) => {
          const opp = nodes[(i + 3) % 6];
          return i < 3 ? <motion.line key={`d${i}`} x1={n.x} y1={n.y} x2={opp.x} y2={opp.y}
            stroke="#a78bfa" strokeOpacity={0.09} strokeWidth={0.6}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }} /> : null;
        })}

        {/* Central Core (Reverted to pulsing dot) */}
        <motion.circle cx={CX} cy={CY} r={32} fill="none" stroke="#ff2b5e" strokeWidth="1"
          animate={{ r: [28, 42, 28], strokeOpacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
        <circle cx={CX} cy={CY} r={24} fill="url(#core-g)"
          style={{ filter: "drop-shadow(0 0 18px #ff2b5e) drop-shadow(0 0 36px rgba(255,43,94,0.5))" }} />
        <motion.circle cx={CX} cy={CY} r={10} fill="white" fillOpacity={0.95}
          animate={{ scale: [1, 1.2, 1], opacity: [0.95, 0.55, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }} />

        {/* Nodes */}
        {nodes.map((n, i) => {
          const isA = active === i;
          return (
            <motion.g key={n.name}
              animate={{ x: [0, n.floatX, -n.floatX / 2, n.floatX / 3, 0], y: [0, n.floatY, n.floatY / 2, -n.floatY / 3, 0] }}
              transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
              style={{ cursor: "none" }}
              onMouseEnter={() => handleHover(i)} onMouseLeave={() => handleHover(null)}>
              {/* Wide invisible hit area */}
              <circle cx={n.x} cy={n.y} r={32} fill="transparent" />
              <circle cx={n.x} cy={n.y} r={13} fill={n.color} fillOpacity={isA ? 0.3 : 0.14} filter="url(#glow-lg)" />
              <circle cx={n.x} cy={n.y} r={10} fill="none" stroke={n.color}
                strokeWidth={isA ? 2 : 1.2} strokeOpacity={isA ? 1 : 0.5}
                style={isA ? { filter: `drop-shadow(0 0 8px ${n.color})` } : {}} />
              {isA && <motion.circle cx={n.x} cy={n.y} r={10} fill="none" stroke={n.color} strokeWidth="1.5"
                animate={{ r: [10, 24, 10], strokeOpacity: [0.8, 0, 0.8] }} transition={{ duration: 1.1, repeat: Infinity }} />}
              <motion.circle cx={n.x} cy={n.y} r={isA ? 8 : 5.5} fill={n.color}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1, type: "spring", stiffness: 240 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px`, filter: `drop-shadow(0 0 ${isA ? 12 : 5}px ${n.color})` }} />
              <circle cx={n.x - 2} cy={n.y - 2} r={2} fill="white" fillOpacity={isA ? 0.9 : 0.45} />
            </motion.g>
          );
        })}
      </svg>

      {/* Labels */}
      {nodes.map((n, i) => {
        const lpos = spoke(6, i, nodeRadius(n.level, cfg.rings) + 44, cfg.rot);
        const isA = active === i;
        return (
          <div key={n.name} className="absolute pointer-events-none select-none text-center"
            style={{ left: `${(lpos.x / W) * 100}%`, top: `${(lpos.y / H) * 100}%`, transform: "translate(-50%,-50%)", opacity: isA ? 1 : 0.6, transition: "opacity 0.2s" }}>
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: n.color, textShadow: isA ? `0 0 14px ${n.color}, 0 0 28px ${n.color}80` : `0 0 6px ${n.color}50` }}>
              {n.name}
            </div>
          </div>
        );
      })}

      {/* Tooltip */}
      <AnimatePresence>
        {active !== null && nodes[active] && (() => {
          const n = nodes[active];
          const tp = spoke(6, active, nodeRadius(n.level, cfg.rings) + 60, cfg.rot);
          return <Tooltip key={n.name} skill={n} x={tp.x} y={tp.y} />;
        })()}
      </AnimatePresence>
    </>
  );
}

/* ── Tab Switch Thwip Effect ── */
function ThwipEffect({ morphKey, accent }: { morphKey: number, accent: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
      <AnimatePresence mode="wait">
        <motion.svg key={morphKey} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
          <motion.line
            x1={CX} y1={-100} x2={CX} y2={CY}
            stroke={accent} strokeWidth="3"
            initial={{ pathLength: 0, opacity: 1, strokeDasharray: "20 5" }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${accent}) drop-shadow(0 0 16px white)` }}
          />
          {/* Ripple on impact */}
          <motion.circle cx={CX} cy={CY} r={10} fill="none" stroke="white" strokeWidth="2"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

/* ── Lightning flash ── */
function Lightning() {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const schedule = () => setTimeout(() => {
      setFlash(true);
      setTimeout(() => { setFlash(false); schedule(); }, 180);
    }, 8000 + Math.random() * 14000);
    const t = schedule();
    return () => clearTimeout(t);
  }, []);
  if (!flash) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0"
      style={{ background: "linear-gradient(135deg, rgba(255,200,255,0.07) 0%, rgba(180,100,255,0.04) 100%)", transition: "opacity 0.08s" }} />
  );
}

/* ── Background Empty Space Theming ── */
function BackgroundTheming() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: "1000px" }}>
      {/* 3D Spider-Sense Floor Grid that illuminates under the cursor */}
      <div className="absolute inset-[-50%] opacity-[0.15] transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.923' viewBox='0 0 60 103.923' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.923L60 86.602L60 51.961L30 34.641L0 51.961L0 86.602Z' stroke='%23ff2b5e' stroke-width='1' fill='none'/%3E%3Cpath d='M30 51.961L60 34.641L60 0L30 -17.32L0 0L0 34.641Z' stroke='%23ff2b5e' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 138.56px',
          maskImage: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          transform: "rotateX(65deg) translateY(-100px) translateZ(-300px)",
        }}
      />

      {/* Floating tech schematics / spider webs in corners */}
      <svg className="absolute top-10 right-10 w-64 h-64 opacity-[0.03] animate-spin-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 6" />
        <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>

      <div className="absolute bottom-20 left-10 w-48 h-48 opacity-[0.02] halftone mask-radial-fade" />

      {/* HUD markers */}
      <div className="absolute top-1/4 left-8 font-mono text-[8px] text-white/10 tracking-widest rotate-90 origin-left">
        SECTOR // 1610.A
      </div>
      <div className="absolute bottom-1/3 right-8 font-mono text-[8px] text-white/10 tracking-widest -rotate-90 origin-right">
        THREAT_LEVEL // ALPHA
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function SpiderSenseRadar() {
  const [tab, setTab] = useState<TabId>("frontend");
  const [morphKey, setMorphKey] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  // 3D Parallax Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Morph: briefly unmount & remount web on tab change
  const switchTab = (id: TabId) => {
    if (id === tab) return;
    setMorphKey(k => k + 1);
    setTab(id);
    setActiveNode(null);
  };

  // Header glitch every 15-20 s
  useEffect(() => {
    const schedule = () => setTimeout(() => {
      setGlitch(true);
      setTimeout(() => { setGlitch(false); schedule(); }, 420);
    }, 15000 + Math.random() * 5000);
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  const cfg = CFG[tab];

  return (
    <section id="skills" ref={sectionRef} className="relative px-4 py-24 md:py-36 overflow-hidden">

      {/* Overlays — DO NOT touch CityBackground */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(4,4,14,0.84) 0%,rgba(4,4,14,0.72) 50%,rgba(4,4,14,0.90) 100%)" }} />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 65% 55% at 50% 55%, ${cfg.accent}18 0%, transparent 60%)`, transition: "background 0.8s" }} />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-35" />

      {/* Lightning & Background details */}
      <Lightning />
      <BackgroundTheming />

      {/* Corner webs */}
      {[false, true].map(flip => (
        <svg key={String(flip)} className={`absolute ${flip ? "bottom-0 right-0 rotate-180" : "top-0 left-0"} w-52 h-52 pointer-events-none opacity-[0.055]`} viewBox="0 0 200 200">
          {Array.from({ length: 6 }).map((_, i) => { const r = ((i / 6) * 75 - 5) * Math.PI / 180; return <line key={i} x1="0" y1="0" x2={200 * Math.cos(r)} y2={200 * Math.sin(r)} stroke="white" strokeWidth="1" />; })}
          {[40, 80, 120, 165].map(r => <path key={r} d={`M ${Math.cos(-0.09) * r} ${Math.sin(-0.09) * r} A ${r} ${r} 0 0 1 ${Math.cos(1.4) * r} ${Math.sin(1.4) * r}`} fill="none" stroke="white" strokeWidth="1" />)}
        </svg>
      ))}

      <div className="mx-auto max-w-6xl relative z-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.9 }}
          className="mb-10 flex flex-col items-center gap-4 text-center">

          {/* Glitching badge */}
          <div className="flex items-center gap-3">
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
              className="size-1.5 rounded-full bg-[#ff2b5e]" style={{ boxShadow: "0 0 8px #ff2b5e" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.55em] text-[#ff2b5e] select-none"
              style={glitch ? { textShadow: "2px 0 0 #ff2b5e, -2px 0 0 #5fb6ff", transform: "translateX(1px)", display: "inline-block" } : {}}>
              // spider_sense.active %
            </span>
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
              className="size-1.5 rounded-full bg-[#ff2b5e]" style={{ boxShadow: "0 0 8px #ff2b5e" }} />
          </div>

          <h2 className="font-display font-bold tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", textShadow: "2px 0 0 rgba(255,43,94,0.3), -2px 0 0 rgba(95,182,255,0.3)" }}>
            Web of Mastery.
          </h2>

          <p className="max-w-sm text-sm text-white/40 leading-relaxed font-mono">
            Skills woven into the web — each strand a discipline, each node a weapon in the arsenal.
          </p>
        </motion.div>

        {/* ── Glassmorphic Tab Switcher ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-1 rounded-2xl border px-2 py-2"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(24px)",
              borderColor: "rgba(255,43,94,0.18)",
              boxShadow: "0 0 40px rgba(255,43,94,0.08), inset 0 0 24px rgba(255,43,94,0.04)",
            }}>
            {TABS.map(t => {
              const isActive = tab === t.id;
              return (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  className="relative px-4 py-2 rounded-xl font-mono text-[10px] uppercase tracking-[0.35em] transition-all duration-300 cursor-none"
                  style={{
                    color: isActive ? "#ff2b5e" : "rgba(255,255,255,0.35)",
                    background: isActive ? "rgba(255,43,94,0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(255,43,94,0.45)" : "1px solid transparent",
                    boxShadow: isActive ? "0 0 20px rgba(255,43,94,0.2), inset 0 0 12px rgba(255,43,94,0.06)" : "none",
                    textShadow: isActive ? "0 0 12px rgba(255,43,94,0.8)" : "none",
                  }}>
                  <span className="opacity-50 mr-1">[</span>
                  {t.num} // {t.label}
                  <span className="opacity-50 ml-1">]</span>
                  {isActive && (
                    <motion.div layoutId="tab-indicator" className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ border: "1px solid rgba(255,43,94,0.6)", boxShadow: "0 0 16px rgba(255,43,94,0.3)" }} />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Web visualization ── */}
        <motion.div
          className="relative mx-auto z-20"
          style={{ width: "min(560px, 92vw)", height: "min(560px, 92vw)", rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          {/* Dark radial backdrop */}
          <div className="absolute inset-[6%] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(6,6,18,0.90) 0%, rgba(4,4,12,0.72) 60%, transparent 100%)", transform: "translateZ(-20px)" }} />

          {/* Accent aura — changes per tab */}
          <div className="absolute inset-[-8%] rounded-full pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle, ${cfg.accent}18 0%, transparent 65%)`, filter: "blur(28px)" }} />

          {/* Thwip Effect on tab change */}
          {morphKey > 0 && <ThwipEffect morphKey={morphKey} accent={cfg.accent} />}

          {/* Morphing web — only starts weaving when in view */}
          {isInView && (
            <AnimatePresence mode="wait">
              <motion.div key={`${tab}-${morphKey}`} className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                transition={{ duration: 0.55, ease: [0.2, 1.2, 0.3, 1] }}>
                <WebViz tab={tab} onActiveChange={setActiveNode} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* ── Status bar ── */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-[#ff2b5e]/20 bg-[#ff2b5e]/5 px-5 py-2.5 backdrop-blur"
            style={{ boxShadow: "0 0 24px rgba(255,43,94,0.08)" }}>
            <motion.span animate={{ opacity: [1, 0.1, 1], scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="size-2 rounded-full bg-[#ff2b5e] shrink-0" style={{ boxShadow: "0 0 10px #ff2b5e" }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/80">
              Available for missions
            </span>
            <span className="font-mono text-[9px] tracking-widest text-white/20 ml-1">— FULL STACK</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
