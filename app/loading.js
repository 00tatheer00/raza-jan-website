export default function RootLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0d0e',
        color: '#f5f5f7',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-body), sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <div
          className="skeleton-shimmer-dark"
          style={{ width: '180px', height: '28px', margin: '0 auto 2.5rem auto', borderRadius: '6px' }}
        />
        <div
          className="skeleton-shimmer-dark"
          style={{ width: '70%', height: '48px', margin: '0 auto 1.5rem auto', borderRadius: '8px' }}
        />
        <div
          className="skeleton-shimmer-dark"
          style={{ width: '50%', height: '20px', margin: '0 auto 3rem auto', borderRadius: '6px' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="skeleton-shimmer-dark" style={{ height: '180px', borderRadius: '12px' }} />
          <div className="skeleton-shimmer-dark" style={{ height: '180px', borderRadius: '12px' }} />
          <div className="skeleton-shimmer-dark" style={{ height: '180px', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
}
