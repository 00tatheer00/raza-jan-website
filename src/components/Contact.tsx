"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
      ref={ref}
      style={{ paddingTop: "clamp(6rem, 12vh, 12rem)", paddingBottom: "clamp(6rem, 12vh, 12rem)" }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-10"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

          {/* ── Left Column: CTA ── */}
          <div className="lg:col-span-6">
            {/* Heading */}
            <motion.h2
              className="text-display font-display font-bold tracking-[-0.02em] leading-[0.92] mb-10"
              initial={{ opacity: 0, y: 35 }}
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
                  className="absolute -bottom-3 left-0 h-[2px] bg-[var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </span>
              <span className="text-[var(--color-accent)]">.</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-[var(--color-text-secondary)] text-base md:text-lg leading-[1.85] max-w-lg mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Available for architectural design, interior design, 3D visualization,
              master planning, and turnkey project site execution worldwide.
            </motion.p>

            {/* Availability */}
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-3 bg-[var(--color-bg-alt)] border border-[var(--color-border)] mb-12"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-text)]">
                AVAILABLE FOR NEW COMMISSIONS
              </span>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href={`mailto:${siteData.personal.email}`}
                className="btn-primary group py-5 px-10"
              >
                EMAIL DIRECTLY
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${siteData.personal.phone}`}
                className="btn-outline group py-5 px-10"
              >
                CALL NOW
                <Phone className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* ── Right Column: Contact Cards ── */}
          <div className="lg:col-span-6 space-y-6 lg:pt-6">

            {/* Email Card */}
            <motion.a
              href={`mailto:${siteData.personal.email}`}
              className="group block p-8 md:p-10 border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-bg-alt)]/30 hover:bg-[var(--color-bg-alt)] transition-all duration-400 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-micro text-[var(--color-accent)] font-semibold">
                      EMAIL
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {siteData.personal.email}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Typical response within 24 hours
                  </p>
                </div>
                <div className="w-10 h-10 border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              href={`tel:${siteData.personal.phone}`}
              className="group block p-8 md:p-10 border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-bg-alt)]/30 hover:bg-[var(--color-bg-alt)] transition-all duration-400 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-micro text-[var(--color-accent)] font-semibold">
                      PHONE / WHATSAPP
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {siteData.personal.phone}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Mon – Sat, 9:00 AM – 7:00 PM PKT
                  </p>
                </div>
                <div className="w-10 h-10 border border-[var(--color-border)] group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] flex items-center justify-center transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              className="p-8 md:p-10 border border-[var(--color-border)] bg-[var(--color-bg-alt)]/30 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-micro text-[var(--color-accent)] font-semibold">
                      BASED IN
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--color-text)]">
                    {siteData.personal.location}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Pakistan &amp; International — Guyana, UAE, UK
                  </p>
                </div>
                <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
