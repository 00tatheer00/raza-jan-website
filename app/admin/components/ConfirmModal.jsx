'use client';

import { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  itemName = '',
  itemType = 'item',
  message = '',
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#16181b',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 20px rgba(239, 68, 68, 0.1)',
          animation: 'modal-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Warning Icon Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 600, margin: 0 }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', margin: '0.2rem 0 0 0' }}>
              Irreversible action
            </p>
          </div>
        </div>

        {/* Message Body */}
        <div style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {message ? (
            <p style={{ margin: 0 }}>{message}</p>
          ) : (
            <p style={{ margin: 0 }}>
              Are you sure you want to delete {itemType}{' '}
              {itemName ? <strong style={{ color: '#fff' }}>&ldquo;{itemName}&rdquo;</strong> : ''}? This record will be permanently removed from your studio portfolio.
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="admin-btn admin-btn--secondary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#dc2626',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            }}
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
