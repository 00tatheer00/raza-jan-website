"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

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
      className="relative border-t border-[var(--color-border-dark)] text-[#E0DFDC]"
      style={{ backgroundColor: "#111111" }}
      ref={ref}
    >
      {/* Precision Gold Accent Top Border */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="container-custom pt-20 pb-12 lg:pt-24 lg:pb-16">
        
        {/* Main Grid: 4 Spacious Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 lg:pb-20 border-b border-[#262626]">
          
          {/* Column 1: Studio Identity & Ethos (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h3 className="font-display text-2xl font-bold tracking-[0.12em] text-white">
                SYED RAZA JAN
              </h3>
              <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-accent)] mt-1.5 font-semibold">
                Architect &middot; Interior Designer &middot; 3D Specialist
              </p>

              {/* Architectural Ethos with Gold Vertical Line */}
              <div className="mt-6 flex items-start gap-4 pt-2">
                <div className="w-px h-14 bg-[var(--color-accent)] shrink-0 relative mt-1">
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                </div>
                <p className="text-sm leading-relaxed text-[#9C9A94] max-w-sm">
                  Designing spaces with precision, purpose, and visual character.
                  Committed to delivering world-class architectural solutions from concept to turnkey execution.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Quick Navigation (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                NAVIGATION
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "About Architect", href: "#about" },
                  { label: "Expertise", href: "#expertise" },
                  { label: "Experience", href: "#experience" },
                  { label: "Selected Projects", href: "#projects" },
                  { label: "Technical Skills", href: "#skills" },
                  { label: "Education", href: "#education" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-sm text-[#9C9A94] hover:text-[var(--color-accent)] hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Column 3: Core Disciplines (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                PRACTICE AREAS
              </h4>
              <ul className="space-y-3 text-sm text-[#9C9A94]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  <span>Architectural Design & Planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  <span>Luxury Interior Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  <span>Photorealistic 3D Visualization</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  <span>On-Site Project Execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  <span>Master Planning & Urban Design</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Column 4: Direct Inquiries (Col Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <h4 className="text-micro text-[var(--color-accent)] font-semibold tracking-[0.2em] mb-6">
                DIRECT INQUIRIES
              </h4>
              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${siteData.personal.email}`}
                  className="group flex items-start gap-3 text-sm text-[#E0DFDC] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-medium">{siteData.personal.email}</span>
                    <span className="text-xs text-[#8A8882]">Direct Portfolio Mailbox</span>
                  </div>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${siteData.personal.phone}`}
                  className="group flex items-start gap-3 text-sm text-[#E0DFDC] hover:text-[var(--color-accent)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <div>
                    <span className="block font-medium">{siteData.personal.phone}</span>
                    <span className="text-xs text-[#8A8882]">Available Mon – Sat</span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-3 text-sm text-[#9C9A94]">
                  <MapPin className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-[#E0DFDC]">{siteData.personal.location}</span>
                    <span className="text-xs text-[#8A8882]">Pakistan & Overseas Projects</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            className="text-xs text-[#8A8882] tracking-wider"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            &copy; {new Date().getFullYear()} Syed Raza Jan. All Rights Reserved. &middot; Architecture & 3D Visualization
          </motion.p>

          {/* Back to Top Action */}
          <motion.button
            onClick={handleScrollToTop}
            className="group flex items-center gap-3 px-5 py-2.5 border border-[#333333] hover:border-[var(--color-accent)] text-xs text-[#E0DFDC] hover:text-[var(--color-accent)] transition-all duration-300"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.65 }}
            aria-label="Back to top"
          >
            <span className="font-semibold tracking-[0.2em] uppercase">
              BACK TO TOP
            </span>
            <div className="w-6 h-6 rounded-full bg-[#1F1F1F] group-hover:bg-[var(--color-accent)] group-hover:text-black flex items-center justify-center transition-all duration-300">
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.button>
        </div>

      </div>
    </footer>
  );
}
