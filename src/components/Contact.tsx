"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-10 md:mb-14"
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── Left Column: Editorial Heading & Action Buttons ── */}
          <div className="lg:col-span-6 space-y-8">
            <motion.h2
              className="text-display font-display font-bold tracking-[-0.02em] leading-[0.95]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              LET&apos;S BUILD
              <br />
              <span className="text-[var(--color-text-secondary)]">SOMETHING</span>
              <br />
              <span className="relative inline-block">
                MEANINGFUL
                <motion.span
                  className="absolute -bottom-2 left-0 h-[2px] bg-[var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
              <span className="text-[var(--color-accent)]">.</span>
            </motion.h2>

            <motion.p
              className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Available for architectural design, interior design, 3D visualization,
              master planning, and turnkey project site execution worldwide.
            </motion.p>

            {/* Availability Pill */}
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--color-bg-alt)] border border-[var(--color-border)] text-xs font-semibold tracking-wider text-[var(--color-text)]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AVAILABLE FOR NEW COMMISSIONS &amp; CONSULTING</span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-2"
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

          {/* ── Right Column: Architectural Contact Cards ── */}
          <div className="lg:col-span-6 space-y-4 lg:pt-2">
            
            {/* Email Card */}
            <motion.a
              href={`mailto:${siteData.personal.email}`}
              className="group block p-6 md:p-8 border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-micro text-[var(--color-accent)] font-semibold mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>DIRECT EMAIL</span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {siteData.personal.email}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Typical response within 24 hours
                  </p>
                </div>
                <div className="w-9 h-9 border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              href={`tel:${siteData.personal.phone}`}
              className="group block p-6 md:p-8 border border-[var(--color-border)] bg-white hover:border-[var(--color-accent)] transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-micro text-[var(--color-accent)] font-semibold mb-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>PHONE &amp; WHATSAPP</span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {siteData.personal.phone}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Available Mon – Sat, 9:00 AM – 7:00 PM PKT
                  </p>
                </div>
                <div className="w-9 h-9 border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              className="p-6 md:p-8 border border-[var(--color-border)] bg-white relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-micro text-[var(--color-accent)] font-semibold mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>LOCATION</span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-[var(--color-text)]">
                    {siteData.personal.location}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Pakistan &amp; International Projects (Guyana, UAE, UK)
                  </p>
                </div>
                <div className="w-9 h-9 border border-[var(--color-border)] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
