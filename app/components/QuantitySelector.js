'use client';

export default function QuantitySelector({ quantity, onChange, max = 99, size = 'md' }) {
  const sizes = {
    sm: { btn: '32px', font: '0.85rem', px: '0.75rem' },
    md: { btn: '40px', font: '1rem', px: '1rem' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center" style={{ borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', overflow: 'hidden', background: 'var(--surface)' }}>
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        style={{
          width: s.btn, height: s.btn, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'var(--surface-alt)', cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem', color: quantity <= 1 ? 'var(--text-muted)' : 'var(--text)',
          transition: 'background 0.2s', fontFamily: 'inherit',
        }}
      >
        −
      </button>
      <span style={{
        minWidth: s.btn, textAlign: 'center', fontWeight: 700, fontSize: s.font,
        padding: `0 ${s.px}`, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)',
      }}>
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        style={{
          width: s.btn, height: s.btn, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'var(--surface-alt)', cursor: quantity >= max ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem', color: quantity >= max ? 'var(--text-muted)' : 'var(--text)',
          transition: 'background 0.2s', fontFamily: 'inherit',
        }}
      >
        +
      </button>
    </div>
  );
}
