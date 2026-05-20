import { motion } from "motion/react";
import { SpiderCrawlButton } from "./SpiderCrawl";

const PROJECTS = [
  {
    name: "EatInSync",
    tag: "Food Intelligence Ecosystem",
    body: "An AI-powered dining companion that scans menus, learns your taste, and recommends the next bite worth remembering.",
    issue: "01",
    action: "WHOOSH!",
    palette: "from-amber-600/30 via-[#ff2b5e]/20 to-transparent",
    accent: "#ff2b5e",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["React", "Node.js", "MongoDB", "AI/ML"],
  },
  {
    name: "Moodify",
    tag: "Music Emotion Universe",
    body: "Visualize how a track feels — emotional gradients, audio-reactive UI, and a soundscape you can step inside.",
    issue: "02",
    action: "ZAP!",
    palette: "from-[#a78bfa]/25 via-[#5fb6ff]/15 to-transparent",
    accent: "#a78bfa",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["React", "Spotify API", "GSAP", "Canvas"],
  },
  {
    name: "Paste App",
    tag: "Encrypted Developer Terminal",
    body: "A secure, terminal-inspired space to share code & secrets with end-to-end encryption and zero clutter.",
    issue: "03",
    action: "POW!",
    palette: "from-[#5fb6ff]/25 via-cyan-500/10 to-transparent",
    accent: "#5fb6ff",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["Next.js", "PostgreSQL", "Prisma", "Encryption"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#a78bfa]">
            // multiverse_log
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Each project, a different universe.
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 1.5 : -1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              whileHover={{ y: -8, rotate: 0.4 }}
              data-cursor="hover"
              className="group relative isolate overflow-hidden rounded-2xl border border-foreground/10 bg-card backdrop-blur-md"
              style={{
                boxShadow: "var(--shadow-panel)",
                // Comic book panel border
                outline: "2px solid transparent",
                outlineOffset: "3px",
              }}
            >
              {/* gradient wash */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.palette}`} />
              <div className="halftone pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay" />

              {/* glowing edge on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 1.5px ${p.accent}, 0 0 50px -10px ${p.accent}` }}
              />

              {/* ISSUE badge — comic book style */}
              <div
                className="absolute -right-2 -top-2 z-10 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 font-mono text-[10px] font-black uppercase tracking-tight text-white shadow-lg"
                style={{
                  background: `radial-gradient(circle at 40% 40%, ${p.accent}, color-mix(in srgb, ${p.accent} 60%, #000))`,
                  borderColor: p.accent,
                  boxShadow: `0 0 20px ${p.accent}66`,
                }}
              >
                <div className="text-center leading-none">
                  <div className="text-[7px] opacity-80">ISSUE</div>
                  <div className="text-sm">#{p.issue}</div>
                </div>
              </div>

              {/* action word burst (appears on hover) */}
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 z-20 font-display text-2xl font-black uppercase opacity-0 group-hover:opacity-100"
                style={{
                  color: p.accent,
                  textShadow: `0 0 20px ${p.accent}, 0 0 40px ${p.accent}88`,
                  WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                }}
                initial={false}
                animate={{}}
                whileHover={{ scale: [1, 1.15, 1], rotate: [-3, 3, -2, 0] }}
                transition={{ duration: 0.4 }}
              >
                {p.action}
              </motion.div>

              {/* panel preview area */}
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-foreground/10">
                {/* big number */}
                <motion.span
                  className="font-display text-[130px] font-black leading-none text-foreground/8 transition-transform duration-700 group-hover:scale-110"
                  style={{ textShadow: `0 0 60px ${p.accent}44` }}
                >
                  {p.issue}
                </motion.span>
                {/* action lines radiating from center */}
                <svg className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                  {Array.from({length:12}).map((_,li)=>{
                    const a=(li/12)*Math.PI*2;
                    const len=160+Math.random()*40;
                    return <line key={li} x1="200" y1="150"
                      x2={200+Math.cos(a)*len} y2={150+Math.sin(a)*len}
                      stroke={p.accent} strokeWidth="0.8" strokeOpacity="0.35"/>;
                  })}
                </svg>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                {/* HUD corners */}
                {(["tl","tr","bl","br"] as const).map((c) => (
                  <span key={c}
                    className={`absolute size-4 transition-colors duration-300 group-hover:border-current ${
                      c==="tl"?"left-3 top-3 border-l border-t border-foreground/30":
                      c==="tr"?"right-3 top-3 border-r border-t border-foreground/30":
                      c==="bl"?"bottom-3 left-3 border-b border-l border-foreground/30":
                             "bottom-3 right-3 border-b border-r border-foreground/30"
                    }`}
                    style={{ color: p.accent }}
                  />
                ))}
              </div>

              <div className="relative p-6">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  {p.tag}
                </p>
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>

                {/* tech pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t}
                      className="rounded-full border border-foreground/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-foreground/50">
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="mt-5 flex items-center gap-3">
                  <SpiderCrawlButton
                    as="div"
                    onClick={() => window.open(p.github, "_blank")}
                    data-cursor="hover"
                    className="flex-1 text-center border border-foreground/15 bg-background/40 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70 transition-all duration-300 hover:border-current hover:text-white rounded-lg cursor-none"
                    style={{ color: p.accent } as any}
                  >
                    GitHub
                  </SpiderCrawlButton>
                  <a
                    href={p.live}
                    data-cursor="hover"
                    className="flex-1 text-center rounded-lg py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${p.accent}aa, ${p.accent}55)`,
                      border: `1px solid ${p.accent}44`,
                    }}
                  >
                    Live Demo →
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
