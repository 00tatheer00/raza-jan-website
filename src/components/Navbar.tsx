"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteData } from "@/data/siteData";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleSectionObserver = () => {
      const sections = siteData.navigation.map((item) =>
        document.querySelector(item.href)
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${entry.target.id}`);
            }
          });
        },
        { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
      );

      sections.forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => observer.disconnect();
    };

    window.addEventListener("scroll", handleScroll);
    const cleanup = handleSectionObserver();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanup?.();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-border)]"
            : "py-5 bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-display font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                isScrolled ? "text-base" : "text-lg"
              }`}
            >
              SYED RAZA JAN
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:scale-125 transition-transform" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {siteData.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative group"
              >
                <span
                  className={`text-label transition-colors duration-300 ${
                    activeSection === item.href
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                  style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}
                >
                  {item.label}
                </span>
                {/* Active indicator */}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-[var(--color-accent)] transition-all duration-300 ${
                    activeSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              className="w-6 h-px bg-[var(--color-text)] block"
              animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 3.5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-6 h-px bg-[var(--color-text)] block"
              animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -3.5 : 0,
                opacity: isMobileMenuOpen ? 1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Decorative vertical line */}
            <motion.div
              className="absolute left-8 top-0 w-px bg-[var(--color-border)]"
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <span className="absolute top-2/4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <span className="absolute top-3/4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            </motion.div>

            <nav className="flex flex-col items-center gap-8">
              {siteData.navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group flex items-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="section-number text-xs">
                    0{index + 1}
                  </span>
                  <span className="font-display text-2xl md:text-3xl font-semibold tracking-[0.05em] uppercase group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            {/* Contact info at bottom */}
            <motion.div
              className="absolute bottom-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-micro text-[var(--color-text-muted)] mb-2">
                {siteData.personal.email}
              </p>
              <p className="text-micro text-[var(--color-text-muted)]">
                {siteData.personal.location}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
