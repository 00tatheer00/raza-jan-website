"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-12 md:py-16 text-[var(--color-text-secondary)]"
      ref={ref}
    >
      {/* Subtle gold accent top line */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-[var(--color-accent)]"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left text-xs text-[var(--color-text-muted)]">
          <span className="font-display font-semibold text-[var(--color-text)]">
            SYED RAZA JAN
          </span>
          <span className="hidden sm:inline">&middot;</span>
          <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
        </div>

        {/* Center/Right: Quick Minimal Navigation & Back to Top */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
          {siteData.navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              {item.label}
            </a>
          ))}

          <Link
            href="/admin"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
            title="Studio Admin Portal"
          >
            <span>CMS</span>
          </Link>

          <span className="text-[var(--color-border)] hidden sm:inline">|</span>

          {/* Back to top */}
          <button
            onClick={handleScrollToTop}
            className="group inline-flex items-center gap-1.5 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors font-medium cursor-pointer"
            aria-label="Back to top"
          >
            <span className="text-micro" style={{ fontSize: "0.65rem" }}>
              TOP
            </span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
