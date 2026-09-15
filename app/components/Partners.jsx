'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  'ARCHITEC', 'ROOM', 'I&D Interior', 'FURNITURE DESIGN', 'ARMS & LEGS',
  'ARCHITEC', 'ROOM', 'I&D Interior', 'FURNITURE DESIGN', 'ARMS & LEGS',
];

export default function Partners() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="partners" ref={sectionRef}>
      <div className="marquee">
        <div className="marquee__track">
          {partners.map((name, i) => (
            <span className="marquee__item" key={i}>
              {name}
              <span className="marquee__separator">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee__track" aria-hidden="true">
          {partners.map((name, i) => (
            <span className="marquee__item" key={`dup-${i}`}>
              {name}
              <span className="marquee__separator">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
