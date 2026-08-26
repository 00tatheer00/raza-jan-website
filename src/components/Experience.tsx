"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Experience() {
  const { ref, isInView } = useInView({ threshold: 0.05 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="experience" className="section-padding relative" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-number">03</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            CAREER PATH
          </span>
        </motion.div>

        {/* Section Title & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-20 md:mb-28">
          <div className="lg:col-span-7">
            <motion.h2
              className="text-display font-display font-bold tracking-[-0.02em]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              PROFESSIONAL
              <br />
              <span className="text-[var(--color-text-secondary)]">EXPERIENCE</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p
              className="text-[var(--color-text-secondary)] leading-relaxed text-sm md:text-base border-l-2 border-[var(--color-accent)] pl-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Over 9+ years of design and execution leadership across prestigious
              architectural firms, government master plans, and luxury international developments.
            </motion.p>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="space-y-6 md:space-y-8">
          {siteData.experience.map((exp, index) => (
            <motion.div
              key={exp.number}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Container */}
              <div
                className="relative border border-[var(--color-border)] transition-all duration-500 ease-out overflow-hidden"
                style={{
                  padding: "clamp(1.75rem, 4vw, 3rem) clamp(1.5rem, 3.5vw, 2.5rem)",
                  borderColor: hoveredIndex === index ? "var(--color-accent)" : undefined,
                  boxShadow: hoveredIndex === index
                    ? "0 8px 40px rgba(200, 168, 78, 0.08), 0 2px 12px rgba(0,0,0,0.04)"
                    : "none",
                  transform: hoveredIndex === index ? "translateY(-3px)" : "translateY(0)",
                }}
              >
                {/* Top gold accent bar — slides in on hover */}
                <div
                  className="absolute top-0 left-0 h-[3px] bg-[var(--color-accent)] transition-all duration-500 ease-out"
                  style={{ width: hoveredIndex === index ? "100%" : "0%" }}
                />

                {/* Subtle background glow on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,168,78,0.03) 0%, transparent 60%)",
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                  {/* Left: Number + Year (3 cols) */}
                  <div className="lg:col-span-3">
                    <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4 lg:gap-5">
                      {/* Number + Badge */}
                      <div className="flex items-center gap-3">
                        <span
                          className="font-display text-4xl md:text-5xl font-bold transition-colors duration-400"
                          style={{
                            color: hoveredIndex === index
                              ? "var(--color-accent)"
                              : "var(--color-border)",
                          }}
                        >
                          {exp.number}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-3 py-1 text-[0.6rem] font-bold tracking-[0.18em] uppercase bg-[var(--color-accent)] text-white">
                            CURRENT
                          </span>
                        )}
                      </div>

                      {/* Year */}
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                        <span
                          className="font-display text-sm md:text-base font-semibold tracking-wider transition-colors duration-300"
                          style={{
                            color: hoveredIndex === index
                              ? "var(--color-text)"
                              : "var(--color-text-secondary)",
                          }}
                        >
                          {exp.years}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Company + Role + Description (9 cols) */}
                  <div className="lg:col-span-9 space-y-5">
                    {/* Company Row */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                      <h3
                        className="font-display text-xl sm:text-2xl md:text-[1.7rem] font-bold transition-colors duration-300"
                        style={{
                          color: hoveredIndex === index
                            ? "var(--color-text)"
                            : "var(--color-text)",
                        }}
                      >
                        {exp.company}
                      </h3>
                      {exp.subtitle && (
                        <span className="text-xs md:text-sm text-[var(--color-text-muted)] italic tracking-wide shrink-0">
                          {exp.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Position */}
                    <div className="flex items-center gap-3">
                      <span
                        className="w-8 h-px transition-all duration-300"
                        style={{
                          backgroundColor: "var(--color-accent)",
                          width: hoveredIndex === index ? "2.5rem" : "1.5rem",
                        }}
                      />
                      <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {exp.position}
                      </span>
                    </div>

                    {/* Description */}
                    <ul className="space-y-3.5 pt-1">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 text-[0.9rem] md:text-[0.95rem] leading-[1.75] text-[var(--color-text-secondary)]"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-[0.55rem] shrink-0 transition-all duration-300"
                            style={{
                              backgroundColor: "var(--color-accent)",
                              opacity: hoveredIndex === index ? 1 : 0.5,
                              transform: hoveredIndex === index ? "scale(1.3)" : "scale(1)",
                            }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Bottom-right corner accent on hover */}
                <div
                  className="absolute bottom-3 right-3 w-5 h-5 transition-opacity duration-400 pointer-events-none"
                  style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                >
                  <div className="absolute bottom-0 right-0 w-full h-px bg-[var(--color-accent)]" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-[var(--color-accent)]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative vertical line */}
      <motion.div
        className="absolute right-[3%] top-0 w-px h-full hidden 2xl:block pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ transformOrigin: "top", background: "var(--color-border)", opacity: 0.3 }}
      >
        <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        <span className="absolute top-3/4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </section>
  );
}
