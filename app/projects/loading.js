export default function ProjectsLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#111111',
        paddingTop: '110px',
        paddingBottom: '80px',
        fontFamily: 'var(--font-body), sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
        }}
      >
        {/* Back Link Skeleton */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton-shimmer" style={{ width: '140px', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* Header Skeleton */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="skeleton-shimmer" style={{ width: '160px', height: '14px', marginBottom: '1rem', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: 'clamp(280px, 60%, 550px)', height: '48px', marginBottom: '1.25rem', borderRadius: '8px' }} />
          <div className="skeleton-shimmer" style={{ width: 'clamp(220px, 45%, 400px)', height: '20px', borderRadius: '6px' }} />
        </div>

        {/* Filter Bar Skeleton */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            background: '#f9f9f9',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            marginBottom: '3rem',
          }}
        >
          {/* Category Pills Skeleton */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div className="skeleton-shimmer" style={{ width: '60px', height: '36px', borderRadius: '20px' }} />
            <div className="skeleton-shimmer" style={{ width: '130px', height: '36px', borderRadius: '20px' }} />
            <div className="skeleton-shimmer" style={{ width: '120px', height: '36px', borderRadius: '20px' }} />
            <div className="skeleton-shimmer" style={{ width: '110px', height: '36px', borderRadius: '20px' }} />
          </div>

          {/* Search Input Skeleton */}
          <div className="skeleton-shimmer" style={{ width: '280px', height: '42px', borderRadius: '8px' }} />
        </div>

        {/* 6 Project Cards Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* Card Image Skeleton */}
              <div
                className="skeleton-shimmer"
                style={{
                  width: '100%',
                  aspectRatio: '16/11',
                  borderRadius: '0',
                }}
              />

              {/* Card Content Skeleton */}
              <div style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div className="skeleton-shimmer" style={{ width: '90px', height: '22px', borderRadius: '12px' }} />
                  <div className="skeleton-shimmer" style={{ width: '50px', height: '16px', borderRadius: '4px' }} />
                </div>

                <div className="skeleton-shimmer" style={{ width: '85%', height: '28px', marginBottom: '0.75rem', borderRadius: '6px' }} />
                <div className="skeleton-shimmer" style={{ width: '60%', height: '16px', marginBottom: '1.5rem', borderRadius: '4px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <div className="skeleton-shimmer" style={{ width: '100px', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton-shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
