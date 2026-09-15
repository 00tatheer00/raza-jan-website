'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const textRef = useRef(null);
  const counterRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const preloader = preloaderRef.current;
    if (!preloader) return;

    /* Counter animation 0 → 100 in 1.1s */
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => setCount(Math.round(counter.val)),
    });

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        setTimeout(() => ScrollTrigger.refresh(), 100);
      },
    });

    /* Text reveal */
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      0.1
    );

    /* Text & counter fade out */
    tl.to(textRef.current, { opacity: 0, y: -15, duration: 0.3 }, 1.15);
    tl.to(counterRef.current, { opacity: 0, duration: 0.25 }, 1.15);

    /* Make non-blocking as soon as curtains start to part */
    tl.add(() => {
      if (preloader) preloader.style.pointerEvents = 'none';
    }, 1.25);

    /* Curtain reveal — fast luxury split */
    tl.to(
      '.preloader__curtain-left',
      { xPercent: -100, duration: 0.65, ease: 'power3.inOut' },
      1.25
    );
    tl.to(
      '.preloader__curtain-right',
      { xPercent: 100, duration: 0.65, ease: 'power3.inOut' },
      1.25
    );

    /* Hide and remove preloader container */
    tl.to(preloader, { autoAlpha: 0, duration: 0.2 }, 1.8);
  }, [onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader__curtain-left"></div>
      <div className="preloader__curtain-right"></div>
      <div className="preloader__content">
        <div className="preloader__text" ref={textRef} style={{ opacity: 0 }}>
          <span className="preloader__name">SRJ STUDIO</span>
          <span className="preloader__tagline">Architectural Atelier</span>
        </div>
        <div className="preloader__counter" ref={counterRef}>
          {count}%
        </div>
      </div>
    </div>
  );
}
