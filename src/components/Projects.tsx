"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { siteData } from "@/data/siteData";
import { ArrowUpRight } from "lucide-react";

const categories = [
  "All",
  "Architecture",
  "Interior",
  "Residential",
  "Commercial",
  "3D Visualization",
  "Master Planning",
];

export default function Projects() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? siteData.projects
      : siteData.projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
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
          <span className="section-number">04</span>
          <span className="w-12 h-px bg-[var(--color-accent)]" />
          <span className="text-micro text-[var(--color-text-muted)]">
            PORTFOLIO
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 md:mb-16">
          <motion.h2
            className="text-display font-display font-bold tracking-[-0.02em]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            SELECTED
            <br />
            <span className="text-[var(--color-text-secondary)]">
              PROJECTS
            </span>
          </motion.h2>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap gap-3 mt-6 lg:mt-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-micro px-3 py-1.5 transition-all duration-300 border ${
                  activeCategory === cat
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-light)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)] hover:text-[var(--color-text-secondary)]"
                }`}
                style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured Project */}
        {filteredProjects.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Featured image placeholder */}
              <div className="lg:col-span-7 group cursor-pointer overflow-hidden relative">
                <div className="aspect-[16/10] bg-[var(--color-border)]/30 border border-[var(--color-border)] flex items-center justify-center relative overflow-hidden group-hover:border-[var(--color-accent)] transition-colors duration-500">
                  {/* Architectural placeholder pattern */}
                  <div className="absolute inset-0">
                    {/* Grid lines */}
                    <div className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `
                          linear-gradient(var(--color-text) 1px, transparent 1px),
                          linear-gradient(90deg, var(--color-text) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                      }}
                    />
                    {/* Cross lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-border)]" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[var(--color-border)]" />
                  </div>

                  <div className="text-center z-10 relative">
                    <div className="w-10 h-10 mx-auto mb-4 border border-[var(--color-border)] flex items-center justify-center">
                      <div className="w-3 h-3 border border-[var(--color-accent)]" />
                    </div>
                    <p className="text-micro text-[var(--color-text-muted)]" style={{ fontSize: "0.6rem" }}>
                      PROJECT IMAGE PLACEHOLDER
                    </p>
                    <p className="text-micro text-[var(--color-text-muted)] mt-1" style={{ fontSize: "0.55rem" }}>
                      Replace with actual project photography / renders
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--color-text)]/0 group-hover:bg-[var(--color-text)]/5 transition-all duration-500" />
                </div>
              </div>

              {/* Featured project info */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <span className="font-display text-5xl md:text-6xl font-bold text-[var(--color-accent)] opacity-30 mb-2">
                  {filteredProjects[0].number}
                </span>
                <span className="text-micro text-[var(--color-accent)] mb-3" style={{ fontSize: "0.6rem" }}>
                  {filteredProjects[0].category.toUpperCase()}
                </span>
                <h3 className="text-heading font-display font-semibold mb-4">
                  {filteredProjects[0].title}
                </h3>
                <p
                  className="mb-6 leading-relaxed"
                  style={{
                    fontSize: "var(--text-small)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {filteredProjects[0].description}
                </p>
                <div className="w-12 h-px bg-[var(--color-accent)] mb-6" />
                <span className="text-micro text-[var(--color-text-muted)] inline-flex items-center gap-2 group cursor-pointer hover:text-[var(--color-accent)] transition-colors" style={{ fontSize: "0.65rem" }}>
                  VIEW PROJECT <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(1).map((project, index) => (
            <motion.div
              key={`${project.number}-${activeCategory}`}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.4 + index * 0.1,
              }}
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-[var(--color-border)]/20 border border-[var(--color-border)] mb-4 relative overflow-hidden group-hover:border-[var(--color-accent)] transition-all duration-500">
                {/* Placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `
                        linear-gradient(var(--color-text) 1px, transparent 1px),
                        linear-gradient(90deg, var(--color-text) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px',
                    }}
                  />
                  <div className="text-center z-10">
                    <div className="w-6 h-6 mx-auto mb-2 border border-[var(--color-border)] flex items-center justify-center">
                      <div className="w-2 h-2 border border-[var(--color-accent)] opacity-50" />
                    </div>
                    <p className="text-micro text-[var(--color-text-muted)]" style={{ fontSize: "0.5rem" }}>
                      IMAGE PLACEHOLDER
                    </p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[var(--color-text)]/0 group-hover:bg-[var(--color-text)]/5 transition-all duration-500 flex items-end justify-between p-4 opacity-0 group-hover:opacity-100">
                  <span className="text-micro text-[var(--color-text-secondary)]" style={{ fontSize: "0.6rem" }}>
                    VIEW PROJECT
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-accent)]" />
                </div>

                {/* Yellow accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-500" />
              </div>

              {/* Project info */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-micro text-[var(--color-accent)] block mb-1" style={{ fontSize: "0.55rem" }}>
                    {project.category.toUpperCase()}
                  </span>
                  <h3 className="font-display font-semibold text-sm group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
                <span className="font-display text-xl font-bold text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {project.number}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
