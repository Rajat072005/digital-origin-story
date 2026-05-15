import { motion } from "motion/react";

/** Vertical glowing web-line that connects sections during scroll. */
export function SectionDivider() {
  return (
    <div className="relative mx-auto h-32 w-full max-w-7xl px-6">
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-30%" }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2"
        viewBox="0 0 8 100"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="4"
          y1="0"
          x2="4"
          y2="100"
          stroke="oklch(0.74 0.19 240 / 0.7)"
          strokeWidth="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ filter: "drop-shadow(0 0 4px var(--electric))" }}
        />
        <circle cx="4" cy="50" r="1.6" fill="oklch(0.96 0.01 250)" />
      </motion.svg>
    </div>
  );
}
