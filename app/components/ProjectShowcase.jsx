'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const projectsData = [
  {
    id: 1,
    title: 'Modern Escape Villa',
    slug: 'modern-escape-villa',
    category: 'Architecture',
    discipline: 'Architecture & Landscape',
    location: 'Islamabad · Pakistan',
    scale: '5,400 sq.ft',
    scope: 'Private Luxury Residence',
    image: '/images/project-villa.jpg',
    featured: true,
  },
  {
    id: 2,
    title: 'Travertine Timber Atelier',
    slug: 'travertine-timber-atelier',
    category: 'Interior',
    discipline: 'Interior Architecture & Styling',
    location: 'Lahore · Pakistan',
    scale: '3,800 sq.ft',
    scope: 'Bespoke Atelier Design',
    image: '/images/project-interior.jpg',
    featured: false,
  },
  {
    id: 3,
    title: 'Cantilever Concrete Villa',
    slug: 'cantilever-concrete-villa',
    category: 'Architecture',
    discipline: 'Brutalist Residence & Planning',
    location: 'Islamabad · Pakistan',
    scale: '6,200 sq.ft',
    scope: 'Architectural Commission',
    image: '/images/project-facade.jpg',
    featured: true,
  },
  {
    id: 4,
    title: 'Elegant Soft Makeover',
    slug: 'elegant-soft-makeover',
    category: 'Turnkey',
    discipline: 'Turnkey Execution & Supervision',
    location: 'Islamabad · Pakistan',
    scale: '3,200 sq.ft',
    scope: 'Turnkey Commission',
    image: '/images/project-1.jpg',
    featured: false,
  },
  {
    id: 5,
    title: 'Horizon Sanctuary House',
    slug: 'horizon-sanctuary-house',
    category: 'Architecture',
    discipline: 'Sustainable & Biophilic Architecture',
    location: 'Murree Hills · Pakistan',
    scale: '4,800 sq.ft',
    scope: 'Hillside Sanctuary',
    image: '/images/hero.jpg',
    featured: false,
  },
];


const defaultCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'Architecture', label: 'Architecture & Villas' },
  { id: 'Interior', label: 'Interior Architecture' },
  { id: 'Turnkey', label: 'Turnkey Execution' },
];

