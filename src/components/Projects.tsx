import { motion } from "motion/react";

const PROJECTS = [
  {
    name: "EatInSync",
    tag: "Food Intelligence Ecosystem",
    body: "An AI-powered dining companion that scans menus, learns your taste, and recommends the next bite worth remembering.",
    glyph: "01",
    palette:
      "from-amber-500/20 via-[var(--crimson)]/20 to-transparent",
    accent: "var(--crimson)",
  },
  {
    name: "Moodify",
    tag: "Music Emotion Universe",
    body: "Visualize how a track feels — emotional gradients, audio-reactive UI, and a soundscape you can step inside.",
    glyph: "02",
    palette:
      "from-[var(--violet-glow)]/25 via-[var(--electric)]/15 to-transparent",
    accent: "var(--violet-glow)",
  },
  {
    name: "Paste App",
    tag: "Encrypted Developer Terminal",
    body: "A secure, terminal-inspired space to share code & secrets with end-to-end encryption and zero clutter.",
    glyph: "03",
    palette:
      "from-[var(--electric)]/25 via-cyan-500/10 to-transparent",
    accent: "var(--electric)",
  },
];

export function Projects() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--violet-glow)]">
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
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              data-cursor="hover"
              className="group relative isolate overflow-hidden rounded-2xl border border-foreground/10 bg-card backdrop-blur-md transition-transform duration-500 hover:-translate-y-2"
              style={{ boxShadow: "var(--shadow-panel)" }}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.palette}`}
              />
              <div className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" />

              {/* glowing edge on hover */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: `inset 0 0 0 1px ${p.accent}, 0 0 40px -10px ${p.accent}`,
                }}
              />

              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-foreground/10">
                <span
                  className="font-display text-[140px] font-black leading-none text-foreground/10 transition-transform duration-700 group-hover:scale-110"
                  style={{ textShadow: `0 0 40px ${p.accent}` }}
                >
                  {p.glyph}
                </span>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                {/* HUD corners */}
                {(["tl", "tr", "bl", "br"] as const).map((c) => (
                  <span
                    key={c}
                    className={`absolute size-4 border-foreground/40 ${
                      c === "tl"
                        ? "left-3 top-3 border-l border-t"
                        : c === "tr"
                          ? "right-3 top-3 border-r border-t"
                          : c === "bl"
                            ? "bottom-3 left-3 border-b border-l"
                            : "bottom-3 right-3 border-b border-r"
                    }`}
                  />
                ))}
              </div>

              <div className="relative p-6">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  {p.tag}
                </p>
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                    Enter universe
                  </span>
                  <span
                    className="grid size-8 place-items-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-current"
                    style={{ color: p.accent }}
                  >
                    →
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
