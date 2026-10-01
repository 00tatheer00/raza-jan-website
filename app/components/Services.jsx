'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    title: 'Architectural Design',
    titleItalic: 'and Planning',
    desc: 'From initial concept to detailed blueprints, we craft comprehensive architectural plans that balance aesthetics with structural integrity.',
    scope: 'Concept Sketches • Site Feasibility • Masterplanning • Construction Docs',
    tags: ['AutoCAD', 'SketchUp', 'Parametric BIM'],
    image: '/images/project-facade.jpg',
  },
  {
    num: '02',
    title: 'Interior Design & Styling',
    titleItalic: 'Services',
    desc: 'Creating harmonious interiors that reflect personality while maximizing spatial potential through material selection and lighting design.',
    scope: 'Material Sourcing • Lighting Architecture • Turnkey Monograph Handover',
    tags: ['Custom Millwork', 'Acoustic Tuning', 'FF&E Curation'],
    image: '/images/project-interior.jpg',
  },
  {
    num: '03',
    title: '3D Visualization and',
    titleItalic: 'Rendering',
    desc: 'Photorealistic 3D renders and walkthroughs that bring architectural concepts to life before construction begins.',
    scope: '8K Stills • Cinematic Anamorphic Reels • Interactive Virtual Walkthroughs',
    tags: ['3ds Max + Corona', 'Lumion 3D', 'Photometric Studies'],
    image: '/images/project-villa.jpg',
  },
  {
    num: '04',
    title: 'Turnkey Execution and',
    titleItalic: 'Co-Ordination',
    desc: 'End-to-end project management from procurement to handover, ensuring quality control at every construction milestone.',
    scope: 'Spatial Calibration • Contractor Coordination • Turnkey Delivery',
    tags: ['Site Supervision', 'QA/QC Compliance', 'Turnkey Handover'],
    image: '/images/project-1.jpg',
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Section header bar fade */
      gsap.fromTo(
        '.services__header',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Service rows — staggered fade up */
      const rows = sectionRef.current.querySelectorAll('.services__row');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.14,
          scrollTrigger: {
            trigger: rows[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services" ref={sectionRef} id="services">
      {/* Ambient Atmospheric Glows from Stitch */}
      <div className="services__glow services__glow--top" aria-hidden="true" />
      <div className="services__glow services__glow--bottom" aria-hidden="true" />

      {/* Section Divider Bar (Full Screen Width) */}
      <div className="services__header">
        <div className="services__header-inner">
          <div className="services__header-left">
            <span className="services__dot" />
            <h3 className="services__header-title">Our Services</h3>
          </div>
          <a href="#process" className="services__learn-more">
            Learn more
          </a>
        </div>
      </div>

      {/* The 4 Core Service Rows (Full Screen Width) */}
      <div className="services__list">
        {services.map((service) => (
          <article className="services__row" key={service.num}>
            <div className="services__row-inner">
              {/* Number */}
              <span className="services__num">{service.num}.</span>

              {/* Capsule/Oval Image Frame */}
              <div className="services__capsule">
                <img src={service.image} alt={service.title} loading="lazy" />
                <div className="services__capsule-overlay" />
              </div>

              {/* Title Block & Software Tags */}
              <div className="services__title-block">
                <h4 className="services__title">
                  {service.title}{' '}
                  <em className="services__title-italic">{service.titleItalic}</em>
                </h4>
                <div className="services__tags">
                  {service.tags.map((tag, idx) => (
                    <span className="services__tag" key={idx}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description & Detailed Scope */}
              <div className="services__desc-block">
                <p className="services__desc">{service.desc}</p>
                <span className="services__scope">{service.scope}</span>
              </div>

              {/* Directional Diagonal Vector Arrow */}
              <div className="services__arrow-wrap">
                <a
                  href="#contact"
                  className="services__arrow-btn"
                  aria-label={`Inquire about ${service.title}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12L12 4M12 4H5M12 4V11" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
