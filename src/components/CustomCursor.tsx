import { useEffect, useRef } from "react";

interface Point { x: number; y: number; age: number }
interface Ring  { x: number; y: number; r: number; opacity: number }

export function CustomCursor() {
  const orbRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);  // web trail
  const senseRef  = useRef<HTMLCanvasElement>(null);  // spider-sense idle rings

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout>;
    let isIdle = false;
    const rings: Ring[] = [];

    // web trail
    const MAX_PTS = 28;
    const trail: Point[] = [];

    const canvas = canvasRef.current!;
    const sense  = senseRef.current!;
    canvas.width  = sense.width  = window.innerWidth;
    canvas.height = sense.height = window.innerHeight;
    const ctx  = canvas.getContext("2d")!;
    const sCtx = sense.getContext("2d")!;

    // ── event handlers ───────────────────────────────────
    const resetIdle = () => {
      isIdle = false;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { isIdle = true; }, 2000);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${mx - 7}px, ${my - 7}px)`;
      }
      trail.push({ x: mx, y: my, age: 0 });
      if (trail.length > MAX_PTS) trail.shift();
      resetIdle();
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,[data-cursor='hover']");
      if (ringRef.current) {
        ringRef.current.style.width  = interactive ? "64px" : "38px";
        ringRef.current.style.height = interactive ? "64px" : "38px";
        ringRef.current.style.borderColor = interactive
          ? "color-mix(in oklab, var(--crimson) 80%, transparent)"
          : "color-mix(in oklab, var(--electric) 60%, transparent)";
      }
    };

    const onResize = () => {
      canvas.width  = sense.width  = window.innerWidth;
      canvas.height = sense.height = window.innerHeight;
    };

    // ── animation loop ────────────────────────────────────
    let senseFrame = 0;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
      }

      // ── web strand trail ──
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const t0 = trail[i - 1];
          const t1 = trail[i];
          const alpha = (i / trail.length) * 0.5;
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          const bx = (t0.x + t1.x) / 2 + (Math.random() - 0.5) * 1.5;
          const by = (t0.y + t1.y) / 2 + 2;
          ctx.quadraticCurveTo(bx, by, t1.x, t1.y);
          ctx.strokeStyle = `rgba(95, 182, 255, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
      for (const pt of trail) pt.age++;
      while (trail.length && trail[0].age > MAX_PTS) trail.shift();

      // ── spider-sense idle rings ──
      senseFrame++;
      // spawn a new ring every 30 frames while idle
      if (isIdle && senseFrame % 30 === 0) {
        rings.push({ x: mx, y: my, r: 4, opacity: 0.85 });
      }

      sCtx.clearRect(0, 0, sense.width, sense.height);
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r       += 3.5;
        ring.opacity -= 0.028;
        if (ring.opacity <= 0) { rings.splice(i, 1); continue; }
        sCtx.beginPath();
        sCtx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        sCtx.strokeStyle = `rgba(255, 43, 94, ${ring.opacity})`;
        sCtx.lineWidth = 1.2;
        sCtx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onResize);
    resetIdle();
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <>
      {/* web-strand trail */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9996] hidden md:block"
        style={{ mixBlendMode: "screen" }}
      />
      {/* spider-sense idle rings */}
      <canvas
        ref={senseRef}
        className="pointer-events-none fixed inset-0 z-[9995] hidden md:block"
        style={{ mixBlendMode: "screen" }}
      />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
      <div ref={orbRef}  className="cursor-orb  hidden md:block" />
    </>
  );
}
