import { useState } from "react";
import { motion } from "motion/react";
import { SpiderCrawlButton } from "./SpiderCrawl";

const PROJECTS = [
  {
    name: "EatInSync",
    tag: "Food Intelligence",
    body: "An AI-powered dining companion that scans menus, learns your taste, and recommends the next bite worth remembering.",
    issue: "01",
    action: "THWIP!",
    accent: "#ff2b5e",
    palette: "from-[#ff2b5e]/30 via-black/80 to-black",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["React", "Node.js", "MongoDB", "AI/ML"],
    universe: "EARTH-1610 // MILES",
    rotation: -1,
  },
  {
    name: "Moodify",
    tag: "Audio Universe",
    body: "Visualize how a track feels — emotional gradients, audio-reactive UI, and a soundscape you can step inside.",
    issue: "02",
    action: "GLITCH!",
    accent: "#a78bfa",
    palette: "from-[#a78bfa]/30 via-black/80 to-black",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["React", "Spotify API", "GSAP", "Canvas"],
    universe: "EARTH-65 // GWEN",
    rotation: 1,
  },
  {
    name: "Paste App",
    tag: "Encrypted Terminal",
    body: "A secure, terminal-inspired space to share code & secrets with end-to-end encryption and zero clutter.",
    issue: "03",
    action: "SHOCK!",
    accent: "#5fb6ff",
    palette: "from-[#5fb6ff]/30 via-black/80 to-black",
    github: "https://github.com/Rajat072005",
    live: "#",
    tech: ["Next.js", "PostgreSQL", "Prisma", "Encryption"],
    universe: "EARTH-928 // MIGUEL",
    rotation: -1.5,
  },
];

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  return (
    <div 
      className="sticky flex items-center justify-center w-full"
      style={{ 
        top: `calc(15vh + ${index * 20}px)`, 
        marginBottom: index === PROJECTS.length - 1 ? "15vh" : "45vh",
        zIndex: index * 10
      }}
    >
      <div 
        className="relative w-full max-w-6xl rounded-[2rem] border-[3px] bg-black/70 backdrop-blur-2xl overflow-visible shadow-2xl flex flex-col md:flex-row origin-center group transition-colors duration-500"
        style={{ 
            borderColor: `${project.accent}40`, 
            boxShadow: `0 20px 60px -10px ${project.accent}30, inset 0 0 40px ${project.accent}10`,
            rotate: project.rotation
        }}
      >
        {/* Dynamic Border Glow on Hover */}
        <div className="absolute inset-0 rounded-[2rem] border-[3px] border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50" style={{ color: project.accent, boxShadow: `0 0 30px ${project.accent}40` }} />

        {/* Comic Panel Action Word (POW! THWIP!) bursting out of the frame */}
        <div 
           className="absolute -top-16 -right-8 md:-right-16 z-[100] font-display font-black text-6xl md:text-8xl italic uppercase pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] opacity-0 scale-50 -rotate-12 translate-y-10 group-hover:opacity-100 group-hover:scale-[1.15] group-hover:-rotate-3 group-hover:translate-y-0"
           style={{ 
             color: "transparent",
             WebkitTextStroke: `2px ${project.accent}`,
             filter: `drop-shadow(4px 4px 0px ${project.accent})`
           }}
        >
           {project.action}
        </div>

        {/* ISSUE Badge - Comic Style overlapping top-left */}
        <div 
          className="absolute -top-8 -left-8 z-40 flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-xl -rotate-12 group-hover:rotate-0 transition-transform duration-500 bg-black"
          style={{
            borderColor: project.accent,
            boxShadow: `0 0 20px ${project.accent}66, inset 0 0 10px ${project.accent}66`,
          }}
        >
          <div className="text-center leading-none text-white font-black">
            <div className="text-xs tracking-widest opacity-80 mb-1">ISSUE</div>
            <div className="text-3xl" style={{ color: project.accent }}>#{project.issue}</div>
          </div>
        </div>

        {/* Glowing Halftone Background inside card */}
        <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${project.palette} pointer-events-none`} />
        <div className="absolute inset-0 rounded-[2rem] halftone opacity-40 mix-blend-overlay pointer-events-none" />

        {/* --- Content Area --- */}
        <div className="relative z-10 p-10 md:p-14 w-full flex flex-col md:flex-row gap-12">
          
          {/* Left Column: Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="font-mono text-sm tracking-[0.3em] font-bold uppercase" style={{ color: project.accent, textShadow: `0 0 10px ${project.accent}88` }}>
                {project.universe}
              </span>
            </div>

            <h3 className="font-display text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6 leading-none">
              {project.name}
            </h3>
            
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-lg">
              {project.body}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              {project.tech.map((t: string) => (
                <span key={t} className="font-mono text-xs tracking-widest text-white/80 uppercase px-4 py-2 border-2 rounded-none bg-black/50" style={{ borderColor: `${project.accent}40` }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-auto">
               <SpiderCrawlButton
                 as="a"
                 href={project.github}
                 target="_blank"
                 className="px-8 py-4 rounded-none border-[3px] font-mono text-sm uppercase tracking-[0.2em] text-white bg-black hover:bg-white/5 transition-colors relative overflow-hidden group/btn cursor-none"
                 style={{ borderColor: project.accent }}
               >
                 <span className="relative z-10">[ SOURCE_CODE ]</span>
               </SpiderCrawlButton>

               <a
                 href={project.live}
                 target="_blank"
                 className="px-8 py-4 rounded-none font-mono text-sm uppercase tracking-[0.2em] text-black font-black transition-all hover:-translate-y-1 hover:translate-x-1 relative"
                 style={{ 
                    backgroundColor: project.accent, 
                    boxShadow: `-6px 6px 0px 0px rgba(255,255,255,0.2)` 
                 }}
               >
                 INITIATE_LINK //
               </a>
            </div>
          </div>

          {/* Right Column: Visual Graphic */}
          <div className="hidden md:flex flex-1 relative min-h-[400px] border-[3px] bg-black/40 overflow-hidden items-center justify-center transition-colors duration-500 rounded-2xl" style={{ borderColor: `${project.accent}30` }}>
             {/* Abstract Collider Rings */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 40, ease: "linear", repeat: Infinity }}
               className="absolute w-[120%] aspect-square rounded-full border-[3px] border-dashed opacity-30"
               style={{ borderColor: project.accent }}
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 25, ease: "linear", repeat: Infinity }}
               className="absolute w-[80%] aspect-square rounded-full border-[3px] opacity-20"
               style={{ borderColor: project.accent }}
             />
             
             {/* Huge background number */}
             <div className="absolute inset-0 flex items-center justify-center font-display font-black text-[250px] opacity-10 select-none pointer-events-none" style={{ color: project.accent }}>
                {project.issue}
             </div>

             {/* Spider-Sense Radar / Glitch Overlay appearing on hover */}
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-md">
                <span className="font-mono text-2xl tracking-[0.5em] font-black" style={{ color: project.accent, textShadow: `3px 0 red, -3px 0 cyan` }}>
                   ACCESSING_DIMENSION
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Projects() {
  return (
    <section id="projects" className="relative w-full pt-32 pb-48">
      {/* Removed bg-background to allow CityBackground/Web to show through */}
      <div className="mx-auto max-w-7xl px-6 mb-32 relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-4 border-l-4 pl-6 border-[#ff2b5e]"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-white/70 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2b5e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2b5e]"></span>
            </span>
            Multiverse_Archives //
          </span>
          <h2 className="font-display text-5xl font-black tracking-tight text-white md:text-7xl uppercase leading-[0.9]">
            Dimensional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/60 to-white/20">
              Rifts
            </span>
          </h2>
        </motion.div>
      </div>

      <div className="relative w-full px-4 md:px-6 mx-auto max-w-[1400px]">
        {PROJECTS.map((project, i) => (
           <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
