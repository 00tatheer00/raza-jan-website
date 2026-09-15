'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      'Working with SRJ Studio was transformative. Their architectural vision combined with meticulous attention to detail exceeded every expectation. The design process was seamless, and the final result is nothing short of extraordinary.',
    name: 'Ahmed Hassan',
    role: 'CEO, Horizon Developers · Islamabad',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&q=80',
  },
  {
    quote:
      'Syed Raza Jan brought a rare level of sophistication to our luxury villa project in Dubai. The spatial hierarchy, light study, and 3D visualization allowed us to experience the space before breaking ground.',
    name: 'Sarah Al-Mansoor',
    role: 'Private Client · Palm Jumeirah, Dubai',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
  },
  {
    quote:
      'The technical mastery from concept development to structural coordination is world-class. Raza Jan’s turnkey execution ensured zero deviations from the approved architectural rendering.',
    name: 'Engr. Tariq Mehmood',
    role: 'Managing Director, Apex Buildcon',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Quote marks fade in */
      gsap.fromTo(
        '.testimonials__quote-mark',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.15,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Quote text line-by-line reveal */
      gsap.fromTo(
        '.testimonials__text',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.testimonials__text',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Client info fade up */
      gsap.fromTo(
        '.testimonials__client',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: '.testimonials__client',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Portrait image clip-path reveal from right */
      gsap.fromTo(
        '.testimonials__portrait',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.testimonials__portrait',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Section title horizontal slide from left */
      gsap.fromTo(
        '.testimonials__section-title',
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testimonials__section-title',
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (index) => {
    if (index === current) return;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        onComplete: () => {
          setCurrent(index);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    } else {
      setCurrent(index);
    }
  };

  const item = testimonials[current];

  return (
    <section className="testimonials section" ref={sectionRef}>
      <div className="testimonials__inner">
        {/* Left side — Quote */}
        <div className="testimonials__left">
          {/* Large quotation marks */}
          <div className="testimonials__quote-mark" style={{ opacity: 0 }}>
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
              <path
                d="M0 40V20C0 8.95 8.95 0 20 0h5v12h-5c-4.42 0-8 3.58-8 8v4h13v24H0zm45 0V20C45 8.95 53.95 0 65 0h5v12h-5c-4.42 0-8 3.58-8 8v4h13v24H45z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div ref={contentRef}>
            <blockquote className="testimonials__text">
              &ldquo;{item.quote}&rdquo;
            </blockquote>

            <div className="testimonials__client">
              <div className="testimonials__divider"></div>
              <h4 className="testimonials__name">{item.name}</h4>
              <p className="testimonials__role">{item.role}</p>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="testimonials__nav">
            {testimonials.map((t, idx) => (
              <button
                key={idx}
                className={`testimonials__dot ${idx === current ? 'testimonials__dot--active' : ''}`}
                aria-label={`Testimonial ${idx + 1}`}
                onClick={() => handleSelect(idx)}
              ></button>
            ))}
          </div>
        </div>

        {/* Right side — Portrait */}
        <div className="testimonials__right">
          <div className="testimonials__portrait" style={{ clipPath: 'inset(0 100% 0 0)' }}>
            <img
              src={item.image}
              alt={`Client portrait — ${item.name}`}
              loading="lazy"
              key={item.name}
            />
          </div>
        </div>
      </div>

      {/* Section title — massive bottom text */}
      <div className="testimonials__section-title" style={{ opacity: 0 }}>
        <h2>CLIENTS REVIEWS</h2>
      </div>
    </section>
  );
}
