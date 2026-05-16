import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import HomeClient from './HomeClient';

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    take: 8,
    include: { categories: true }
  });

  const categories = await prisma.category.findMany();

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />;
}
