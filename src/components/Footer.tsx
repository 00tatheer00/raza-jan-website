"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

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
      id="contact"
      className="relative bg-[var(--color-bg)] py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden"
      ref={ref}
    >
      {/* ══════════════════════════════════════════════════════════
          LARGE CENTERED UNIFIED ARCHITECTURAL CONTAINER (FLOATING CARD)
          ══════════════════════════════════════════════════════════ */}
      <div className="w-[92%] sm:w-[94%] max-w-[1400px] mx-auto bg-white rounded-[22px] md:rounded-[28px] border border-[#E8E6E1] shadow-[0_12px_44px_rgba(0,0,0,0.035)] overflow-hidden relative z-10">
        
        {/* ── TOP PART: COMPACT BLACK CTA PANEL ── */}
        <div className="bg-[#0A0A0A] text-white py-14 sm:py-16 md:py-20 px-6 sm:px-12 text-center relative overflow-hidden rounded-t-[22px] md:rounded-t-[28px]">
          {/* Subtle architectural radial lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 30%, #202020 0%, #0A0A0A 80%)",
            }}
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-3.5">
            <motion.h3
              className="font-display text-2xl sm:text-3xl md:text-[2rem] font-medium tracking-tight text-white leading-snug"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to create something exceptional?
            </motion.h3>

            <motion.p
              className="text-xs sm:text-sm text-[#8E8C85] max-w-md mx-auto leading-relaxed font-normal"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Let&apos;s bring thoughtful architecture, interior design and visualization together.
            </motion.p>

            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href={`mailto:${siteData.personal.email}`}
                className="inline-block px-5 py-2.5 bg-white text-black font-semibold text-xs tracking-wider rounded-md hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 shadow-sm"
              >
                START A PROJECT
              </a>
            </motion.div>
          </div>
        </div>

        {/* ── LOWER PART: WHITE EDITORIAL FOOTER ── */}
        <div className="bg-white pt-12 sm:pt-14 md:pt-16 pb-7 md:pb-9 px-6 sm:px-10 md:px-14 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Side: Brand Identity + Description + Minimal Socials */}
            <div className="lg:col-span-5 space-y-3.5">
              <div>
                <h4 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                  SYED RAZA JAN
                </h4>
                <p className="text-[0.7rem] uppercase tracking-wider text-[var(--color-accent)] font-semibold mt-1">
                  ARCHITECT &middot; INTERIOR DESIGNER &middot; 3D VISUALIZATION SPECIALIST
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-sm">
                Creating thoughtful spaces through architecture, design and visualization.
              </p>

              {/* Minimal Monochrome Social Icons */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3 h-3 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="X / Twitter"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side: 3 Compact Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Column 01: NAVIGATION */}
              <div className="space-y-3">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  NAVIGATION
                </h5>
                <ul className="space-y-2 text-xs text-[#666666]">
                  {siteData.navigation.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="hover:text-black transition-colors inline-block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 02: EXPERTISE */}
              <div className="space-y-3">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  EXPERTISE
                </h5>
                <ul className="space-y-2 text-xs text-[#666666]">
                  <li>Architectural Design</li>
                  <li>Interior Design</li>
                  <li>3D Visualization</li>
                  <li>Site Execution</li>
                  <li>Master Planning</li>
                </ul>
              </div>

              {/* Column 03: CONTACT */}
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  CONTACT
                </h5>
                <ul className="space-y-2 text-xs text-[#666666]">
                  <li>{siteData.personal.location}</li>
                  <li>
                    <a
                      href={`tel:${siteData.personal.phone}`}
                      className="hover:text-black transition-colors"
                    >
                      {siteData.personal.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${siteData.personal.email}`}
                      className="hover:text-black transition-colors break-all"
                    >
                      {siteData.personal.email}
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Thin Bottom Divider & Row */}
          <div className="border-t border-[#EDEDED] mt-10 md:mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E8C85]">
            <p>
              &copy; {new Date().getFullYear()} Syed Raza Jan
            </p>
            <p>
              Islamabad, Pakistan
            </p>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          GIANT FAINT BACKGROUND TYPOGRAPHY (WATERMARK)
          ══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-display font-bold text-[15vw] leading-none text-[#000000]/[0.035] tracking-tight whitespace-nowrap translate-y-[32%]">
          SYED RAZA JAN
        </span>
      </div>

    </footer>
  );
}
