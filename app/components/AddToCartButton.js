'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product, quantity = 1, phoneModel = null, requiresModel = false, stock = 0 }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (requiresModel && !phoneModel) return;
    addToCart(product, quantity, phoneModel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const isDisabled = stock <= 0 || (requiresModel && !phoneModel);
  const label = stock <= 0
    ? 'Out of Stock'
    : (requiresModel && !phoneModel)
      ? 'Select Model'
      : null;

  return (
    <button
      onClick={handleAdd}
      className="btn flex-grow py-4 text-lg"
      disabled={isDisabled}
      style={{
        background: isDisabled ? 'var(--surface-alt)' : added ? 'var(--success)' : 'var(--primary)',
        color: isDisabled ? 'var(--text-muted)' : '#fff',
        fontSize: '1rem',
        fontWeight: 700,
        borderRadius: 'var(--radius)',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        transform: added ? 'scale(0.97)' : 'scale(1)',
        boxShadow: added ? '0 4px 20px rgba(5,150,105,0.3)' : isDisabled ? 'none' : '0 4px 20px rgba(79,70,229,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {label ? label : (
        added ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-scale-in">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Added!
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Add to Cart
          </span>
        )
      )}
    </button>
  );
}
