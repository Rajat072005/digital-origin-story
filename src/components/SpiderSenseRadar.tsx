import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { name: "React.js",    level: 92, angle: -90,  color: "#5fb6ff", years: "2yr" },
  { name: "Next.js",    level: 85, angle: -30,  color: "#5fb6ff", years: "1.5yr" },
  { name: "Node.js",    level: 88, angle:  30,  color: "#ff2b5e", years: "2yr" },
  { name: "MongoDB",    level: 80, angle:  90,  color: "#ff2b5e", years: "1yr" },
  { name: "Tailwind",   level: 90, angle:  150, color: "#5fb6ff", years: "1.5yr" },
  { name: "TypeScript", level: 78, angle:  210, color: "#a78bfa", years: "1yr" },
  { name: "GSAP",       level: 72, angle:  270, color: "#a78bfa", years: "0.5yr" },
  { name: "Three.js",   level: 68, angle:  330, color: "#5fb6ff", years: "0.5yr" },
];

const EXTRA = ["PostgreSQL","Docker","Redis","GraphQL","Prisma","Express"];

export function SpiderSenseRadar() {
  const [active, setActive] = useState<number | null>(null);
  const [ping, setPing] = useState(0);
  const [sweepAngle, setSweepAngle] = useState(0);
  const rafRef = useRef<number>();
  const startRef = useRef(performance.now());

  useEffect(() => {
    const loop = () => {
      const t = (performance.now() - startRef.current) / 1000;
      setSweepAngle((t * 45) % 360);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    const id = setInterval(() => setPing((p) => p + 1), 2500);
    return () => { cancelAnimationFrame(rafRef.current!); clearInterval(id); };
  }, []);

  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 20;

  return (
    <section id="skills" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#ff2b5e]">
            // spider_sense.active
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Threat Detection Matrix.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Every blip is a skill locked and loaded. Hover to surface the tactical readout.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-center">
          {/* RADAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative shrink-0"
            style={{ width: size, height: size }}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
              <defs>
                <radialGradient id="sweep-g" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#ff2b5e" stopOpacity="0" />
                  <stop offset="65%"  stopColor="#ff2b5e" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ff2b5e" stopOpacity="0" />
                </radialGradient>
                <filter id="rglow"><feGaussianBlur stdDeviation="2.5" /></filter>
              </defs>

              {/* rings */}
              {[0.25,0.5,0.75,1].map((f) => (
                <circle key={f} cx={cx} cy={cy} r={maxR*f} fill="none"
                  stroke="#ff2b5e" strokeWidth="0.7" strokeOpacity={0.15+f*0.08} strokeDasharray="3 5" />
              ))}

              {/* spokes */}
              {Array.from({length:12}).map((_,i)=>{
                const a=(i/12)*Math.PI*2;
                return <line key={i} x1={cx} y1={cy}
                  x2={cx+Math.cos(a)*maxR} y2={cy+Math.sin(a)*maxR}
                  stroke="#ff2b5e" strokeWidth="0.5" strokeOpacity="0.12" />;
              })}

              {/* sweep wedge */}
              {(()=>{
                const a=(sweepAngle*Math.PI)/180;
                const span=(55*Math.PI)/180;
                const x1=cx+Math.cos(a)*maxR, y1=cy+Math.sin(a)*maxR;
                const x2=cx+Math.cos(a-span)*maxR, y2=cy+Math.sin(a-span)*maxR;
                return <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${maxR} ${maxR} 0 0 0 ${x2} ${y2} Z`}
                  fill="url(#sweep-g)" />;
              })()}

              {/* sweep leading edge */}
              {(()=>{
                const a=(sweepAngle*Math.PI)/180;
                return <line x1={cx} y1={cy} x2={cx+Math.cos(a)*maxR} y2={cy+Math.sin(a)*maxR}
                  stroke="#ff2b5e" strokeWidth="1.8" strokeOpacity="0.9" filter="url(#rglow)" />;
              })()}

              {/* crosshair */}
              <line x1={cx-8} y1={cy} x2={cx+8} y2={cy} stroke="#ff2b5e" strokeWidth="0.8" strokeOpacity="0.7"/>
              <line x1={cx} y1={cy-8} x2={cx} y2={cy+8} stroke="#ff2b5e" strokeWidth="0.8" strokeOpacity="0.7"/>
              <circle cx={cx} cy={cy} r="3.5" fill="#ff2b5e" fillOpacity="0.9" />

              {/* blips */}
              {SKILLS.map((s,i)=>{
                const rad=(s.angle*Math.PI)/180;
                const dist=maxR*(s.level/100)*0.86;
                const bx=cx+Math.cos(rad)*dist;
                const by=cy+Math.sin(rad)*dist;
                const isActive=active===i;
                return (
                  <g key={s.name}>
                    <motion.circle key={`ping-${ping}-${i}`}
                      cx={bx} cy={by} r="5" fill="none"
                      stroke={s.color} strokeWidth="1"
                      initial={{r:5,opacity:0.9}}
                      animate={{r:20,opacity:0}}
                      transition={{duration:1.4,delay:i*0.18,ease:"easeOut"}}/>
                    <circle cx={bx} cy={by} r={isActive?7.5:5.5}
                      fill={s.color} fillOpacity={isActive?1:0.8}
                      style={{filter:`drop-shadow(0 0 6px ${s.color})`,cursor:"none"}}
                      onMouseEnter={()=>setActive(i)}
                      onMouseLeave={()=>setActive(null)}/>
                  </g>
                );
              })}
            </svg>

            {/* label tags */}
            {SKILLS.map((s,i)=>{
              const rad=(s.angle*Math.PI)/180;
              const dist=maxR*(s.level/100)*0.86+30;
              return (
                <div key={s.name} className="absolute pointer-events-none text-center"
                  style={{left:cx+Math.cos(rad)*dist,top:cy+Math.sin(rad)*dist,transform:"translate(-50%,-50%)",opacity:active===i?1:0.5}}>
                  <span className="font-mono text-[9px] uppercase tracking-widest" style={{color:s.color}}>
                    {s.name}
                  </span>
                </div>
              );
            })}

            {/* hover readout */}
            <AnimatePresence>
              {active!==null&&(
                <motion.div key={active}
                  initial={{opacity:0,scale:0.9}}
                  animate={{opacity:1,scale:1}}
                  exit={{opacity:0,scale:0.9}}
                  transition={{duration:0.22}}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 rounded-xl border border-[#ff2b5e]/30 bg-background/90 p-4 backdrop-blur-xl text-center z-10"
                  style={{boxShadow:"0 0 40px rgba(255,43,94,0.25)"}}>
                  <div className="font-mono text-[8px] uppercase tracking-[0.4em] text-[#ff2b5e]/80">// TARGET LOCKED</div>
                  <div className="mt-1.5 font-display text-sm font-bold text-white">{SKILLS[active].name}</div>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                    <motion.div className="h-full rounded-full" style={{background:SKILLS[active].color}}
                      initial={{width:0}} animate={{width:`${SKILLS[active].level}%`}}
                      transition={{duration:0.5,ease:"easeOut"}}/>
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[8px] text-white/50">
                    <span>POWER</span><span>{SKILLS[active].level}%</span>
                  </div>
                  <div className="mt-2 font-mono text-[8px] tracking-widest text-white/35">{SKILLS[active].years} field exp.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* side panel */}
          <motion.div
            initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}}
            viewport={{once:true}} transition={{duration:0.8,delay:0.3}}
            className="flex flex-col gap-4"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/70 mb-2">
              // additional_arsenal
            </div>
            {EXTRA.map((sk,i)=>(
              <motion.div key={sk} initial={{opacity:0,x:16}} whileInView={{opacity:1,x:0}}
                viewport={{once:true}} transition={{duration:0.5,delay:0.4+i*0.07}}
                className="flex items-center gap-3 group cursor-none" data-cursor="hover">
                <span className="size-1.5 rounded-full bg-[#ff2b5e] shadow-[0_0_8px_#ff2b5e] transition-transform duration-200 group-hover:scale-150"/>
                <span className="font-mono text-sm tracking-wide text-foreground/70 group-hover:text-white transition-colors duration-200">{sk}</span>
              </motion.div>
            ))}
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#ff2b5e]/20 bg-background/40 px-4 py-3 backdrop-blur">
              <motion.span className="size-2 rounded-full bg-[#ff2b5e]"
                animate={{opacity:[1,0.3,1]}} transition={{duration:1.4,repeat:Infinity}}
                style={{boxShadow:"0 0 8px #ff2b5e"}}/>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff2b5e]/80">
                Available for missions
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
