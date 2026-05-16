'use client';
import Link from 'next/link';
import { useCart } from '../components/CartProvider';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '../components/QuantitySelector';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoaded } = useCart();

  if (!isLoaded) return <div className="py-20 text-center text-secondary">Loading...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="py-20 container text-center animate-fade-in">
        <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
        <h1 className="font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)' }}>Your Cart is Empty</h1>
        <p className="text-secondary mb-8" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/shop" className="btn btn-primary" style={{ padding: '0.85rem 2rem', boxShadow: '0 4px 20px rgba(79,70,229,0.25)' }}>
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 6rem' }}>
      <h1 className="font-bold mb-2 animate-fade-in" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Shopping Cart</h1>
      <p className="text-secondary mb-8 animate-fade-in text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
        <div style={{ gridColumn: 'span 1' }} className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item, i) => (
            <div key={item.cartKey} className="glass-panel animate-fade-in" style={{ padding: 'clamp(0.75rem, 2vw, 1.25rem)', animationDelay: `${i * 0.08}s`, borderRadius: 'var(--radius-lg)' }}>
              <div className="flex gap-4 items-center">
                <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 'clamp(64px, 15vw, 88px)', height: 'clamp(64px, 15vw, 88px)', background: 'var(--surface-alt)' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-secondary">No Image</div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="font-bold line-clamp-1" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '0.15rem' }}>{item.name}</h3>
                  {item.phoneModelName && (
                    <p className="text-xs text-secondary" style={{ marginBottom: '0.25rem' }}>📱 {item.phoneModelName}</p>
                  )}
                  <p className="font-bold" style={{ color: 'var(--primary)', fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginBottom: '0.5rem' }}>{formatPrice(item.price)}</p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <QuantitySelector quantity={item.quantity} onChange={(q) => updateQuantity(item.cartKey, q)} size="sm" />
                    <button onClick={() => removeFromCart(item.cartKey)} className="text-sm font-medium" style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0' }}>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="font-bold text-right" style={{ minWidth: '70px', fontSize: '0.95rem' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="glass-panel p-6 sticky top-24 animate-fade-in" style={{ animationDelay: '0.2s', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span className="text-secondary">Subtotal</span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between mb-6 pb-6 border-b">
              <span className="text-secondary">Shipping</span>
              <span className="text-sm text-secondary">Calculated at checkout</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>{formatPrice(cartTotal)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full py-4 text-lg" style={{ borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(79,70,229,0.25)' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
