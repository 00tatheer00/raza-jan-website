"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp, Send } from "lucide-react";

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
    <footer className="relative bg-[var(--color-bg)] pt-12 pb-16 md:pb-24 overflow-hidden" ref={ref}>
      
      {/* ══════════════════════════════════════════════════════════
          TOP SECTION: Curved Dark Atmospheric CTA
          ══════════════════════════════════════════════════════════ */}
      <div className="w-[92%] sm:w-[94%] max-w-[1400px] mx-auto mb-10 md:mb-14">
        <motion.div
          className="bg-[#0A0A0A] text-white py-16 sm:py-20 md:py-24 px-6 md:px-12 text-center rounded-[24px] md:rounded-[32px] relative overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Radial depth lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 20%, #262626 0%, #0A0A0A 80%)",
            }}
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white leading-tight">
              Ready to create something exceptional?
            </h3>

            <p className="text-xs sm:text-sm text-[#8E8C85] max-w-md mx-auto leading-relaxed">
              Let&apos;s bring thoughtful architecture, interior design and visualization together.
            </p>

            <div className="pt-3">
              <a
                href={`mailto:${siteData.personal.email}`}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white text-black font-semibold text-xs tracking-wider rounded-lg hover:bg-[var(--color-accent)] hover:text-white transition-all duration-300 shadow-md"
              >
                <span>GET IN TOUCH</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM SECTION: Floating Rounded White Card
          ══════════════════════════════════════════════════════════ */}
      <div className="w-[92%] sm:w-[94%] max-w-[1400px] mx-auto relative z-10">
        <motion.div
          className="bg-white border border-[#E8E6E1] rounded-[24px] md:rounded-[32px] p-8 sm:p-10 md:p-14 shadow-[0_12px_44px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-10 md:pb-12 border-b border-[#EFEFEA]">
            
            {/* Left Brand Column (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#0F0F0F] flex items-center justify-center text-white">
                  <span className="font-display font-bold text-xs tracking-wider text-[var(--color-accent)]">
                    SRJ
                  </span>
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-[#111111]">
                  Syed Raza Jan
                </span>
              </div>

              <p className="text-xs text-[var(--color-accent)] font-medium tracking-wide">
                Architect &middot; Interior Designer &middot; 3D Specialist
              </p>

              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-sm">
                Creating thoughtful spaces through architecture, design and visualization.
              </p>

              {/* Minimal Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
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
                  className="w-8 h-8 rounded-md border border-[#E5E3DC] flex items-center justify-center text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors"
                  aria-label="X / Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side (Span 7: 3 Columns) */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Col 1: NAVIGATION */}
              <div className="space-y-3">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  NAVIGATION
                </h5>
                <ul className="space-y-2.5 text-xs text-[#666666]">
                  {siteData.navigation.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="hover:text-black transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: EXPERTISE */}
              <div className="space-y-3">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  EXPERTISE
                </h5>
                <ul className="space-y-2.5 text-xs text-[#666666]">
                  <li>Architectural Design</li>
                  <li>Interior Design</li>
                  <li>3D Visualization</li>
                  <li>Site Execution</li>
                  <li>Master Planning</li>
                </ul>
              </div>

              {/* Col 3: CONNECT */}
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <h5 className="text-[0.7rem] uppercase font-bold tracking-wider text-[#111111]">
                  CONNECT
                </h5>
                <ul className="space-y-2.5 text-xs text-[#666666]">
                  <li>
                    <a
                      href={`mailto:${siteData.personal.email}`}
                      className="hover:text-black transition-colors break-all"
                    >
                      Email Me
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${siteData.personal.phone}`}
                      className="hover:text-black transition-colors"
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

          {/* Sub-bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8C85]">
            <p>
              &copy; {new Date().getFullYear()} Syed Raza Jan. All rights reserved.
            </p>

            <button
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[var(--color-accent)] transition-colors font-medium cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          Giant Background Typography Watermark
          ══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-display font-bold text-[15vw] leading-none text-[#000000]/[0.035] tracking-tight whitespace-nowrap translate-y-[30%]">
          RAZA JAN
        </span>
      </div>

    </footer>
  );
}
