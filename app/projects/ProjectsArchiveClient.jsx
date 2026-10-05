'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProjectsArchiveClient({ initialProjects = [], initialCategories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = initialProjects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.discipline?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#111111' }}>
      <main style={{ paddingTop: 'calc(var(--navbar-height, 4.5rem) + 3.5rem)', paddingBottom: '7rem' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.85rem',
                color: '#666666',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.color = '#111111')}
              onMouseOut={(e) => (e.target.style.color = '#666666')}
            >
              Home
            </Link>
            <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: '0.85rem' }}>/</span>
            <span style={{ fontSize: '0.85rem', color: '#9e733b', fontWeight: 600 }}>Commissions Archive</span>
          </div>

          {/* Editorial Page Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2rem',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              marginBottom: '3rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  background: '#fbf8f4',
                  borderRadius: '999px',
                  color: '#9e733b',
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  border: '1px solid rgba(184, 134, 11, 0.25)',
                }}
              >
                <span>Curated Portfolio</span>
                <span>✦</span>
                <span>{filteredProjects.length} Works</span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#111111',
                }}
              >
                Selected <em style={{ fontStyle: 'italic', color: '#9e733b' }}>Commissions</em>
              </h1>
            </div>

            <p
              style={{
                maxWidth: '480px',
                fontSize: '1rem',
                lineHeight: 1.75,
                color: '#555555',
              }}
            >
              Every commission is rooted in spatial purity, tactile materiality, and structural rigor—spanning
              bespoke luxury villas, private creative ateliers, and full turnkey completions.
            </p>
          </div>

          {/* Category Filter Pills & Search */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              marginBottom: '3rem',
            }}
          >
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {initialCategories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id || cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      background: isActive ? '#111111' : '#f7f7f7',
                      color: isActive ? '#ffffff' : '#333333',
                      border: isActive ? '1px solid #111111' : '1px solid rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.15)' : 'none',
                    }}
                  >
                    {cat.name === 'all' ? 'All Commissions' : cat.label || cat.name}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#888888"
                strokeWidth="2"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search commissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem 0.55rem 2.4rem',
                  borderRadius: '999px',
                  background: '#f7f7f7',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  color: '#111111',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Grid of Projects */}
          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#111111', marginBottom: '0.5rem' }}>
                No commissions found
              </h3>
              <p style={{ color: '#666666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try resetting your filters or search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '999px',
                  background: '#111111',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {filteredProjects.map((project, idx) => (
                <article
                  key={project.id || project.slug}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s, border-color 0.4s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(184, 134, 11, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Media Image */}
                  <Link
                    href={`/projects/${project.slug}`}
                    style={{
                      position: 'relative',
                      aspectRatio: '16 / 10',
                      overflow: 'hidden',
                      display: 'block',
                      background: '#e8e8e8',
                    }}
                  >
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#111111',
                        fontWeight: 600,
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      {project.category}
                    </div>
                  </Link>

                  {/* Content */}
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#888888',
                          fontWeight: 500,
                          marginBottom: '0.35rem',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {project.discipline}
                      </div>
                      <h2
                        style={{
                          fontFamily: "var(--font-heading), 'DM Serif Display', Georgia, serif",
                          fontSize: '1.6rem',
                          fontWeight: 400,
                          color: '#111111',
                          marginBottom: '0.5rem',
                          lineHeight: 1.25,
                        }}
                      >
                        <Link
                          href={`/projects/${project.slug}`}
                          style={{ color: '#111111', textDecoration: 'none' }}
                        >
                          {project.title}
                        </Link>
                      </h2>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: '#555555',
                          lineHeight: 1.6,
                        }}
                      >
                        {project.scope}
                      </p>
                    </div>

                    {/* Meta Specs Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.825rem',
                        color: '#666666',
                      }}
                    >
                      <span>{project.location}</span>
                      <span style={{ color: '#9e733b', fontWeight: 600 }}>{project.scale}</span>
                    </div>

                    {/* Read Case Study Action */}
                    <div style={{ marginTop: '1.25rem' }}>
                      <Link
                        href={`/projects/${project.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#111111',
                          textDecoration: 'none',
                          fontWeight: 600,
                          letterSpacing: '0.02em',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#9e733b')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#111111')}
                      >
                        <span>Explore Case Study</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
