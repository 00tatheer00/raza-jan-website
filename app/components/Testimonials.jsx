'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reviewsData = [
  {
    quote:
      'Working with SRJ Studio was transformative. Their architectural vision combined with meticulous attention to detail exceeded every expectation. The design process was seamless, and the final result is nothing short of extraordinary.',
    name: 'Ahmed Hassan',
    role: 'CEO, Horizon Developers · Islamabad',
  },
  {
    quote:
      'Syed Raza Jan brought a rare level of sophistication to our luxury villa project in Dubai. The spatial hierarchy, light study, and 3D visualization allowed us to experience the space before breaking ground.',
    name: 'Sarah Al-Mansoor',
    role: 'Private Client · Palm Jumeirah, Dubai',
  },
  {
    quote:
      'The technical mastery from concept development to structural coordination is world-class. Raza Jan’s turnkey execution ensured zero deviations from the approved architectural rendering.',
    name: 'Engr. Tariq Mehmood',
    role: 'Managing Director, Apex Buildcon',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const isPausedRef = useRef(false);
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const authorRef = useRef(null);

  // Sync ref with state
  currentRef.current = current;

  // Smooth transition between reviews
  const goToReview = useCallback((nextIndex) => {
    if (nextIndex === currentRef.current) return;

    if (quoteRef.current && authorRef.current) {
      gsap.to([quoteRef.current, authorRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setCurrent(nextIndex);
          gsap.fromTo(
            [quoteRef.current, authorRef.current],
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.05,
              ease: 'power2.out',
            }
          );
        },
      });
    } else {
      setCurrent(nextIndex);
    }
  }, []);

  // Entrance animations on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(
        '.reviews__header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Quote entrance animation
      gsap.fromTo(
        ['.reviews__quote-icon', '.reviews__quote-text'],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.reviews__quote-wrap',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Footer entrance animation
      gsap.fromTo(
        '.reviews__footer',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.reviews__footer',
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Automatic transition every 5 seconds (pauses while hovering or interacting)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        const next = (currentRef.current + 1) % reviewsData.length;
        goToReview(next);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [goToReview]);

  const handleSelect = (index) => {
    goToReview(index);
  };

  const item = reviewsData[current];

  return (
    <section
      className="reviews"
      ref={sectionRef}
      id="reviews"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
      onTouchStart={() => {
        isPausedRef.current = true;
      }}
      onTouchEnd={() => {
        isPausedRef.current = false;
      }}
    >
      <div className="reviews__container">
        {/* Top Header Row */}
        <div className="reviews__header">
          <div className="reviews__header-left">
            <div className="reviews__badge">
              <span className="reviews__badge-dot"></span>
              <span className="reviews__badge-text">Client Testimonial &amp; Appraisal</span>
            </div>
            <h2 className="reviews__title">Words from Our Patrons</h2>
          </div>

          <div className="reviews__header-right">
            <span className="reviews__watermark">Client Reviews</span>
            <span className="reviews__sub-badge">Curated Endorsements</span>
          </div>
        </div>

        {/* Testimonial Quote Body */}
        <div className="reviews__content">
          <div className="reviews__quote-wrap">
            <span className="reviews__quote-icon" aria-hidden="true">
              “
            </span>
            <p className="reviews__quote-text" ref={quoteRef}>
              {item.quote}
            </p>
          </div>

          {/* Footer: Author & Interactive Carousel Controls */}
          <div className="reviews__footer">
            <div className="reviews__author" ref={authorRef}>
              <div className="reviews__author-name">{item.name}</div>
              <div className="reviews__author-role">{item.role}</div>
            </div>

            <div className="reviews__nav" role="tablist" aria-label="Client review selection">
              {reviewsData.map((review, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={idx === current}
                  aria-label={`Testimonial from ${review.name}`}
                  className="reviews__dot-btn"
                  onClick={() => handleSelect(idx)}
                >
                  <span
                    className={`reviews__dot-pill ${
                      idx === current
                        ? 'reviews__dot-pill--active'
                        : 'reviews__dot-pill--inactive'
                    }`}
                  ></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
