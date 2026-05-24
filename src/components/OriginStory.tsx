import { motion, useScroll, useTransform } from "motion/react";
import { useState, useRef } from "react";

const PANELS = [
  {
    chapter: "TIMELINE_01",
    title: "BEFORE THE POWERS CAME THE OBSESSION.",
    body: "Sleepless nights. Terminal windows glowing at 2 A.M .Somewhere between failed compiles and tiny victories, the first successful program felt less like code… and more like a canon event.",
    accent: "from-[var(--crimson)]/40 to-transparent",
    stamp: "BOOT",
    color: "var(--crimson)",
    webColor: "oklch(0.58 0.24 25 / 0.7)",
  },
  {
    chapter: "TIMELINE_02",
    title: "DISCOVERED THE WEB COULD FEEL ALIVE.",
    body: "Code stopped feeling like syntax and started behaving like storytelling — motion, interaction, atmosphere, and experiences capable of pulling people into entirely different realities.",
    accent: "from-[var(--violet-glow)]/40 to-transparent",
    stamp: "ARC",
    color: "var(--violet-glow)",
    webColor: "oklch(0.62 0.21 295 / 0.7)",
  },
  {
    chapter: "TIMELINE_03",
    title: "NOW ENGINEERING DIGITAL REALITIES.",
    body: "From neural systems to immersive interfaces, from scalable APIs to cinematic interactions — building intelligent applications designed to feel less like websites and more like living dimensions.",
    accent: "from-[var(--electric)]/40 to-transparent",
    stamp: "NOW",
    color: "var(--electric)",
    webColor: "oklch(0.74 0.19 240 / 0.7)",
  },
];

export function OriginStory() {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const webY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="about-origin" ref={containerRef} className="relative px-6 py-32 md:py-44 overflow-hidden">
      {/* Cinematic Spider Web Background */}
      <motion.div 
        style={{ y: webY }}
        className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.15] pointer-events-none"
      >
        <svg className="w-[150vw] h-[150vh] min-w-[1200px] max-w-none" viewBox="0 0 1000 1000" fill="none">
          <g stroke="#5fb6ff" strokeWidth="0.7">
            {/* Radial threads */}
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={`ray-${i}`} x1="500" y1="500" x2={500 + 800 * Math.cos(i * 15 * Math.PI / 180)} y2={500 + 800 * Math.sin(i * 15 * Math.PI / 180)} />
            ))}
            {/* Polygonal web rings */}
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={`ring-${i}`} d={
                Array.from({ length: 25 }).map((_, j) => {
                  const angle = j * 15 * Math.PI / 180;
                  const r = (i + 1) * 55 + (j % 2 === 0 ? 5 : -5); // organic irregularity
                  return `${j === 0 ? 'M' : 'L'} ${500 + r * Math.cos(angle)} ${500 + r * Math.sin(angle)}`;
                }).join(" ")
              } strokeLinejoin="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-14 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--crimson)]">
            // origin story
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Every variant has a beginning.
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {PANELS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl border border-foreground/10 bg-card/90 backdrop-blur-md cursor-none"
              data-cursor="hover"
              style={{ boxShadow: hovered === i ? `0 20px 40px -15px ${p.color}` : "var(--shadow-panel)" }}
            >
              {/* Suspension thread */}
              <div className="absolute left-1/2 bottom-[99%] w-px h-[400px] -translate-x-1/2 bg-gradient-to-t from-white/40 to-transparent pointer-events-none z-[-1]" />
              
              {/* Inner clipped backgrounds */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-70`} />
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay" 
                  style={{ 
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", 
                    backgroundSize: "6px 6px" 
                  }} 
                />
              </div>

              {/* glowing edge on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                animate={{ opacity: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ boxShadow: `inset 0 0 0 1px ${p.color}, 0 0 40px -10px ${p.color}` }}
              />

              {/* corner stamp */}
              <div className="absolute right-4 top-4 rounded-md border border-foreground/15 bg-background/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70 backdrop-blur">
                {p.stamp}
              </div>

              <div className="relative p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span 
                    className="font-mono text-7xl font-black leading-none text-foreground/15 transition-all duration-300"
                    style={{
                      textShadow: hovered === i ? "3px 0px 0px rgba(255,0,0,0.5), -3px 0px 0px rgba(0,255,255,0.5)" : "none",
                      color: hovered === i ? "rgba(255,255,255,0.25)" : ""
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/60 group-hover:text-foreground/90 transition-colors">
                    {p.chapter}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                  {p.title}
                </h3>
                <div className="relative mt-5 mb-2 pl-5">
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] opacity-70" style={{ backgroundImage: `linear-gradient(to bottom, ${p.color}, transparent)` }} />
                  <p className="text-[14px] md:text-[15px] leading-[1.8] text-white/70 font-medium">
                    {p.body}
                  </p>
                </div>

                {/* animated web thread on hover */}
                <svg className="mt-8 h-14 w-full" viewBox="0 0 200 50" fill="none" preserveAspectRatio="none">
                  {/* base wave — always visible */}
                  <path
                    d="M0 28 Q50 8 100 28 T200 28"
                    stroke={p.webColor}
                    strokeWidth="0.5"
                  />

                  {/* hover wave — draws in */}
                  <motion.path
                    d="M0 22 Q35 38 70 22 T140 22 T200 22"
                    stroke={p.webColor}
                    strokeWidth="0.7"
                    strokeDasharray="200"
                    initial={{ strokeDashoffset: 200, opacity: 0 }}
                    animate={{
                      strokeDashoffset: hovered === i ? 0 : 200,
                      opacity: hovered === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* anchor dots */}
                  <motion.circle
                    cx="100"
                    cy="28"
                    r="2.2"
                    fill={p.color}
                    animate={{
                      r: hovered === i ? 3.2 : 2.2,
                      opacity: hovered === i ? 1 : 0.7,
                    }}
                    style={{ filter: hovered === i ? `drop-shadow(0 0 6px ${p.color})` : "none" }}
                  />
                  {hovered === i && (
                    <>
                      <motion.circle cx="50"  cy="28" r="1.5" fill={p.color}
                        initial={{ opacity: 0, r: 0 }} animate={{ opacity: 0.6, r: 1.5 }}
                        transition={{ duration: 0.3, delay: 0.2 }} />
                      <motion.circle cx="150" cy="28" r="1.5" fill={p.color}
                        initial={{ opacity: 0, r: 0 }} animate={{ opacity: 0.6, r: 1.5 }}
                        transition={{ duration: 0.3, delay: 0.3 }} />
                    </>
                  )}

                  {/* tiny hanging spider on hover */}
                  <motion.g
                    animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : -8 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <line x1="100" y1="28" x2="100" y2="40" stroke={p.webColor} strokeWidth="0.5" strokeDasharray="1 1" />
                    <ellipse cx="100" cy="44" rx="2.5" ry="3.2" fill="#cc1122" />
                    <circle  cx="100" cy="40" r="1.8" fill="#cc1122" />
                    {/* tiny legs */}
                    <line x1="97.5" y1="42" x2="94" y2="40" stroke="#cc1122" strokeWidth="0.6" />
                    <line x1="97.5" y1="44" x2="93.5" y2="44" stroke="#cc1122" strokeWidth="0.6" />
                    <line x1="102.5" y1="42" x2="106" y2="40" stroke="#cc1122" strokeWidth="0.6" />
                    <line x1="102.5" y1="44" x2="106.5" y2="44" stroke="#cc1122" strokeWidth="0.6" />
                  </motion.g>
                </svg>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
