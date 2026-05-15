import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LINES = [
  "[ EARTH-1610 :: CONNECTED ]",
  "Synchronizing neural interface...",
  "Loading digital web systems...",
  "Initializing variant: Rajat_Trehan.exe",
];

export function IntroLoader({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState<number>(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (shown < LINES.length) {
      const t = setTimeout(() => setShown((n) => n + 1), 520);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setClosing(true), 700);
    const t2 = setTimeout(onDone, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shown, onDone]);

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.05_0.012_270)]"
        >
          {/* scan line */}
          <div className="pointer-events-none absolute left-0 right-0 h-px bg-[color-mix(in_oklab,var(--electric)_70%,transparent)] animate-scan opacity-60" />
          <div className="relative w-full max-w-2xl px-8 font-mono text-sm md:text-base">
            <div className="mb-6 flex items-center gap-3 text-xs text-muted-foreground/80">
              <span className="size-2 animate-pulse rounded-full bg-[var(--electric)] shadow-[0_0_12px_var(--electric)]" />
              <span className="tracking-[0.3em] uppercase">SYS//BOOT</span>
              <span className="ml-auto opacity-60">v.1.61.0</span>
            </div>
            <div className="space-y-3">
              {LINES.slice(0, shown).map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-[var(--electric)] opacity-70">{">"}</span>
                  <span
                    className={
                      i === LINES.length - 1
                        ? "glitch text-foreground"
                        : "text-foreground/80"
                    }
                    data-text={l}
                  >
                    {l}
                  </span>
                </motion.div>
              ))}
              {shown < LINES.length && (
                <span className="inline-block h-4 w-2 animate-pulse bg-[var(--electric)] align-bottom" />
              )}
            </div>
            <div className="mt-10 h-px w-full overflow-hidden bg-foreground/10">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-[var(--electric)] to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
