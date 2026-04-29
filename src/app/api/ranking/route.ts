import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: {
        zyg: 'desc',
      },
      take: 20,
      select: {
        id: true,
        name: true,
        image: true,
        zyg: true,
      }
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Failed to fetch ranking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
