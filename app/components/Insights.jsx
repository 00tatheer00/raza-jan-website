'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const articles = [
  { title: 'Urban Spaces: Architecture for Livable Cities', category: 'Urbanism', date: 'Jan 17, 2026' },
  { title: '10 Ways to Make Better Architecture', category: 'Urbanism', date: 'Jan 17, 2026' },
  { title: '18 Best Materials for Sustainable Architecture', category: 'Exterior', date: 'Jan 17, 2026' },
  { title: 'Present Your Architecture Site Analysis Successfully', category: 'Design', date: 'Jan 17, 2026' },
];

export default function Insights() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.insights__title', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });

      gsap.fromTo('.insights__featured-image', { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.insights__featured-image', start: 'top 80%', toggleActions: 'play none none none' },
      });

      const items = sectionRef.current.querySelectorAll('.insights__article');
      gsap.fromTo(items, { opacity: 0, x: 30 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.12,
        scrollTrigger: { trigger: items[0], start: 'top 85%', toggleActions: 'play none none none' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="insights section" ref={sectionRef} id="insights">
      <div className="container">
        <h2 className="insights__title">
          Our latest <em className="text-italic">insights</em>
        </h2>

        <div className="insights__grid">
          {/* Featured Post — left */}
          <div className="insights__featured">
            <div className="insights__featured-image" style={{ clipPath: 'inset(100% 0 0 0)' }}>
              <img
                src="/images/project-interior.jpg"
                alt="Designing with Purpose"
                loading="lazy"
              />
            </div>
            <div className="insights__featured-meta">
              <span className="insights__featured-cat">INTERIOR / DESIGN</span>
              <span className="insights__featured-dot">•</span>
              <span className="insights__featured-date">December 1, 2025</span>
            </div>
            <h3 className="insights__featured-title">
              Designing with Purpose, Architecture that Inspires
            </h3>
          </div>

          {/* Article list — right */}
          <div className="insights__list">
            {articles.map((article, i) => (
              <a href="#" className="insights__article" key={i}>
                <div className="insights__article-content">
                  <h4 className="insights__article-title">{article.title}</h4>
                  <div className="insights__article-meta">
                    <span>{article.category}</span>
                    <span className="insights__article-dot">•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <span className="insights__article-arrow">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            ))}

            <a href="#" className="btn-pill" style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
              <span>See Insights</span>
              <span className="btn-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
