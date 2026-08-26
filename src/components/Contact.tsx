"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section id="contact" className="section-padding relative" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left - Large CTA */}
          <div className="lg:col-span-7">
            <motion.h2
              className="text-display font-display font-bold tracking-[-0.02em] leading-[0.95] mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
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
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
              <span className="text-[var(--color-accent)]">.</span>
            </motion.h2>

            <motion.p
              className="max-w-lg mb-10 leading-relaxed"
              style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Available for architectural design, interior design, 3D
              visualization, planning, and project collaboration.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={`mailto:${siteData.personal.email}`}
                className="btn-primary group"
              >
                EMAIL ME
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${siteData.personal.phone}`}
                className="btn-outline group"
              >
                CALL NOW
                <Phone className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Right - Contact Info */}
          <div className="lg:col-span-5 lg:pt-8">
            <motion.div
              className="space-y-0"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Name */}
              <div className="py-6 border-b border-[var(--color-border)]">
                <span className="text-micro text-[var(--color-text-muted)] block mb-2" style={{ fontSize: "0.6rem" }}>
                  NAME
                </span>
                <span className="font-display font-semibold text-lg">
                  {siteData.personal.name}
                </span>
              </div>

              {/* Phone */}
              <div className="py-6 border-b border-[var(--color-border)] group">
                <span className="text-micro text-[var(--color-text-muted)] block mb-2" style={{ fontSize: "0.6rem" }}>
                  PHONE
                </span>
                <a
                  href={`tel:${siteData.personal.phone}`}
                  className="flex items-center gap-3 group-hover:text-[var(--color-accent)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-medium">{siteData.personal.phone}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Email */}
              <div className="py-6 border-b border-[var(--color-border)] group">
                <span className="text-micro text-[var(--color-text-muted)] block mb-2" style={{ fontSize: "0.6rem" }}>
                  EMAIL
                </span>
                <a
                  href={`mailto:${siteData.personal.email}`}
                  className="flex items-center gap-3 group-hover:text-[var(--color-accent)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-medium">{siteData.personal.email}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Location */}
              <div className="py-6">
                <span className="text-micro text-[var(--color-text-muted)] block mb-2" style={{ fontSize: "0.6rem" }}>
                  LOCATION
                </span>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="font-medium">
                    {siteData.personal.location}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Architectural accent lines */}
      <motion.div
        className="absolute left-[4%] top-0 w-px h-full hidden xl:block"
        style={{ background: "var(--color-border)", opacity: 0.3, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5 }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      </motion.div>

      <motion.div
        className="absolute right-[4%] top-0 w-px h-full hidden xl:block"
        style={{ background: "var(--color-border)", opacity: 0.3, transformOrigin: "bottom" }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <span className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </section>
  );
}
