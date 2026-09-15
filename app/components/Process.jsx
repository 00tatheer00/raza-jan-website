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
    link: '#',
  },
  {
    num: '02',
    title: 'Concept & Planning',
    desc: 'Strategic space planning, feasibility studies, and master planning that lay the groundwork for exceptional architectural outcomes.',
    link: '#',
  },
  {
    num: '03',
    title: 'Visualization & Presentation',
    desc: 'Photorealistic 3D renders using 3ds Max + Corona Renderer and Lumion walkthroughs that bring designs to life before construction.',
    link: '#',
  },
  {
    num: '04',
    title: 'Execution & Delivery',
    desc: 'End-to-end site supervision, contractor coordination, quality control, and turnkey project delivery ensuring design integrity.',
    link: '#',
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.process__image',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
    <section className="process" ref={sectionRef}>
      <div className="process__inner">
        <div className="process__left">
          <div className="process__image" style={{ clipPath: 'inset(100% 0 0 0)' }}>
            <img
              src="/images/project-facade.jpg"
              alt="Modern architectural structure"
              loading="lazy"
            />
          </div>
        </div>

        <div className="process__right">
          <div className="process__right-inner">
            <h3 className="process__label text-uppercase">Designed for your living</h3>

            <div className="process__steps">
              {steps.map((step, i) => (
                <div
                  className={`process__step ${activeStep === i ? 'process__step--active' : ''}`}
                  key={step.num}
                  onClick={() => setActiveStep(i)}
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

            {/* Software Skill Bars */}
            <SkillBars />
          </div>
        </div>
      </div>
    </section>
  );
}
