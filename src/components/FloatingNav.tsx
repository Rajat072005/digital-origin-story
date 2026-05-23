import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { id: "#about", label: "About", icon: "◆" },
  { id: "#skills", label: "Skills", icon: "◎" },
  { id: "#projects", label: "Projects", icon: "◈" },
  { id: "#contact", label: "Contact", icon: "◉" },
];

/**
 * Fixed floating dot-nav that highlights the active section.
 * Positioned on the right edge, visible on md+ screens only.
 */
export function FloatingNav() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Show nav only after hero leaves viewport
  useEffect(() => {
    const hero = document.querySelector("section");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Track which section is active
  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.querySelector(n.id)).filter(Boolean);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sections.forEach(s => observerRef.current?.observe(s!));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="pointer-events-auto fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-end gap-4"
        >
          {/* back-to-top */}
          <button
            onClick={scrollTop}
            data-cursor="hover"
            className="group flex items-center gap-2 cursor-none mb-2"
            aria-label="Back to top"
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Top
            </span>
            <span className="size-3 rounded-full border border-[#5fb6ff]/40 flex items-center justify-center group-hover:border-[#5fb6ff] transition-colors duration-200">
              <svg width="6" height="6" viewBox="0 0 6 6">
                <path d="M3 5 L3 1 M1 3 L3 1 L5 3" stroke="#5fb6ff" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </button>

          {/* divider line */}
          <div className="w-px h-6 bg-white/10 self-end mr-1.5" />

          {/* section dots */}
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={item.id}
                data-cursor="hover"
                className="group flex items-center gap-2.5 cursor-none"
                aria-label={item.label}
              >
                <motion.span
                  className="font-mono text-[8px] uppercase tracking-widest transition-all duration-200"
                  animate={{ opacity: isActive ? 0.9 : 0, x: isActive ? 0 : 4 }}
                  initial={false}
                  style={{ color: isActive ? "#5fb6ff" : "rgba(255,255,255,0.4)" }}
                >
                  {item.label}
                </motion.span>

                <motion.span
                  className="relative flex items-center justify-center"
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* active ring */}
                  {isActive && (
                    <motion.span
                      className="absolute inset-[-4px] rounded-full border border-[#5fb6ff]/40"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  )}
                  <span
                    className="size-2 rounded-full transition-all duration-300 group-hover:scale-125"
                    style={{
                      background: isActive ? "#5fb6ff" : "rgba(255,255,255,0.2)",
                      boxShadow: isActive ? "0 0 10px #5fb6ff, 0 0 20px rgba(95,182,255,0.4)" : "none",
                    }}
                  />
                </motion.span>
              </a>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
