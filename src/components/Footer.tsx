import { motion } from "motion/react";
import { useState, useRef } from "react";
import { SpiderCrawlButton } from "./SpiderCrawl";
import rooftop from "@/assets/rooftop.jpg";

const LINKS: { label: string; href: string }[] = [
  { label: "github",   href: "https://github.com/Rajat072005" },
  { label: "linkedin", href: "https://linkedin.com/in/rajat-trehan" },
  { label: "twitter",  href: "https://twitter.com" },
  { label: "email",    href: "mailto:rajattrehan7@gmail.com" },
];

export function Footer() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <footer id="contact" className="relative isolate overflow-hidden pt-20 z-50 bg-background">
      {/* Background layer */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${rooftop})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#020205] via-[#05060c]/80 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 noise opacity-30" />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 pb-12 pt-16 md:pb-20">
        
        {/* Holographic Tactical Form Terminal */}
        <div
          className="w-full relative overflow-hidden bg-[#04040a]/80 backdrop-blur-2xl p-8 md:p-14 border border-white/10"
          style={{ 
            clipPath: "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)",
            boxShadow: "0 20px 80px -20px rgba(0, 240, 255, 0.15), inset 0 0 40px rgba(0,240,255,0.05)"
          }}
        >
          {/* Glowing Ambient Background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
               style={{ background: "radial-gradient(circle at 0% 0%, #00f0ff 0%, transparent 50%), radial-gradient(circle at 100% 100%, #ff007f 0%, transparent 50%)" }} />
          
          <div className="pointer-events-none absolute inset-0 scanlines opacity-30 mix-blend-overlay" />
          
          <div className="mb-12 flex flex-col items-center text-center relative z-10">
            <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-[#00f0ff] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" style={{ boxShadow: "0 0 10px #00f0ff" }} />
              // SECURE_CHANNEL_OPEN
            </span>
            <h2 
              className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white animate-spider-glitch"
              data-text="ESTABLISH CONNECTION"
            >
              Establish Connection
            </h2>
            <p className="mt-5 font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/50 max-w-lg">
              Transmit your coordinates across the multiverse.
            </p>
          </div>

          {!sent ? (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  required
                  value={fields.name}
                  onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                  placeholder="IDENTIFIER [ NAME ]"
                  className="w-full bg-white/5 border-b-2 border-white/20 px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[#00f0ff] focus:bg-[#00f0ff]/10 cursor-none"
                />
                <input
                  type="email"
                  required
                  value={fields.email}
                  onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                  placeholder="FREQUENCY [ EMAIL ]"
                  className="w-full bg-white/5 border-b-2 border-white/20 px-5 py-4 font-mono text-[11px] uppercase tracking-widest text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-[#ff007f] focus:bg-[#ff007f]/10 cursor-none"
                />
              </div>
              <div className="relative">
                {/* Decorative corner brackets for textarea */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30" />
                <textarea
                  required
                  value={fields.message}
                  onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
                  placeholder="MESSAGE_PAYLOAD..."
                  rows={4}
                  className="w-full resize-none bg-white/5 border-b-2 border-white/20 px-5 py-5 font-mono text-[11px] uppercase tracking-widest text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-white focus:bg-white/10 cursor-none"
                />
              </div>
              <SpiderCrawlButton
                type="submit"
                disabled={sending}
                className="group mt-6 w-full md:w-auto md:self-end overflow-hidden border-2 border-white/20 bg-black px-10 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-white transition-all duration-300 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] disabled:opacity-50"
                style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
              >
                {sending ? (
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    [ TRANSMITTING... ]
                  </motion.span>
                ) : (
                  <span className="inline-block transition-all duration-300 group-hover:tracking-[0.6em]">INITIATE_TRANSFER //</span>
                )}
              </SpiderCrawlButton>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-12 text-center relative z-10"
            >
              <div className="relative flex items-center justify-center size-20 mb-2">
                <motion.div className="absolute inset-0 border-2 border-[#00f0ff] rounded-full" animate={{ scale: [1, 1.5], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                <div className="text-4xl text-[#00f0ff]">✓</div>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#00f0ff]">
                // TRANSMISSION_RECEIVED
              </div>
              <p className="font-display text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">Signal Locked.</p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mt-2">With great power comes great response time.</p>
            </motion.div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {LINKS.map(({ label, href }) => (
            <SpiderCrawlButton
              key={label}
              as="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 transition-all duration-300 hover:text-white cursor-none no-underline flex items-center gap-2"
            >
              <span className="text-[#ff007f] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">[</span>
              {label}
              <span className="text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">]</span>
            </SpiderCrawlButton>
          ))}
        </div>

        {/* Bottom Metadata */}
        <div className="mt-12 flex w-full items-center justify-between font-mono text-[9px] uppercase tracking-[0.4em] text-white/20 border-t border-white/5 pt-6">
          <span>RAJAT // 2026</span>
          <span className="hidden md:inline hover:text-white/40 transition-colors">EARTH-1610 — ALL VARIANTS RESERVED</span>
          <span>SYS.v.1.0</span>
        </div>
      </div>
    </footer>
  );
}
