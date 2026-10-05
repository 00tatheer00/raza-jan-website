export default function AdminLoading() {
  return (
    <div style={{ width: '100%', maxWidth: '1200px' }}>
      {/* Topbar Skeleton */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="admin-skeleton admin-skeleton-title" />
        <div className="admin-skeleton admin-skeleton-desc" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="admin-stats-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="admin-skeleton admin-skeleton-card" />
        <div className="admin-skeleton admin-skeleton-card" />
        <div className="admin-skeleton admin-skeleton-card" />
        <div className="admin-skeleton admin-skeleton-card" />
      </div>

      {/* Main Table / Form Skeleton Card */}
      <div
        className="admin-card"
        style={{
          padding: '2rem',
          background: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div className="admin-skeleton" style={{ height: '24px', width: '200px' }} />
          <div className="admin-skeleton" style={{ height: '36px', width: '120px', borderRadius: '8px' }} />
        </div>

        {/* Table Rows Skeleton */}
        <div className="admin-skeleton admin-skeleton-row" />
        <div className="admin-skeleton admin-skeleton-row" />
        <div className="admin-skeleton admin-skeleton-row" />
        <div className="admin-skeleton admin-skeleton-row" />
        <div className="admin-skeleton admin-skeleton-row" />
      </div>
    </div>
  );
}
