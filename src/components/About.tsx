import { motion } from "motion/react";
import { SpiderCrawlButton } from "./SpiderCrawl";

const STATS = [
  { label: "Projects Shipped", value: "12+" },
  { label: "Years Coding",     value: "3+"  },
  { label: "Cups of Coffee",   value: "∞"   },
  { label: "Bugs Squashed",    value: "9999" },
];

const INTERESTS = [
  "3D / WebGL", "Motion Design", "AI/ML", "Open Source", "UI Systems", "Game Dev",
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-36">
      <div className="mx-auto max-w-7xl">
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
          >
            {/* Comic-book ID card */}
            <div
              className="relative overflow-hidden rounded-2xl border border-[#5fb6ff]/20 bg-card backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 0 60px rgba(95,182,255,0.08), 0 30px 80px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(95,182,255,0.06)",
              }}
            >
              {/* halftone */}
              <div className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay" />
              {/* blue gradient wash */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#5fb6ff]/15 via-[#a78bfa]/10 to-transparent" />

              {/* card header bar */}
              <div className="flex items-center justify-between border-b border-[#5fb6ff]/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#5fb6ff]" style={{ boxShadow: "0 0 8px #5fb6ff" }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#5fb6ff]/70">
                    EARTH-1610 // VARIANT PROFILE
                  </span>
                </div>
                <span className="font-mono text-[9px] text-foreground/30">ID: 001</span>
              </div>

              <div className="p-7 md:p-8">
                {/* Avatar area */}
                <div className="mb-6 flex items-start gap-5">
                  {/* placeholder avatar with spider symbol */}
                  <div
                    className="relative shrink-0 size-20 rounded-xl overflow-hidden border border-[#5fb6ff]/25"
                    style={{ background: "radial-gradient(circle at 40% 35%, #1a2a4a, #060611)" }}
                  >
                    <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 80 80" fill="none">
                      {/* Spider symbol */}
                      <circle cx="40" cy="40" r="18" fill="#ff2b5e" fillOpacity="0.15" />
                      <path d="M40 22 L40 58 M28 28 L52 52 M52 28 L28 52 M22 40 L58 40"
                        stroke="#ff2b5e" strokeWidth="1.5" strokeOpacity="0.6" />
                      <circle cx="40" cy="40" r="8" fill="#ff2b5e" fillOpacity="0.4" />
                      <circle cx="40" cy="40" r="3" fill="#ff2b5e" />
                    </svg>
                    <div className="absolute bottom-1 right-1 font-mono text-[7px] text-[#5fb6ff]/60">
                      AVT_001
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#5fb6ff]/60 mb-1">
                      CLASSIFICATION
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">Rajat Trehan</h3>
                    <p className="font-mono text-xs text-[#ff2b5e]/80 mt-0.5 uppercase tracking-wider">
                      Full Stack Developer
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <motion.span className="size-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
                      <span className="font-mono text-[9px] text-emerald-400/70 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  A developer who believes interfaces should feel like experiences, not forms.
                  I build full-stack applications with a cinematic eye — where every scroll,
                  hover, and transition is intentional. Obsessed with the intersection of
                  code, motion, and storytelling.
                </p>

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
                  onClick={() => window.open("/resume.pdf", "_blank")}
                  data-cursor="hover"
                  className="w-full text-center border border-[#5fb6ff]/30 bg-[#5fb6ff]/5 py-2.5 font-mono text-[10px] uppercase tracking-[0.4em] text-[#5fb6ff] transition-all duration-300 hover:bg-[#5fb6ff]/10 hover:border-[#5fb6ff]/60 rounded-xl cursor-none"
                  style={{ boxShadow: "0 0 20px rgba(95,182,255,0.08)" } as any}
                >
                  [ Download Case File // Resume ]
                </SpiderCrawlButton>
              </div>
            </div>

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
            <div className="relative rounded-2xl border border-foreground/8 bg-card/60 backdrop-blur-md p-7"
              style={{ boxShadow: "var(--shadow-panel)" }}>
              <div className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay rounded-2xl" />
              <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#ff2b5e]/70 mb-4">
                // last_transmission
              </div>
              <blockquote className="font-display text-xl font-semibold leading-snug text-white">
                "With great code comes great responsibility — to the user experience."
              </blockquote>
              <div className="mt-4 font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                — Rajat Trehan, Variant 001
              </div>
            </div>

            {/* location + availability */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📍", label: "Base of Operations", value: "India" },
                { icon: "🕐", label: "Time Zone",          value: "IST +5:30" },
                { icon: "💼", label: "Status",             value: "Open to Work" },
                { icon: "🎓", label: "Affiliation",        value: "CS Student" },
              ].map((item) => (
                <div key={item.label}
                  className="rounded-xl border border-foreground/8 bg-card/40 backdrop-blur px-4 py-4">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="font-mono text-[8px] uppercase tracking-widest text-foreground/40">{item.label}</div>
                  <div className="font-display text-sm font-semibold text-white mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>

            {/* web pattern decoration */}
            <svg className="w-full h-16 opacity-20" viewBox="0 0 400 60" fill="none" aria-hidden>
              {Array.from({length:5}).map((_,i)=>(
                <path key={i}
                  d={`M ${i*100} 0 Q ${i*100+50} 30 ${i*100+100} 0`}
                  stroke="#5fb6ff" strokeWidth="0.6" />
              ))}
              {[100,200,300].map((x,i)=>(
                <circle key={i} cx={x} cy="0" r="2" fill="#5fb6ff" />
              ))}
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
