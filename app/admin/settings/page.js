'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Password change form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        console.warn('Failed to load user:', err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setUpdating(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg('Master password updated successfully! Your new password is now active.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      setErrorMsg(err.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Topbar */}
      <div className="admin-topbar">
        <div>
          <h1 className="admin-topbar__title">Security &amp; Account Settings</h1>
          <p className="admin-topbar__desc">
            Manage your master authentication credentials, session security, and studio integrations.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Password Reset Card */}
        <div className="admin-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(205, 162, 111, 0.12)',
                border: '1px solid rgba(205, 162, 111, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--admin-gold)',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 600, margin: 0 }}>
                Reset Master Password
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', margin: '0.2rem 0 0 0' }}>
                Set a new password for your admin account
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div
              role="alert"
              style={{
                padding: '0.85rem 1rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div
              role="status"
              style={{
                padding: '0.85rem 1rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#34d399',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword}>
            <div className="admin-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="admin-label" htmlFor="settings-new-password" style={{ marginBottom: 0 }}>
                  New Password <span className="required">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--admin-text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="settings-new-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="admin-input"
                autoComplete="new-password"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="settings-confirm-password">
                Confirm New Password <span className="required">*</span>
              </label>
              <input
                id="settings-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="admin-input"
                autoComplete="new-password"
              />
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <button
                type="submit"
                disabled={updating || !newPassword || !confirmPassword}
                className="admin-btn admin-btn--primary"
                style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {updating ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Account Info & Integrations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Identity Card */}
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600, marginBottom: '1.25rem' }}>
              Active Admin Identity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Email Address</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>
                  {loadingUser ? 'Loading...' : user?.email || 'Authenticated Admin'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Security Level</span>
                <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>Superadmin / Master</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Auth Provider</span>
                <span style={{ color: '#fff' }}>Supabase Auth</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--admin-text-secondary)' }}>Last Sign In</span>
                <span style={{ color: '#fff' }}>
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Active Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Card */}
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 600, marginBottom: '1.25rem' }}>
              Connected Cloud Systems
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  <span style={{ color: '#fff' }}>Supabase Database</span>
                </div>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>Connected</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  <span style={{ color: '#fff' }}>Cloudinary Media CDN</span>
                </div>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>Auto-purge Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                  <span style={{ color: '#fff' }}>EmailJS Client Inquiries</span>
                </div>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>Configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
