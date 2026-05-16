'use client';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import useScrollReveal from './components/useScrollReveal';

export default function HomeClient({ featuredProducts, categories }) {
  useScrollReveal();

  return (
    <div>


      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #e0e7ff 30%, #f5f3ff 60%, #faf5ff 100%)', padding: 'clamp(4rem, 10vw, 7rem) 0 clamp(5rem, 12vw, 9rem)' }}>
        {/* Floating orbs */}
        <div className="absolute inset-0 z-0" style={{ overflow: 'hidden' }}>
          <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(79,70,229,0.07)', filter: 'blur(60px)' }} />
          <div className="animate-float" style={{ position: 'absolute', bottom: '10%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(168,85,247,0.07)', filter: 'blur(60px)', animationDelay: '1.5s' }} />
          <div className="animate-float" style={{ position: 'absolute', top: '50%', left: '60%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(79,70,229,0.05)', filter: 'blur(50px)', animationDelay: '0.8s' }} />
        </div>

        <div className="container relative z-10 text-center">
          <div className="animate-slide-up">
            <span className="badge badge-primary mb-6" style={{ fontSize: '0.78rem', padding: '0.35rem 1rem', borderRadius: '999px' }}>✨ New Collection 2026</span>
          </div>
          <h1 className="animate-slide-up" style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1, animationDelay: '0.1s' }}>
            Elevate Your <br />
            <span className="text-gradient">Everyday Carry</span>
          </h1>
          <p className="text-secondary mx-auto animate-slide-up" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.7, animationDelay: '0.2s' }}>
            Premium, protective, and perfectly designed phone cases. Delivered right to your doorstep anywhere in Bangladesh.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(79,70,229,0.3)', animation: 'pulseGlow 3s ease-in-out infinite' }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="flex justify-between items-end mb-10 flex-wrap gap-4 reveal">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-secondary">Our most popular styles this week.</p>
            </div>
            <Link href="/shop" className="text-primary font-medium text-sm" style={{ whiteSpace: 'nowrap' }}>
              View All Products →
            </Link>
          </div>

          {/* Mobile: horizontal scroll / Desktop: grid */}
          <div className="reveal" style={{ animationDelay: '0.1s' }}>
            {/* Desktop grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'none' }}>
              {featuredProducts.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} delay={i * 0.08} />
              ))}
            </div>
            {/* Mobile scroll */}
            <div className="scroll-x" style={{ display: 'flex' }}>
              {featuredProducts.map((product, i) => (
                <div key={product.id} style={{ width: '70vw', maxWidth: '280px' }}>
                  <ProductCard product={product} delay={i * 0.05} />
                </div>
              ))}
            </div>
            <style jsx>{`
              @media (min-width: 640px) {
                div[style*="display: none"] { display: grid !important; }
                .scroll-x[style*="display: flex"] { display: none !important; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 reveal" style={{ background: 'var(--surface-alt)' }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-3 text-center">Shop by Category</h2>
          <p className="text-secondary text-center mb-10">Find exactly what you&#39;re looking for.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.filter(cat => cat.slug !== 'all').map((category, i) => (
              <Link href={`/shop?category=${category.slug}`} key={category.id} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="category-card">
                  <h3 className="text-2xl font-bold" style={{ transition: 'color 0.2s', position: 'relative', zIndex: 1 }}>{category.name}</h3>
                  <p className="text-secondary text-sm mt-2" style={{ position: 'relative', zIndex: 1 }}>Browse collection →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 reveal">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: '700px', margin: '0 auto' }}>
          {[
            { icon: '🛡️', title: 'Premium Quality', desc: 'Guaranteed protection for your devices.', bg: 'var(--accent-light)', color: 'var(--accent)' },
            { icon: '💵', title: 'Cash on Delivery', desc: 'Pay safely when you receive your order.', bg: 'var(--success-light)', color: 'var(--success)' },
          ].map((item, i) => (
            <div key={i} className="trust-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="trust-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-secondary text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, delay = 0 }) {
  const images = JSON.parse(product.images || '[]');
  return (
    <Link href={`/shop/${product.slug}`} className="product-card" style={{ animationDelay: `${delay}s` }}>
      <div className="product-img-box mb-4">
        {images[0] && <img src={images[0]} alt={product.name} />}
        {product.comparePrice && (
          <div className="absolute top-4 left-4 badge badge-danger" style={{ borderRadius: '999px', padding: '0.2rem 0.6rem' }}>Sale</div>
        )}
      </div>
      <h3 className="font-bold text-lg mb-1 line-clamp-1" style={{ transition: 'color 0.2s' }}>{product.name}</h3>
      <div className="flex gap-2 items-center">
        <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>{formatPrice(product.price)}</span>
        {product.comparePrice && (
          <span className="text-secondary line-through text-sm">{formatPrice(product.comparePrice)}</span>
        )}
      </div>
    </Link>
  );
}
