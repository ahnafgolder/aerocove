'use client';
import { useState } from 'react';

export default function ImageGallery({ images = [], productName = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="product-img-box" style={{ aspectRatio: '1/1' }}>
        <div className="w-full h-full flex items-center justify-center text-secondary">No Image</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="product-img-box" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-xl)' }}>
        <img
          src={images[activeIndex]}
          alt={productName}
          style={{ transition: 'opacity 0.4s ease' }}
          key={activeIndex}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: '72px', height: '72px', flexShrink: 0, borderRadius: 'var(--radius)',
                overflow: 'hidden', border: i === activeIndex ? '2.5px solid var(--primary)' : '2px solid var(--border-light)',
                padding: 0, cursor: 'pointer', background: 'var(--surface-alt)',
                transition: 'border-color 0.2s, transform 0.2s',
                transform: i === activeIndex ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img src={img} alt={`${productName} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
