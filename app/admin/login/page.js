'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import '@/app/admin/admin.css';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(urlError ? decodeURIComponent(urlError) : '');

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Persistent browser session check: if already authenticated, forward to dashboard
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          router.push(redirectTo);
        }
      } catch (err) {
        console.warn('Session cache check:', err);
      }
    };
    checkActiveSession();
  }, [redirectTo, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during login');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your admin email address.');
      return;
    }

    setResetLoading(true);
    setErrorMsg('');
    setResetSuccessMsg('');

    try {
      const supabase = createClient();
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin/settings` : '/admin/settings';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setResetSent(true);
      setResetSuccessMsg(`Password reset instructions sent to ${email.trim()}. Please check your inbox.`);
    } catch (err) {
      console.error('Reset password email error:', err);
      setErrorMsg(err.message || 'Failed to send reset email. Verify your email address.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        background: '#141618',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(205, 162, 111, 0.1)',
            borderRadius: '999px',
            color: '#cda26f',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <span>SRJ Studio</span>
          <span>✦</span>
          <span>Management</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
            fontSize: '2rem',
            color: '#ffffff',
            fontWeight: 400,
            marginBottom: '0.5rem',
          }}
        >
          {isForgotMode ? 'Reset Credentials' : 'Executive Access'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#9ea3a9' }}>
          {isForgotMode
            ? 'Enter your admin email to receive a secure recovery link.'
            : 'Enter your authorized portfolio credentials to continue.'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            padding: '0.85rem 1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ lineHeight: 1.4 }}>{errorMsg}</span>
        </div>
      )}

      {/* Success Alert */}
      {resetSuccessMsg && (
        <div
          role="status"
          style={{
            padding: '0.85rem 1rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            color: '#34d399',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginTop: '2px', flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ lineHeight: 1.4 }}>{resetSuccessMsg}</span>
        </div>
      )}

      {/* Forms */}
      {isForgotMode ? (
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="reset-email"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#f5f5f7',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              Registered Admin Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@srjstudio.com"
              autoComplete="email"
              className="admin-input"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: '#1a1d20',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            style={{
              width: '100%',
              padding: '0.9rem 1.5rem',
              background: resetLoading ? '#8a7354' : '#cda26f',
              color: '#0c0d0e',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: resetLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '48px',
            }}
          >
            {resetLoading ? <span>Sending Link...</span> : <span>Send Password Reset Link</span>}
          </button>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setErrorMsg('');
                setResetSuccessMsg('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--admin-gold)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
              }}
            >
              ← Back to Sign In
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#f5f5f7',
                marginBottom: '0.5rem',
                fontWeight: 500,
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@srjstudio.com"
              autoComplete="email"
              className="admin-input"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: '#1a1d20',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.85rem',
                  color: '#f5f5f7',
                  fontWeight: 500,
                }}
              >
                Master Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setErrorMsg('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-gold)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="admin-input"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: '#1a1d20',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem 1.5rem',
              background: loading ? '#8a7354' : '#cda26f',
              color: '#0c0d0e',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '48px',
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              marginTop: '1.25rem',
              color: '#8e949c',
              fontSize: '0.76rem',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#cda26f" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Device remembered · 1-Year browser session cache active</span>
          </div>
        </form>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          href="/"
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#cda26f')}
          onMouseOut={(e) => (e.target.style.color = '#6b7280')}
        >
          ← Return to public website
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0d0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Architectural subtle ambient background grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(205, 162, 111, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <Suspense
        fallback={
          <div style={{ color: '#cda26f', fontSize: '0.9rem', textAlign: 'center' }}>
            Loading login portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
