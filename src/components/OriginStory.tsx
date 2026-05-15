import { motion } from "motion/react";

const PANELS = [
  {
    chapter: "Chapter 01",
    title: "Started with C++",
    body: "Late nights, blinking cursors, and a curiosity that wouldn't sleep. The first compile that actually worked felt like origin energy.",
    accent: "from-[var(--crimson)]/40 to-transparent",
    stamp: "BOOT",
  },
  {
    chapter: "Chapter 02",
    title: "Fell in love with creating experiences.",
    body: "Code stopped being syntax and started feeling like cinema — pixels, motion, and stories I could build for other humans.",
    accent: "from-[var(--violet-glow)]/40 to-transparent",
    stamp: "ARC",
  },
  {
    chapter: "Chapter 03",
    title: "Now building immersive full-stack applications.",
    body: "From databases to interfaces, from APIs to atmospheres — shipping products that feel like a place, not a page.",
    accent: "from-[var(--electric)]/40 to-transparent",
    stamp: "NOW",
  },
];

export function OriginStory() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
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
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 1.2 : -1.2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{
                duration: 0.9,
                delay: i * 0.12,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card backdrop-blur-md"
              style={{ boxShadow: "var(--shadow-panel)" }}
            >
              {/* halftone wash */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent} opacity-70`}
              />
              <div className="halftone pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />

              {/* corner stamp */}
              <div className="absolute right-4 top-4 rounded-md border border-foreground/15 bg-background/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70 backdrop-blur">
                {p.stamp}
              </div>

              <div className="relative p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="font-mono text-7xl font-black leading-none text-foreground/15">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/60">
                    {p.chapter}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>

                {/* web thread */}
                <svg
                  className="mt-8 h-12 w-full opacity-60"
                  viewBox="0 0 200 40"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 20 Q50 0 100 20 T200 20"
                    stroke="oklch(0.74 0.19 240 / 0.6)"
                    strokeWidth="0.6"
                  />
                  <circle cx="100" cy="20" r="2" fill="oklch(0.74 0.19 240)" />
                </svg>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
