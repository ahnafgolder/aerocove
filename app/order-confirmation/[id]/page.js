import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export default async function OrderConfirmation({ params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="py-16 container flex justify-center" style={{ padding: '3rem 1.25rem' }}>
      <div className="glass-panel w-full animate-fade-in" style={{ maxWidth: '640px', padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
        {/* Animated Checkmark */}
        <div className="relative mx-auto mb-6 animate-scale-in" style={{ width: '80px', height: '80px' }}>
          <div className="success-ring w-full h-full rounded-full flex items-center justify-center" style={{ background: 'var(--success-light)', color: 'var(--success)', fontSize: '2.5rem', position: 'relative' }}>
            ✓
          </div>
        </div>

        <h1 className="font-bold mb-3 animate-fade-in" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', animationDelay: '0.2s' }}>Order Confirmed!</h1>
        <p className="text-secondary mb-8 animate-fade-in" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', animationDelay: '0.3s' }}>
          Thank you for your purchase, {order.customerName}.
        </p>

        {/* Order Details Card */}
        <div className="rounded-xl text-left mb-8 animate-fade-in" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border-light)', padding: 'clamp(1rem, 3vw, 1.5rem)', animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-5 pb-5" style={{ borderBottom: '1px dashed var(--border)' }}>
            <div>
              <p className="text-xs text-secondary mb-1">Order Number</p>
              <p className="font-bold text-lg" style={{ color: 'var(--primary)' }}>{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary mb-1">Total Amount</p>
              <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h4 className="font-medium text-secondary text-xs mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</h4>
              <p className="text-sm">{order.address}<br />{order.area ? `${order.area}, ` : ''}{order.city}</p>
              <p className="text-sm mt-2">{order.phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-secondary text-xs mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</h4>
              <p className="text-sm">Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* What's Next Timeline */}
        <div className="rounded-xl text-left mb-8 animate-fade-in" style={{ background: 'var(--primary-light)', border: '1px solid rgba(79,70,229,0.12)', padding: 'clamp(1rem, 3vw, 1.5rem)', animationDelay: '0.5s' }}>
          <h4 className="font-bold mb-4" style={{ fontSize: '1rem' }}>📦 What&apos;s next?</h4>
          <div className="flex flex-col gap-3">
            {[
              { step: '1', text: 'We\'re confirming your order' },
              { step: '2', text: 'Your order will be packed and shipped' },
              { step: '3', text: 'Our delivery agent will call before arriving' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                  {item.step}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href="/shop" className="btn btn-primary px-8" style={{ borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(79,70,229,0.25)' }}>
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
