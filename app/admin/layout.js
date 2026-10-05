'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ResetPasswordModal from '@/app/admin/components/ResetPasswordModal';
import '@/app/admin/admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  // Clear transition indicator on route change
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();

      // Clear all local storage, session storage, and auth cookies
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {}

        // Expire all Supabase auth cookies
        document.cookie.split(';').forEach((c) => {
          const cookieName = c.split('=')[0].trim();
          if (
            cookieName.startsWith('sb-') ||
            cookieName.includes('auth') ||
            cookieName.includes('supabase')
          ) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          }
        });
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    }

    router.push('/admin/login');
    router.refresh();
  };

  // Do not wrap login page with sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }


  const navLinks = [
    {
      href: '/admin',
      label: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
      exact: false,
    },
    {
      href: '/admin/projects/new',
      label: 'New Project',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/admin/reviews',
      label: 'Client Reviews',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      exact: false,
    },
    {
      href: '/admin/settings',
      label: 'Security & Settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      exact: true,
    },
  ];

  return (
    <div className="admin-shell">
      {/* Golden Route Transition Progress Bar */}
      {navigatingTo && <div className="admin-top-progress" />}

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            SRJ <span>STUDIO</span>
          </div>
          <span className="admin-sidebar__badge">ADMIN</span>
        </div>

        <nav className="admin-sidebar__nav">
          {navLinks.map((item) => {
            const isTarget = navigatingTo === item.href;
            const isActive = isTarget
              ? true
              : !navigatingTo &&
                (item.exact
                  ? pathname === item.href
                  : pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin'));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileOpen(false);
                  if (pathname !== item.href) {
                    setNavigatingTo(item.href);
                  }
                }}
                className={`admin-nav__link ${isActive ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                {item.icon}
                <span>{item.label}</span>
                {isTarget && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--admin-gold)',
                      boxShadow: '0 0 8px var(--admin-gold)',
                    }}
                  />
                )}
              </Link>
            );
          })}

          <div style={{ margin: '1rem 0', height: '1px', background: 'var(--admin-border)' }} />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav__link"
            style={{ color: 'var(--admin-text-muted)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Live Website ↗</span>
          </a>
        </nav>

        {/* User Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-user">
            <div className="admin-user__info">
              <div className="admin-user__avatar">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="admin-user__email" title={user?.email || 'Admin'}>
                {user?.email || 'Authenticated Admin'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="admin-user__logout"
                title="Reset Master Password"
                aria-label="Reset Master Password"
                style={{ color: 'var(--admin-gold)' }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-user__logout"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Mobile Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Immediate Skeleton Placeholder when tab is switching */}
        {navigatingTo ? (
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="admin-skeleton admin-skeleton-title" />
              <div className="admin-skeleton admin-skeleton-desc" />
            </div>
            <div className="admin-stats-grid" style={{ marginBottom: '2.5rem' }}>
              <div className="admin-skeleton admin-skeleton-card" />
              <div className="admin-skeleton admin-skeleton-card" />
              <div className="admin-skeleton admin-skeleton-card" />
              <div className="admin-skeleton admin-skeleton-card" />
            </div>
            <div className="admin-card" style={{ padding: '2rem' }}>
              <div className="admin-skeleton admin-skeleton-row" />
              <div className="admin-skeleton admin-skeleton-row" />
              <div className="admin-skeleton admin-skeleton-row" />
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Global In-Dashboard Password Reset Modal */}
      <ResetPasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        userEmail={user?.email}
      />
    </div>
  );
}
