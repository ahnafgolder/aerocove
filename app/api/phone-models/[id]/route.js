import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.phoneModel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete — phone model is in use by products' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete phone model' }, { status: 500 });
  }
}
