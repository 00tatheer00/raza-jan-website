"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.3 });

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
      className="relative border-t border-[var(--color-border)]"
      style={{ backgroundColor: "var(--color-bg-dark)" }}
      ref={ref}
    >
      {/* Gold accent line at top */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Left - Name & Title */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display text-xl font-bold tracking-[0.1em] text-[var(--color-white)] mb-2">
                SYED RAZA JAN
              </h3>
              <p
                className="tracking-[0.15em] uppercase"
                style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
              >
                Architect / Designer
              </p>

              {/* Vertical line with dot */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-px h-10 bg-[var(--color-accent)] relative">
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                </div>
                <p
                  className="max-w-xs leading-relaxed"
                  style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
                >
                  Creating architecture that inspires and endures.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Middle - Navigation */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4
                className="text-micro mb-6"
                style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}
              >
                NAVIGATION
              </h4>
              <div className="grid grid-cols-2 gap-3">
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
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Contact */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4
                className="text-micro mb-6"
                style={{ fontSize: "0.6rem", color: "var(--color-text-muted)" }}
              >
                CONTACT
              </h4>
              <div className="space-y-3">
                <a
                  href={`mailto:${siteData.personal.email}`}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors block"
                >
                  {siteData.personal.email}
                </a>
                <a
                  href={`tel:${siteData.personal.phone}`}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors block"
                >
                  {siteData.personal.phone}
                </a>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {siteData.personal.location}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-border-dark)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            className="text-[var(--color-text-muted)]"
            style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            © 2026 Syed Raza Jan. All Rights Reserved.
          </motion.p>

          {/* Back to top */}
          <motion.button
            onClick={handleScrollToTop}
            className="group flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            aria-label="Back to top"
          >
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Back to Top
            </span>
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
