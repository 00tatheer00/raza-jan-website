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
    image: '/images/project-facade.jpg',
  },
  {
    num: '02',
    title: 'Interior Design & Styling',
    titleItalic: 'Services',
    desc: 'Creating harmonious interiors that reflect personality while maximizing spatial potential through material selection and lighting design.',
    image: '/images/project-interior.jpg',
  },
  {
    num: '03',
    title: '3D Visualization and',
    titleItalic: 'Rendering',
    desc: 'Photorealistic 3D renders and walkthroughs that bring architectural concepts to life before construction begins.',
    image: '/images/project-villa.jpg',
  },
  {
    num: '04',
    title: 'Turnkey Execution and',
    titleItalic: 'Co-Ordination',
    desc: 'End-to-end project management from procurement to handover, ensuring quality control at every construction milestone.',
    image: '/images/project-1.jpg',
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Section header fade in */
      gsap.fromTo(
        '.services__header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Service rows — staggered fade up */
      const rows = sectionRef.current.querySelectorAll('.services__row');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
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
    <section className="services section--dark" ref={sectionRef} id="services">
      {/* Section Header */}
      <div className="services__header">
        <div className="services__header-inner container">
          <div className="services__header-left">
            <span className="services__dot"></span>
            <h2 className="text-uppercase">Our Services</h2>
          </div>
          <a href="#" className="services__learn-more">
            Learn more
          </a>
        </div>
      </div>

      {/* Service Rows */}
      <div className="services__list">
        {services.map((service) => (
          <div className="services__row" key={service.num}>
            <div className="services__row-inner container">
              {/* Number */}
              <span className="services__num">{service.num}.</span>

              {/* Capsule/Oval Image */}
              <div className="services__capsule">
                <img src={service.image} alt={service.title} loading="lazy" />
              </div>

              {/* Title */}
              <div className="services__title-block">
                <h3 className="services__title">
                  {service.title}{' '}
                  <em className="text-italic">{service.titleItalic}</em>
                </h3>
              </div>

              {/* Description */}
              <p className="services__desc">{service.desc}</p>

              {/* Arrow Link */}
              <a href="#" className="services__arrow" aria-label={`Learn more about ${service.title}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
