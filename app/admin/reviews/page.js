'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConfirmModal from '@/app/admin/components/ConfirmModal';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data?.reviews || []);
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setName('');
    setRole('');
    setQuote('');
    setRating(5);
    setIsPublished(true);
    setShowModal(true);
  };

  const openEditModal = (r) => {
    setEditingReview(r);
    setName(r.name || '');
    setRole(r.role || '');
    setQuote(r.quote || '');
    setRating(r.rating || 5);
    setIsPublished(r.is_published ?? true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    setSubmitting(true);
    try {
      const url = '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';
      const body = {
        ...(editingReview && { id: editingReview.id }),
        name: name.trim(),
        role: role.trim(),
        quote: quote.trim(),
        rating: Number(rating),
        is_published: isPublished,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save review');

      setReviews(data.reviews || []);
      setShowModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublished = async (review) => {
    try {
      const newVal = !review.is_published;
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, is_published: newVal } : r))
      );

      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, is_published: newVal }),
      });
    } catch (err) {
      console.error('Toggle error:', err);
      fetchReviews();
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    setDeleting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(reviewToDelete.id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setReviews(data.reviews || []);
      setReviewToDelete(null);
    } catch (err) {
      setErrorMsg(err.message || 'Error deleting review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Topbar */}
      <div className="admin-topbar">
        <div>
          <h1 className="admin-topbar__title">Client Endorsements &amp; Reviews</h1>
          <p className="admin-topbar__desc">
            Manage architectural client testimonials displayed dynamically on your studio homepage.
          </p>
        </div>
        <div className="admin-topbar__actions">
          <button type="button" onClick={openAddModal} className="admin-btn admin-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Client Review</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg('')}
            style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      {loading ? (
        <div className="admin-card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
          Loading endorsements...
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '1.5rem' }}>No reviews found.</p>
          <button type="button" onClick={openAddModal} className="admin-btn admin-btn--primary">
            Add Your First Review
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((r) => {
            return (
              <div
                key={r.id}
                className="admin-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: r.is_published ? '1px solid var(--admin-border)' : '1px dashed rgba(255,255,255,0.1)',
                  opacity: r.is_published ? 1 : 0.65,
                  position: 'relative',
                }}
              >
                <div>
                  {/* Rating Stars & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: '#cda26f', fontSize: '0.9rem', letterSpacing: '2px' }}>
                      {'★'.repeat(r.rating || 5)}
                    </div>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: r.is_published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: r.is_published ? '#4ade80' : '#f87171',
                      }}
                    >
                      {r.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </div>

                  {/* Quote */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: '#e5e5e5',
                      fontStyle: 'italic',
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info & Actions */}
                <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                        {r.name}
                      </h4>
                      <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                        {r.role}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(r)}
                        className="admin-btn admin-btn--secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title={r.is_published ? 'Hide from homepage' : 'Publish on homepage'}
                      >
                        {r.is_published ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(r)}
                        className="admin-btn admin-btn--secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewToDelete(r)}
                        className="admin-btn admin-btn--danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        title={`Delete endorsement by ${r.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: '14px',
              padding: '2rem',
              width: '100%',
              maxWidth: '540px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>
                {editingReview ? 'Edit Client Endorsement' : 'Add Client Endorsement'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ color: 'var(--admin-text-muted)', fontSize: '1.3rem', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">
                  Client / Commissioner Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Al-Mansoor"
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Client Role &amp; Location</label>
                <input
                  type="text"
                  placeholder="e.g. Private Client · Palm Jumeirah, Dubai"
                  className="admin-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Testimonial Quote <span className="required">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write the architectural endorsement or client feedback..."
                  className="admin-textarea"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Rating</label>
                  <select
                    className="admin-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>

                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#cda26f' }}
                    />
                    <span>Publish on Main Page</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn admin-btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name.trim() || !quote.trim()}
                  className="admin-btn admin-btn--primary"
                >
                  {submitting ? 'Saving...' : editingReview ? 'Update Review' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Client Endorsement"
        itemName={reviewToDelete?.name}
        itemType="the review from"
        message={
          reviewToDelete
            ? `Are you sure you want to permanently delete the endorsement by "${reviewToDelete.name}" (${reviewToDelete.role || 'Client'})? This will remove their testimonial from the studio homepage.`
            : ''
        }
        confirmText="Delete Review"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
}
