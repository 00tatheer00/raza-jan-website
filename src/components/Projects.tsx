"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Project, PROJECT_CATEGORIES, getLocalProjects } from "@/lib/projects";
import { ArrowUpRight, MapPin, Calendar, Building, Sparkles } from "lucide-react";

export default function Projects() {
  const { ref, isInView } = useInView({ threshold: 0.08 });
  const [activeCategory, setActiveCategory] = useState("All");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedProjectModal, setSelectedProjectModal] = useState<Project | null>(null);

  useEffect(() => {
    // Initial load from local/default
    const initial = getLocalProjects();
    setProjectsList(initial);

    // Fetch latest from API
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjectsList(data);
        }
      })
      .catch((e) => console.log("Loaded cached projects", e));

    // Listen for updates from admin dashboard
    const handleUpdate = () => {
      const updated = getLocalProjects();
      setProjectsList(updated);
    };

    window.addEventListener("portfolio_projects_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_projects_updated", handleUpdate);
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeCategory);

  const featuredProject = projectsList.find((p) => p.featured) || projectsList[0];

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

        {/* Section Heading & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 md:mb-16 gap-6">
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
            className="flex flex-wrap gap-2.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-micro px-3.5 py-2 transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat
                    ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-light)] font-bold shadow-xs"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                }`}
                style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </motion.div>
        </div>

        {/* ── Featured Spotlight Project (if any exists) ── */}
        {featuredProject && activeCategory === "All" && (
          <motion.div
            className="mb-14 md:mb-20 bg-white border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            onClick={() => setSelectedProjectModal(featuredProject)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch cursor-pointer">
              
              {/* Featured Image */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[320px] overflow-hidden bg-[#1A1A1A]">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[var(--color-accent)] text-xs font-bold uppercase tracking-wider border border-[var(--color-accent)]/30">
                    FEATURED SHOWCASE
                  </span>
                </div>
              </div>

              {/* Featured Content */}
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5 text-[var(--color-accent)] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{featuredProject.location}</span>
                    </span>
                    <span>{featuredProject.year}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                    {featuredProject.title}
                  </h3>

                  {featuredProject.client && (
                    <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                      Client: {featuredProject.client}
                    </p>
                  )}

                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] text-[0.65rem] font-medium tracking-wide border border-[var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform">
                    <span>VIEW</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ── Architectural Projects Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)]/80 overflow-hidden cursor-pointer transition-all duration-400 shadow-xs hover:shadow-md flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setSelectedProjectModal(project)}
            >
              <div>
                {/* Project Image */}
                <div className="aspect-[16/10] bg-[#1A1A1A] relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-[var(--color-accent)] text-[0.65rem] font-bold uppercase tracking-wider border border-[var(--color-accent)]/20">
                      {project.category}
                    </span>
                  </div>

                  {/* Corner View Arrow */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-[var(--color-accent)]" />
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1 text-[var(--color-accent)] font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {project.client && (
                    <p className="text-xs text-[var(--color-text-muted)] font-medium">
                      Client: {project.client}
                    </p>
                  )}

                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tags Footer */}
              <div className="p-6 pt-0 border-t border-[var(--color-border)]/50 mt-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {project.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[var(--color-bg-alt)] text-[var(--color-text-muted)] text-[0.6rem] uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-[var(--color-accent)] pt-3">
                  {project.number || `0${index + 1}`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* ── PROJECT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              className="w-full max-w-3xl bg-white border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden my-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              {/* Modal Image */}
              <div className="relative aspect-[16/9] w-full bg-black">
                <Image
                  src={selectedProjectModal.image}
                  alt={selectedProjectModal.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProjectModal(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent)] font-bold text-xs uppercase tracking-wider border border-[var(--color-accent)]/30">
                    {selectedProjectModal.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1 text-[var(--color-accent)]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedProjectModal.location}</span>
                    </span>
                    <span>{selectedProjectModal.year}</span>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                  {selectedProjectModal.title}
                </h2>

                {selectedProjectModal.client && (
                  <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                    Client: {selectedProjectModal.client}
                  </p>
                )}

                <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedProjectModal.description}
                </p>

                <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-2">
                  {selectedProjectModal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[var(--color-bg-alt)] text-[var(--color-text)] text-xs font-medium border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
