import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true }
  });
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      categories: true,
      variants: { include: { phoneModel: true } }
    }
  });

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
