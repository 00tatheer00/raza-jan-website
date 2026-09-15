'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    tag: 'ARCHITECTURE & LANDSCAPE',
    title: 'Modern Escape Villa',
    image: '/images/project-villa.jpg',
    beds: 5,
    baths: 4,
    sqft: 5400,
    priceFrom: '$4,500',
    priceTo: '6,000',
  },
  {
    id: 2,
    tag: 'INTERIOR ARCHITECTURE',
    title: 'Travertine Timber Atelier',
    image: '/images/project-interior.jpg',
    beds: 4,
    baths: 3,
    sqft: 3800,
    priceFrom: '$3,800',
    priceTo: '5,200',
  },
  {
    id: 3,
    tag: 'BRUTALIST RESIDENCE',
    title: 'Cantilever Concrete Villa',
    image: '/images/project-facade.jpg',
    beds: 6,
    baths: 5,
    sqft: 6200,
    priceFrom: '$5,500',
    priceTo: '7,500',
  },
  {
    id: 4,
    tag: 'TURNKEY EXECUTION',
    title: 'Elegant Soft Makeover',
    image: '/images/project-1.jpg',
    beds: 4,
    baths: 3,
    sqft: 3200,
    priceFrom: '$4,000',
    priceTo: '5,800',
  },
  {
    id: 5,
    tag: 'SUSTAINABLE LIVING',
    title: 'Horizon Sanctuary House',
    image: '/images/hero.jpg',
    beds: 5,
    baths: 4,
    sqft: 4800,
    priceFrom: '$5,000',
    priceTo: '6,800',
  },
];

export default function Philosophy() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const carouselRef = useRef(null);
  const subTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Statement text — word by word reveal on scroll */
      const words = statementRef.current.querySelectorAll('.philosophy__word');
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      /* Sub-text + button fade up */
      gsap.fromTo(
        subTextRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: subTextRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Carousel cards staggered entrance */
      const cards = carouselRef.current.querySelectorAll('.philosophy__card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Split text into words for word-by-word animation */
  const statementText = 'We focus on projects of any design that allow us to fundamentally re-think how people interact';
  const statementItalic = 'with buildings, nature, technologies.';

  return (
    <section className="philosophy section" ref={sectionRef} id="about">
      <div className="container">
        {/* Large statement text */}
        <div className="philosophy__statement" ref={statementRef}>
          {statementText.split(' ').map((word, i) => (
            <span key={i} className="philosophy__word">{word} </span>
          ))}
          {statementItalic.split(' ').map((word, i) => (
            <span key={`it-${i}`} className="philosophy__word philosophy__word--italic">
              {word}{' '}
            </span>
          ))}
        </div>

        {/* Sub-text row with description + All Portfolio button */}
        <div className="philosophy__sub" ref={subTextRef}>
          <div className="philosophy__controls">
            <button className="philosophy__pause" aria-label="Pause carousel">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="2" width="3" height="12" fill="currentColor"/>
                <rect x="10" y="2" width="3" height="12" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <p className="philosophy__subtext">
            The art of the table is anchored in the minerality
            of the landscape, the household linen is imbued
            with salt and the breath of the sea
          </p>

          <a href="#projects" className="btn-pill">
            <span>All Portfolio</span>
            <span className="btn-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Horizontal Project Carousel */}
      <div className="philosophy__carousel" ref={carouselRef} id="projects">
        <div className="philosophy__track">
          {projects.map((project) => (
            <div className="philosophy__card" key={project.id}>
              <div className="philosophy__card-image">
                <span className="philosophy__card-tag">{project.tag}</span>
                <button className="philosophy__card-link" aria-label={`View ${project.title}`}>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <img src={project.image} alt={project.title} loading="lazy" />
              </div>
              <h3 className="philosophy__card-title">{project.title}</h3>

              {/* Hover info overlay — matches reference */}
              <div className="philosophy__card-info">
                <div className="philosophy__card-info-left">
                  <h4>{project.title}</h4>
                  <span className="philosophy__card-price-label">Price Starts With</span>
                  <span className="philosophy__card-price">
                    {project.priceFrom} <span className="philosophy__card-price-divider">——</span> {project.priceTo}
                  </span>
                </div>
                <div className="philosophy__card-info-right">
                  <div className="philosophy__card-spec">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7M3 7l2-4h14l2 4M3 7h18"/>
                    </svg>
                    <span>{project.beds} Beds</span>
                  </div>
                  <div className="philosophy__card-spec">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 12h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5zM6 12V5a2 2 0 012-2h1a2 2 0 012 2v7"/>
                    </svg>
                    <span>{project.baths} Baths</span>
                  </div>
                  <div className="philosophy__card-spec">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M3 12h18M12 3v18"/>
                    </svg>
                    <span>{project.sqft} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
