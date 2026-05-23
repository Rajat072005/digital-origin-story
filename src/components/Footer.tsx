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
        
        {/* Terminal Form integrated into Footer */}
        <div
          className="w-full relative overflow-hidden rounded-2xl border border-[#ff2b5e]/20 bg-background/50 backdrop-blur-xl p-8 md:p-12 shadow-[0_0_60px_rgba(255,43,94,0.08),inset_0_0_0_1px_rgba(255,43,94,0.06)]"
        >
          <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
          
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-3 font-mono text-xs uppercase tracking-[0.5em] text-[#ff2b5e]">
              // end_of_patrol
            </span>
            <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
              Leave a signal.
            </h2>
            <p className="mt-2 text-sm text-foreground/60 max-w-md">
              I'll web-swing back to you as soon as I can.
            </p>
          </div>

          {!sent ? (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  type="text"
                  required
                  value={fields.name}
                  onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Identifier (Name)"
                  className="w-full rounded-xl border border-foreground/10 bg-white/[0.03] px-5 py-3.5 font-mono text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 focus:bg-white/[0.06] cursor-none"
                />
                <input
                  type="email"
                  required
                  value={fields.email}
                  onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                  placeholder="Frequency (Email)"
                  className="w-full rounded-xl border border-foreground/10 bg-white/[0.03] px-5 py-3.5 font-mono text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 focus:bg-white/[0.06] cursor-none"
                />
              </div>
              <textarea
                required
                value={fields.message}
                onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
                placeholder="Message transmission..."
                rows={4}
                className="w-full resize-none rounded-xl border border-foreground/10 bg-white/[0.03] px-5 py-3.5 font-mono text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 focus:bg-white/[0.06] cursor-none"
              />
              <SpiderCrawlButton
                type="submit"
                disabled={sending}
                className="mt-2 w-full md:w-auto md:self-end overflow-hidden rounded-xl border border-[#ff2b5e]/40 bg-[#ff2b5e]/10 px-10 py-4 font-mono text-[11px] uppercase tracking-[0.4em] text-white backdrop-blur-md transition-all duration-300 hover:bg-[#ff2b5e]/20 hover:border-[#ff2b5e] disabled:opacity-50 shadow-[0_0_24px_rgba(255,43,94,0.15)]"
              >
                {sending ? (
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    [ Transmitting... ]
                  </motion.span>
                ) : (
                  "[ Fire Signal ]"
                )}
              </SpiderCrawlButton>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center relative z-10"
            >
              <div className="text-5xl mb-2">🕸️</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]">
                // transmission_received
              </div>
              <p className="font-display text-2xl font-semibold text-white">Signal locked.</p>
              <p className="text-sm text-foreground/60">With great power comes great response time.</p>
            </motion.div>
          )}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          {LINKS.map(({ label, href }) => (
            <SpiderCrawlButton
              key={label}
              as="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-foreground/15 bg-background/40 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/80 backdrop-blur transition-all duration-300 hover:border-[var(--electric)] hover:text-white hover:bg-[var(--electric)]/10 cursor-none no-underline"
            >
              {label}
            </SpiderCrawlButton>
          ))}
        </div>

        {/* Bottom Metadata */}
        <div className="mt-8 flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/30 border-t border-foreground/5 pt-6">
          <span>RAJAT // 2026</span>
          <span className="hidden md:inline">EARTH-1610 — ALL VARIANTS RESERVED</span>
          <span>v.1.0</span>
        </div>
      </div>
    </footer>
  );
}
