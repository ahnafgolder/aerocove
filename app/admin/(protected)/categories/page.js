import prisma from '@/lib/prisma';
import CategoryManager from './CategoryManager';

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1"><CategoryManager /></div>
        <div className="md:col-span-2">
          <div className="glass-panel overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-alt)' }}>
                  <th className="p-4 font-medium text-secondary">Name</th>
                  <th className="p-4 font-medium text-secondary">Slug</th>
                  <th className="p-4 font-medium text-secondary">Products</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="3" className="p-8 text-center text-secondary">No categories found.</td></tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <td className="p-4 font-medium">{cat.name}</td>
                      <td className="p-4 text-secondary">{cat.slug}</td>
                      <td className="p-4"><span className="badge badge-primary">{cat._count.products}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
