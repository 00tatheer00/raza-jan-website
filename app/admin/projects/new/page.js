'use client';

import Link from 'next/link';
import ProjectForm from '@/app/admin/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <div className="admin-topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link href="/admin/projects" style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
              ← Commissions
            </Link>
            <span style={{ color: 'var(--admin-border)' }}>/</span>
            <span style={{ color: 'var(--admin-gold)', fontSize: '0.85rem' }}>New Entry</span>
          </div>
          <h1 className="admin-topbar__title">Create Architectural Commission</h1>
          <p className="admin-topbar__desc">
            Add a new luxury residential, atelier, or turnkey project to your portfolio database.
          </p>
        </div>
      </div>

      <ProjectForm isEdit={false} />
    </div>
  );
}
