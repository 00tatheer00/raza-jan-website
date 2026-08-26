"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Education() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      id="education"
      className="section-padding relative"
      style={{ backgroundColor: "var(--color-bg-alt)" }}
      ref={ref}
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-number">06</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            EDUCATION
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left - Large Visual */}
          <div className="lg:col-span-5">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Large B.Arch text */}
              <div className="relative">
                <span className="font-display text-[6rem] md:text-[8rem] lg:text-[10rem] font-bold leading-none text-[var(--color-border)] opacity-40 select-none">
                  B.Arch
                </span>

                {/* Yellow accent line through text */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-px bg-[var(--color-accent)]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.6 }}
                />

                {/* Decorative corner */}
                <div className="absolute -top-4 -left-4 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-px bg-[var(--color-accent)]" />
                  <div className="absolute top-0 left-0 h-full w-px bg-[var(--color-accent)]" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* Degree */}
              <h3 className="text-heading font-display font-semibold mb-4">
                {siteData.education.degree}
              </h3>

              {/* Thin line */}
              <motion.div
                className="w-16 h-px bg-[var(--color-accent)] mb-6"
                initial={{ width: 0 }}
                animate={isInView ? { width: 64 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              />

              {/* Institution */}
              <p
                className="mb-2 leading-relaxed"
                style={{ fontSize: "var(--text-body)", color: "var(--color-text-secondary)" }}
              >
                {siteData.education.institution}
              </p>

              {/* Years */}
              <div className="flex items-center gap-3 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                <span
                  className="font-display font-medium"
                  style={{ fontSize: "var(--text-small)", color: "var(--color-accent)", letterSpacing: "0.1em" }}
                >
                  {siteData.education.years}
                </span>
              </div>

              {/* Additional decorative info */}
              <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-micro text-[var(--color-text-muted)] block mb-1" style={{ fontSize: "0.6rem" }}>
                      DURATION
                    </span>
                    <span className="text-sm font-medium">5 Years</span>
                  </div>
                  <div>
                    <span className="text-micro text-[var(--color-text-muted)] block mb-1" style={{ fontSize: "0.6rem" }}>
                      FOCUS
                    </span>
                    <span className="text-sm font-medium">Architecture</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
