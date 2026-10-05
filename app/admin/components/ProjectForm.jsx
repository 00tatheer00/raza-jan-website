'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ConfirmModal from './ConfirmModal';

export default function ProjectForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState(initialData?.category || 'Architecture');
  const [discipline, setDiscipline] = useState(initialData?.discipline || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [scale, setScale] = useState(initialData?.scale || '');
  const [scope, setScope] = useState(initialData?.scope || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [galleryUrls, setGalleryUrls] = useState(initialData?.gallery_urls || []);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order ?? 0);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dynamic Categories state
  const [availableCategories, setAvailableCategories] = useState([
    { id: 'Architecture', name: 'Architecture', label: 'Architecture' },
    { id: 'Interior', name: 'Interior', label: 'Interior' },
    { id: 'Turnkey', name: 'Turnkey', label: 'Turnkey' },
  ]);
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [addingQuickCat, setAddingQuickCat] = useState(false);
  const [deletingCatName, setDeletingCatName] = useState(null);
  const [catToDelete, setCatToDelete] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data?.categories && data.categories.length > 0) {
          setAvailableCategories(data.categories);
        }
      } catch (e) {
        console.warn('Failed to load categories:', e);
      }
    }
    loadCategories();
  }, []);

  const handleQuickAddCategory = async (e) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;

    setAddingQuickCat(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: quickCatName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add category');

      if (data.categories) {
        setAvailableCategories(data.categories);
      }
      setCategory(quickCatName.trim());
      setQuickCatName('');
      setShowQuickAddCat(false);
    } catch (err) {
      setErrorMsg(err.message || 'Error adding category');
    } finally {
      setAddingQuickCat(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!catToDelete) return;

    setDeletingCatName(catToDelete);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/categories?name=${encodeURIComponent(catToDelete)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      if (data.categories) {
        setAvailableCategories(data.categories);
        if (category === catToDelete) {
          setCategory(data.categories[0]?.name || 'Architecture');
        }
      } else {
        setAvailableCategories((prev) => prev.filter((c) => c.name !== catToDelete));
        if (category === catToDelete) setCategory('Architecture');
      }
      setCatToDelete(null);
    } catch (err) {
      setErrorMsg(err.message || 'Error deleting category');
    } finally {
      setDeletingCatName(null);
    }
  };


  // Auto-generate slug from title if not manually customized
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugManuallyEdited && !isEdit) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Upload file helper via /api/upload
  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload image to Cloudinary');
    }

    return data.url;
  };

  // Cover image upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg('');

    try {
      const uploadedUrl = await uploadImageFile(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Error uploading cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery images multi-upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingGallery(true);
    setErrorMsg('');

    try {
      const uploadPromises = files.map((file) => uploadImageFile(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setGalleryUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setErrorMsg(err.message || 'Error uploading gallery images');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Save project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a project title');
      return;
    }

    if (!slug.trim()) {
      setErrorMsg('Please specify a unique URL slug');
      return;
    }

    if (!imageUrl) {
      setErrorMsg('Please upload a cover image for this project');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        discipline: discipline.trim() || `${category} Commission`,
        location: location.trim() || 'Pakistan',
        scale: scale.trim() || 'Custom Scale',
        scope: scope.trim() || 'Architectural Commission',
        description: description.trim(),
        image_url: imageUrl,
        gallery_urls: galleryUrls,
        featured,
        is_published: isPublished,
        display_order: parseInt(displayOrder, 10) || 0,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', initialData.id);

        if (error) throw error;
        setSuccessMsg('Project updated successfully!');
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setSuccessMsg('Project created successfully!');
      }

      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error('Save project error:', err);
      if (err.message && err.message.includes('projects_category_check')) {
        setErrorMsg(
          'Database Constraint: Your Supabase database is restricting categories to ("Architecture", "Interior", "Turnkey"). Run "ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;" in Supabase SQL Editor to allow new categories.'
        );
      } else {
        setErrorMsg(err.message || 'Failed to save project. Ensure slug is unique.');
      }
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '1000px' }}>
      {/* Alert Banners */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            padding: '1.25rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: '#f87171' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMsg.includes('ALTER TABLE') ? 'Database Check Constraint Detected' : 'Error Saving Project'}</span>
          </div>
          <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#e5e7eb' }}>
            {errorMsg}
          </div>
          {errorMsg.includes('ALTER TABLE') && (
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <code style={{ background: '#111317', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', color: '#cda26f', border: '1px solid rgba(205, 162, 111, 0.3)' }}>
                ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText('ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;')}
                className="admin-btn admin-btn--secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                Copy SQL
              </button>
            </div>
          )}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          style={{
            padding: '1rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            color: '#34d399',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Core Architectural Details */}
        <div>
          <div className="admin-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
              Project Specification
            </h3>

            {/* Title */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="project-title">
                Project Title <span className="required">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                required
                className="admin-input"
                placeholder="e.g. Modern Escape Villa"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="project-slug">
                URL Slug <span className="required">*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>/projects/</span>
                <input
                  id="project-slug"
                  type="text"
                  required
                  className="admin-input"
                  placeholder="modern-escape-villa"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                />
              </div>
            </div>

            {/* Category & Discipline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label className="admin-label" htmlFor="project-category" style={{ marginBottom: 0 }}>
                    Category <span className="required">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQuickAddCat(!showQuickAddCat)}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--admin-gold)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {showQuickAddCat ? '✕ Close' : '+ Manage Categories'}
                  </button>
                </div>

                {showQuickAddCat && (
                  <div
                    style={{
                      padding: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '8px',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        placeholder="Add new category..."
                        className="admin-input"
                        value={quickCatName}
                        onChange={(e) => setQuickCatName(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        disabled={addingQuickCat || !quickCatName.trim()}
                        onClick={handleQuickAddCategory}
                        className="admin-btn admin-btn--primary"
                        style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', minHeight: '36px' }}
                      >
                        {addingQuickCat ? '...' : '+ Add'}
                      </button>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Existing Categories (click ✕ to delete):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {availableCategories.map((c) => (
                        <span
                          key={c.id || c.name}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            fontSize: '0.75rem',
                            color: '#e5e5e5',
                            border: '1px solid var(--admin-border)',
                          }}
                        >
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => setCatToDelete(c.name)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#f87171',
                              cursor: 'pointer',
                              padding: '0 2px',
                              fontSize: '0.85rem',
                              lineHeight: 1,
                            }}
                            title={`Delete category ${c.name}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <select
                  id="project-category"
                  className="admin-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {availableCategories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="admin-form-group">
                <label className="admin-label" htmlFor="project-discipline">
                  Discipline Label
                </label>
                <input
                  id="project-discipline"
                  type="text"
                  className="admin-input"
                  placeholder="Architecture & Landscape"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                />
              </div>
            </div>

            {/* Location & Scale */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="project-location">
                  Location
                </label>
                <input
                  id="project-location"
                  type="text"
                  className="admin-input"
                  placeholder="Islamabad · Pakistan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="project-scale">
                  Scale / Area
                </label>
                <input
                  id="project-scale"
                  type="text"
                  className="admin-input"
                  placeholder="5,400 sq.ft"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                />
              </div>
            </div>

            {/* Scope */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="project-scope">
                Commission Scope
              </label>
              <input
                id="project-scope"
                type="text"
                className="admin-input"
                placeholder="Private Luxury Residence"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label" htmlFor="project-desc">
                Architectural Narrative & Design Concept
              </label>
              <textarea
                id="project-desc"
                className="admin-textarea"
                rows="5"
                placeholder="Describe the spatial flow, materiality, brutalist or contemporary nuances, and client aspirations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Imagery & Publishing Controls */}
        <div>
          {/* Cover Image Upload (Cloudinary) */}
          <div className="admin-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
              Primary Cover Image <span style={{ color: 'var(--admin-gold)' }}>*</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginBottom: '1.25rem' }}>
              High-resolution photo displayed on the homepage showcase card and project case study hero.
            </p>

            {imageUrl ? (
              <div className="admin-preview-box">
                <img src={imageUrl} alt="Project Cover Preview" />
                <button
                  type="button"
                  className="admin-preview-box__remove"
                  onClick={() => setImageUrl('')}
                  title="Remove image"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="admin-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
                {uploadingCover ? (
                  <div style={{ color: 'var(--admin-gold)', padding: '1rem 0' }}>
                    <span>Uploading directly to Cloudinary...</span>
                  </div>
                ) : (
                  <div>
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--admin-gold)"
                      strokeWidth="1.5"
                      style={{ margin: '0 auto 0.75rem' }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>
                      Click to browse or drop cover image
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                      PNG, JPG, WEBP up to 10MB
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Gallery Photos */}
          <div className="admin-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#fff' }}>
              Project Gallery (Optional)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginBottom: '1.25rem' }}>
              Additional photos showcasing interior angles, construction details, and lighting.
            </p>

            {galleryUrls.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                {galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      height: '70px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      background: '#000',
                    }}
                  >
                    <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="admin-upload-zone" style={{ padding: '1.5rem 1rem' }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
              />
              <div style={{ fontSize: '0.85rem', color: uploadingGallery ? 'var(--admin-gold)' : 'var(--admin-text-secondary)' }}>
                {uploadingGallery ? 'Uploading gallery photos...' : '+ Add gallery photos'}
              </div>
            </div>
          </div>

          {/* Visibility & Showcase Controls */}
          <div className="admin-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#fff' }}>
              Showcase & Publishing
            </h3>

            {/* Showcase Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--admin-border)',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                  ★ Showcase on Home Page
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                  Highlight this project directly in the homepage interactive showcase.
                </div>
              </div>
              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className="admin-slider"></span>
              </label>
            </div>

            {/* Published Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--admin-border)',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                  Live Status (Published)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                  Visible to public visitors across the website.
                </div>
              </div>
              <label className="admin-switch">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span className="admin-slider"></span>
              </label>
            </div>

            {/* Display Order */}
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label" htmlFor="display-order">
                Display Order Priority
              </label>
              <input
                id="display-order"
                type="number"
                className="admin-input"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
                style={{ width: '120px' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '0.25rem' }}>
                Higher numbers appear first in the showcase.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link href="/admin/projects" className="admin-btn admin-btn--secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingCover || uploadingGallery}
              className="admin-btn admin-btn--primary"
              style={{ minWidth: '160px' }}
            >
              {saving ? 'Saving Commission...' : isEdit ? 'Update Project' : 'Publish Project'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Deletion Modal */}
      <ConfirmModal
        isOpen={Boolean(catToDelete)}
        title="Delete Architectural Category"
        itemName={catToDelete}
        itemType="the category"
        message={
          catToDelete
            ? `Are you sure you want to permanently delete the category "${catToDelete}"? It will no longer be available in category selection filters.`
            : ''
        }
        confirmText="Delete Category"
        loading={Boolean(deletingCatName)}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setCatToDelete(null)}
      />
    </form>
  );
}
