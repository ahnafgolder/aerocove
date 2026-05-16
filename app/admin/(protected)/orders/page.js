import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/utils';

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-alt)' }}>
                <th className="p-4 font-medium text-secondary">Order</th>
                <th className="p-4 font-medium text-secondary">Date</th>
                <th className="p-4 font-medium text-secondary">Customer</th>
                <th className="p-4 font-medium text-secondary">Location</th>
                <th className="p-4 font-medium text-secondary">Total</th>
                <th className="p-4 font-medium text-secondary">Status</th>
                <th className="p-4 font-medium text-secondary text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-secondary">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4 text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-secondary">{order.phone}</p>
                    </td>
                    <td className="p-4 text-secondary">{order.city}</td>
                    <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className="badge" style={{
                        backgroundColor: `${getStatusColor(order.status)}18`,
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}30`
                      }}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary font-medium text-sm">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
