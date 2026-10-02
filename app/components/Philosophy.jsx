'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import quotesData from '@/data/quotes.json';

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const subTextRef = useRef(null);

  /* Quotes switching & pause state */
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotesData.length);
        setIsFading(false);
      }, 350);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Statement text — word by word reveal on scroll */
      const words = statementRef.current.querySelectorAll('.philosophy__word');
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );

      /* Sub-text + button fade up */
      gsap.fromTo(
        subTextRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: subTextRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Split text into words for word-by-word animation */
  const statementText =
    'We focus on projects of any design that allow us to fundamentally re-think how people interact';
  const statementItalic = 'with buildings, nature, technologies.';

  return (
    <section className="philosophy section" ref={sectionRef} id="about">
      <div className="container">
        {/* Large statement text */}
        <div className="philosophy__statement" ref={statementRef}>
          {statementText.split(' ').map((word, i) => (
            <span key={i} className="philosophy__word">
              {word}{' '}
            </span>
          ))}
          {statementItalic.split(' ').map((word, i) => (
            <span key={`it-${i}`} className="philosophy__word philosophy__word--italic">
              {word}{' '}
            </span>
          ))}
        </div>

        {/* Sub-text row with rotating quotes + Pause/Play toggle + All Portfolio button */}
        <div className="philosophy__sub" ref={subTextRef}>
          <div className="philosophy__controls">
            <button
              type="button"
              className={`philosophy__pause ${isPaused ? 'philosophy__pause--paused' : ''}`}
              onClick={togglePause}
              aria-label={isPaused ? 'Resume quotes rotation' : 'Pause quotes rotation'}
              title={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                /* Play Icon */
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.5 3.2L13 8L4.5 12.8V3.2Z" />
                </svg>
              ) : (
                /* Pause Icon */
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3.5" y="2.5" width="3" height="11" rx="0.5" />
                  <rect x="9.5" y="2.5" width="3" height="11" rx="0.5" />
                </svg>
              )}
            </button>
          </div>

          <p
            className={`philosophy__subtext ${isFading ? 'philosophy__subtext--fading' : ''}`}
            aria-live="polite"
          >
            {quotesData[currentQuoteIndex]}
          </p>

          <a href="#projects" className="btn-pill">
            <span>Explore Project Showcase</span>
            <span className="btn-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 12L12 4M12 4H5M12 4V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
