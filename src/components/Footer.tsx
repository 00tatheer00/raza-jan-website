"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

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
    <footer
      className="relative border-t border-[#2A2A2A] text-[#E0DFDC] overflow-hidden"
      style={{ backgroundColor: "#0D0D0D" }}
      ref={ref}
    >
      {/* Precision Gold Accent Top Border */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="container-custom pt-24 pb-14 lg:pt-32 lg:pb-18">

        {/* Top Branding Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 lg:pb-20 border-b border-[#222222]">
          <div>
            <motion.span
              className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.25em] block mb-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              PORTFOLIO ARCHITECTURE STUDIO
            </motion.span>
            <motion.h2
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              SYED RAZA JAN
            </motion.h2>
          </div>

          <motion.div
            className="flex items-center gap-3 px-5 py-2.5 bg-[#171717] border border-[#2B2B2B]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#C4C2BC]">
              ACCEPTING COMMISSIONS WORLDWIDE
            </span>
          </motion.div>
        </div>

        {/* Main 4-Column Grid with Deep Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 py-16 lg:py-24 border-b border-[#222222]">
          
          {/* Column 1: Studio Identity & Ethos (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-display text-lg font-bold tracking-[0.1em] text-white">
                DESIGN PHILOSOPHY
              </h3>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] mt-1 font-semibold">
                Precision &middot; Purpose &middot; Character
              </p>

              {/* Architectural Ethos with Gold Vertical Line */}
              <div className="mt-6 flex items-start gap-4 pt-2">
                <div className="w-px h-16 bg-[var(--color-accent)] shrink-0 relative mt-1">
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                </div>
                <p className="text-sm leading-[1.8] text-[#9C9A94] max-w-sm">
                  Designing spaces with precision, purpose, and visual character.
                  Committed to delivering world-class architectural solutions from concept to turnkey execution.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Navigation Links (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                NAVIGATION
              </h4>
              <ul className="space-y-3.5">
                {[
                  { label: "About Architect", href: "#about" },
                  { label: "Expertise", href: "#expertise" },
                  { label: "Experience", href: "#experience" },
                  { label: "Selected Projects", href: "#projects" },
                  { label: "Technical Skills", href: "#skills" },
                  { label: "Education", href: "#education" },
                  { label: "Get in Touch", href: "#contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-sm text-[#9C9A94] hover:text-[var(--color-accent)] hover:translate-x-1.5 transition-all duration-300 inline-block font-medium"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Column 3: Practice Areas (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                PRACTICE AREAS
              </h4>
              <ul className="space-y-4 text-sm text-[#9C9A94]">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                  <span>Architectural Design &amp; Planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                  <span>Luxury Interior Architecture</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                  <span>Photorealistic 3D Visualization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                  <span>On-Site Project Execution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                  <span>Master Planning &amp; Urban Design</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Column 4: Direct Inquiries (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                DIRECT CONTACT
              </h4>
              <div className="space-y-5">
                {/* Email */}
                <a
                  href={`mailto:${siteData.personal.email}`}
                  className="group flex items-start gap-3.5 text-sm text-[#E0DFDC] hover:text-[var(--color-accent)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xs bg-[#1A1A1A] border border-[#2B2B2B] group-hover:border-[var(--color-accent)] flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
                      {siteData.personal.email}
                    </span>
                    <span className="text-xs text-[#8A8882]">Direct Portfolio Mailbox</span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${siteData.personal.phone}`}
                  className="group flex items-start gap-3.5 text-sm text-[#E0DFDC] hover:text-[var(--color-accent)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xs bg-[#1A1A1A] border border-[#2B2B2B] group-hover:border-[var(--color-accent)] flex items-center justify-center shrink-0 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
                      {siteData.personal.phone}
                    </span>
                    <span className="text-xs text-[#8A8882]">Mon – Sat, 9:00 AM – 7:00 PM</span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-3.5 text-sm text-[#9C9A94]">
                  <div className="w-8 h-8 rounded-xs bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <span className="block font-semibold text-white">{siteData.personal.location}</span>
                    <span className="text-xs text-[#8A8882]">Pakistan &amp; Overseas Commissions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Bar with Distinct Spacing */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            className="text-xs text-[#8A8882] tracking-wider text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            &copy; {new Date().getFullYear()} Syed Raza Jan. All Rights Reserved. &middot; Architecture, Interior &amp; 3D Visualization
          </motion.p>

          {/* Back to Top Action */}
          <motion.button
            onClick={handleScrollToTop}
            className="group flex items-center gap-3 px-6 py-3 border border-[#333333] hover:border-[var(--color-accent)] bg-[#141414] hover:bg-[#1A1A1A] text-xs text-[#E0DFDC] hover:text-[var(--color-accent)] transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            aria-label="Back to top"
          >
            <span className="font-semibold tracking-[0.2em] uppercase">
              BACK TO TOP
            </span>
            <div className="w-6 h-6 rounded-full bg-[#242424] group-hover:bg-[var(--color-accent)] group-hover:text-black flex items-center justify-center transition-all duration-300">
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.button>
        </div>

      </div>
    </footer>
  );
}
