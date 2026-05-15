import { motion, useInView } from "motion/react";
import { useRef } from "react";

/**
 * Cinematic neural-web transition between sections.
 * Briefly fires a glowing strand that spreads organically across the top edge
 * of the next section as it scrolls into view, then fades out. It is *not* a
 * permanent decorative graphic — it only flashes during the section handoff.
 */
export function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -25% 0px" });

  return (
    <div
      ref={ref}
      className="pointer-events-none relative mx-auto h-28 w-full max-w-[1600px] px-4"
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="strand-glow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.74 0.19 240 / 0)" />
            <stop offset="50%" stopColor="oklch(0.74 0.19 240 / 0.95)" />
            <stop offset="100%" stopColor="oklch(0.74 0.19 240 / 0)" />
          </linearGradient>
          <linearGradient id="strand-accent" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.58 0.24 25 / 0)" />
            <stop offset="50%" stopColor="oklch(0.58 0.24 25 / 0.7)" />
            <stop offset="100%" stopColor="oklch(0.58 0.24 25 / 0)" />
          </linearGradient>
          <filter id="strand-blur">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Primary strand — shoots in fast, then fades */}
        <motion.path
          d="M -20 60 C 220 30, 420 78, 520 50 S 820 20, 1020 55"
          stroke="url(#strand-glow)"
          strokeWidth="0.8"
          fill="none"
          filter="url(#strand-blur)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: [0, 1, 1], opacity: [0, 1, 0.15] }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 1.6,
            times: [0, 0.55, 1],
            ease: [0.2, 0.8, 0.2, 1],
          }}
        />

        {/* Accent crimson micro-strand — slight delay, threads underneath */}
        <motion.path
          d="M -20 70 C 260 50, 460 30, 540 62 S 800 80, 1020 40"
          stroke="url(#strand-accent)"
          strokeWidth="0.5"
          fill="none"
          filter="url(#strand-blur)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 1.8,
            delay: 0.15,
            times: [0, 0.6, 1],
            ease: [0.2, 0.9, 0.2, 1],
          }}
        />

        {/* Spreading micro-threads (neural branches) */}
        {[
          "M 200 55 L 220 35 L 240 50",
          "M 420 60 L 440 80 L 470 65",
          "M 640 50 L 670 30 L 700 48",
          "M 820 60 L 845 75 L 875 58",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="oklch(0.74 0.19 240 / 0.6)"
            strokeWidth="0.3"
            fill="none"
            filter="url(#strand-blur)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              inView
                ? { pathLength: [0, 1], opacity: [0, 0.7, 0] }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: 1.4,
              delay: 0.4 + i * 0.08,
              times: [0, 0.5, 1],
              ease: "easeOut",
            }}
          />
        ))}

        {/* Anchor pulse — where the strand "lands" */}
        <motion.circle
          cx="500"
          cy="50"
          r="1.4"
          fill="oklch(0.99 0.02 240)"
          initial={{ opacity: 0, r: 0 }}
          animate={inView ? { opacity: [0, 1, 0], r: [0, 2.4, 0] } : {}}
          transition={{ duration: 1.2, delay: 0.55, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
