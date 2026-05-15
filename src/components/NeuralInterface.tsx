import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

const MODULES = [
  { name: "React.js", role: "Frontend Neural System", angle: -90 },
  { name: "Next.js", role: "Spatial Routing Mesh", angle: -30 },
  { name: "Node.js", role: "Backend Processing Core", angle: 30 },
  { name: "MongoDB", role: "Memory Storage Unit", angle: 90 },
  { name: "Tailwind", role: "UI Rendering Engine", angle: 150 },
  { name: "GSAP", role: "Motion Synthesis Layer", angle: 210 },
];

/**
 * Neural Core Interface — a holographic energy core with tech modules
 * orbiting it. Hovering a module fires a glowing connector and reveals a
 * minimal floating panel. Designed to feel cinematic and restrained, not like
 * a dashboard.
 */
export function NeuralInterface() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [size, setSize] = useState(560);

  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.clientWidth ?? 560;
      setSize(Math.min(640, Math.max(360, w)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const radius = size * 0.42;
  const coreSize = size * 0.28;

  // Subtle parallax on the entire core
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const tiltX = useTransform(sy, (v) => v * -6);
  const tiltY = useTransform(sx, (v) => v * 6);

  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[var(--electric)]">
            // neural_core.v2
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Neural Core Interface.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            A holographic reactor of subsystems. Each module is a node wired
            into the core — hover to surface its function.
          </p>
        </motion.div>

        <div
          ref={wrapRef}
          onMouseMove={(e) => {
            const r = wrapRef.current?.getBoundingClientRect();
            if (!r) return;
            mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
            my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
          }}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          className="relative mx-auto flex aspect-square w-full max-w-[640px] items-center justify-center"
        >
          <motion.div
            style={{
              rotateX: tiltX,
              rotateY: tiltY,
              transformPerspective: 1400,
            }}
            className="relative h-full w-full"
          >
            {/* Connector layer (renders behind nodes) */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`-${size / 2} -${size / 2} ${size} ${size}`}
            >
              {MODULES.map((m, i) => {
                const rad = (m.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const isActive = active === i;
                return (
                  <motion.line
                    key={m.name}
                    x1={0}
                    y1={0}
                    x2={x}
                    y2={y}
                    stroke={
                      isActive
                        ? "oklch(0.99 0.02 240 / 0.95)"
                        : "oklch(0.74 0.19 240 / 0.35)"
                    }
                    strokeWidth={isActive ? 1.2 : 0.6}
                    strokeDasharray={isActive ? "0" : "2 4"}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.15 * i }}
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 0 6px var(--electric))"
                        : "none",
                      transition: "stroke 0.3s, stroke-width 0.3s, filter 0.3s",
                    }}
                  />
                );
              })}
            </svg>

            {/* Outer atmospheric aura */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full opacity-40 blur-3xl"
              style={{ background: "var(--gradient-aurora)" }}
            />

            {/* Concentric rings */}
            <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-foreground/10" />
            <div className="absolute inset-[10%] animate-spin-slow rounded-full border border-foreground/10" />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[18%] rounded-full border border-[var(--electric)]/15"
            />

            {/* Segmented ring with tick marks */}
            <svg
              className="absolute inset-[6%] h-[88%] w-[88%] -rotate-90 animate-spin-slower"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="oklch(0.74 0.19 240 / 0.45)"
                strokeWidth="0.25"
                strokeDasharray="0.6 4"
              />
            </svg>

            {/* === Core reactor === */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: coreSize, height: coreSize }}
            >
              {/* pulse halo */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--electric) 70%, transparent) 0%, transparent 65%)",
                  filter: "blur(8px)",
                }}
              />
              {/* layered rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 rounded-full border border-[var(--electric)]/40" />
                <div className="absolute inset-[10%] rounded-full border border-[var(--electric)]/30" />
                <div className="absolute inset-[22%] rounded-full border border-[var(--crimson)]/30" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[14%] rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, color-mix(in oklab, var(--electric) 60%, transparent) 18%, transparent 32%, transparent 60%, color-mix(in oklab, var(--crimson) 50%, transparent) 76%, transparent 90%)",
                  mask: "radial-gradient(circle, transparent 55%, black 56%, black 100%)",
                  WebkitMask:
                    "radial-gradient(circle, transparent 55%, black 56%, black 100%)",
                }}
              />
              {/* core nucleus */}
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[28%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.99 0.02 240) 0%, var(--electric) 30%, oklch(0.30 0.12 250) 70%, transparent 100%)",
                  boxShadow:
                    "0 0 40px var(--electric), 0 0 80px color-mix(in oklab, var(--electric) 60%, transparent), inset 0 0 20px oklch(0.99 0.02 240 / 0.6)",
                }}
              />
              {/* drifting particles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 size-1 rounded-full bg-[var(--electric)]"
                  style={{ boxShadow: "0 0 6px var(--electric)" }}
                  animate={{
                    x: [0, Math.cos(i) * 40, 0],
                    y: [0, Math.sin(i * 1.3) * 40, 0],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 4 + i * 0.6,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

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
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  data-cursor="hover"
                  className="absolute left-1/2 top-1/2"
                  style={{ x, y }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.06 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                    className="group relative -translate-x-1/2 -translate-y-1/2 cursor-none"
                  >
                    {/* Node halo */}
                    <motion.div
                      animate={{
                        opacity: isActive ? 0.9 : 0.35,
                        scale: isActive ? 1.4 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 -z-10 rounded-full blur-xl"
                      style={{
                        background:
                          "radial-gradient(circle, var(--electric), transparent 70%)",
                      }}
                    />
                    <div className="rounded-xl border border-foreground/15 bg-background/60 px-4 py-3 backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <motion.span
                          animate={{
                            scale: isActive ? [1, 1.4, 1] : 1,
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: isActive ? Infinity : 0,
                          }}
                          className="size-1.5 rounded-full bg-[var(--electric)] shadow-[0_0_10px_var(--electric)]"
                        />
                        <span className="font-mono text-xs font-semibold tracking-wider">
                          {m.name}
                        </span>
                      </div>
                    </div>

                    {/* Holographic floating panel on hover */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 8 : 4,
                        scale: isActive ? 1 : 0.96,
                      }}
                      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                      className="pointer-events-none absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 rounded-lg border border-[var(--electric)]/30 bg-background/85 p-3 backdrop-blur-xl"
                      style={{
                        boxShadow:
                          "0 12px 30px -10px oklch(0 0 0 / 0.6), 0 0 24px color-mix(in oklab, var(--electric) 25%, transparent)",
                      }}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--electric)]/80">
                        Subsystem
                      </div>
                      <div className="mt-1 text-xs text-foreground/90">
                        {m.role}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-[var(--electric)]" />
                        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
                          ONLINE
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
