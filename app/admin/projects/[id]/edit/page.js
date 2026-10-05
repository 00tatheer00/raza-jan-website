'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ProjectForm from '@/app/admin/components/ProjectForm';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Failed to load project for editing:', err);
        setErrorMsg(err.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id]);

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link href="/admin/projects" style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
              ← Commissions
            </Link>
            <span style={{ color: 'var(--admin-border)' }}>/</span>
            <span style={{ color: 'var(--admin-gold)', fontSize: '0.85rem' }}>
              {project ? project.title : 'Edit Entry'}
            </span>
          </div>
          <h1 className="admin-topbar__title">Edit Commission</h1>
          <p className="admin-topbar__desc">
            Modify architectural specs, update imagery, or adjust home showcase priority.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
          Loading commission details...
        </div>
      ) : errorMsg ? (
        <div
          role="alert"
          style={{
            padding: '1.25rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
          }}
        >
          {errorMsg}
        </div>
      ) : (
        <ProjectForm initialData={project} isEdit={true} />
      )}
    </div>
  );
}
