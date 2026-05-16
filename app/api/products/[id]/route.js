import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, price, comparePrice, categoryIds, featured, active, images, variants } = body;

    // Update product + replace categories + replace variants
    const product = await prisma.$transaction(async (tx) => {
      // Update core fields + set categories
      const updated = await tx.product.update({
        where: { id },
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
            set: (categoryIds || []).map(cid => ({ id: cid }))
          }
        }
      });

      // Replace variants: delete all existing, create new
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map(v => ({
            productId: id,
            phoneModelId: v.phoneModelId,
            stock: v.stock || 0
          }))
        });
      }

      return tx.product.findUnique({
        where: { id },
        include: { categories: true, variants: { include: { phoneModel: true } } }
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
