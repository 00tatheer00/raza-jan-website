"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp } from "lucide-react";

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
      className="relative border-t border-[#222222] text-[#E0DFDC]"
      style={{ backgroundColor: "#0C0C0C" }}
      ref={ref}
    >
      {/* Subtle Gold Accent Top Line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="container-custom py-16 lg:py-20">
        {/* Main Clean 3-Part Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start pb-12 border-b border-[#1E1E1E]">
          
          {/* Brand Column (Left) */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              SYED RAZA JAN
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-accent)] font-medium">
              Architect &middot; Interior Designer &middot; 3D Specialist
            </p>
            <p className="text-xs text-[#8A8882] tracking-wide pt-1">
              Islamabad, Pakistan
            </p>
          </div>

          {/* Minimal Navigation (Center) */}
          <div className="md:col-span-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { label: "About", href: "#about" },
                { label: "Expertise", href: "#expertise" },
                { label: "Experience", href: "#experience" },
                { label: "Projects", href: "#projects" },
                { label: "Skills", href: "#skills" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-sm text-[#9C9A94] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Inquiries (Right) */}
          <div className="md:col-span-3 md:text-right space-y-2">
            <a
              href={`mailto:${siteData.personal.email}`}
              className="block text-sm text-white hover:text-[var(--color-accent)] transition-colors font-medium"
            >
              {siteData.personal.email}
            </a>
            <a
              href={`tel:${siteData.personal.phone}`}
              className="block text-sm text-[#9C9A94] hover:text-[var(--color-accent)] transition-colors"
            >
              {siteData.personal.phone}
            </a>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#73716C]">
          <p>
            &copy; {new Date().getFullYear()} Syed Raza Jan. All Rights Reserved.
          </p>

          <button
            onClick={handleScrollToTop}
            className="group inline-flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.15em] font-medium"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
