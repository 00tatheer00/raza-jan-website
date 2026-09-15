'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = sectionRef.current.querySelectorAll('.footer__col');
      gsap.fromTo(
        cols,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
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
    <footer className="footer" ref={sectionRef} id="contact">
      <div className="footer__main">
        <div className="footer__grid container">
          {/* Column 1 — Contact */}
          <div className="footer__col">
            <h3 className="footer__col-title">LET&apos;S WORK TOGETHER</h3>
            <div className="footer__contact-list">
              <a href="tel:+923465564074" className="footer__contact-item">+92 346 5564074</a>
              <a href="mailto:arrazajan@gmail.com" className="footer__contact-item">arrazajan@gmail.com</a>
              <p className="footer__contact-item footer__address">
                Islamabad, Pakistan<br />
                Available for Global Commissions
              </p>
            </div>
          </div>

          {/* Column 2 — Newsletter */}
          <div className="footer__col">
            <h3 className="footer__col-title">JOIN OUR NEWSLETTER</h3>
            <form className="footer__newsletter" onSubmit={(e) => e.preventDefault()}>
              <div className="footer__input-group">
                <input
                  type="email"
                  placeholder="Email*"
                  className="footer__input"
                  required
                />
                <button type="submit" className="footer__submit" aria-label="Subscribe">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Column 3 — Quick Links */}
          <div className="footer__col">
            <h3 className="footer__col-title">QUICK LINKS</h3>
            <nav className="footer__links">
              <a href="#about">Company</a>
              <a href="#projects">Work</a>
              <a href="#services">Services</a>
              <a href="#contact">Career</a>
            </nav>
          </div>

          {/* Column 4 — Social */}
          <div className="footer__col">
            <h3 className="footer__col-title">SOCIAL</h3>
            <nav className="footer__links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://wa.me/923465564074" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <span className="footer__logo">SRJ STUDIO</span>
          <span className="footer__terms">Terms and conditions</span>
          <span className="footer__copy">&copy; 2026. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}
