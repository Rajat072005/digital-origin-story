import { motion, useInView, useSpring, useMotionValue } from "motion/react";
import { useRef, useEffect } from "react";

/**
 * Web-pull section transition:
 * 1. A web strand shoots across the top edge (existing).
 * 2. A vertical "catch" line drops down from the center.
 * 3. The section below springs upward with elastic physics,
 *    as if the web physically pulled it into view.
 */
export function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -20% 0px" });

  // spring y for the pull-in wrapper
  const rawY = useMotionValue(40);
  const springY = useSpring(rawY, { stiffness: 100, damping: 14, mass: 1.1 });

  useEffect(() => {
    if (inView) {
      rawY.set(40);
      // small delay so the web strand fires first
      const t = setTimeout(() => rawY.set(0), 180);
      return () => clearTimeout(t);
    }
  }, [inView, rawY]);

  return (
    <div ref={ref} className="pointer-events-none relative mx-auto h-28 w-full max-w-[1600px] px-4">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="sd-blue" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="oklch(0.74 0.19 240 / 0)" />
            <stop offset="50%"  stopColor="oklch(0.74 0.19 240 / 0.95)" />
            <stop offset="100%" stopColor="oklch(0.74 0.19 240 / 0)" />
          </linearGradient>
          <linearGradient id="sd-red" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="oklch(0.58 0.24 25 / 0)" />
            <stop offset="50%"  stopColor="oklch(0.58 0.24 25 / 0.8)" />
            <stop offset="100%" stopColor="oklch(0.58 0.24 25 / 0)" />
          </linearGradient>
          <filter id="wb"><feGaussianBlur stdDeviation="0.8" /></filter>
        </defs>

        {/* primary web strand — shoots left→right */}
        <motion.path
          d="M -20 55 C 200 25, 420 80, 520 50 S 820 18, 1020 52"
          stroke="url(#sd-blue)"
          strokeWidth="0.9"
          fill="none"
          filter="url(#wb)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView
            ? { pathLength: [0, 1, 1], opacity: [0, 1, 0.12] }
            : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.5, times: [0, 0.55, 1], ease: [0.2, 0.8, 0.2, 1] }}
        />

        {/* crimson accent strand */}
        <motion.path
          d="M -20 68 C 260 48, 460 28, 545 60 S 800 82, 1020 38"
          stroke="url(#sd-red)"
          strokeWidth="0.55"
          fill="none"
          filter="url(#wb)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView
            ? { pathLength: [0, 1, 1], opacity: [0, 0.85, 0] }
            : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.7, delay: 0.12, times: [0, 0.6, 1] }}
        />

        {/* vertical "catch" drop — the web that "pulls" the next section */}
        <motion.line
          x1="500" y1="50" x2="500" y2="100"
          stroke="oklch(0.74 0.19 240 / 0.7)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          filter="url(#wb)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView
            ? { pathLength: [0, 1], opacity: [0, 0.9, 0.3] }
            : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.55, times: [0, 0.5, 1] }}
        />

        {/* micro branches */}
        {["M 200 52 L 222 32 L 244 48","M 420 58 L 442 78 L 472 62",
          "M 640 48 L 670 28 L 700 46","M 820 58 L 845 73 L 876 56"].map((d, i) => (
          <motion.path key={i} d={d}
            stroke="oklch(0.74 0.19 240 / 0.6)" strokeWidth="0.32" fill="none"
            filter="url(#wb)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView
              ? { pathLength: [0, 1], opacity: [0, 0.7, 0] }
              : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.3, delay: 0.38 + i * 0.07, times: [0, 0.5, 1] }}
          />
        ))}

        {/* anchor pulse */}
        <motion.circle cx="500" cy="50" r="1.4" fill="oklch(0.99 0.02 240)"
          initial={{ opacity: 0, r: 0 }}
          animate={inView ? { opacity: [0, 1, 0], r: [0, 2.8, 0] } : {}}
          transition={{ duration: 1.1, delay: 0.52, ease: "easeOut" }}
        />
      </svg>

      {/* spring-y pull indicator (invisible but feeds physics to child wrapper) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-transparent"
        style={{ y: springY }}
      />
    </div>
  );
}

/**
 * Wrap any section with this to give it the web-pulled spring entrance.
 */
export function WebPullSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -5% 0px" });

  const rawY = useMotionValue(36);
  const springY = useSpring(rawY, { stiffness: 110, damping: 16, mass: 1.0 });
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => {
        rawY.set(0);
        opacity.set(1);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [inView, rawY, opacity]);

  return (
    <div ref={ref}>
      <motion.div style={{ y: springY, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
