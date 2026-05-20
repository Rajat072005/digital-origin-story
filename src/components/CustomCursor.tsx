import { useEffect, useRef } from "react";

interface Point { x: number; y: number; age: number }

export function CustomCursor() {
  const orbRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    // web trail points
    const MAX_PTS = 28;
    const trail: Point[] = [];

    const canvas = canvasRef.current!;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d")!;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${mx - 7}px, ${my - 7}px)`;
      }
      // add trail point
      trail.push({ x: mx, y: my, age: 0 });
      if (trail.length > MAX_PTS) trail.shift();
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
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
      }

      // draw web trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const t0 = trail[i - 1];
          const t1 = trail[i];
          const alpha = (i / trail.length) * 0.55;
          ctx.beginPath();
          ctx.moveTo(t0.x, t0.y);
          // slight quadratic bow to mimic web strand
          const mx2 = (t0.x + t1.x) / 2 + (Math.random() - 0.5) * 2;
          const my2 = (t0.y + t1.y) / 2 + 2;
          ctx.quadraticCurveTo(mx2, my2, t1.x, t1.y);
          ctx.strokeStyle = `rgba(95, 182, 255, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // age + prune trail
      for (const pt of trail) pt.age++;
      while (trail.length && trail[0].age > MAX_PTS) trail.shift();

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* web-strand trail canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9997] hidden md:block"
        style={{ mixBlendMode: "screen" }}
      />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
      <div ref={orbRef}  className="cursor-orb  hidden md:block" />
    </>
  );
}
