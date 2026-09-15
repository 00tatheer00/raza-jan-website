'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const textRef = useRef(null);
  const counterRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    /* Counter animation 0 → 100 */
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(counter.val)),
    });

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    /* Text reveal */
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.2
    );

    /* Wait for counter to finish, then exit */
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.4 }, 2.4);
    tl.to(counterRef.current, { opacity: 0, duration: 0.3 }, 2.4);

    /* Curtain reveal — split wipe */
    tl.to(
      '.preloader__curtain-left',
      { xPercent: -100, duration: 0.9, ease: 'power4.inOut' },
      2.6
    );
    tl.to(
      '.preloader__curtain-right',
      { xPercent: 100, duration: 0.9, ease: 'power4.inOut' },
      2.6
    );

    /* Remove preloader */
    tl.to(preloaderRef.current, { autoAlpha: 0, duration: 0.01 }, 3.6);
  }, [onComplete]);

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader__curtain-left"></div>
      <div className="preloader__curtain-right"></div>
      <div className="preloader__content">
        <div className="preloader__text" ref={textRef} style={{ opacity: 0 }}>
          <span className="preloader__name">SRJ STUDIO</span>
          <span className="preloader__tagline">Architecture & Design</span>
        </div>
        <div className="preloader__counter" ref={counterRef}>
          {count}%
        </div>
      </div>
    </div>
  );
}
