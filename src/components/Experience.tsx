"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Experience() {
  const { ref, isInView } = useInView({ threshold: 0.05 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

        {/* Timeline */}
        <div className="relative">
          {/* Central timeline line — Desktop */}
          <motion.div
            className="absolute left-8 lg:left-[120px] top-0 bottom-0 w-px bg-[var(--color-border)]"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
          />

          {/* Timeline entries */}
          {siteData.experience.map((exp, index) => (
            <motion.div
              key={exp.number}
              className={`relative pl-16 lg:pl-[180px] pb-12 md:pb-16 last:pb-0 cursor-pointer group`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Timeline point */}
              <div
                className={`absolute left-[26px] lg:left-[114px] top-1 w-[9px] h-[9px] rounded-full border-2 transition-all duration-400 ${
                  activeIndex === index || exp.isCurrent
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] scale-125"
                    : "bg-[var(--color-bg)] border-[var(--color-text-muted)] group-hover:border-[var(--color-accent)]"
                }`}
              />

              {/* Year — positioned left of timeline on desktop */}
              <div className="absolute left-0 lg:left-0 top-0 w-[60px] lg:w-[100px] text-right hidden lg:block">
                <span
                  className={`font-display text-xs font-medium transition-colors duration-300 ${
                    activeIndex === index
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                  style={{ letterSpacing: "0.05em" }}
                >
                  {exp.years.split(" – ")[0]}
                </span>
              </div>

              {/* Content */}
              <div className="border-b border-[var(--color-border)] pb-8 md:pb-12 group-hover:border-[var(--color-accent)] transition-colors duration-500">
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-display text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                        activeIndex === index
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-border)] group-hover:text-[var(--color-accent)]"
                      }`}
                    >
                      {exp.number}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-lg md:text-xl font-semibold transition-colors duration-300 ${
                          activeIndex === index
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text)]"
                        }`}
                      >
                        {exp.company}
                      </h3>
                      {exp.subtitle && (
                        <span className="text-[var(--color-text-muted)] italic" style={{ fontSize: "var(--text-small)" }}>
                          {exp.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:text-right ml-12 sm:ml-0">
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.1em] uppercase bg-[var(--color-accent-light)] text-[var(--color-accent)] rounded-sm">
                        CURRENT
                      </span>
                    )}
                    <span
                      className="text-[var(--color-text-muted)] font-display font-medium whitespace-nowrap"
                      style={{ fontSize: "var(--text-small)" }}
                    >
                      {exp.years}
                    </span>
                  </div>
                </div>

                {/* Position */}
                <p
                  className="text-[var(--color-accent)] font-medium mb-4 ml-12 sm:ml-[calc(2rem+0.75rem)]"
                  style={{
                    fontSize: "var(--text-small)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {exp.position}
                </p>

                {/* Description — reveal on active */}
                <AnimatePresence>
                  {(activeIndex === index || exp.isCurrent) && (
                    <motion.div
                      className="ml-0 sm:ml-[calc(2rem+0.75rem)]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ul className="space-y-2">
                        {exp.description.map((desc, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 leading-relaxed"
                            style={{
                              fontSize: "var(--text-small)",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right architectural line */}
      <motion.div
        className="absolute right-[4%] top-0 w-px h-full hidden xl:block"
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
