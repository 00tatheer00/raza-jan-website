'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkillBars from './SkillBars';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Architectural Design',
    desc: 'From concept sketches to comprehensive construction documents, we develop complete architectural solutions tailored to each project.',
    link: '#inquire',
    image: '/images/project-facade.jpg',
    tag: 'Phase 01 · Synthesis & Form',
  },
  {
    num: '02',
    title: 'Concept & Planning',
    desc: 'Strategic space planning, feasibility studies, and master planning that lay the groundwork for exceptional architectural outcomes.',
    link: '#inquire',
    image: '/images/project-interior.jpg',
    tag: 'Phase 02 · Spatial Hierarchy',
  },
  {
    num: '03',
    title: 'Visualization & Presentation',
    desc: 'Photorealistic 3D renders using 3ds Max + Corona Renderer and Lumion walkthroughs that bring designs to life before construction.',
    link: '#inquire',
    image: '/images/project-1.jpg',
    tag: 'Phase 03 · Photoreal Simulation',
  },
  {
    num: '04',
    title: 'Execution & Delivery',
    desc: 'End-to-end site supervision, contractor coordination, quality control, and turnkey project delivery ensuring design integrity.',
    link: '#inquire',
    image: '/images/project-villa.jpg',
    tag: 'Phase 04 · Turnkey Fidelity',
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process__image-container',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      const stepEls = sectionRef.current.querySelectorAll('.process__step');
      gsap.fromTo(
        stepEls,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: {
            trigger: stepEls[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="process" ref={sectionRef} id="process">
      <div className="process__inner">
        {/* Left Side — Smooth Cinematic Image Display without layout jitter */}
        <div className="process__left">
          <div className="process__image-container">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className={`process__slide ${activeStep === idx ? 'process__slide--active' : ''}`}
                aria-hidden={activeStep !== idx}
              >
                <img
                  src={step.image}
                  alt={`${step.title} — SRJ Studio`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="process__slide-overlay" />
                <div className="process__slide-badge">
                  <span className="process__slide-phase">{step.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side — Interactive Steps with Accordion */}
        <div className="process__right">
          <div className="process__right-inner">
            <h3 className="process__label text-uppercase">Designed for your living</h3>

            <div className="process__steps">
              {steps.map((step, i) => (
                <div
                  className={`process__step ${activeStep === i ? 'process__step--active' : ''}`}
                  key={step.num}
                  onClick={() => setActiveStep(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveStep(i);
                    }
                  }}
                  aria-expanded={activeStep === i}
                >
                  <div className="process__step-header">
                    <span className="process__step-num">{step.num}</span>
                    <h4 className="process__step-title">{step.title}</h4>
                  </div>
                  <div className="process__step-body">
                    <p className="process__step-desc">{step.desc}</p>
                    {step.link && (
                      <a href={step.link} className="process__step-link">
                        learn more
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Atelier Tooling & Technical Standards */}
            <SkillBars />
          </div>
        </div>
      </div>
    </section>
  );
}
