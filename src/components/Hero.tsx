import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import swingAvatar from "@/assets/hero-swing.png";

/**
 * Unified cinematic hero.
 * One avatar, one pendulum rig — the web, the body, the shadow and lighting all
 * move together as a single physical system. After landing, the entire scene
 * reacts subtly to the mouse for cinematic depth.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroLift = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const [phase, setPhase] = useState<"swing" | "land" | "done">("swing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("land"), 2200);
    const t2 = setTimeout(() => setPhase("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Mouse parallax — subtle, only after landing.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (phase !== "done") return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [phase, mx, my]);

  const bgX = useTransform(sx, (v) => v * -18);
  const bgY = useTransform(sy, (v) => v * -10);
  const avatarRotY = useTransform(sx, (v) => v * 6);
  const avatarRotX = useTransform(sy, (v) => v * -4);
  const avatarX = useTransform(sx, (v) => v * 12);
  const avatarY = useTransform(sy, (v) => v * 8);
  const lightX = useTransform(sx, (v) => 50 + v * 20);
  const lightY = useTransform(sy, (v) => 30 + v * 15);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Cinematic atmospheric light that follows the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: useTransform(
            [lightX, lightY] as never,
            ([lx, ly]: number[]) =>
              `radial-gradient(ellipse 70% 55% at ${lx}% ${ly}%, color-mix(in oklab, var(--electric) 16%, transparent), transparent 65%), radial-gradient(ellipse 50% 40% at ${100 - lx}% ${100 - ly}%, color-mix(in oklab, var(--crimson) 14%, transparent), transparent 70%)`,
          ),
        }}
      />

      {/* Background parallax wrapper */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ x: bgX, y: bgY }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "var(--gradient-hero)" }}
        />
      </motion.div>

      <motion.div
        style={{ y: heroLift, opacity: heroFade }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-32 md:py-40"
      >
        {/* === Unified pendulum scene === */}
        <UnifiedSwing
          phase={phase}
          parallax={{ x: avatarX, y: avatarY, rx: avatarRotX, ry: avatarRotY }}
        />

        {/* Text reveal */}
        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            animate={
              phase === "done"
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -40 }
            }
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-2 md:text-right"
          >
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--electric)]/80">
              Earth-1610
            </p>
            <p className="text-sm text-muted-foreground">
              Building immersive
              <br className="hidden md:block" /> digital experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              phase === "done"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.94 }
            }
            transition={{ duration: 1.1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative shrink-0"
          >
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              <span className="block text-gradient-aurora">RAJAT</span>
              <span className="block text-gradient-aurora">TREHAN</span>
            </h1>
            <div className="mt-3 flex items-center gap-2 md:justify-center">
              <span className="h-px w-8 bg-[var(--crimson)]" />
              <p className="font-mono text-xs uppercase tracking-[0.5em] text-foreground/80">
                Full Stack Developer
              </p>
              <span className="h-px w-8 bg-[var(--electric)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            animate={
              phase === "done"
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: 40 }
            }
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-2"
          >
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--crimson)]/80">
              Variant // 001
            </p>
            <p className="text-sm text-muted-foreground">
              Crafting interfaces at the
              <br className="hidden md:block" /> intersection of code and cinema.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "done" ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50"
        >
          ▼ traverse the web
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- Unified swing rig ---------- */

type SwingProps = {
  phase: "swing" | "land" | "done";
  parallax: {
    x: ReturnType<typeof useTransform>;
    y: ReturnType<typeof useTransform>;
    rx: ReturnType<typeof useTransform>;
    ry: ReturnType<typeof useTransform>;
  };
};

