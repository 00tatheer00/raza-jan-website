export default function ProjectDetailLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#111111',
        paddingTop: '110px',
        paddingBottom: '100px',
        fontFamily: 'var(--font-body), sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
        }}
      >
        {/* Back Link Skeleton */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton-shimmer" style={{ width: '160px', height: '20px', borderRadius: '4px' }} />
        </div>

        {/* Eyebrow & Badges Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="skeleton-shimmer" style={{ width: '110px', height: '26px', borderRadius: '13px' }} />
          <div className="skeleton-shimmer" style={{ width: '80px', height: '26px', borderRadius: '13px' }} />
        </div>

        {/* Main Title Skeleton */}
        <div className="skeleton-shimmer" style={{ width: 'clamp(280px, 75%, 680px)', height: '54px', marginBottom: '1.5rem', borderRadius: '8px' }} />

        {/* Specs Bar Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            padding: '1.75rem 2rem',
            background: '#fafafa',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
            marginBottom: '3rem',
          }}
        >
          {[1, 2, 3, 4].map((col) => (
            <div key={col}>
              <div className="skeleton-shimmer" style={{ width: '70px', height: '12px', marginBottom: '0.6rem', borderRadius: '4px' }} />
              <div className="skeleton-shimmer" style={{ width: '130px', height: '20px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>

        {/* Large Hero Photography Skeleton */}
        <div
          className="skeleton-shimmer"
          style={{
            width: '100%',
            aspectRatio: '16/9',
            maxHeight: '620px',
            borderRadius: '16px',
            marginBottom: '3.5rem',
          }}
        />

        {/* Editorial Narrative Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
          }}
        >
          <div>
            <div className="skeleton-shimmer" style={{ width: '140px', height: '14px', marginBottom: '1rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '220px', height: '32px', marginBottom: '1.5rem', borderRadius: '6px' }} />
            <div className="skeleton-shimmer" style={{ width: '100%', height: '16px', marginBottom: '0.75rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '95%', height: '16px', marginBottom: '0.75rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '90%', height: '16px', marginBottom: '0.75rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ width: '70%', height: '16px', borderRadius: '4px' }} />
          </div>

          <div
            style={{
              padding: '2.5rem',
              background: '#141416',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div className="skeleton-shimmer-dark" style={{ width: '120px', height: '14px', marginBottom: '1.25rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer-dark" style={{ width: '100%', height: '24px', marginBottom: '0.75rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer-dark" style={{ width: '85%', height: '24px', marginBottom: '2rem', borderRadius: '4px' }} />
            <div className="skeleton-shimmer-dark" style={{ width: '160px', height: '44px', borderRadius: '22px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
