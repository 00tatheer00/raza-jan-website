'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const atelierStandards = [
  {
    category: 'Visualization & Light Simulation',
    tool: '3ds Max + Corona Renderer',
    role: 'Photorealistic CGI, Spectral Lighting & Material Synthesis',
    badge: 'Atelier Benchmark',
  },
  {
    category: 'Cinematic Spatial Media',
    tool: 'Lumion Pro',
    role: 'Ultra-HD Architectural Walkthroughs & Atmospheric Time-Lapse',
    badge: 'Interactive Media',
  },
  {
    category: 'Technical & Construction Fidelity',
    tool: 'AutoCAD Advanced',
    role: 'Comprehensive Structural Working Drawings & Municipal Filings',
    badge: 'Production Standard',
  },
  {
    category: 'Volumetric Form & Massing',
    tool: 'SketchUp Pro',
    role: 'Iterative Volumetric Studies & Daylight Orientation Analysis',
    badge: 'Spatial Exploration',
  },
  {
    category: 'Publishing & Editorial',
    tool: 'Adobe Creative Suite',
    role: 'Architectural Monographs, Client Presentations & Color Grading',
    badge: 'Editorial Suite',
  },
];

export default function SkillBars() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.atelier-tool__item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="atelier-tools" ref={sectionRef}>
      <div className="atelier-tools__header">
        <h4 className="atelier-tools__title text-uppercase">Atelier Tooling &amp; Technical Standards</h4>
        <span className="atelier-tools__status">Bespoke Precision</span>
      </div>

      <div className="atelier-tools__list">
        {atelierStandards.map((item, i) => (
          <div className="atelier-tool__item" key={i}>
            <div className="atelier-tool__top">
              <span className="atelier-tool__category">{item.category}</span>
              <span className="atelier-tool__badge">{item.badge}</span>
            </div>
            <div className="atelier-tool__main">
              <span className="atelier-tool__name">{item.tool}</span>
              <p className="atelier-tool__role">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
