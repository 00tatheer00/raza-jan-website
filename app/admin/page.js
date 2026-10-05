'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    published: 0,
    drafts: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: projects, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });


        if (error) {
          console.error('Error fetching dashboard stats:', error);
          setLoading(false);
          return;
        }

        const all = projects || [];
        const featured = all.filter((p) => p.featured).length;
        const published = all.filter((p) => p.is_published).length;
        const drafts = all.filter((p) => !p.is_published).length;

        setStats({
          total: all.length,
          featured,
          published,
          drafts,
        });

        setRecentProjects(all.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      {/* Topbar */}
      <div className="admin-topbar">
        <div>
          <h1 className="admin-topbar__title">Portfolio Command Center</h1>
          <p className="admin-topbar__desc">
            Manage your architectural commissions, showcase highlights, and public case studies.
          </p>
        </div>
        <div className="admin-topbar__actions">
          <Link href="/admin/projects/new" className="admin-btn admin-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Commission</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Projects</div>
          <div className="admin-stat-card__value">{loading ? '...' : stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Showcased on Home</div>
          <div className="admin-stat-card__value" style={{ color: 'var(--admin-gold)' }}>
            {loading ? '...' : stats.featured}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Published Live</div>
          <div className="admin-stat-card__value" style={{ color: 'var(--admin-success)' }}>
            {loading ? '...' : stats.published}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Drafts</div>
          <div className="admin-stat-card__value" style={{ color: 'var(--admin-text-muted)' }}>
            {loading ? '...' : stats.drafts}
          </div>
        </div>
      </div>

      {/* Recent Projects Card */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Recent Architectural Commissions</h2>
          <Link href="/admin/projects" className="admin-btn admin-btn--secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            View All ({stats.total})
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
            Loading commissions...
          </div>
        ) : recentProjects.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--admin-text-muted)', marginBottom: '1rem', fontSize: '2.5rem' }}>✦</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>No Projects Created Yet</h3>
            <p style={{ color: 'var(--admin-text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              Your database is fresh and ready. Create your first project with photos, architectural specs, and choose whether to feature it on the home page.
            </p>
            <Link href="/admin/projects/new" className="admin-btn admin-btn--primary">
              Create First Project
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Commission</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Showcased</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#222',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={p.image_url}
                            alt={p.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{p.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                            {p.discipline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--admin-text-secondary)',
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{p.location}</td>
                    <td>
                      {p.featured ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.75rem',
                            color: 'var(--admin-gold)',
                            fontWeight: 600,
                          }}
                        >
                          <span>★</span> Showcased
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '4px',
                          background: p.is_published ? 'var(--admin-success-soft)' : 'rgba(255, 255, 255, 0.05)',
                          color: p.is_published ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="admin-btn admin-btn--secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', minHeight: '32px' }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
