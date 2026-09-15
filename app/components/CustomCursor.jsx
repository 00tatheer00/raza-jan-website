'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      /* Inner dot — instant */
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
    };

    /* Follower circle — smooth lag */
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateFollower);
    };

    /* Scale up on hover over interactive elements */
    const onHoverEnter = () => {
      gsap.to(follower, { scale: 2.5, opacity: 0.15, duration: 0.4, ease: 'power2.out' });
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
    };

    const onHoverLeave = () => {
      gsap.to(follower, { scale: 1, opacity: 0.35, duration: 0.4, ease: 'power2.out' });
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    };

    /* Magnetic effect for buttons */
    const onMagneticMove = (e) => {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    };

    const onMagneticLeave = (e) => {
      gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    };

    document.addEventListener('mousemove', onMouseMove);
    animateFollower();

    /* Attach hover listeners to all interactive elements */
    const interactives = document.querySelectorAll('a, button, .philosophy__card, .services__row, .team__card, .insights__article');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onHoverEnter);
      el.addEventListener('mouseleave', onHoverLeave);
    });

    /* Attach magnetic effect to pill buttons */
    const magnetics = document.querySelectorAll('.btn-pill, .scroll-top, .philosophy__pause, .footer__submit');
    magnetics.forEach((btn) => {
      btn.addEventListener('mousemove', onMagneticMove);
      btn.addEventListener('mouseleave', onMagneticLeave);
    });

    /* Hide on touch devices */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      cursor.style.display = 'none';
      follower.style.display = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
      magnetics.forEach((btn) => {
        btn.removeEventListener('mousemove', onMagneticMove);
        btn.removeEventListener('mouseleave', onMagneticLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div className="custom-cursor" ref={cursorRef}></div>
      {/* Outer follower circle */}
      <div className="custom-cursor-follower" ref={followerRef}></div>
    </>
  );
}
