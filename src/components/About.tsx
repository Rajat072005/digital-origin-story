import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "motion/react";
import { SpiderCrawlButton } from "./SpiderCrawl";

const STATS = [
  { label: "SYSTEMS ACROSS THE MULTIVERSE", value: "12+" },
  { label: "MULTIVERSE EXPERIENCE", value: "3+" },
  { label: "Cups of Coffee", value: "∞" },
  { label: "Bugs Squashed", value: "9999" },
];

const INTERESTS = [
  "AI Systems" ,"3D / WebGL", "Motion Design", "Open Source", "UI Systems", "Game Dev",
];

export function About() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-300, 300], [12, -12]);
  const rotateY = useTransform(x, [-300, 300], [-12, 12]);

  const glareX = useTransform(x, [-300, 300], ["0%", "100%"]);
  const glareY = useTransform(y, [-300, 300], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - (rect.left + rect.width / 2));
    mouseY.set(event.clientY - (rect.top + rect.height / 2));
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section id="about" className="relative px-6 py-24 md:py-36 overflow-hidden">
      {/* Spider-Verse Dimensional Rift Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff2b5e]/10 rounded-full blur-[120px] mix-blend-screen animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#5fb6ff]/10 rounded-full blur-[150px] mix-blend-screen animate-[spin_30s_linear_infinite_reverse]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#5fb6ff]">
            // variant_profile // 001
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            The person behind the mask.
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
          {/* ── ID Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
            style={{ perspective: 1200 }}
          >
            {/* Comic-book ID card */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(95,182,255,0.08), inset 0 0 0 1px rgba(95,182,255,0.15)"
              }}
              className="group relative rounded-2xl border border-transparent bg-card/80 backdrop-blur-xl transition-all duration-300"
            >
              {/* Dynamic Glare */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-50 rounded-2xl mix-blend-overlay"
                style={{ background: glareBackground }}
              />

              {/* Inner container for background clipping */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="halftone absolute inset-0 opacity-25 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#5fb6ff]/15 via-[#a78bfa]/10 to-transparent" />
              </div>

              {/* card header bar */}
              <div className="relative z-10 flex items-center justify-between border-b border-[#5fb6ff]/10 px-5 py-3" style={{ transform: "translateZ(10px)" }}>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#5fb6ff]" style={{ boxShadow: "0 0 8px #5fb6ff" }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#5fb6ff]/70">
                    EARTH-1610 // VARIANT PROFILE
                  </span>
                </div>
                <span className="font-mono text-[9px] text-foreground/30">ID: 001</span>
              </div>

              <div className="relative z-10 p-7 md:p-8" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                {/* Avatar area */}
                <div className="mb-6 flex items-start gap-5">
                  {/* tactical avatar */}
                  <motion.div
                    className="group/avatar relative shrink-0 size-20 rounded-xl overflow-hidden border border-[#5fb6ff]/25 cursor-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    style={{ background: "radial-gradient(circle at 40% 35%, #1a2a4a, #060611)" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* scanline */}
                    <motion.div
                      className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#ff2b5e]/20 to-transparent opacity-0 group-hover/avatar:opacity-100"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    />
                    <svg className="absolute inset-0 w-full h-full opacity-60 group-hover/avatar:opacity-90 transition-opacity duration-300" viewBox="0 0 80 80" fill="none">
                      {/* Spider symbol */}
                      <circle cx="40" cy="40" r="18" fill="#ff2b5e" fillOpacity="0.15" />
                      <motion.path d="M40 22 L40 58 M28 28 L52 52 M52 28 L28 52 M22 40 L58 40"
                        stroke="#ff2b5e" strokeWidth="1.5" strokeOpacity="0.6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "40px", originY: "40px" }} />
                      <circle cx="40" cy="40" r="8" fill="#ff2b5e" fillOpacity="0.4" />
                      <circle cx="40" cy="40" r="3" fill="#ff2b5e" />
                    </svg>
                    <div className="absolute bottom-1 right-1 font-mono text-[7px] text-[#5fb6ff]/60 group-hover/avatar:text-[#ff2b5e] transition-colors">
                      AVT_001
                    </div>
                  </motion.div>

                  <div style={{ transform: "translateZ(20px)" }}>
                    <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#5fb6ff]/60 mb-1">
                      CLASSIFICATION
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">Rajat Trehan</h3>
                    <p className="font-mono text-xs text-[#ff2b5e]/80 mt-0.5 uppercase tracking-wider">
                      Full Stack Developer & AI ENGINEER
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <motion.span className="size-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                      <span className="font-mono text-[9px] text-emerald-400/70 uppercase tracking-widest">SYSTEM ONLINE</span>
                    </div>
                  </div>
                </div>

                {/* Bio (Premium, mature, sophisticated) */}
                <div className="relative mb-10 pl-5" style={{ transform: "translateZ(15px)" }}>
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-[#5fb6ff] to-[#ff2b5e] rounded-full opacity-70 shadow-[0_0_8px_rgba(95,182,255,0.4)]" />
                  <p className="text-[15px] md:text-[16px] leading-[1.8] text-white/70">
                    <strong className="font-display text-white text-lg md:text-xl block mb-2 tracking-tight">Bitten by curiosity. Rewired by code.</strong>
                    I build <strong className="font-semibold text-white">AI-powered web experiences</strong> that feel pulled from another universe — cinematic interfaces, intelligent systems, and interactions engineered to stick in memory long after the tab closes. Somewhere between <strong className="font-semibold text-white">full-stack engineering, motion design, and machine intelligence</strong>… this variant found his calling.
                  </p>
                </div>

                {/* stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {STATS.map((s) => (
                    <div key={s.label}
                      className="rounded-lg border border-foreground/8 bg-background/30 px-3 py-2.5">
                      <div className="font-display text-xl font-bold text-white">{s.value}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-foreground/45 mt-0.5">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* interests */}
                <div className="mb-5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/40 mb-2">
                    // interests
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((int) => (
                      <span key={int}
                        className="rounded-full border border-[#5fb6ff]/15 bg-[#5fb6ff]/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#5fb6ff]/70">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CV download */}
                <SpiderCrawlButton
                  as="div"
                  onClick={() => window.open("https://drive.google.com/file/d/1aHfPUuwJPXy5TdmwNfzolbFVWGf0j71k/view?usp=drive_link", "_blank")}
                  data-cursor="hover"
                  className="group relative w-full overflow-hidden text-center border border-[#5fb6ff]/30 bg-[#5fb6ff]/5 py-2.5 font-mono text-[10px] uppercase tracking-[0.4em] text-[#5fb6ff] transition-all duration-300 hover:bg-[#5fb6ff]/10 hover:border-[#5fb6ff]/80 rounded-xl cursor-none"
                  style={{ boxShadow: "0 0 20px rgba(95,182,255,0.08)" } as any}
                >
                  <span className="relative z-10 inline-block transition-all duration-300 group-hover:scale-105 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(95,182,255,0.8)]">
                    [ Access Case File // Resume ]
                  </span>
                  <motion.div
                    className="absolute top-0 left-0 h-full w-[200%] bg-gradient-to-r from-transparent via-[#5fb6ff]/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                </SpiderCrawlButton>
              </div>
            </motion.div>

            {/* decorative tilt shadow */}
            <div
              className="absolute -inset-2 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{ background: "radial-gradient(ellipse at 50% 50%, #5fb6ff, transparent 70%)" }}
            />
          </motion.div>

          {/* ── Right side: location, availability, quote ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-8"
          >
            {/* quote block */}
            <div className="group relative rounded-2xl border border-foreground/8 bg-card/60 backdrop-blur-md p-7 overflow-hidden"
              style={{ boxShadow: "var(--shadow-panel)" }}>
              <div className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay rounded-2xl" />

              {/* animated scanline on hover */}
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#ff2b5e]/10 to-transparent -translate-y-full group-hover:translate-y-full"
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#ff2b5e]/70 mb-4 flex items-center gap-2">
                <span className="size-1.5 rounded-sm bg-[#ff2b5e] animate-pulse" />
                // threat_assessment // log_001
              </div>
              <blockquote className="font-display text-xl font-semibold leading-snug text-white">
                "With great code comes great responsibility — to the user experience."<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block ml-1 w-2 h-5 bg-[#ff2b5e]/70 align-middle" />
              </blockquote>
              <div className="mt-4 font-mono text-[10px] text-foreground/40 uppercase tracking-widest flex justify-between">
                <span>— Rajat Trehan</span>
                <span className="text-[#5fb6ff]/50">CLASS: OMEGA</span>
              </div>
            </div>

            {/* location + availability */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📍", label: "Base of Operations", value: "India", code: "LOC_01" },
                { icon: "🕐", label: "Time Zone", value: "IST +5:30", code: "TMR_SYNC" },
                { icon: "💼", label: "Status", value: "AVAILABLE FOR NEW MISSIONS", code: "STS_ACT" },
                { icon: "🎓", label: "Affiliation", value: "AI & CS ENGINEER", code: "AFF_CS" },
              ].map((item) => (
                <div key={item.label}
                  className="group relative border border-foreground/8 bg-card/40 backdrop-blur px-4 py-4 overflow-hidden transition-all duration-300 hover:border-[#ff2b5e]/40 hover:bg-card/80"
                  style={{
                    clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
                  }}
                >
                  {/* High-tech targeting bracket corners */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#ff2b5e]/0 group-hover:border-[#ff2b5e]/50 transition-colors" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#ff2b5e]/0 group-hover:border-[#ff2b5e]/50 transition-colors" />

                  {/* Subtle hover background sweep */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff2b5e]/0 to-[#ff2b5e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex justify-between items-start mb-2">
                    <div className="relative z-10 text-lg group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                    <div className="font-mono text-[6px] tracking-widest text-[#ff2b5e]/30 group-hover:text-[#ff2b5e]/70 transition-colors">{item.code}</div>
                  </div>

                  <div className="relative z-10 font-mono text-[8px] uppercase tracking-widest text-foreground/40 group-hover:text-[#5fb6ff]/70 transition-colors">{item.label}</div>
                  <div className="relative z-10 font-display text-sm font-semibold text-white mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>

            {/* web pattern decoration */}
            <svg className="absolute -left-[20%] top-[40%] -translate-y-1/2 w-[140%] h-[150%] -z-10 opacity-40 pointer-events-none" viewBox="0 0 400 400" fill="none">
              <path d="M0,200 Q200,50 400,200 T800,200" stroke="#5fb6ff" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M0,200 Q200,350 400,200 T800,200" stroke="#ff2b5e" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="135" r="3" fill="#5fb6ff" />
              <circle cx="200" cy="265" r="3" fill="#ff2b5e" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
