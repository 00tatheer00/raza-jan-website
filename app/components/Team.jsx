'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const members = [
  {
    name: 'Syed Raza Jan',
    role: 'Lead Architect, SRJ Studio',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    name: 'Ali Hassan',
    role: 'Interior Designer, SRJ Studio',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  },
  {
    name: 'Sara Ahmed',
    role: '3D Visualization, SRJ Studio',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
  },
];

export default function Team() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header reveal */
      gsap.fromTo(
        '.team__header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* Cards staggered scale-up + fade */
      const cards = sectionRef.current.querySelectorAll('.team__card');
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="team section" ref={sectionRef} id="team">
      <div className="container">
        {/* Header row */}
        <div className="team__header">
          <div className="team__header-left">
            <span className="text-uppercase">Team Members</span>
            <h2 className="team__heading">
              When selecting SRJ Studio,{' '}
              <em className="text-italic">we focus on several</em>
            </h2>
          </div>
          <a href="#" className="btn-pill">
            <span>ALL MEMBERS</span>
            <span className="btn-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>

        {/* Team cards — 3 column grid */}
        <div className="team__grid">
          {members.map((member, i) => (
            <div className="team__card" key={i}>
              <div className="team__card-image">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>
              <div className="team__card-info">
                <h3 className="team__card-name">{member.name}</h3>
                <div className="team__card-right">
                  <div className="team__card-socials">
                    <a href="#" aria-label="Settings">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.1 1.45 1.1H21a2 2 0 010 4h-.09c-.68 0-1.25.45-1.45 1.1z"/></svg>
                    </a>
                    <a href="#" aria-label="X">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l16 16M20 4L4 20"/></svg>
                    </a>
                    <a href="#" aria-label="LinkedIn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
              <p className="team__card-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
