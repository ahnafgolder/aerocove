import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';
import OrderStatusSelect from './OrderStatusSelect';

export default async function AdminOrderDetail({ params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order {order.orderNumber}</h1>
          <p className="text-secondary text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">Order Items</h2>
            <div className="flex flex-col gap-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-md overflow-hidden border flex-shrink-0" style={{ background: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="w-full h-full flex items-center justify-center text-xs text-secondary">—</div>}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-secondary">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm text-secondary"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm text-secondary"><span>Shipping</span><span>{formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                <span>Total</span><span style={{ color: 'var(--primary)' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">Customer</h2>
            <div className="space-y-4">
              <div><p className="text-sm text-secondary mb-1">Name</p><p className="font-medium">{order.customerName}</p></div>
              <div><p className="text-sm text-secondary mb-1">Contact</p><p>{order.phone}</p>{order.email && <p className="text-secondary text-sm">{order.email}</p>}</div>
            </div>
          </div>
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b">Shipping Address</h2>
            <p className="whitespace-pre-wrap">{order.address}</p>
            <p className="mt-2">{order.area ? `${order.area}, ` : ''}{order.city}</p>
          </div>
          {order.notes && (
            <div className="glass-panel p-6" style={{ background: 'var(--warning-light)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--warning)' }}>Order Notes</h2>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
