import { useState, useRef, useCallback } from "react";

/* ── Sleek Cinematic Spider SVG ── */
export function SleekSpiderSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      <style>{`
        .spider-legs path { transform-origin: 50% 50%; }
        .leg-l-1, .leg-r-2, .leg-l-3, .leg-r-4 { animation: walk1 0.50s infinite alternate ease-in-out; }
        .leg-r-1, .leg-l-2, .leg-r-3, .leg-l-4 { animation: walk2 0.50s infinite alternate ease-in-out; }
        @keyframes walk1 { 0% { transform: rotate(12deg); } 100% { transform: rotate(-12deg); } }
        @keyframes walk2 { 0% { transform: rotate(-12deg); } 100% { transform: rotate(12deg); } }
      `}</style>
      <g
        className="spider-legs"
        stroke="#c0d8ff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M 42 45 L 20 20 L 5 35"  className="leg-l-1" />
        <path d="M 42 50 L 15 45 L 2 55"  className="leg-l-2" />
        <path d="M 42 55 L 15 65 L 5 85"  className="leg-l-3" />
        <path d="M 42 60 L 25 80 L 15 95" className="leg-l-4" />
        <path d="M 58 45 L 80 20 L 95 35"  className="leg-r-1" />
        <path d="M 58 50 L 85 45 L 98 55"  className="leg-r-2" />
        <path d="M 58 55 L 85 65 L 95 85"  className="leg-r-3" />
        <path d="M 58 60 L 75 80 L 85 95"  className="leg-r-4" />
      </g>
      {/* Abdomen */}
      <path d="M 35 58 C 35 90, 65 90, 65 58 Z" fill="#0a0a1a" />
      {/* Red diamond marking */}
      <path d="M 50 63 L 57 74 L 50 83 L 43 74 Z" fill="#ff2b5e" />
      {/* Cephalothorax */}
      <path d="M 38 45 C 38 28, 62 28, 62 45 C 62 55, 38 55, 38 45 Z" fill="#051020" />
      {/* Blue visor */}
      <path d="M 41 39 L 46 44 L 54 44 L 59 39" stroke="#5fb6ff" strokeWidth="2.5" fill="none" opacity="0.95" />
      {/* Eyes */}
      <circle cx="46" cy="35" r="3"   fill="#ffffff" />
      <circle cx="54" cy="35" r="3"   fill="#ffffff" />
      <circle cx="46" cy="35" r="1.5" fill="#5fb6ff" />
      <circle cx="54" cy="35" r="1.5" fill="#5fb6ff" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────
   Path generator
   Coordinates are in button-local space (top-left = 0,0).
   The spider enters from the left, zigzags ABOVE and BELOW the
   button surface (negative y and y > height), then exits right.
   Because the wrapper uses overflow:visible the spider is fully
   visible outside the button boundaries.
