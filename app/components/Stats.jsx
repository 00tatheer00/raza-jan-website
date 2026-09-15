'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 9, suffix: '+', label: 'Years Experience' },
  { value: 150, suffix: '+', label: 'Projects Completed' },
  { value: 50, suffix: '+', label: 'Happy Clients' },
  { value: 4, suffix: '', label: 'Countries Served' },
];

export default function Stats() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const animated = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (animated.current) return;
          animated.current = true;

          stats.forEach((stat, i) => {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 2,
              delay: i * 0.15,
              ease: 'power2.out',
              onUpdate: () => {
                setCounts((prev) => {
                  const next = [...prev];
                  next[i] = Math.round(counter.val);
                  return next;
                });
              },
            });
          });
        },
      });

      /* Staggered reveal */
      const items = sectionRef.current.querySelectorAll('.stats__item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
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
    <section className="stats" ref={sectionRef}>
      <div className="stats__inner container">
        {stats.map((stat, i) => (
          <div className="stats__item" key={i}>
            <span className="stats__value">
              {counts[i]}{stat.suffix}
            </span>
            <span className="stats__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