function UnifiedSwing({ phase, parallax }: SwingProps) {
  // Pivot anchor: starts at top-left (where the web fires from), then slides
  // toward the top-center as the swing arcs across the viewport.
  // Both the rope and the avatar are children of this pivot — they move as one.
  const pivot = phase === "swing"
    ? { left: "12%", top: "6%" }
    : { left: "50%", top: "10%" };

  return (
    <div className="pointer-events-none relative h-[68svh] w-full md:h-[78svh]">
      {/* Atmospheric halo behind the avatar — shares the same scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: phase === "swing" ? 0.35 : 0.7, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute left-1/2 top-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:size-[680px]"
        style={{ background: "var(--gradient-aurora)" }}
      />

      {/* Pivot — origin point of the energy strand */}
      <motion.div
        animate={pivot}
        transition={{ duration: 2.0, ease: [0.22, 0.9, 0.28, 1] }}
        className="absolute"
        style={{ transformOrigin: "top center" }}
      >
        {/* Pendulum group — rotates around the pivot */}
        <motion.div
          initial={{ rotate: -55 }}
          animate={
            phase === "swing"
              ? { rotate: [-55, 28, -14, 6, -2, 0] }
              : phase === "land"
                ? { rotate: [0, 1.5, -1, 0.6, 0] }
                : { rotate: 0 }
          }
          transition={
            phase === "swing"
              ? { duration: 2.2, ease: [0.22, 0.9, 0.28, 1], times: [0, 0.45, 0.7, 0.85, 0.95, 1] }
              : phase === "land"
                ? { duration: 0.9, ease: "easeOut" }
                : { duration: 0.6 }
          }
          style={{ transformOrigin: "top center" }}
          className="relative"
        >
          {/* Energy strand (the "web") — anchors avatar's raised hand to pivot */}
          <EnergyStrand phase={phase} />

          {/* Avatar — its raised hand sits exactly where the strand ends */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: "var(--strand-length, 220px)",
              x: phase === "done" ? parallax.x : 0,
              y: phase === "done" ? parallax.y : 0,
              rotateY: phase === "done" ? parallax.ry : 0,
              rotateX: phase === "done" ? parallax.rx : 0,
              transformPerspective: 1200,
            }}
          >
            {/* Idle breathing + tiny landing bounce */}
            <motion.div
              animate={
                phase === "done"
                  ? { y: [0, -6, 0], scale: [1, 1.01, 1] }
                  : phase === "land"
                    ? { y: [0, -10, 0, -3, 0] }
                    : { y: 0 }
              }
              transition={
                phase === "done"
                  ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.9, ease: "easeOut" }
              }
              className="relative"
            >
              <img
                src={swingAvatar}
                alt="Rajat Trehan — futuristic vigilante"
                width={1024}
                height={1536}
                draggable={false}
                className="h-[58svh] w-auto select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.75)] md:h-[68svh]"
                style={{
                  // Avatar's raised hand is roughly at top-center of the PNG,
                  // shifted slightly right. Anchor that point to the strand.
                  transform: "translate(-46%, 0)",
                }}
              />
              {/* Subtle ground shadow that breathes with the avatar */}
              <div
                aria-hidden
                className="absolute -bottom-6 left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] opacity-50 blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse, oklch(0 0 0 / 0.7), transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Impact ring — fired the instant the swing settles */}
      {phase !== "swing" && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--electric)]"
          style={{ boxShadow: "var(--shadow-glow-blue)" }}
        />
      )}
    </div>
  );
}

/* ---------- Energy strand (the web line that holds the avatar) ---------- */

function EnergyStrand({ phase }: { phase: "swing" | "land" | "done" }) {
  // Strand length matches `--strand-length` consumed by the avatar offset.
  const length = 220;
  return (
    <div
      className="relative left-1/2 -translate-x-1/2"
      style={{ width: 4, height: length, ["--strand-length" as never]: `${length}px` }}
    >
      {/* Core glowing line */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{
          scaleY: 1,
          opacity: phase === "done" ? 0.55 : 0.95,
        }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          transformOrigin: "top center",
          background:
            "linear-gradient(to bottom, oklch(0.99 0.02 240) 0%, var(--electric) 30%, color-mix(in oklab, var(--electric) 40%, transparent) 100%)",
          boxShadow:
            "0 0 8px var(--electric), 0 0 18px color-mix(in oklab, var(--electric) 60%, transparent)",
          filter: "blur(0.4px)",
        }}
        className="absolute inset-0 mx-auto w-[2px] rounded-full"
      />
      {/* Subtle outer aura */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: phase === "done" ? 0.25 : 0.5 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          transformOrigin: "top center",
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--electric) 50%, transparent), transparent)",
          filter: "blur(3px)",
        }}
        className="absolute inset-0 mx-auto w-[10px] rounded-full"
      />
    </div>
  );
}
