import { motion } from "motion/react";
import { useState } from "react";

const MODULES = [
  { name: "React.js", role: "Frontend Neural System", angle: 0 },
  { name: "Node.js", role: "Backend Processing Core", angle: 60 },
  { name: "MongoDB", role: "Memory Storage Unit", angle: 120 },
  { name: "Tailwind", role: "UI Rendering Engine", angle: 180 },
  { name: "TypeScript", role: "Type Integrity Shield", angle: 240 },
  { name: "Next.js", role: "Spatial Routing Mesh", angle: 300 },
];

export function NeuralInterface() {
  const [active, setActive] = useState<number | null>(null);
  const radius = 220;

  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--electric)]">
            // suit_os.v1
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Neural interface.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            A holographic chamber of modules that power the suit. Each tech is a
            subsystem orbiting the spider-core reactor.
          </p>
        </motion.div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[640px] items-center justify-center">
          {/* Outer rings */}
          <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-foreground/10" />
          <div className="absolute inset-8 animate-spin-slow rounded-full border border-foreground/10" />
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="oklch(0.74 0.19 240 / 0.3)"
              strokeWidth="0.2"
              strokeDasharray="2 4"
            />
          </svg>

          {/* Core reactor */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            className="relative flex size-40 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--electric) 60%, transparent), transparent 70%)",
              boxShadow: "var(--shadow-glow-blue)",
            }}
          >
            <div className="absolute inset-2 rounded-full border border-[var(--electric)]/40" />
            <div className="absolute inset-6 rounded-full border border-[var(--crimson)]/40" />
            <svg viewBox="0 0 100 100" className="size-24">
              <g
                fill="none"
                stroke="oklch(0.96 0.01 250 / 0.9)"
                strokeWidth="1"
              >
                <circle cx="50" cy="50" r="6" />
                <path d="M50 8 L50 92 M8 50 L92 50 M20 20 L80 80 M80 20 L20 80" />
              </g>
            </svg>
          </motion.div>

          {/* Modules */}
          {MODULES.map((m, i) => {
            const rad = (m.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = active === i;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                data-cursor="hover"
                className="absolute"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {/* connecting web */}
                <svg
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[2px] origin-left"
                  style={{
                    width: radius,
                    transform: `translateY(-1px) rotate(${m.angle + 180}deg)`,
                  }}
                >
                  <line
                    x1="0"
                    y1="1"
                    x2={radius}
                    y2="1"
                    stroke="oklch(0.74 0.19 240 / 0.4)"
                    strokeWidth="0.6"
                    strokeDasharray="2 3"
                  />
                </svg>

                <motion.div
                  animate={{
                    scale: isActive ? 1.08 : 1,
                    boxShadow: isActive
                      ? "0 0 30px var(--electric)"
                      : "0 0 0 rgba(0,0,0,0)",
                  }}
                  className="group relative -translate-x-1/2 -translate-y-1/2 cursor-none rounded-xl border border-foreground/15 bg-background/70 px-4 py-3 backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[var(--electric)] shadow-[0_0_8px_var(--electric)]" />
                    <span className="font-mono text-xs font-semibold tracking-wider">
                      {m.name}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-all duration-300 ${
                      isActive ? "mt-1 max-h-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {m.role}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
