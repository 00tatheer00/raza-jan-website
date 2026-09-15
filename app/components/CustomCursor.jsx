'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const followerRef = useRef(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    /* Hide completely on touch devices */
    if (window.matchMedia('(pointer: coarse)').matches) {
      follower.style.display = 'none';
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        follower.classList.add('is-active');
      }
    };

    const animate = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };

    const onHoverEnter = () => follower.classList.add('is-hovered');
    const onHoverLeave = () => follower.classList.remove('is-hovered');

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);

    /* Attach hover effects to interactive elements */
    const attachHover = () => {
      const targets = document.querySelectorAll(
        'a, button, .btn-pill, .philosophy__card, .services__row, .team__card, .insights__featured, .testimonials__dot'
      );
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
    };

    attachHover();
    const interval = setInterval(attachHover, 2500);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return <div className="custom-cursor-follower" ref={followerRef}></div>;
}
