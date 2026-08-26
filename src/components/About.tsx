"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function About() {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section id="about" className="section-padding relative" ref={ref}>
      {/* Section number */}
      <div className="container-custom">
        <motion.div
          className="flex items-center gap-3 mb-12 md:mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-number">01</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">ABOUT</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left - Large Typography */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-display font-display font-bold leading-[0.95] tracking-[-0.02em] mb-6">
                ABOUT
                <br />
                <span className="text-[var(--color-text-secondary)]">THE</span>
                <br />
                <span className="relative inline-block">
                  ARCHITECT
                  <motion.span
                    className="absolute -bottom-2 left-0 h-[2px] bg-[var(--color-accent)]"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </span>
              </h2>
            </motion.div>

            {/* Years of Experience - Large Visual Number */}
            <motion.div
              className="mt-10 md:mt-16 flex items-end gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <span className="font-display text-[5rem] md:text-[7rem] lg:text-[8rem] font-bold leading-none text-[var(--color-accent)] opacity-90">
                {siteData.about.yearsOfExperience}
              </span>
              <div className="mb-4 md:mb-6">
                <span className="text-label text-[var(--color-text-secondary)] block" style={{ fontSize: "0.65rem" }}>
                  YEARS OF
                </span>
                <span className="text-label text-[var(--color-text)] block" style={{ fontSize: "0.65rem" }}>
                  EXPERIENCE
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right - Content */}
          <div className="lg:col-span-7 lg:pt-4">
            {/* Decorative line */}
            <motion.div
              className="hidden lg:block w-full h-px bg-[var(--color-border)] mb-10"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
            />

            {siteData.about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="mb-6 leading-[1.8]"
                style={{
                  fontSize: "var(--text-body)",
                  color: index === 0 ? "var(--color-text)" : "var(--color-text-secondary)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Architectural details list */}
            <motion.div
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {[
                { label: "LOCATION", value: "Islamabad, PK" },
                { label: "EXPERTISE", value: "Architecture" },
                { label: "DEGREE", value: "B.Arch — UET" },
                { label: "AVAILABILITY", value: "Open to Projects" },
              ].map((item) => (
                <div key={item.label} className="border-l border-[var(--color-border)] pl-4 py-2">
                  <span className="text-micro text-[var(--color-text-muted)] block mb-1" style={{ fontSize: "0.6rem" }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Architectural vertical line accent */}
      <motion.div
        className="absolute right-[4%] top-0 w-px h-full hidden xl:block"
        style={{ background: "var(--color-border)", opacity: 0.3 }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      </motion.div>
    </section>
  );
}
