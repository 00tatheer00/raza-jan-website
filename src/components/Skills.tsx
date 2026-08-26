"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Skills() {
  const { ref, isInView } = useInView({ threshold: 0.15 });

  return (
    <section id="skills" className="section-padding relative" ref={ref}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-number">05</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            PROFICIENCY
          </span>
        </motion.div>

        <motion.h2
          className="text-display font-display font-bold tracking-[-0.02em] mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          SKILLS
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Technical Skills */}
          <div className="lg:col-span-7">
            <motion.h3
              className="text-label text-[var(--color-text-secondary)] mb-10"
              style={{ fontSize: "0.7rem" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              TECHNICAL SKILLS
            </motion.h3>

            <div className="space-y-8">
              {siteData.technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-medium text-sm tracking-wide">
                      {skill.name}
                    </span>
                    <span className="font-display text-sm font-semibold text-[var(--color-accent)]">
                      {skill.percentage}%
                    </span>
                  </div>

                  <div className="skill-bar-track">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.percentage}%` } : { width: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5 + index * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="lg:col-span-5">
            <motion.h3
              className="text-label text-[var(--color-text-secondary)] mb-10"
              style={{ fontSize: "0.7rem" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              SOFT SKILLS
            </motion.h3>

            <div className="space-y-0">
              {siteData.softSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className="group flex items-center gap-4 py-4 border-b border-[var(--color-border)] cursor-default hover:border-[var(--color-accent)] transition-colors duration-300"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.6 + index * 0.08,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-accent)] transition-colors duration-300" />
                  <span className="font-display font-medium text-sm tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Architectural accent */}
            <motion.div
              className="mt-12 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="w-px h-16 bg-[var(--color-accent)]">
                <span className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] -translate-x-[2.5px]" />
              </div>
              <div>
                <p className="text-micro text-[var(--color-text-muted)]" style={{ fontSize: "0.6rem" }}>
                  CONTINUOUS LEARNING
                </p>
                <p className="text-micro text-[var(--color-text-muted)] mt-1" style={{ fontSize: "0.6rem" }}>
                  & PROFESSIONAL DEVELOPMENT
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <motion.div
        className="absolute left-[4%] top-1/4 w-px h-1/2 hidden xl:block"
        style={{ background: "var(--color-border)", opacity: 0.3 }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.2 }}
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </section>
  );
}
