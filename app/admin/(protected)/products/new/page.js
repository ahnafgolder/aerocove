import prisma from '@/lib/prisma';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const [categories, phoneModels] = await Promise.all([
    prisma.category.findMany(),
    prisma.phoneModel.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
      <ProductForm categories={categories} phoneModels={phoneModels} />
    </div>
  );
}
