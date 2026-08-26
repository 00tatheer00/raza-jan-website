"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteData } from "@/data/siteData";
import { ArrowDown, ArrowRight } from "lucide-react";

export default function Hero() {
  const handleScrollTo = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "clamp(6rem, 10vh, 8rem)" }}
    >
      {/* Background architectural grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical line left */}
        <motion.div
          className="absolute left-[8%] top-0 bottom-0 w-px bg-[var(--color-border)] opacity-40"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        />
        {/* Vertical line right */}
        <motion.div
          className="absolute right-[8%] top-0 bottom-0 w-px bg-[var(--color-border)] opacity-40 hidden lg:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 2.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        />
      </div>

      <div className="container-custom w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1 relative z-10">
            {/* Top label */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <span className="w-8 h-px bg-[var(--color-accent)]" />
              <span className="text-micro text-[var(--color-text-secondary)]" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
                ARCHITECT / DESIGNER / 3D VISUALIZATION
              </span>
            </motion.div>

            {/* Main heading */}
            <div className="mb-6 lg:mb-8">
              <div className="overflow-hidden">
                <motion.h1
                  className="text-hero font-display font-bold leading-[0.85] tracking-[-0.03em]"
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  SYED
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  className="text-hero font-display font-bold leading-[0.85] tracking-[-0.03em]"
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 2.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="relative">
                    RAZA
                    <motion.span
                      className="absolute -bottom-2 left-0 h-[3px] bg-[var(--color-accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 3.6 }}
                    />
                  </span>{" "}
                  <span className="text-[var(--color-accent)]">JAN</span>
                </motion.h1>
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-subheading max-w-md mb-3 leading-relaxed"
              style={{ fontSize: "var(--text-subheading)", color: "var(--color-text)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.0 }}
            >
              {siteData.personal.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              className="max-w-lg mb-10 leading-relaxed"
              style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.2 }}
            >
              {siteData.personal.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.4 }}
            >
              <button
                onClick={() => handleScrollTo("#experience")}
                className="btn-primary group"
              >
                VIEW EXPERIENCE
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => handleScrollTo("#contact")}
                className="btn-outline group"
              >
                GET IN TOUCH
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right - Portrait */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Yellow architectural accent behind image */}
              <motion.div
                className="absolute -right-4 md:-right-6 top-8 md:top-12 w-px bg-[var(--color-accent)]"
                initial={{ height: 0 }}
                animate={{ height: "80%" }}
                transition={{ duration: 1.2, delay: 3.2 }}
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              </motion.div>

              {/* Horizontal yellow line */}
              <motion.div
                className="absolute -bottom-4 md:-bottom-6 left-8 md:left-12 h-px bg-[var(--color-accent)]"
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 3.4 }}
              />

              {/* Image container */}
              <div className="relative w-[280px] h-[370px] sm:w-[320px] sm:h-[420px] md:w-[380px] md:h-[500px] lg:w-[420px] lg:h-[540px] overflow-hidden">
                <Image
                  src={siteData.personal.profileImage}
                  alt={`${siteData.personal.name} — Architect`}
                  fill
                  className="object-cover object-center grayscale contrast-[1.05]"
                  priority
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 380px, 420px"
                />
                {/* Subtle overlay for editorial feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/10 to-transparent" />
              </div>

              {/* Corner accent */}
              <div className="absolute -top-3 -left-3 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-px bg-[var(--color-accent)]" />
                <div className="absolute top-0 left-0 h-full w-px bg-[var(--color-accent)]" />
              </div>

              {/* Experience badge */}
              <motion.div
                className="absolute -left-2 md:-left-8 bottom-12 md:bottom-16 bg-[var(--color-bg)] px-4 py-3 border border-[var(--color-border)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 3.6 }}
              >
                <span className="font-display text-3xl md:text-4xl font-bold text-[var(--color-accent)] block leading-none">
                  09+
                </span>
                <span className="text-micro text-[var(--color-text-secondary)] mt-1 block" style={{ fontSize: "0.55rem" }}>
                  YEARS OF<br />EXPERIENCE
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 0.6 }}
      >
        <span className="text-micro text-[var(--color-text-muted)]" style={{ fontSize: "0.6rem" }}>
          SCROLL
        </span>
        <motion.div
          className="w-px h-8 bg-[var(--color-accent)]"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
