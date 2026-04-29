import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { zyg, tapsToday, lastTapDate, inventory } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update User Stats
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { zyg, tapsToday, lastTapDate }
    });

    // Sync Inventory
    for (const item of inventory) {
      const existingItem = await prisma.inventoryItem.findUnique({
        where: {
          userId_cardId: {
            userId: user.id,
            cardId: item.cardId
          }
        }
      });

      if (existingItem) {
        await prisma.inventoryItem.update({
          where: { id: existingItem.id },
          data: { quantity: item.quantity }
        });
      } else {
        await prisma.inventoryItem.create({
          data: {
            cardId: item.cardId,
            quantity: item.quantity,
            userId: user.id
          }
        });
      }
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