export default function ProjectShowcase() {
  const [projects, setProjects] = useState(projectsData);
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState('all');
  const [gliderPos, setGliderPos] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const filterGroupRef = useRef(null);
  const pillRefs = useRef({});
  const ringRef = useRef(null);
  const ringCircleRef = useRef(null);
  const prevPositionsRef = useRef(new Map());

  // Fetch live categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data?.categories && data.categories.length > 0) {
          const mapped = [
            { id: 'all', label: 'All Projects' },
            ...data.categories.map((c) => ({
              id: c.name,
              label: c.label || c.name,
            })),
          ];
          setCategories(mapped);
        }
      } catch (e) {
        console.warn('Error loading dynamic showcase categories:', e);
      }
    }
    loadCategories();
  }, []);

  // Fetch live published projects from Supabase
  useEffect(() => {
    async function loadShowcaseProjects() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          // If some projects are explicitly marked featured, display them first
          const featured = data.filter((p) => p.featured);
          const list = featured.length > 0 ? featured : data;
          setProjects(list);
        }
      } catch (err) {
        console.error('Error loading showcase projects from Supabase:', err);
      }
    }

    loadShowcaseProjects();
  }, []);


  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);


  // Gliding Pill Position Calculation (Supports multi-line wrap, resize, fonts.ready)
  const updateGlider = () => {
    const activeBtn = pillRefs.current[activeCategory];
    if (activeBtn) {
      setGliderPos({
        left: activeBtn.offsetLeft,
        top: activeBtn.offsetTop,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        ready: true,
      });
    }
  };

  useEffect(() => {
    updateGlider();
    window.addEventListener('resize', updateGlider);

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(updateGlider);
    }

    return () => {
      window.removeEventListener('resize', updateGlider);
    };
  }, [activeCategory]);

  // Butter-Smooth Scroll Progress Ring with Inertia Physics (Lerp / Spring Coasting)
  useEffect(() => {
    let rafId = null;
    let isTicking = false;
    let currentY = null;
    let targetY = 0;
    let currentOffset = 113.1;
    let targetOffset = 113.1;

    const calculateTargets = () => {
      if (!sectionRef.current || !ringRef.current || !ringCircleRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // 1. Target Arc Progress
      const totalScrollable = sectionHeight - windowHeight * 0.4;
      if (totalScrollable > 0) {
        const currentScroll = -rect.top + windowHeight * 0.15;
        const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
        const circumference = 113.1;
        targetOffset = circumference * (1 - progress);
      }

      // 2. Target Computed Position
      const titleEl = sectionRef.current.querySelector('.showcase__title');
      const initialY = titleEl ? titleEl.offsetTop + 10 : 180;
      const targetScreenY = Math.max(120, windowHeight * 0.32);
      const desiredY = -rect.top + targetScreenY;
      const maxY = sectionHeight - 140;
      targetY = Math.max(initialY, Math.min(maxY, desiredY));

      // Initial placement immediately
      if (currentY === null) {
        currentY = targetY;
        currentOffset = targetOffset;
        ringRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
        ringCircleRef.current.style.strokeDashoffset = currentOffset.toFixed(2);
      }
    };

    const loop = () => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        if (ringRef.current) ringRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
        if (ringCircleRef.current) ringCircleRef.current.style.strokeDashoffset = String(targetOffset.toFixed(2));
        isTicking = false;
        return;
      }

      // Exponential damping lerp (0.08 factor for silky, non-jittery acceleration and gentle coasting to halt)
      const diffY = targetY - currentY;
      const diffOffset = targetOffset - currentOffset;

      if (Math.abs(diffY) > 0.08 || Math.abs(diffOffset) > 0.08) {
        currentY += diffY * 0.08;
        currentOffset += diffOffset * 0.08;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
        }
        if (ringCircleRef.current) {
          ringCircleRef.current.style.strokeDashoffset = currentOffset.toFixed(2);
        }

        rafId = requestAnimationFrame(loop);
      } else {
        // Settled cleanly at target resting point
        currentY = targetY;
        currentOffset = targetOffset;
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
        }
        if (ringCircleRef.current) {
          ringCircleRef.current.style.strokeDashoffset = currentOffset.toFixed(2);
        }
        isTicking = false;
      }
    };

    const handleScrollOrResize = () => {
      calculateTargets();
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    calculateTargets();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth FLIP Filtering
  const handleCategoryChange = (catId) => {
    if (catId === activeCategory) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !gridRef.current) {
      setActiveCategory(catId);
      return;
    }

    // 1. FIRST: Record bounding rects of currently visible cards
    const cards = gridRef.current.querySelectorAll('.showcase__card');
    const positions = new Map();
    cards.forEach((card) => {
      const id = card.getAttribute('data-project-id');
      if (id) {
        positions.set(id, card.getBoundingClientRect());
      }
    });
    prevPositionsRef.current = positions;

    // 2. Set new active category
    setActiveCategory(catId);
  };

  // FLIP: Play animation after state render
  useLayoutEffect(() => {
    if (!gridRef.current || prevPositionsRef.current.size === 0) return;

    const prevPositions = prevPositionsRef.current;
    const currentCards = gridRef.current.querySelectorAll('.showcase__card');

    currentCards.forEach((card) => {
      const id = card.getAttribute('data-project-id');
      const first = prevPositions.get(id);

      if (first) {
        const last = card.getBoundingClientRect();
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;

        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
          card.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: 'translate(0px, 0px)' },
            ],
            {
              duration: 650,
              easing: 'cubic-bezier(0.7, 0, 0.2, 1)',
              fill: 'none',
            }
          );
        }
      } else {
        // Newly shown cards fade opacity 0 -> 1 over 500ms
        card.animate(
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          {
            duration: 500,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            fill: 'none',
          }
        );
      }
    });

    prevPositionsRef.current = new Map();
  }, [activeCategory]);

  return (
    <section className="showcase section" ref={sectionRef} id="projects">
      {/* Background Architectural Guides with Falling Gold Streaks */}
      <div className="showcase__guides" aria-hidden="true">
        <div className="showcase__guide-col">
          <div className="showcase__guide-line">
            <div className="showcase__guide-glow showcase__guide-glow--1" />
          </div>
        </div>
        <div className="showcase__guide-col">
          <div className="showcase__guide-line">
            <div className="showcase__guide-glow showcase__guide-glow--2" />
          </div>
        </div>
        <div className="showcase__guide-col">
          <div className="showcase__guide-line">
            <div className="showcase__guide-glow showcase__guide-glow--3" />
          </div>
        </div>
        <div className="showcase__guide-col">
          <div className="showcase__guide-line">
            <div className="showcase__guide-glow showcase__guide-glow--4" />
          </div>
        </div>
      </div>

      {/* Scroll Progress Ring Follower (Desktop Left Margin) */}
      <div className="showcase__scroll-ring-wrapper" aria-hidden="true">
        <div className="showcase__scroll-ring" ref={ringRef}>
          <svg className="showcase__ring-svg" width="44" height="44" viewBox="0 0 44 44">
            <circle className="showcase__ring-track" cx="22" cy="22" r="18" />
            <circle
              ref={ringCircleRef}
              className="showcase__ring-indicator"
              cx="22"
              cy="22"
              r="18"
            />
          </svg>
          <div className="showcase__ring-dot" />
        </div>
      </div>

      <div className="container showcase__container">

        {/* Section Header */}
        <div className="showcase__header">
          <div className="showcase__header-top">
            <div className="showcase__badge">
              <span className="showcase__badge-dot"></span>
              <span className="showcase__badge-text">Project Showcase</span>
            </div>
            <span className="showcase__counter" aria-label={`${filteredProjects.length} projects displayed`}>
              01 — 0{filteredProjects.length}
            </span>
          </div>

          <div className="showcase__header-main">
            <div className="showcase__heading-block">
              {/* Heading Entrance: Words masked and rising with stagger */}
              <h2 className="showcase__title" aria-label="Curated Architectural Showcase">
                <span className="showcase__word-mask">
                  <span className="showcase__word" style={{ animationDelay: '0ms' }}>Curated</span>
                </span>{' '}
                <span className="showcase__word-mask">
                  <span className="showcase__word" style={{ animationDelay: '120ms' }}>Architectural</span>
                </span>{' '}
                <span className="showcase__word-mask">
                  <em className="showcase__word text-italic" style={{ animationDelay: '240ms' }}>Showcase</em>
                </span>
              </h2>
              <p className="showcase__subtitle">
                Spatial mastery materialized across luxury residential villas, bespoke interior
                ateliers, and full-scope turnkey built commissions.
              </p>
            </div>

            {/* Filter Pills with Gliding Black Indicator */}
            <div
              className="showcase__filter-group"
              ref={filterGroupRef}
              role="tablist"
              aria-label="Filter project showcase by architectural discipline"
            >
              <div
                className="showcase__filter-glider"
                style={{
                  left: `${gliderPos.left}px`,
                  top: `${gliderPos.top}px`,
                  width: `${gliderPos.width}px`,
                  height: `${gliderPos.height}px`,
                  opacity: gliderPos.ready ? 1 : 0,
                }}
                aria-hidden="true"
              />

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  ref={(el) => {
                    if (el) pillRefs.current[cat.id] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`showcase__filter-btn ${
                    activeCategory === cat.id ? 'showcase__filter-btn--active' : ''
                  }`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Meta Bar with Animated Counter & Golden Sweep */}
        <div className="showcase__meta-bar">
          <span className="showcase__meta-label">Selected Works</span>
          <div className="showcase__meta-line-wrapper" aria-hidden="true">
            <div className="showcase__meta-line" />
            <div className="showcase__meta-sweep" />
          </div>
          <div className="showcase__meta-counter" aria-live="polite">
            <span className="showcase__meta-showing">Showing </span>
            <span className="showcase__meta-roll-container">
              <span key={filteredProjects.length} className="showcase__meta-roll-num">
                {String(filteredProjects.length).padStart(2, '0')}
              </span>
            </span>
            <span className="showcase__meta-total"> / 05</span>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="showcase__grid" ref={gridRef} id="projects-grid">
          {filteredProjects.map((project, idx) => {
            const isFeatured = activeCategory === 'all' && idx === 0;
            const isSide = activeCategory === 'all' && (idx === 1 || idx === 2);

            return (
              <article
                key={project.id}
                data-project-id={project.id}
                className={`showcase__card ${isFeatured ? 'showcase__card--featured' : ''} ${
                  isSide ? 'showcase__card--side' : ''
                }`}
              >
                {/* Image Media Container - Completely Static Images */}
                <div className="showcase__card-media">
                  <img
                    src={project.image_url || project.image}
                    alt={`${project.title} — Architectural Commission by Syed Raza Jan`}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                  <div className="showcase__card-overlay" aria-hidden="true" />

                  {/* Corner Action Button with Swapping Double Arrow linking to project case study */}
                  <Link
                    href={`/projects/${project.slug || project.id}`}
                    className="showcase__card-action"
                    aria-label={`Explore case study for ${project.title}`}
                  >
                    <span className="showcase__card-action-icon">
                      <svg
                        className="showcase__arrow-icon showcase__arrow-icon--1"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 12L12 4M12 4H5M12 4V11"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className="showcase__arrow-icon showcase__arrow-icon--2"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 12L12 4M12 4H5M12 4V11"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>

                {/* Card Meta & Architectural Details */}
                <div className="showcase__card-content">
                  <div className="showcase__card-header-row">
                    {/* Short Gold Growing Bar */}
                    <div className="showcase__card-accent-bar" aria-hidden="true" />

                    <h3 className="showcase__card-title">
                      <Link href={`/projects/${project.slug || project.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        <span className="showcase__card-title-text">{project.title}</span>
                      </Link>
                      <span className="showcase__card-title-underline" aria-hidden="true" />
                    </h3>
                    <span className="showcase__card-category">{project.discipline}</span>
                    <p className="showcase__card-scope">{project.scope}</p>
                  </div>


                  <div className="showcase__card-footer-row">
                    <div className="showcase__card-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{project.location}</span>
                    </div>

                    <div className="showcase__card-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 12h18M12 3v18" />
                      </svg>
                      <span>{project.scale}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Full-Width Architectural Disciplines Ticker Marquee Strip */}
        <div className="showcase__ticker-strip" aria-label="SRJ Studio Architectural Disciplines">
          <div className="showcase__ticker-track">
            <div className="showcase__ticker-group">
              <span>Architecture</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
              <span>Interiors</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
              <span>3D Visualization</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
              <span>Turnkey Execution</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
              <span>Landscape</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
              <span>Site Supervision</span><span className="showcase__ticker-sep" aria-hidden="true">✦</span>
            </div>
            <div className="showcase__ticker-group" aria-hidden="true">
              <span>Architecture</span><span className="showcase__ticker-sep">✦</span>
              <span>Interiors</span><span className="showcase__ticker-sep">✦</span>
              <span>3D Visualization</span><span className="showcase__ticker-sep">✦</span>
              <span>Turnkey Execution</span><span className="showcase__ticker-sep">✦</span>
              <span>Landscape</span><span className="showcase__ticker-sep">✦</span>
              <span>Site Supervision</span><span className="showcase__ticker-sep">✦</span>
            </div>
          </div>
        </div>

        {/* Bottom Dialogue Invitation */}
        <div className="showcase__bottom-bar">
          <div className="showcase__bottom-text">
            <span>Have an architectural commission or master planning brief in contemplation?</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/projects"
              className="showcase__bottom-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span>Explore All Works</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a href="#inquire" className="showcase__bottom-btn">
              <span>Initiate Project Dialogue</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
