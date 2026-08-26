"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";

export default function Expertise() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section
      id="expertise"
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
          <span className="section-number">02</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            SERVICES
          </span>
        </motion.div>

        <motion.h2
          className="text-display font-display font-bold tracking-[-0.02em] mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          EXPERTISE
        </motion.h2>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {siteData.expertise.map((item, index) => (
            <motion.div
              key={item.number}
              className="group relative border-t border-[var(--color-border)] py-8 md:py-10 px-0 md:px-6 first:md:pl-0 cursor-default"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Hover indicator line */}
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-500" />

              {/* Number */}
              <span className="font-display text-4xl md:text-5xl font-bold text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors duration-500 block mb-4">
                {item.number}
              </span>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-display font-semibold mb-3 group-hover:translate-x-2 transition-transform duration-500">
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {item.description}
              </p>

              {/* Corner accent on hover */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-4 h-4">
                  <div className="absolute bottom-0 right-0 w-full h-px bg-[var(--color-accent)]" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-[var(--color-accent)]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
