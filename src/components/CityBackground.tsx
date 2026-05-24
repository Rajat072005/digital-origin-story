import { useEffect, useRef, useState } from "react";
import skyline from "@/assets/skyline.jpg";

/**
 * Cinematic atmosphere:
 *  - Scroll-driven parallax on the skyline (buildings + colour washes move at different speeds)
 *  - Canvas rain that accelerates on fast scroll
 *  - Drifting ambient particles
 *  - Organic spider-web corners that draw themselves in
 */
export function CityBackground() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const skyRef     = useRef<HTMLDivElement>(null);
  const wash1Ref   = useRef<HTMLDivElement>(null);
  const wash2Ref   = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollVel   = useRef(0);

  /* ── scroll parallax (Direct DOM updates for lag-free rendering) ── */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      scrollVel.current = Math.abs(sy - lastScrollY.current);
      lastScrollY.current = sy;
      
      if (skyRef.current) {
        skyRef.current.style.transform = `translateY(${sy * 0.08}px)`;
      }
      if (wash1Ref.current) {
        wash1Ref.current.style.transform = `translateY(${sy * 0.18}px)`;
      }
      if (wash2Ref.current) {
        wash2Ref.current.style.transform = `translateY(${sy * 0.30}px)`;
      }
    };

    // Initial positioning
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── canvas: rain + particles ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const drops = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: 8  + Math.random() * 18,
      v: 6  + Math.random() * 10,
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
      // rain — accelerate velocity with scroll speed
      const speedMult = 1 + Math.min(scrollVel.current * 0.18, 2.5);
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.globalAlpha = d.o;
        ctx.strokeStyle = "rgba(180, 210, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - speedMult, d.y + d.l * speedMult);
        ctx.stroke();
        d.y += d.v * speedMult;
        d.x -= 0.5 * speedMult;
        if (d.y > h) { d.y = -d.l; d.x = Math.random() * w; }
      }
      // particles
      for (const p of particles) {
        ctx.globalAlpha = p.o;
        ctx.fillStyle = `hsl(${p.hue} 90% 70%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      ctx.globalAlpha = 1;
      // decay scroll velocity
      scrollVel.current *= 0.88;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">

      {/* Skyline — slowest parallax layer */}
      <div
        ref={skyRef}
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: `url(${skyline})`,
          transform: `translateY(0px)`,
          willChange: "transform",
        }}
      />

      {/* Hero gradient wash — mid parallax */}
      <div
        ref={wash1Ref}
        className="absolute inset-0"
        style={{
          background: "var(--gradient-hero)",
          transform: `translateY(0px)`,
          willChange: "transform",
        }}
      />

      {/* Dark fade — fastest parallax (creates depth) */}
      <div
        ref={wash2Ref}
        className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background"
        style={{
          transform: `translateY(0px)`,
          willChange: "transform",
        }}
      />

      {/* Lightning flash */}
      <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-lightning" />

      {/* Rain + particles canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* ── Organic spider web — top-left (electric blue) ── */}
      <svg
        className="absolute -top-4 -left-4 w-80 h-80 opacity-35"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
      >
        <style>{`
          .web-s { stroke-dasharray:400; stroke-dashoffset:400;
            animation: wdraw 2.6s ease-out forwards; }
          .web-a { stroke-dasharray:200; stroke-dashoffset:200;
            animation: wdraw 2.6s ease-out forwards; }
          @keyframes wdraw { to { stroke-dashoffset:0; } }
        `}</style>

        {/* spokes */}
        {[0,15,30,45,60,75,90].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line key={i} x1="0" y1="0"
              x2={Math.cos(r)*195} y2={Math.sin(r)*195}
              stroke="oklch(0.74 0.19 240)" strokeWidth="0.55"
              className="web-s" style={{ animationDelay:`${i*0.08}s` }} />
          );
        })}

        {/* concentric arcs */}
        {[28,55,85,118,152].map((d, i) => (
          <path key={i} d={`M ${d} 0 Q ${d*0.72} ${d*0.72} 0 ${d}`}
            stroke="oklch(0.74 0.19 240)" strokeWidth="0.45"
            className="web-a" style={{ animationDelay:`${0.55+i*0.11}s` }} />
        ))}

        {/* cross-threads */}
        {[28,55,85,118,152].map((d, i) => {
          const pts = [0,15,30,45,60,75,90].map(deg => {
            const r = (deg * Math.PI) / 180;
            return [Math.cos(r)*d, Math.sin(r)*d] as [number,number];
          });
          return pts.slice(0,-1).map((p,j) => (
            <line key={`${i}-${j}`}
              x1={p[0]} y1={p[1]} x2={pts[j+1][0]} y2={pts[j+1][1]}
              stroke="oklch(0.74 0.19 240)" strokeWidth="0.28"
              className="web-a" style={{ animationDelay:`${0.65+i*0.1+j*0.04}s` }} />
          ));
        })}
      </svg>

      {/* ── Organic spider web — top-right (crimson) ── */}
      <svg
        className="absolute -top-4 -right-4 w-64 h-64 opacity-25"
        viewBox="0 0 200 200"
        fill="none"
        style={{ transform:"scaleX(-1)" }}
        aria-hidden
      >
        {[0,18,36,54,72,90].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return (
            <line key={i} x1="0" y1="0"
              x2={Math.cos(r)*195} y2={Math.sin(r)*195}
              stroke="oklch(0.58 0.24 25)" strokeWidth="0.5"
              style={{ strokeDasharray:400, strokeDashoffset:400,
                animation:`wdraw 2.2s ease-out ${0.3+i*0.09}s forwards` }} />
          );
        })}
        {[32,62,96,132].map((d, i) => (
          <path key={i} d={`M ${d} 0 Q ${d*0.72} ${d*0.72} 0 ${d}`}
            stroke="oklch(0.58 0.24 25)" strokeWidth="0.4"
            style={{ strokeDasharray:200, strokeDashoffset:200,
              animation:`wdraw 2.2s ease-out ${0.75+i*0.12}s forwards` }} />
        ))}
        {[32,62,96,132].map((d, i) => {
          const pts = [0,18,36,54,72,90].map(deg => {
            const r=(deg*Math.PI)/180;
            return [Math.cos(r)*d, Math.sin(r)*d] as [number,number];
          });
          return pts.slice(0,-1).map((p,j)=>(
            <line key={`${i}-${j}`}
              x1={p[0]} y1={p[1]} x2={pts[j+1][0]} y2={pts[j+1][1]}
              stroke="oklch(0.58 0.24 25)" strokeWidth="0.25"
              style={{ strokeDasharray:200, strokeDashoffset:200,
                animation:`wdraw 2.2s ease-out ${0.9+i*0.1+j*0.04}s forwards` }}/>
          ));
        })}
      </svg>

      {/* Scanlines + noise */}
      <div className="absolute inset-0 scanlines opacity-30" />
      <div className="absolute inset-0 noise opacity-40" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.012 270 / 0.85) 100%)",
        }}
      />
    </div>
  );
}
