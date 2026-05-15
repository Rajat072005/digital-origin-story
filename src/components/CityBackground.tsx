import { useEffect, useRef } from "react";
import skyline from "@/assets/skyline.jpg";

/**
 * Cinematic atmosphere: skyline parallax + canvas rain + drifting particles.
 * Pure presentation — no interactivity logic.
 */
export function CityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const drops = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: 8 + Math.random() * 18,
      v: 6 + Math.random() * 10,
      o: 0.15 + Math.random() * 0.35,
    }));
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.6,
      vy: -0.1 - Math.random() * 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      o: 0.1 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? 220 : 350,
    }));

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      // rain
      ctx.strokeStyle = "rgba(180, 210, 255, 0.35)";
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.globalAlpha = d.o;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.l);
        ctx.stroke();
        d.y += d.v;
        d.x -= 0.5;
        if (d.y > h) {
          d.y = -d.l;
          d.x = Math.random() * w;
        }
      }
      // particles
      for (const p of particles) {
        ctx.globalAlpha = p.o;
        ctx.fillStyle = `hsl(${p.hue} 90% 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Skyline */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${skyline})` }}
      />
      {/* Color washes */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      {/* Lightning flash */}
      <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-lightning" />
      {/* Rain canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Web corners */}
      <svg
        className="absolute -top-10 -left-10 w-72 h-72 opacity-30"
        viewBox="0 0 200 200"
        fill="none"
      >
        <g stroke="oklch(0.74 0.19 240)" strokeWidth="0.5" opacity="0.6">
          <path d="M0 0 L200 200" />
          <path d="M0 40 L160 200" />
          <path d="M0 80 L120 200" />
          <path d="M40 0 L200 160" />
          <path d="M80 0 L200 120" />
          <circle cx="0" cy="0" r="40" />
          <circle cx="0" cy="0" r="80" />
          <circle cx="0" cy="0" r="120" />
        </g>
      </svg>
      <svg
        className="absolute -top-10 -right-10 w-72 h-72 opacity-25 rotate-90"
        viewBox="0 0 200 200"
        fill="none"
      >
        <g stroke="oklch(0.58 0.24 25)" strokeWidth="0.5" opacity="0.6">
          <path d="M0 0 L200 200" />
          <path d="M0 40 L160 200" />
          <path d="M0 80 L120 200" />
          <path d="M40 0 L200 160" />
          <path d="M80 0 L200 120" />
          <circle cx="0" cy="0" r="40" />
          <circle cx="0" cy="0" r="80" />
          <circle cx="0" cy="0" r="120" />
        </g>
      </svg>
      {/* Scanlines + noise */}
      <div className="absolute inset-0 scanlines opacity-30" />
      <div className="absolute inset-0 noise opacity-40" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.012 270 / 0.85) 100%)",
        }}
      />
    </div>
  );
}
