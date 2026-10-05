'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ConfirmModal from '@/app/admin/components/ConfirmModal';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [reordering, setReordering] = useState(false);
  const [movedId, setMovedId] = useState(null);

  // Dynamic Categories state
  const [categories, setCategories] = useState([
    { id: 'all', name: 'all', label: 'All Projects' },
    { id: 'Architecture', name: 'Architecture', label: 'Architecture & Villas' },
    { id: 'Interior', name: 'Interior', label: 'Interior Architecture' },
    { id: 'Turnkey', name: 'Turnkey', label: 'Turnkey Execution' },
  ]);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [deletingCatName, setDeletingCatName] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data?.categories && data.categories.length > 0) {
        setCategories([
          { id: 'all', name: 'all', label: 'All' },
          ...data.categories,
        ]);
      }
    } catch (e) {
      console.warn('Failed to load dynamic categories:', e);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAddingCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          label: newCatLabel.trim() || newCatName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');

      if (data.categories) {
        setCategories([
          { id: 'all', name: 'all', label: 'All' },
          ...data.categories,
        ]);
      }
      setNewCatName('');
      setNewCatLabel('');
    } catch (err) {
      setErrorMsg(err.message || 'Error adding category');
    } finally {
      setAddingCat(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete || !categoryToDelete.name || categoryToDelete.name === 'all') return;

    setDeletingCatName(categoryToDelete.name);
    try {
      const res = await fetch(
        `/api/categories?name=${encodeURIComponent(categoryToDelete.name)}&id=${encodeURIComponent(categoryToDelete.id || '')}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      if (data.categories) {
        setCategories([
          { id: 'all', name: 'all', label: 'All' },
          ...data.categories,
        ]);
      } else {
        setCategories((prev) => prev.filter((c) => c.name.toLowerCase() !== categoryToDelete.name.toLowerCase()));
      }

      if (categoryFilter.toLowerCase() === categoryToDelete.name.toLowerCase()) {
        setCategoryFilter('all');
      }
      setCategoryToDelete(null);
    } catch (err) {
      setErrorMsg(err.message || 'Error deleting category');
    } finally {
      setDeletingCatName(null);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Fetch projects error:', err);
      setErrorMsg(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  // Reorder projects with Up / Down buttons
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length || reordering) return;

    setReordering(true);

    const newProjects = [...projects];
    const itemToMove = newProjects[index];
    const swapItem = newProjects[targetIndex];

    // Trigger row animation highlight
    setMovedId(itemToMove.id);
    setTimeout(() => setMovedId(null), 900);

    // Swap elements
    newProjects[index] = swapItem;
    newProjects[targetIndex] = itemToMove;

    // Assign sequential display orders: 1, 2, 3, 4, 5...
    const updatedList = newProjects.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    // Optimistic UI update
    setProjects(updatedList);

    try {
      const supabase = createClient();
      await Promise.all([
        supabase
          .from('projects')
          .update({ display_order: targetIndex + 1, updated_at: new Date().toISOString() })
          .eq('id', itemToMove.id),
        supabase
          .from('projects')
          .update({ display_order: index + 1, updated_at: new Date().toISOString() })
          .eq('id', swapItem.id),
      ]);
    } catch (err) {
      console.error('Error persisting project reorder:', err);
      setErrorMsg('Failed to update project order in database');
      fetchProjects(); // Revert on error
    } finally {
      setReordering(false);
    }
  };



  // Quick toggle featured / showcase
  const handleToggleFeatured = async (id, currentVal) => {
    try {
      const supabase = createClient();
      const newVal = !currentVal;

      // Optimistic UI update
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: newVal } : p))
      );

      const { error } = await supabase
        .from('projects')
        .update({ featured: newVal, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Toggle featured error:', err);
      fetchProjects(); // Revert on failure
    }
  };

  // Quick toggle published
  const handleTogglePublished = async (id, currentVal) => {
    try {
      const supabase = createClient();
      const newVal = !currentVal;

      // Optimistic UI update
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: newVal } : p))
      );

      const { error } = await supabase
        .from('projects')
        .update({ is_published: newVal, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Toggle published error:', err);
      fetchProjects(); // Revert on failure
    }
  };

  // Delete project confirmation handler
  const handleConfirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setDeletingProject(true);

      // 1. Delete associated images from Cloudinary storage
      const imageUrls = [
        projectToDelete.image_url,
        ...(Array.isArray(projectToDelete.gallery_urls) ? projectToDelete.gallery_urls : []),
      ].filter(Boolean);

      if (imageUrls.length > 0) {
        try {
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: imageUrls }),
          });
        } catch (cloudErr) {
          console.warn('Could not delete Cloudinary assets:', cloudErr);
        }
      }

      // 2. Delete project record from Supabase
      const supabase = createClient();
      const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      console.error('Delete project error:', err);
      setErrorMsg(err.message || 'Failed to delete commission');
    } finally {
      setDeletingProject(false);
    }
  };

  // Filtered projects
  const filtered = projects.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      search === '' ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.discipline?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Topbar */}
      <div className="admin-topbar">
        <div>
          <h1 className="admin-topbar__title">Architectural Commissions</h1>
          <p className="admin-topbar__desc">
            Organize, edit, publish, and choose which projects appear in the curated home showcase.
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

      {/* Error message banner */}
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
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div
        className="admin-card"
        style={{
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--admin-text-muted)"
              strokeWidth="2"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, location, or discipline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map((cat) => {
              const catVal = cat.name;
              const isActive = categoryFilter === catVal;
              return (
                <button
                  key={cat.id || catVal}
                  type="button"
                  onClick={() => setCategoryFilter(catVal)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: isActive ? 'var(--admin-gold)' : 'var(--admin-surface-elevated)',
                    color: isActive ? '#0c0d0e' : 'var(--admin-text-secondary)',
                    border: '1px solid var(--admin-border)',
                    transition: 'all 0.2s',
                  }}
                >
                  {catVal === 'all' ? 'All' : cat.name}
                </button>
              );
            })}

            {/* Manage Categories Button */}
            <button
              type="button"
              onClick={() => setShowAddCatModal(true)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(205, 162, 111, 0.1)',
                color: 'var(--admin-gold)',
                border: '1px dashed rgba(205, 162, 111, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
              title="Add or delete architectural categories"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
          Showing <strong>{filtered.length}</strong> of {projects.length} commissions
        </div>
      </div>

      {/* Manage Categories Modal (Add & Delete) */}
      {showAddCatModal && (
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
            if (e.target === e.currentTarget) setShowAddCatModal(false);
          }}
        >
          <div
            style={{
              background: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
              borderRadius: '14px',
              padding: '2rem',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>Manage Categories</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '0.25rem' }}>
                  Add new categories or delete ones you no longer need.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                style={{
                  color: 'var(--admin-text-muted)',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: '0.25rem',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* List of current categories with Delete action */}
            <div style={{ marginBottom: '1.75rem', marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                Existing Categories ({categories.filter((c) => c.name !== 'all').length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categories
                  .filter((cat) => cat.name !== 'all')
                  .map((cat) => {
                    const projectCount = projects.filter(
                      (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
                    ).length;
                    const isDeleting = deletingCatName === cat.name;

                    return (
                      <div
                        key={cat.id || cat.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>
                            {cat.name}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            {cat.label && cat.label !== cat.name ? `${cat.label} • ` : ''}
                            {projectCount} commission{projectCount === 1 ? '' : 's'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.2s',
                          }}
                          title={`Delete category ${cat.name}`}
                        >
                          {isDeleting ? (
                            <span>Deleting...</span>
                          ) : (
                            <>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--admin-border)', margin: '1.5rem 0' }} />

            {/* Create New Category */}
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--admin-gold)', marginBottom: '0.85rem', fontWeight: 600 }}>
                + Add New Category
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="admin-form-group">
                  <label className="admin-label">
                    Category Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Landscape, Commercial, Hospitality, Residential"
                    className="admin-input"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Label (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Landscape & Masterplanning"
                    className="admin-input"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddCatModal(false)}
                    className="admin-btn admin-btn--secondary"
                  >
                    Done
                  </button>
                  <button
                    type="submit"
                    disabled={addingCat || !newCatName.trim()}
                    className="admin-btn admin-btn--primary"
                  >
                    {addingCat ? 'Adding...' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
            Loading commissions...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
              {search || categoryFilter !== 'all'
                ? 'No commissions match your filter'
                : 'No commissions created yet'}
            </h3>
            <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {search || categoryFilter !== 'all'
                ? 'Try clearing the search or category filters.'
                : 'Get started by creating your first architectural project.'}
            </p>
            {search || categoryFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                }}
                className="admin-btn admin-btn--secondary"
              >
                Reset Filters
              </button>
            ) : (
              <Link href="/admin/projects/new" className="admin-btn admin-btn--primary">
                Add Project Now
              </Link>
            )}
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '100px', textAlign: 'center' }}>Order</th>
                  <th>Commission</th>
                  <th>Category</th>
                  <th>Location & Scale</th>
                  <th>Showcase on Home</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const fullIndex = projects.findIndex((item) => item.id === p.id);
                  const isFirst = fullIndex === 0;
                  const isLast = fullIndex === projects.length - 1;

                  return (
                    <tr key={p.id} className={movedId === p.id ? 'admin-row--moved' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <div className="admin-order-box">
                          <span className="admin-order-num">
                            #{String(p.display_order ?? (fullIndex + 1)).padStart(2, '0')}
                          </span>
                          <div className="admin-order-actions">
                            <button
                              type="button"
                              disabled={isFirst || reordering}
                              onClick={() => handleMove(fullIndex, -1)}
                              title="Move position Up"
                              aria-label={`Move ${p.title} up`}
                              className="admin-order-btn admin-order-btn--up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={isLast || reordering}
                              onClick={() => handleMove(fullIndex, 1)}
                              title="Move position Down"
                              aria-label={`Move ${p.title} down`}
                              className="admin-order-btn admin-order-btn--down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              width: '54px',
                              height: '54px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#000',
                              flexShrink: 0,
                              border: '1px solid var(--admin-border)',
                            }}
                          >
                            <img
                              src={p.image_url}
                              alt={p.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{p.title}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                              /projects/{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--admin-text-primary)',
                          }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#fff' }}>{p.location}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{p.scale}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label className="admin-switch" title="Toggle Home Showcase">
                            <input
                              type="checkbox"
                              checked={p.featured || false}
                              onChange={() => handleToggleFeatured(p.id, p.featured)}
                            />
                            <span className="admin-slider"></span>
                          </label>
                          <span style={{ fontSize: '0.78rem', color: p.featured ? 'var(--admin-gold)' : 'var(--admin-text-muted)' }}>
                            {p.featured ? '★ Showcase' : 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <label className="admin-switch" title="Toggle Publish Status">
                          <input
                            type="checkbox"
                            checked={p.is_published || false}
                            onChange={() => handleTogglePublished(p.id, p.is_published)}
                          />
                          <span className="admin-slider"></span>
                        </label>
                      </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn--secondary"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', minHeight: '32px' }}
                          title="Preview public page"
                        >
                          ↗ View
                        </a>
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="admin-btn admin-btn--secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: '32px' }}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(p)}
                          className="admin-btn admin-btn--secondary"
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.75rem',
                            color: 'var(--admin-danger)',
                            minHeight: '32px',
                          }}
                          title="Delete commission"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Confirm Project Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Architectural Commission"
        itemName={projectToDelete?.title}
        itemType="commission"
        message={
          projectToDelete
            ? `Are you sure you want to permanently delete "${projectToDelete.title}"? This commission will be removed from your portfolio archive and database. This action cannot be undone.`
            : ''
        }
        confirmText="Delete Commission"
        loading={deletingProject}
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />

      {/* Confirm Category Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        title="Delete Architectural Category"
        itemName={categoryToDelete?.name}
        itemType="category"
        message={
          categoryToDelete
            ? (() => {
                const count = projects.filter(
                  (p) => p.category?.toLowerCase() === categoryToDelete.name.toLowerCase()
                ).length;
                return count > 0
                  ? `Are you sure you want to delete the category "${categoryToDelete.name}"? ${count} commission(s) currently belong to this category.`
                  : `Are you sure you want to delete the category "${categoryToDelete.name}"?`;
              })()
            : ''
        }
        confirmText="Delete Category"
        loading={Boolean(deletingCatName)}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
