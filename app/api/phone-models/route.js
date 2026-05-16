import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const phoneModels = await prisma.phoneModel.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(phoneModels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch phone models' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const phoneModel = await prisma.phoneModel.create({ data: { name: name.trim() } });
    return NextResponse.json(phoneModel, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Phone model already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create phone model' }, { status: 500 });
  }
}
