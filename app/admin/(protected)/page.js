import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [totalOrders, totalRevenue, pendingOrders, totalProducts] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.product.count()
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lte: 10 } },
    take: 5,
    orderBy: { stock: 'asc' },
    include: { product: true, phoneModel: true }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 border-l-4 border-l-primary">
          <p className="text-secondary text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold">{formatPrice(totalRevenue._sum.total || 0)}</h3>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-accent">
          <p className="text-secondary text-sm font-medium mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold">{totalOrders}</h3>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-warning">
          <p className="text-secondary text-sm font-medium mb-1">Pending Orders</p>
          <h3 className="text-2xl font-bold">{pendingOrders}</h3>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-success">
          <p className="text-secondary text-sm font-medium mb-1">Total Products</p>
          <h3 className="text-2xl font-bold">{totalProducts}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-secondary border-b border-border">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-secondary">No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-border">
                      <td className="py-3"><Link href={`/admin/orders/${order.id}`} className="hover:text-primary">{order.orderNumber}</Link></td>
                      <td className="py-3">{order.customerName}</td>
                      <td className="py-3">
                        <span className={`badge ${order.status === 'pending' ? 'badge-warning' : order.status === 'delivered' ? 'badge-success' : 'badge-primary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">{formatPrice(order.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Low Stock Alerts</h2>
            <Link href="/admin/products" className="text-primary text-sm hover:underline">View Products</Link>
          </div>

          <div className="flex flex-col gap-4">
            {lowStockVariants.length === 0 ? (
              <p className="text-secondary text-center py-4">All variants are well stocked.</p>
            ) : (
              lowStockVariants.map(variant => (
                <div key={variant.id} className="flex justify-between items-center p-3 border border-border rounded-md bg-surface">
                  <div>
                    <Link href={`/admin/products/${variant.productId}/edit`} className="font-medium hover:text-primary line-clamp-1">{variant.product.name}</Link>
                    <p className="text-xs text-secondary mt-1">📱 {variant.phoneModel.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${variant.stock <= 5 ? 'badge-danger' : 'badge-warning'}`}>
                      {variant.stock} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
