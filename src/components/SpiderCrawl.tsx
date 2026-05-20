import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ── tiny SVG spider ──────────────────────────────────── */
function SpiderSVG({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        transform: flipped ? "scaleX(-1)" : "scaleX(1)",
        filter: "drop-shadow(0 0 3px rgba(255,43,94,0.7))",
      }}
      aria-hidden
    >
      {/* abdomen */}
      <ellipse cx="10" cy="13" rx="3.8" ry="5" fill="#cc1122" />
      {/* web pattern on abdomen */}
      <path d="M6.5 11 Q10 13.5 13.5 11" stroke="#8b0000" strokeWidth="0.6" fill="none" />
      <path d="M6.2 13.5 Q10 16.5 13.8 13.5" stroke="#8b0000" strokeWidth="0.6" fill="none" />
      {/* cephalothorax (head) */}
      <ellipse cx="10" cy="6.5" r="3.2" fill="#cc1122" />
      {/* eyes */}
      <ellipse cx="8.2" cy="5.6" rx="1.3" ry="1.1" fill="white" />
      <ellipse cx="11.8" cy="5.6" rx="1.3" ry="1.1" fill="white" />
      <ellipse cx="8.2" cy="5.6" rx="0.6" ry="0.5" fill="#111" />
      <ellipse cx="11.8" cy="5.6" rx="0.6" ry="0.5" fill="#111" />
      {/* left legs — 4 */}
      <line x1="6.2" y1="8"  x2="1"   y2="5"  stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="6.2" y1="10" x2="0.5" y2="10" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="6.2" y1="12" x2="1"   y2="15" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="6.2" y1="14" x2="2"   y2="18" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      {/* right legs — 4 */}
      <line x1="13.8" y1="8"  x2="19"   y2="5"  stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="13.8" y1="10" x2="19.5" y2="10" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="13.8" y1="12" x2="19"   y2="15" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="13.8" y1="14" x2="18"   y2="18" stroke="#aa0011" strokeWidth="1.1" strokeLinecap="round" />
      {/* web thread above */}
      <line x1="10" y1="0" x2="10" y2="3.3" stroke="#cc1122" strokeWidth="0.8" strokeDasharray="1 1" />
    </svg>
  );
}

/* ── wrapper button — drop-in replacement for <button> ── */
interface SpiderCrawlButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: "button" | "div";
}

export function SpiderCrawlButton({
  children,
  className = "",
  as: Tag = "button",
  ...props
}: SpiderCrawlButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [goingRight, setGoingRight] = useState(true);
  const flipTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovered) {
      // flip direction every 900 ms while hovered
      flipTimer.current = setInterval(() => setGoingRight((g) => !g), 900);
    } else {
      if (flipTimer.current) clearInterval(flipTimer.current);
      setGoingRight(true);
    }
    return () => {
      if (flipTimer.current) clearInterval(flipTimer.current);
    };
  }, [hovered]);

  return (
    <Tag
      className={`relative overflow-visible group ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...(props as any)}
    >
      {children}

      <AnimatePresence>
        {hovered && (
          <motion.span
            key="spider"
            className="pointer-events-none absolute"
            style={{ top: "-22px", left: 0, zIndex: 50 }}
            initial={{ x: goingRight ? "0%" : "calc(100% - 20px)", opacity: 0 }}
            animate={{
              x: goingRight ? "calc(100% - 20px)" : "0%",
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "linear" }}
            aria-hidden
          >
            <SpiderSVG flipped={!goingRight} />
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
}
