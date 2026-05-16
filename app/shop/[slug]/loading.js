export default function Loading() {
  return (
    <div style={{ paddingBottom: '5rem', width: '100%' }} className="animate-fade-in">
      {/* Skeleton Breadcrumb */}
      <div className="container" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ width: '150px', height: '20px', background: 'var(--surface-alt)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
          {/* Skeleton Image Gallery */}
          <div style={{ width: '100%', aspectRatio: '4/5', background: 'var(--surface-alt)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite ease-in-out' }} />

          {/* Skeleton Product Info */}
          <div>
            <div style={{ width: '80%', height: '40px', background: 'var(--surface-alt)', borderRadius: '8px', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '30%', height: '30px', background: 'var(--surface-alt)', borderRadius: '8px', marginBottom: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
            
            <div style={{ width: '100%', height: '20px', background: 'var(--surface-alt)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '100%', height: '20px', background: 'var(--surface-alt)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '60%', height: '20px', background: 'var(--surface-alt)', borderRadius: '4px', marginBottom: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }} />

            <div style={{ width: '40%', height: '20px', background: 'var(--surface-alt)', borderRadius: '4px', marginBottom: '1rem', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: '80px', height: '36px', background: 'var(--surface-alt)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s infinite ease-in-out' }} />
              ))}
            </div>

            <div style={{ width: '100%', height: '50px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
