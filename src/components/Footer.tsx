import { motion } from "motion/react";
import rooftop from "@/assets/rooftop.jpg";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${rooftop})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/40" />
      <div className="absolute inset-0 -z-10 noise opacity-40" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-32 text-center md:py-44">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--electric)]"
        >
          // end_of_patrol
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-3xl font-semibold leading-tight text-gradient md:text-5xl"
        >
          Friendly neighborhood
          <br />
          full stack developer.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="max-w-md text-sm text-muted-foreground"
        >
          Built with creativity, caffeine, and late-night debugging.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {["github", "linkedin", "twitter", "email"].map((label) => (
            <a
              key={label}
              href="#"
              data-cursor="hover"
              className="group relative rounded-full border border-foreground/15 bg-background/40 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/80 backdrop-blur transition-all duration-300 hover:border-[var(--electric)] hover:text-foreground"
            >
              <span className="relative z-10">{label}</span>
              <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 glow-blue" />
            </a>
          ))}
        </motion.div>

        <div className="mt-16 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">
          <span>RAJAT // 2026</span>
          <span className="hidden md:inline">EARTH-1610 — ALL VARIANTS RESERVED</span>
          <span>v.1.0</span>
        </div>
      </div>
    </footer>
  );
}
