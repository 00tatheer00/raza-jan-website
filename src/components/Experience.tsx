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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-16 md:mb-24">
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
              className="text-[var(--color-text-secondary)] leading-relaxed text-sm md:text-base border-l border-[var(--color-accent)]/40 pl-5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Over 9+ years of design and execution leadership across prestigious
              architectural firms, government master plans, and luxury international developments.
            </motion.p>
          </div>
        </div>

        {/* Architectural Timeline Grid */}
        <div className="border-t border-[var(--color-border)]">
          {siteData.experience.map((exp, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={exp.number}
                className="group relative border-b border-[var(--color-border)] py-10 md:py-14 lg:py-16 px-2 md:px-6 -mx-2 md:-mx-6 transition-all duration-400 hover:bg-[var(--color-bg-alt)]/60"
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + index * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gold left border highlight on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                  
                  {/* Left Column: Number + Year Range (Col 1 to 4) */}
                  <div className="lg:col-span-4 flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-start gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-muted)]/40 group-hover:text-[var(--color-accent)] transition-colors duration-400">
                        {exp.number}
                      </span>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.18em] uppercase bg-[var(--color-accent)] text-[var(--color-white)]">
                          CURRENT ROLE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 lg:mt-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                      <span className="font-display text-sm md:text-base font-semibold tracking-wider text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors duration-300">
                        {exp.years}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Company, Position, Description (Col 5 to 12) */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Company Name & Subtitle */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {exp.company}
                      </h3>
                      {exp.subtitle && (
                        <span className="text-xs md:text-sm text-[var(--color-text-muted)] font-normal tracking-wide italic">
                          {exp.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Role / Position */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="w-6 h-px bg-[var(--color-accent)]" />
                      <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                        {exp.position}
                      </span>
                    </div>

                    {/* Description List */}
                    <div className="pt-3">
                      <ul className="space-y-3">
                        {exp.description.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3.5 text-sm md:text-[0.95rem] text-[var(--color-text-secondary)] leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
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
