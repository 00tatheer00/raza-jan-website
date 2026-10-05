'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);

  // Turn off loading indicator once route transition completes
  useEffect(() => {
    setNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, and anchor hashes on the same page
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank'
      ) {
        return;
      }

      // If it's a hash anchor on the same page (e.g. #about when already on /), don't show full page loader
      if (href.startsWith('#') || (href.startsWith('/#') && pathname === '/')) {
        return;
      }

      // If clicking the current exact page without hash change
      if (href === pathname) {
        return;
      }

      // User clicked a cross-page route — activate immediate visual feedback!
      setNavigating(true);

      // Auto-dismiss safety timeout
      setTimeout(() => {
        setNavigating(false);
      }, 4000);
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [pathname]);

  if (!navigating) return null;

  return (
    <div className="global-progress-bar" role="progressbar" aria-label="Loading page..." />
  );
}
