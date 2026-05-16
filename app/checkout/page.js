'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../components/CartProvider';
import { formatPrice, calculateShipping } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, isLoaded, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '', phone: '', email: '', address: '', city: '', area: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && cartItems.length === 0) router.push('/cart');
  }, [isLoaded, cartItems, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shipping = calculateShipping(formData.city);
  const total = cartTotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            phoneModelId: item.phoneModelId || null,
            phoneModelName: item.phoneModelName || null,
          }))
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');
      clearCart();
      router.push(`/order-confirmation/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || cartItems.length === 0) return <div className="py-20 text-center text-secondary">Loading...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Step Indicator */}
      <div className="checkout-steps animate-fade-in">
        <div className="checkout-step active">
          <span className="step-num">1</span>
          <span className="step-label">Delivery</span>
        </div>
        <div className="checkout-step"><span className="step-line" /></div>
        <div className="checkout-step active">
          <span className="step-num">2</span>
          <span className="step-label">Payment</span>
        </div>
        <div className="checkout-step"><span className="step-line" /></div>
        <div className="checkout-step">
          <span className="step-num">3</span>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <h1 className="font-bold mb-8 animate-fade-in" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5" style={{ gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 animate-fade-in" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
            {error && (
              <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                  <input required name="customerName" value={formData.customerName} onChange={handleChange} className="input" placeholder="e.g. Hasan Mahmud" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="e.g. 01712345678" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="For order updates" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Detailed Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} className="input" rows="3" placeholder="House/Flat No, Road No, Area" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>City/District *</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="input" placeholder="e.g. Dhaka" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Area/Thana (Optional)</label>
                  <input name="area" value={formData.area} onChange={handleChange} className="input" placeholder="e.g. Dhanmondi" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Order Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="input" rows="2" placeholder="Any special instructions" />
              </div>

              <div className="mt-4 border-t pt-6">
                <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                <div className="p-4 border rounded-lg flex items-center gap-3" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)', borderRadius: 'var(--radius)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '5px solid var(--primary)', flexShrink: 0 }} />
                  <div>
                    <span className="font-medium block">Cash on Delivery</span>
                    <span className="text-sm text-secondary">Pay with cash upon delivery.</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg mt-4"
                style={{ borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(79,70,229,0.25)', position: 'relative', overflow: 'hidden' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeLinecap="round" />
                    </svg>
                    Processing...
                  </span>
                ) : 'Place Order Now'}
              </button>
              <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="glass-panel sticky top-24 animate-fade-in" style={{ animationDelay: '0.15s', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            {/* Collapsible header on mobile */}
            <button
              onClick={() => setSummaryOpen(!summaryOpen)}
              className="w-full p-5 flex justify-between items-center font-bold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1.1rem', color: 'var(--text)' }}
            >
              <span>Order Summary ({cartItems.length})</span>
              <span className="lg:hidden" style={{ fontSize: '1.2rem', transition: 'transform 0.3s', transform: summaryOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
            </button>

            <div style={{ display: 'block' }}>
              <style jsx>{`
                @media (max-width: 1023px) {
                  div[style*="display: block"] { display: ${summaryOpen ? 'block' : 'none'} !important; }
                }
              `}</style>
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <div className="flex flex-col gap-3 mb-5">
                  {cartItems.map(item => (
                    <div key={item.cartKey} className="flex gap-3 items-center">
                      <div className="relative flex-shrink-0" style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-alt)', border: '1px solid var(--border-light)' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        <span className="absolute flex items-center justify-center rounded-full text-white font-bold" style={{ top: '-6px', right: '-6px', width: '18px', height: '18px', background: 'var(--primary)', fontSize: '0.6rem' }}>
                          {item.quantity}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                        {item.phoneModelName && <p className="text-xs text-secondary">📱 {item.phoneModelName}</p>}
                      </div>
                      <div className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 pb-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-secondary">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-secondary">Shipping</span><span>{formatPrice(shipping)}</span></div>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-xl" style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
