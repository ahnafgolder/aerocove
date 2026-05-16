import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import DeleteProductButton from './DeleteProductButton';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { categories: true, variants: { include: { phoneModel: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary text-sm">+ Add New Product</Link>
      </div>
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-alt)' }}>
                <th className="p-4 font-medium text-secondary">Product</th>
                <th className="p-4 font-medium text-secondary">Categories</th>
                <th className="p-4 font-medium text-secondary">Price</th>
                <th className="p-4 font-medium text-secondary">Models / Stock</th>
                <th className="p-4 font-medium text-secondary">Status</th>
                <th className="p-4 font-medium text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-secondary">No products found. Add one to get started.</td></tr>
              ) : (
                products.map(product => {
                  const images = JSON.parse(product.images || '[]');
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  return (
                    <tr key={product.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0" style={{ background: 'var(--surface-alt)' }}>
                            {images[0] ? <img src={images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="w-full h-full flex items-center justify-center text-xs text-secondary">—</div>}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-xs text-secondary">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.categories.length > 0 ? product.categories.map(c => (
                            <span key={c.id} className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{c.name}</span>
                          )) : <span className="text-secondary text-xs">—</span>}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`badge ${totalStock <= 0 ? 'badge-danger' : totalStock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                            {totalStock} total
                          </span>
                          <span className="text-xs text-secondary">{product.variants.length} model{product.variants.length !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {product.active ? <span className="badge badge-success">Active</span> : <span className="badge">Draft</span>}
                          {product.featured && <span className="badge badge-primary">Featured</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/products/${product.id}/edit`} className="text-primary font-medium text-sm">Edit</Link>
                          <DeleteProductButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
