import prisma from '@/lib/prisma';
import ProductForm from '../../ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const [product, categories, phoneModels] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { categories: true, variants: { include: { phoneModel: true } } }
    }),
    prisma.category.findMany(),
    prisma.phoneModel.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Edit Product: {product.name}</h1>
      <ProductForm initialData={product} categories={categories} phoneModels={phoneModels} />
    </div>
  );
}
