import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/* wall-crawling Spider-Man progress indicator */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [stepping, setStepping] = useState(false);
  const lastY = useRef(0);
  const stepTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setProgress(p);

      // trigger step animation on scroll
      if (Math.abs(window.scrollY - lastY.current) > 2) {
        setStepping(true);
        clearTimeout(stepTimer.current);
        stepTimer.current = setTimeout(() => setStepping(false), 250);
      }
      lastY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stepTimer.current);
    };
  }, []);

  // Spidey climbs from bottom (progress=0) to top (progress=1)
  // bottomPct = 8% at top, 92% at bottom
  const bottomPct = 92 - progress * 84;

  return (
    <div
      className="pointer-events-none fixed right-4 top-0 bottom-0 z-50 hidden md:flex flex-col items-center"
      aria-hidden
    >
      {/* progress track */}
      <div className="absolute right-0 top-[8%] bottom-[8%] w-px bg-white/5" />
      {/* filled track */}
      <motion.div
        className="absolute right-0 w-px bg-gradient-to-t from-[#ff2b5e] to-[#5fb6ff]"
        style={{
          bottom: `${bottomPct}%`,
          top: "8%",
        }}
      />

      {/* Spider-Man figure */}
      <motion.div
        className="absolute right-[-2px]"
        style={{ bottom: `${bottomPct - 2}%` }}
        animate={stepping ? { x: [0, 2, -2, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
          {/* web line going up */}
          <line
            x1="11"
            y1="0"
            x2="11"
            y2="6"
            stroke="#5fb6ff"
            strokeWidth="0.8"
            strokeDasharray="1.5 1"
          />
          {/* body */}
          <ellipse cx="11" cy="18" rx="4.5" ry="6" fill="#cc1122" />
          {/* head */}
          <circle cx="11" cy="10" r="4" fill="#cc1122" />
          {/* eyes */}
          <ellipse cx="9" cy="9.2" rx="1.6" ry="1.3" fill="white" />
          <ellipse cx="13" cy="9.2" rx="1.6" ry="1.3" fill="white" />
          {/* web on chest */}
          <path
            d="M6.5 15 Q11 17.5 15.5 15"
            stroke="#8b0000"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M6 18 Q11 21 16 18"
            stroke="#8b0000"
            strokeWidth="0.6"
            fill="none"
          />
          {/* arms */}
          <motion.line
            x1="6.5"
            y1="13"
            x2="1"
            y2={stepping ? "9" : "11"}
            stroke="#cc1122"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <motion.line
            x1="15.5"
            y1="13"
            x2="21"
            y2={stepping ? "9" : "11"}
            stroke="#cc1122"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* legs */}
          <motion.line
            x1="7"
            y1="22"
            x2="2"
            y2={stepping ? "28" : "26"}
            stroke="#cc1122"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <motion.line
            x1="15"
            y1="22"
            x2="20"
            y2={stepping ? "28" : "26"}
            stroke="#cc1122"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
