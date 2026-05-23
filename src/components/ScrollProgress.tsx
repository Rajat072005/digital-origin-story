import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { SleekSpiderSVG } from "./SpiderCrawl";

/* descending wall-crawling Spider-Man progress indicator */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [stepping, setStepping] = useState(false);
  const lastY = useRef(0);
  const stepTimer = useRef<any>(null);

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

  return (
    <div
      className="pointer-events-none fixed right-8 top-0 bottom-0 z-50 hidden md:flex flex-col items-center"
      aria-hidden
    >
      {/* progress track (empty web) */}
      <div className="absolute right-0 top-[8%] bottom-[8%] w-px bg-white/5" />
      
      {/* filled track — grows downward from the top */}
      <motion.div
        className="absolute right-0 w-px bg-gradient-to-b from-[#5fb6ff] to-[#ff2b5e]"
        style={{
          top: "8%",
          height: `${progress * 84}%`,
        }}
      />

      {/* Sleek Spider figure */}
      <motion.div
        className="absolute right-[-11px]"
        style={{ top: `calc(8% + ${progress * 84}% - 12px)` }}
        animate={stepping ? { x: [0, 2, -2, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <SleekSpiderSVG className="w-6 h-6 rotate-180 drop-shadow-[0_0_8px_rgba(255,43,94,0.6)]" />
      </motion.div>
    </div>
  );
}
