'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/app/components/ImageGallery';
import AddToCartButton from '@/app/components/AddToCartButton';
import QuantitySelector from '@/app/components/QuantitySelector';

export default function ProductDetailClient({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length === 1 ? product.variants[0] : null
  );
  const images = JSON.parse(product.images || '[]');
  const mainImage = images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const currentStock = selectedVariant ? selectedVariant.stock : totalStock;
  const firstCategory = product.categories?.[0];

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Breadcrumb */}
      <div className="container" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex items-center gap-2 text-sm text-secondary animate-fade-in">
          <Link href="/" style={{ transition: 'color 0.2s' }}>Home</Link>
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <Link href="/shop" style={{ transition: 'color 0.2s' }}>Shop</Link>
          {firstCategory && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>›</span>
              <Link href={`/shop?category=${firstCategory.slug}`} style={{ transition: 'color 0.2s' }}>{firstCategory.name}</Link>
            </>
          )}
          <span style={{ color: 'var(--text-muted)' }}>›</span>
          <span className="line-clamp-1" style={{ color: 'var(--text)', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
          {/* Image Gallery */}
          <div className="animate-fade-in">
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="mb-6">
              {product.categories.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {product.categories.filter(c => c.slug !== 'all').map(cat => (
                    <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="text-sm font-medium inline-block" style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.2rem 0.7rem', borderRadius: '999px' }}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              <h1 className="font-bold mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.15 }}>{product.name}</h1>
              <div className="flex gap-4 items-center flex-wrap">
                <span className="font-bold text-gradient" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-secondary line-through" style={{ fontSize: '1.1rem' }}>{formatPrice(product.comparePrice)}</span>
                )}
                {product.comparePrice && (
                  <span className="badge badge-danger" style={{ borderRadius: '999px', padding: '0.2rem 0.6rem' }}>
                    Save {Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="mb-6 text-secondary whitespace-pre-wrap" style={{ lineHeight: '1.8', fontSize: '0.92rem' }}>
                {product.description}
              </div>
            )}

            {/* Phone Model Selector */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">Select Phone Model</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(variant => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const outOfStock = variant.stock <= 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => { setSelectedVariant(variant); setQuantity(1); }}
                        disabled={outOfStock}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--primary-light)' : outOfStock ? 'var(--surface-alt)' : 'var(--surface)',
                          color: outOfStock ? 'var(--text-muted)' : isSelected ? 'var(--primary)' : 'var(--text)',
                          cursor: outOfStock ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          textDecoration: outOfStock ? 'line-through' : 'none',
                          opacity: outOfStock ? 0.6 : 1,
                        }}
                      >
                        {variant.phoneModel.name}
                        {outOfStock && <span className="text-xs ml-1">(Out)</span>}
                      </button>
                    );
                  })}
                </div>
                {!selectedVariant && product.variants.length > 1 && (
                  <p className="text-xs mt-2" style={{ color: 'var(--danger)' }}>Please select a phone model</p>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentStock > 0 ? 'var(--success)' : 'var(--danger)', boxShadow: currentStock > 0 ? '0 0 8px rgba(5,150,105,0.4)' : '0 0 8px rgba(220,38,38,0.4)' }} />
                <span className="font-medium text-sm">
                  {selectedVariant
                    ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock')
                    : (totalStock > 0 ? `${totalStock} total in stock` : 'Out of stock')
                  }
                </span>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mb-8">
              {currentStock > 0 && selectedVariant && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-secondary">Quantity:</span>
                  <QuantitySelector quantity={quantity} onChange={setQuantity} max={selectedVariant.stock} />
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex-1">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: mainImage,
                    }}
                    quantity={quantity}
                    phoneModel={selectedVariant ? { id: selectedVariant.phoneModelId, name: selectedVariant.phoneModel.name } : null}
                    requiresModel={product.variants.length > 0}
                    stock={currentStock}
                  />
                </div>
                <div className="flex-1">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: mainImage,
                    }}
                    quantity={quantity}
                    phoneModel={selectedVariant ? { id: selectedVariant.phoneModelId, name: selectedVariant.phoneModel.name } : null}
                    requiresModel={product.variants.length > 0}
                    stock={currentStock}
                    isBuyNow={true}
                  />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="glass-panel p-5 flex flex-col gap-4" style={{ borderRadius: 'var(--radius-lg)' }}>
              {[
                { icon: '💵', title: 'Cash on Delivery', desc: 'Pay when you receive' },
                { icon: '🔄', title: 'Easy Returns', desc: '3-day return policy' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4" style={{ borderBottom: i < 1 ? '1px solid var(--border-light)' : 'none', paddingBottom: i < 1 ? '1rem' : 0 }}>
                  <span style={{ fontSize: '1.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', borderRadius: '12px' }}>{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-sm text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Cart Bar */}
      <div className="mobile-sticky-cart">
        <div style={{ flex: 1 }}>
          <div className="font-bold" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{formatPrice(product.price)}</div>
          <div className="text-xs text-secondary">
            {selectedVariant ? selectedVariant.phoneModel.name : 'Select model'}
          </div>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <div style={{ width: '48%' }}>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: mainImage,
              }}
              quantity={quantity}
              phoneModel={selectedVariant ? { id: selectedVariant.phoneModelId, name: selectedVariant.phoneModel.name } : null}
              requiresModel={product.variants.length > 0}
              stock={currentStock}
            />
          </div>
          <div style={{ width: '48%' }}>
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: mainImage,
              }}
              quantity={quantity}
              phoneModel={selectedVariant ? { id: selectedVariant.phoneModelId, name: selectedVariant.phoneModel.name } : null}
              requiresModel={product.variants.length > 0}
              stock={currentStock}
              isBuyNow={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
