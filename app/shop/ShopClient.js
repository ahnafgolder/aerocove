'use client';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import useScrollReveal from '../components/useScrollReveal';

export default function ShopClient({ products, categories, categorySlug }) {
  useScrollReveal();

  const activeCategory = categories.find(c => c.slug === categorySlug);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #e0e7ff 40%, #f5f3ff 100%)', padding: 'clamp(2rem, 5vw, 3.5rem) 0' }}>
        <div className="container">
          <h1 className="font-bold animate-fade-in" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
            {activeCategory && activeCategory.slug !== 'all' ? activeCategory.name : 'All Products'}
          </h1>
          <p className="text-secondary animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1.5rem' }}>
        {/* Category Filter Bar — horizontal scroll on mobile */}
        <div className="glass-panel p-4 mb-8 animate-fade-in" style={{ animationDelay: '0.15s', boxShadow: 'var(--shadow)' }}>
          <div className="scroll-x" style={{ gap: '0.5rem' }}>
            {/* All — links to /shop with no filter */}
            <Link
              href="/shop"
              style={{
                padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600,
                background: !categorySlug ? 'var(--primary)' : 'var(--surface-alt)',
                color: !categorySlug ? '#fff' : 'var(--text-secondary)',
                whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                display: 'inline-block',
              }}
            >
              All
            </Link>
            {/* Men & Women — exclude the 'all' DB slug since that's covered above */}
            {categories.filter(cat => cat.slug !== 'all').map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 600,
                  background: categorySlug === cat.slug ? 'var(--primary)' : 'var(--surface-alt)',
                  color: categorySlug === cat.slug ? '#fff' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
                  display: 'inline-block',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 glass-panel animate-fade-in">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-secondary mb-6">Try selecting a different category.</p>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>View All Products</Link>
          </div>
        ) : (
          <div className="grid gap-6 reveal" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <style jsx>{`
              @media (min-width: 768px) {
                div[style*="repeat(2, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
              }
              @media (min-width: 1024px) {
                div[style*="repeat(2, 1fr)"] { grid-template-columns: repeat(4, 1fr) !important; }
              }
            `}</style>
            {products.map((product, i) => {
              const images = JSON.parse(product.images || '[]');
              return (
                <Link
                  href={`/shop/${product.slug}`}
                  key={product.id}
                  className="product-card"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 1 }}
                >
                  <div className="product-img-box mb-3">
                    {images[0] ? (
                      <img src={images[0]} alt={product.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary text-sm" style={{ background: 'var(--surface-alt)' }}>No Image</div>
                    )}
                    {product.comparePrice && (
                      <div className="absolute top-3 left-3 badge badge-danger" style={{ borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>Sale</div>
                    )}
                  </div>
                  <h3 className="font-bold mb-1 line-clamp-1" style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', transition: 'color 0.2s' }}>
                    {product.name}
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-bold" style={{ color: 'var(--primary)', fontSize: 'clamp(0.85rem, 2vw, 1.05rem)' }}>
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-secondary line-through" style={{ fontSize: '0.75rem' }}>
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