────────────────────────────────────────────────────────────── */
function generateCrawlPath(w: number, h: number): string {
  // How far above / below the button the spider can wander
  const yOver = h * (0.3 + Math.random() * 0.4);

  const points: [number, number][] = [
    [-55, h * (0.2 + Math.random() * 0.6)],
  ];

  const steps = 3 + Math.floor(Math.random() * 3); // 3-5 interior zigs
  for (let i = 1; i <= steps; i++) {
    const xFrac = i / (steps + 1);
    const x = w * xFrac + (Math.random() - 0.5) * w * 0.14;
    // Strict alternation: even index goes above, odd goes below
    const goAbove = i % 2 !== 0;
    const y = goAbove
      ? -(Math.random() * yOver)       // above button
      : h + Math.random() * yOver;     // below button
    points.push([x, y]);
  }

  points.push([w + 15, h * (0.2 + Math.random() * 0.6)]);

  // Build smooth cubic bezier: midpoint control points → natural S-curves
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const mx = ((px + cx) / 2).toFixed(1);
    d += ` C ${mx} ${py.toFixed(1)}, ${mx} ${cy.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  return d;
}

/* ── Types ── */
type CrawlState = { path: string; key: number; duration: number } | null;

type Props = {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

/* ──────────────────────────────────────────────────────────────
   SpiderCrawlButton
   - overflow:visible  →  spider escapes button bounds freely
   - hoveredRef        →  stale-closure-safe hover tracking
   - onAnimationEnd    →  picks a brand-new random path and loops
────────────────────────────────────────────────────────────── */
export function SpiderCrawlButton({
  children,
  className = "",
  as = "button",
  ...props
}: Props) {
  const [crawl, setCrawl] = useState<CrawlState>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);          // avoids stale closures
  const Tag: any   = as;

  /** Build a fresh crawl state from the current button dimensions */
  const spawnPath = useCallback(() => {
    if (!wrapRef.current) return;
    const { width, height } = wrapRef.current.getBoundingClientRect();
    setCrawl({
      path:     generateCrawlPath(width, height),
      key:      Date.now(),
      duration: 3 + Math.random() * 1.2,   // 2.2 – 3.4 s (varies each pass)
    });
  }, []);

  const startCrawl = useCallback(() => {
    hoveredRef.current = true;
    spawnPath();
  }, [spawnPath]);

  const stopCrawl = useCallback(() => {
    hoveredRef.current = false;
    setCrawl(null);
  }, []);

  /** Called when each crawl animation finishes — loop if still hovered */
  const handleAnimationEnd = useCallback(() => {
    // Immediately clear the spider so it doesn't freeze at the end!
    setCrawl(null);
    if (hoveredRef.current) {
      // Small pause (2000-2300 ms) before next crawl so it feels natural
      setTimeout(() => {
        if (hoveredRef.current) spawnPath();
      }, 2000 + Math.random() * 300);
    }
  }, [spawnPath]);

  return (
    <Tag
      /* overflow-visible lets the spider escape the button border */
      className={`relative overflow-visible group ${className}`}
      onMouseEnter={startCrawl}
      onMouseLeave={stopCrawl}
      {...props}
    >
      {/* Measurement anchor at (0,0) of the button */}
      <div ref={wrapRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>

      {crawl && (
        <SpiderOnPath
          key={crawl.key}
          path={crawl.path}
          duration={crawl.duration}
          onEnd={handleAnimationEnd}
        />
      )}
    </Tag>
  );
}

/* ── The animated spider element ── */
function SpiderOnPath({
  path,
  duration,
  onEnd,
}: {
  path: string;
  duration: number;
  onEnd: () => void;
}) {
  return (
    <div
      /*
       * Two CSS animations run simultaneously on this element:
       * 1. spider-path-crawl  — moves it along the offset-path
       * 2. spider-depth       — scale + opacity + blur cycle that
       *    simulates the spider crawling to the BACK of the button
       *    (shrinks + dims mid-pass) then returning to the front.
       * Both share the same duration so they stay perfectly in sync.
       */
      className="pointer-events-none absolute top-0 left-0"
      style={
        {
          offsetPath:   `path("${path}")`,
          offsetRotate: "auto 90deg",
          animation:    [
            `spider-path-crawl ${duration}s linear forwards`,
            `spider-depth      ${duration}s ease-in-out forwards`,
          ].join(", "),
          willChange: "offset-distance, transform, opacity, filter",
          zIndex: 200,
        } as React.CSSProperties
      }
      onAnimationEnd={onEnd}
    >
      <SleekSpiderSVG
        className="w-6 h-6"
        style={{
          /*
           * Base glow — the spider-depth keyframe's filter layer
           * (blur) is applied on the container, stacking on top
           * of this, so the blur effect compounds naturally.
           */
          filter:
            "drop-shadow(0 0 5px #ff2b5e) drop-shadow(0 0 11px rgba(95,182,255,0.7)) drop-shadow(0 0 2px #fff)",
        }}
      />
    </div>
  );
}
