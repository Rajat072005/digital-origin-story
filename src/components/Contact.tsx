import { motion } from "motion/react";
import { useState, useRef } from "react";
import { SpiderCrawlButton } from "./SpiderCrawl";

export function Contact() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  return (
    <section id="contact" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-3xl">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center gap-3 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-[#ff2b5e]">
            // hq_comms_terminal
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-gradient md:text-6xl">
            Send a transmission.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Open channel to base. Leave a signal and I'll web-swing back to you.
          </p>
        </motion.div>

        {/* Terminal card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-2xl border border-[#ff2b5e]/20 bg-background/60 backdrop-blur-xl"
          style={{
            boxShadow:
              "0 0 60px rgba(255,43,94,0.08), 0 30px 80px -20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,43,94,0.06)",
          }}
        >
          {/* scanlines overlay */}
          <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

          {/* CRT top bar */}
          <div className="flex items-center gap-2 border-b border-[#ff2b5e]/15 px-5 py-3">
            <span className="size-2.5 rounded-full bg-[#ff2b5e]/60" />
            <span className="size-2.5 rounded-full bg-amber-500/40" />
            <span className="size-2.5 rounded-full bg-[#5fb6ff]/40" />
            <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/40">
              EARTH-1610 // SECURE CHANNEL
            </span>
            <motion.span
              className="ml-auto font-mono text-[9px] text-[#ff2b5e]/70"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ● LIVE
            </motion.span>
          </div>

          <div className="p-8">
            {!sent ? (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/70">
                    {">"} Identifier (Name)
                  </label>
                  <div
                    className="relative"
                    style={{
                      boxShadow: focused === "name" ? "0 0 20px rgba(255,43,94,0.15)" : "none",
                    }}
                  >
                    <input
                      type="text"
                      value={fields.name}
                      onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      placeholder="Peter Parker"
                      className="w-full rounded-lg border border-foreground/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/25 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 cursor-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/70">
                    {">"} Frequency (Email)
                  </label>
                  <input
                    type="email"
                    value={fields.email}
                    onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="spidey@stark.com"
                    style={{
                      boxShadow: focused === "email" ? "0 0 20px rgba(255,43,94,0.15)" : "none",
                    }}
                    className="w-full rounded-lg border border-foreground/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/25 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 cursor-none"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]/70">
                    {">"} Signal (Message)
                  </label>
                  <textarea
                    value={fields.message}
                    onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
                    onFocus={() => setFocused("msg")}
                    onBlur={() => setFocused(null)}
                    placeholder="Hey Rajat, I need a web-slinger on my team..."
                    rows={4}
                    style={{
                      boxShadow: focused === "msg" ? "0 0 20px rgba(255,43,94,0.15)" : "none",
                    }}
                    className="w-full resize-none rounded-lg border border-foreground/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-foreground placeholder:text-foreground/25 outline-none transition-all duration-300 focus:border-[#ff2b5e]/50 cursor-none"
                  />
                </div>

                {/* submit */}
                <SpiderCrawlButton
                  type="submit"
                  data-cursor="hover"
                  disabled={sending}
                  className="self-end overflow-hidden border border-[#ff2b5e]/40 bg-[#0a0a0a]/60 px-8 py-3 font-mono text-[11px] uppercase tracking-[0.4em] text-[#cfe2ff] backdrop-blur-md transition-all duration-300 hover:border-[#ff2b5e] hover:text-white disabled:opacity-50"
                  style={{
                    boxShadow: "0 0 24px rgba(255,43,94,0.25), inset 0 0 14px rgba(255,43,94,0.08)",
                  }}
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
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex flex-col items-center gap-4 py-12 text-center"
              >
                {/* web burst icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease: [0.2, 1.4, 0.3, 1] }}
                  className="text-5xl"
                >
                  🕸️
                </motion.div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff2b5e]">
                  // transmission_received
                </div>
                <p className="font-display text-2xl font-semibold text-white">
                  Signal locked.
                </p>
                <p className="max-w-xs text-sm text-muted-foreground">
                  I'll swing your way soon. With great power comes great response time.
                </p>
              </motion.div>
            )}
          </div>

          {/* bottom bar */}
          <div className="border-t border-foreground/5 px-5 py-2.5 flex items-center justify-between">
            <span className="font-mono text-[9px] text-foreground/25 uppercase tracking-widest">
              END-TO-END ENCRYPTED
            </span>
            <span className="font-mono text-[9px] text-foreground/25 uppercase tracking-widest">
              v1.0 // SECURE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
