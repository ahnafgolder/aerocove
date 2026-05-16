import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, slug, description, price, comparePrice, categoryIds, featured, active, images, variants } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        comparePrice,
        featured,
        active,
        images: JSON.stringify(images || []),
        categories: {
          connect: (categoryIds || []).map(id => ({ id }))
        },
        variants: {
          create: (variants || []).map(v => ({
            phoneModelId: v.phoneModelId,
            stock: v.stock || 0
          }))
        }
      },
      include: { categories: true, variants: { include: { phoneModel: true } } }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: category ? { categories: { some: { slug: category } } } : {},
      include: {
        categories: true,
        variants: { include: { phoneModel: true } }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
