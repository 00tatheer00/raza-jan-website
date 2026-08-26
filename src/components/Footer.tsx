"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp, Mail, Phone, MapPin, Send, Compass, Layers, Building2 } from "lucide-react";

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[var(--color-bg)] overflow-hidden" ref={ref}>
      
      {/* ══════════════════════════════════════════════════════════
          TOP SECTION: Dark Atmospheric CTA Banner (Curved Bottom)
          ══════════════════════════════════════════════════════════ */}
      <div className="bg-[#0A0A0A] text-white pt-24 pb-28 md:pt-32 md:pb-36 px-6 text-center rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        {/* Subtle architectural radial lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-radial from-[rgba(200,168,78,0.12)] via-transparent to-transparent pointer-events-none blur-3xl" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <motion.span
            className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.25em] uppercase block"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            LET&apos;S COLLABORATE
          </motion.span>

          <motion.h2
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Ready to bring your architectural vision to life?
          </motion.h2>

          <motion.p
            className="text-sm md:text-base text-[#9E9C96] max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Delivering precision architectural design, luxury interiors, and photorealistic 3D visualizations for clients worldwide.
          </motion.p>

          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <a
              href={`mailto:${siteData.personal.email}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide rounded-xl hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Get in touch</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM SECTION: Floating White Card + Huge Watermark
          ══════════════════════════════════════════════════════════ */}
      <div className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Floating Card Container */}
        <div className="container-custom max-w-6xl mx-auto relative z-10">
          <motion.div
            className="bg-white border border-[var(--color-border)] rounded-2xl md:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-10 border-b border-[#F0EFEB]">
              
              {/* Left Brand Column (Span 6) */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0F0F0F] flex items-center justify-center text-white">
                    <span className="font-display font-bold text-sm tracking-wider text-[var(--color-accent)]">
                      SRJ
                    </span>
                  </div>
                  <span className="font-display font-bold text-xl tracking-tight text-[var(--color-text)]">
                    Syed Raza Jan
                  </span>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                  Architect and 3D Visualization Specialist with 9+ years of professional experience delivering functional, innovative, and aesthetically refined spaces.
                </p>

                {/* Contact Icons Row */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`mailto:${siteData.personal.email}`}
                    className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${siteData.personal.phone}`}
                    className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                    aria-label="Phone"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <div
                    className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)]"
                    title={siteData.personal.location}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Right Columns (Span 6: 3 Columns) */}
              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
                
                {/* Col 1: Navigation */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                    Navigation
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
                    {siteData.navigation.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className="hover:text-[var(--color-accent)] transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 2: Services */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                    Services
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
                    <li>Architecture</li>
                    <li>Interior Design</li>
                    <li>3D Visualization</li>
                    <li>Site Execution</li>
                    <li>Master Planning</li>
                  </ul>
                </div>

                {/* Col 3: Contact */}
                <div className="space-y-3.5 col-span-2 sm:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                    Connect
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
                    <li>
                      <a
                        href={`mailto:${siteData.personal.email}`}
                        className="hover:text-[var(--color-accent)] transition-colors break-all"
                      >
                        Email Me
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${siteData.personal.phone}`}
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        Call Now
                      </a>
                    </li>
                    <li>Islamabad, PK</li>
                    <li>Guyana Projects</li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Card Bottom Sub-bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
              <p>
                &copy; {new Date().getFullYear()} Syed Raza Jan. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={handleScrollToTop}
                  className="inline-flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors font-medium cursor-pointer"
                >
                  <span>Back to top</span>
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            Huge Faded Watermark Background Text (like "Graphy")
            ══════════════════════════════════════════════════════════ */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display font-bold text-[14vw] leading-none text-[#0A0A0A]/[0.035] tracking-tight whitespace-nowrap translate-y-1/4">
            RAZA JAN
          </span>
        </div>

      </div>

    </footer>
  );
}
