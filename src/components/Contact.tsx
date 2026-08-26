"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { Mail, Phone, MapPin, ArrowUpRight, Clock, Globe } from "lucide-react";

export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--color-bg)]"
      style={{
        paddingTop: "clamp(5rem, 10vh, 9rem)",
        paddingBottom: "clamp(5rem, 10vh, 9rem)",
      }}
      ref={ref}
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-12 md:mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-number">07</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            GET IN TOUCH
          </span>
        </motion.div>

        {/* Two-column layout with substantial gap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ── Left Column: Editorial Heading & Action Buttons ── */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Main Heading */}
            <motion.h2
              className="text-display font-display font-bold tracking-[-0.02em] leading-[0.95] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              LET&apos;S BUILD
              <br />
              <span className="text-[var(--color-text-secondary)]">SOMETHING</span>
              <br />
              <span className="relative inline-block pb-2">
                MEANINGFUL
                <span className="text-[var(--color-accent)]">.</span>
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
            </motion.h2>

            {/* Paragraph with clear margins */}
            <motion.p
              className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Available for architectural design, interior design, 3D visualization,
              master planning, and turnkey project site execution worldwide.
            </motion.p>

            {/* Availability Pill */}
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2.5 bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-xs font-semibold tracking-wider text-[var(--color-text)] mb-10 self-start"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AVAILABLE FOR NEW COMMISSIONS &amp; CONSULTING</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href={`mailto:${siteData.personal.email}`}
                className="btn-primary group"
              >
                <span>EMAIL ME</span>
                <Mail className="w-4 h-4 text-[var(--color-accent)] group-hover:text-white transition-colors" />
              </a>
              <a
                href={`tel:${siteData.personal.phone}`}
                className="btn-outline group"
              >
                <span>CALL NOW</span>
                <Phone className="w-4 h-4 text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>

          </div>

          {/* ── Right Column: 3 Standalone Architectural Cards with Explicit Margins & Gap ── */}
          <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
            
            {/* Card 01: Direct Email */}
            <motion.a
              href={`mailto:${siteData.personal.email}`}
              className="group block p-7 sm:p-9 bg-white border border-[#E2DFD8] hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(200,168,78,0.1)] hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Gold Top Slide Line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-400 ease-out" />

              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-xs text-[var(--color-accent)] tracking-widest">
                    01
                  </span>
                  <span className="text-[var(--color-accent)]">&middot;</span>
                  <span className="text-micro text-[var(--color-text-muted)] font-semibold tracking-wider">
                    DIRECT INQUIRY
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xs border border-[#E2DFD8] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-white transition-colors" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                {siteData.personal.email}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#8A8882]">
                <Clock className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
                <span>Typical response time within 24 hours</span>
              </div>
            </motion.a>

            {/* Card 02: Telephone & WhatsApp */}
            <motion.a
              href={`tel:${siteData.personal.phone}`}
              className="group block p-7 sm:p-9 bg-white border border-[#E2DFD8] hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(200,168,78,0.1)] hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Gold Top Slide Line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-400 ease-out" />

              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-xs text-[var(--color-accent)] tracking-widest">
                    02
                  </span>
                  <span className="text-[var(--color-accent)]">&middot;</span>
                  <span className="text-micro text-[var(--color-text-muted)] font-semibold tracking-wider">
                    VOICE &amp; WHATSAPP
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xs border border-[#E2DFD8] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-white transition-colors" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                {siteData.personal.phone}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#8A8882]">
                <Clock className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
                <span>Mon – Sat, 9:00 AM – 7:00 PM PKT</span>
              </div>
            </motion.a>

            {/* Card 03: Studio Base & Global Reach */}
            <motion.div
              className="p-7 sm:p-9 bg-white border border-[#E2DFD8] relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-xs text-[var(--color-accent)] tracking-widest">
                    03
                  </span>
                  <span className="text-[var(--color-accent)]">&middot;</span>
                  <span className="text-micro text-[var(--color-text-muted)] font-semibold tracking-wider">
                    STUDIO BASE &amp; REACH
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xs border border-[#E2DFD8] flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                </div>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#111111] mb-2">
                {siteData.personal.location}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#8A8882]">
                <Globe className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
                <span>Serving Pakistan &amp; International Clients (Guyana, UAE, UK)</span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
