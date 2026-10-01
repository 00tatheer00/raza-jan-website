'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const actionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      /* Eyebrow badge — fade up */
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.3
      );

      /* Title lines — reveal from bottom, staggered without clipping descenders */
      const titleLines = titleRef.current.querySelectorAll('.hero__title-line');
      tl.fromTo(
        titleLines,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
        },
        0.4
      );

      /* Description and CTA button — fade up towards bottom right */
      tl.fromTo(
        actionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.65
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={sectionRef} id="home">
      {/* Background Portrait of Architect Syed Raza Jan — Large & Prominent on Right */}
      <div className="hero__bg-portrait" aria-hidden="true">
        <div className="hero__bg-portrait-gradient" />
      </div>

      <div className="hero__content">
        <div className="hero__left">
          {/* Eyebrow Badge — "• BUILDING FUTURE HOMES" */}
          <div className="hero__eyebrow" ref={eyebrowRef} style={{ opacity: 0 }}>
            <div className="eyebrow-badge">
              <span className="dot"></span>
              <span>Building Future Homes</span>
            </div>
          </div>

          {/* Main Heading — with overflow visible so 'g' is never cut off */}
          <h1 className="hero__title" ref={titleRef}>
            <span className="hero__title-line">
              Dream <em className="italic">Spaces</em> + Modern
            </span>
            <span className="hero__title-line">
              Living Homes
            </span>
          </h1>
        </div>

        {/* Positioned on the right side towards the bottom so it sits below his face */}
        <div className="hero__right" ref={actionRef} style={{ opacity: 0 }}>
          <p className="hero__description">
            We create visionary spaces that inspire, combining innovative design
            with lasting functionality to bring your ideas to life.
          </p>
          <a href="#about" className="btn-pill">
            <span>About SRJ Studio</span>
            <span className="btn-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
