import { useEffect, useRef } from "react";

export function CustomCursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${mx - 7}px, ${my - 7}px)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a,button,[data-cursor='hover']");
      if (ringRef.current) {
        ringRef.current.style.width = interactive ? "64px" : "38px";
        ringRef.current.style.height = interactive ? "64px" : "38px";
        ringRef.current.style.borderColor = interactive
          ? "color-mix(in oklab, var(--crimson) 80%, transparent)"
          : "color-mix(in oklab, var(--electric) 60%, transparent)";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring hidden md:block" />
      <div ref={orbRef} className="cursor-orb hidden md:block" />
    </>
  );
}
