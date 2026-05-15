import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import vigilante from "@/assets/hero-vigilante.png";
import unmasked from "@/assets/hero-unmasked.png";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skyShift = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Sequence: swing -> land -> mask off -> text in
  const [phase, setPhase] = useState<"swing" | "land" | "reveal" | "done">(
    "swing",
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("land"), 1700);
    const t2 = setTimeout(() => setPhase("reveal"), 2900);
    const t3 = setTimeout(() => setPhase("done"), 3900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Web-line that shoots from corner */}
      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="0"
          y1="0"
          x2="50"
          y2="50"
          stroke="oklch(0.96 0.01 250 / 0.7)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.3] }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 4px var(--electric))" }}
        />
      </motion.svg>

      <motion.div
        style={{ y: skyShift, opacity: heroFade }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-32 md:py-40"
      >
        {/* Avatar centerpiece */}
        <div className="relative flex h-[60svh] w-full items-center justify-center md:h-[70svh]">
          {/* Halo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: phase === "swing" ? 0.7 : 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute size-[420px] rounded-full opacity-60 blur-3xl md:size-[560px]"
            style={{ background: "var(--gradient-aurora)" }}
          />

          {/* Masked swing-in */}
          <motion.img
            src={vigilante}
            alt=""
            initial={{
              x: "-60vw",
              y: "-50vh",
              rotate: -28,
              scale: 0.7,
              opacity: 0,
            }}
            animate={
              phase === "swing"
                ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                : phase === "land"
                  ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                  : { opacity: 0, scale: 1.05, filter: "blur(10px)" }
            }
            transition={{
              duration: phase === "swing" ? 1.6 : 0.6,
              ease:
                phase === "swing"
                  ? [0.22, 1.2, 0.36, 1]
                  : [0.4, 0, 0.2, 1],
            }}
            className="absolute z-20 h-[80%] w-auto select-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
            draggable={false}
          />

          {/* Unmasked reveal */}
          <motion.img
            src={unmasked}
            alt="Rajat Trehan"
            initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            animate={
              phase === "reveal" || phase === "done"
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 1.05, filter: "blur(20px)" }
            }
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute z-20 h-[78%] w-auto select-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
            draggable={false}
          />

          {/* Impact ring */}
          {phase !== "swing" && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="absolute size-72 rounded-full border border-[var(--electric)]"
              style={{ boxShadow: "var(--shadow-glow-blue)" }}
            />
          )}

          {/* Orbit ring */}
          <div className="absolute size-[500px] rounded-full border border-foreground/5 md:size-[640px]" />
          <div className="absolute size-[420px] animate-spin-slower rounded-full border border-dashed border-foreground/10 md:size-[540px]" />
        </div>

        {/* Text reveal */}
        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-6 text-center md:grid-cols-[1fr_auto_1fr] md:text-left">
          {/* Left tagline */}
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

          {/* Center name */}
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

          {/* Right meta */}
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

        {/* Scroll cue */}
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
