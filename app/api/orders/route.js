import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber, calculateShipping } from '@/lib/utils';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      customerName, phone, email, address, city, area, notes, items 
    } = body;

    if (!customerName || !phone || !address || !city || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify products and variants, calculate total
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      }

      // Check variant stock if phoneModelId is provided
      if (item.phoneModelId) {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_phoneModelId: { productId: item.id, phoneModelId: item.phoneModelId } },
          include: { phoneModel: true }
        });
        if (!variant) {
          return NextResponse.json({ error: `Model not available for ${product.name}` }, { status: 400 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json({ error: `Not enough stock for ${product.name} (${variant.phoneModel.name})` }, { status: 400 });
        }
      }

      subtotal += product.price * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: item.image,
        phoneModel: item.phoneModelName || null,
      });
    }

    const shipping = calculateShipping(city);
    const total = subtotal + shipping;
    const orderNumber = generateOrderNumber();

    // Create Order + decrement variant stock in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          phone,
          email,
          address,
          city,
          area,
          notes,
          subtotal,
          shipping,
          total,
          items: {
            create: orderItemsData
          }
        }
      });

      // Decrement variant stock
      for (const item of items) {
        if (item.phoneModelId) {
          await tx.productVariant.update({
            where: { productId_phoneModelId: { productId: item.id, phoneModelId: item.phoneModelId } },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
