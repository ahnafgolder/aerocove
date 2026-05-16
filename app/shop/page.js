import prisma from '@/lib/prisma';
import ShopClient from './ShopClient';

export const revalidate = 60;

export default async function Shop({ searchParams }) {
  const { category: categorySlug } = await searchParams;

  const where = {
    active: true,
    ...(categorySlug ? { categories: { some: { slug: categorySlug } } } : {})
  };

  const products = await prisma.product.findMany({
    where,
    include: {
      categories: true,
      variants: { include: { phoneModel: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany();

  return <ShopClient products={products} categories={categories} categorySlug={categorySlug} />;
}
