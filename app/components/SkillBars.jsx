'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: '3ds Max + Corona', percent: 99 },
  { name: 'Lumion', percent: 96 },
  { name: 'Adobe Photoshop', percent: 75 },
  { name: 'SketchUp', percent: 70 },
  { name: 'AutoCAD', percent: 70 },
];

export default function SkillBars() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bars = sectionRef.current.querySelectorAll('.skillbar__fill');
      bars.forEach((bar, i) => {
        const target = skills[i].percent;
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: `${target}%`,
            duration: 1.4,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* Labels stagger */
      gsap.fromTo(
        '.skillbar__row',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="skillbars" ref={sectionRef}>
      <h3 className="skillbars__title text-uppercase">Software Proficiency</h3>
      <div className="skillbars__list">
        {skills.map((skill, i) => (
          <div className="skillbar__row" key={i}>
            <div className="skillbar__info">
              <span className="skillbar__name">{skill.name}</span>
              <span className="skillbar__percent">{skill.percent}%</span>
            </div>
            <div className="skillbar__track">
              <div className="skillbar__fill" style={{ width: '0%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
