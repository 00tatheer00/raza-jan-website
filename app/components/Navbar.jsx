'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo — matches ARCHIDEX style serif logo */}
        <a href="#" className="navbar__logo">
          <span>SRJ Studio</span>
        </a>

        {/* Desktop Menu — 3 groups, 2-row stacked layout like reference */}
        <div className="navbar__menu">
          <div className="navbar__menu-group">
            <a href="#about" className="navbar__menu-item">About</a>
            <a href="#services" className="navbar__menu-item">Services</a>
          </div>
          <div className="navbar__menu-group">
            <a href="#projects" className="navbar__menu-item">Projects</a>
            <a href="#insights" className="navbar__menu-item">Insights</a>
          </div>
          <div className="navbar__menu-group">
            <a href="#team" className="navbar__menu-item">Process</a>
            <a href="#contact" className="navbar__menu-item">Contact Us</a>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="navbar__lang">
          EN
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span style={mobileOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}} />
          <span style={mobileOpen ? { opacity: 0 } : {}} />
          <span style={mobileOpen ? { transform: 'rotate(-45deg) translate(5px, -5px)' } : {}} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="navbar__mobile-overlay">
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
          <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setMobileOpen(false)}>Projects</a>
          <a href="#insights" onClick={() => setMobileOpen(false)}>Insights</a>
          <a href="#team" onClick={() => setMobileOpen(false)}>Process</a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>Contact Us</a>
        </div>
      )}
    </nav>
  );
}
