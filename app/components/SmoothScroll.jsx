'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    /* Ensure ScrollTrigger is synchronized with native high-performance scroll */
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    });

    /* Handle smooth scrolling for all anchor links */
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute('href');
      if (!id || id === '#') return;

      const element = document.querySelector(id);
      if (element) {
        e.preventDefault();
        const navbarHeight = 80;
        const targetPosition =
          element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    /* Refresh ScrollTrigger on window resize and after load */
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    /* Initial refresh */
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  return <>{children}</>;
}
