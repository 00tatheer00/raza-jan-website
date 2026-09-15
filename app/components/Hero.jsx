'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const rightRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

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

      /* Title lines — clip-path reveal from bottom, staggered */
      const titleLines = titleRef.current.querySelectorAll('.hero__title-line');
      tl.fromTo(
        titleLines,
        { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.9,
          stagger: 0.12,
        },
        0.4
      );

      /* Right panel — fade up */
      tl.fromTo(
        rightRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      );

      /* Hero image — scale down reveal with clip-path */
      tl.fromTo(
        imageWrapperRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power3.inOut' },
        0.6
      );

      tl.fromTo(
        imageRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.8, ease: 'power2.out' },
        0.6
      );

      /* Parallax on scroll — image moves slower */
      gsap.to(imageRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={sectionRef} id="home">
      <div className="hero__content">
        <div className="hero__left">
          {/* Eyebrow Badge — "• BUILDING FUTURE HOMES" */}
          <div className="hero__eyebrow" ref={eyebrowRef} style={{ opacity: 0 }}>
            <div className="eyebrow-badge">
              <span className="dot"></span>
              <span>Building Future Homes</span>
            </div>
          </div>

          {/* Main Heading — mixed serif + italic like reference */}
          <h1 className="hero__title" ref={titleRef}>
            <span className="hero__title-line" style={{ display: 'block', opacity: 0 }}>
              Dream <em className="italic">Spaces</em> + Modern
            </span>
            <span className="hero__title-line" style={{ display: 'block', opacity: 0 }}>
              Living Homes
            </span>
          </h1>
        </div>

        <div className="hero__right" ref={rightRef} style={{ opacity: 0 }}>
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

      {/* Full-width panoramic hero image */}
      <div className="hero__image-wrapper" ref={imageWrapperRef} style={{ clipPath: 'inset(100% 0 0 0)' }}>
        <img
          src="/images/hero.jpg"
          alt="Modern architectural house nestled in mountains at dusk — SRJ Studio"
          className="hero__image"
          ref={imageRef}
        />
      </div>
    </section>
  );
}
