"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 md:mb-20">
          <motion.h2
            className="text-display font-display font-bold tracking-[-0.02em]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            EXPERIENCE
          </motion.h2>
          <motion.p
            className="text-[var(--color-text-secondary)] mt-4 lg:mt-0 max-w-md"
            style={{ fontSize: "var(--text-small)" }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A journey through leading architecture firms, building expertise
            from residential design to international urban developments.
          </motion.p>
        </div>

        {/* Structured Architectural Timeline */}
        <div className="space-y-0">
          {siteData.experience.map((exp, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={exp.number}
                className="group relative border-b border-[var(--color-border)] py-8 md:py-10 transition-colors duration-300 hover:border-[var(--color-accent)]/50"
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 w-0 h-px bg-[var(--color-accent)] group-hover:w-full transition-all duration-500" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                  {/* Column 1: Index Number & Period (Col span 3 on desktop) */}
                  <div className="md:col-span-3 flex md:flex-col items-baseline md:items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl md:text-3xl font-bold text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {exp.number}
                      </span>
                      {exp.isCurrent && (
                        <span className="px-2 py-0.5 text-[0.6rem] font-bold tracking-widest uppercase bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-xs">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                      <span className="font-display text-xs md:text-sm font-semibold tracking-wider text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {exp.years}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Company, Position & Description (Col span 9 on desktop) */}
                  <div className="md:col-span-9 space-y-3">
                    {/* Company Header */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                      <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                        {exp.company}
                      </h3>
                      {exp.subtitle && (
                        <span className="text-xs md:text-sm text-[var(--color-text-muted)] italic font-normal">
                          {exp.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Role / Position */}
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-px bg-[var(--color-accent)]" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                        {exp.position}
                      </span>
                    </div>

                    {/* Responsibilities & Achievements */}
                    <div className="pt-2">
                      <ul className="space-y-2">
                        {exp.description.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed"
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-2 shrink-0 opacity-70 group-hover:opacity-100" />
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
        className="absolute right-[4%] top-0 w-px h-full hidden xl:block pointer-events-none"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ transformOrigin: "top", background: "var(--color-border)", opacity: 0.3 }}
      >
        <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="absolute top-3/4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </section>
  );
}
