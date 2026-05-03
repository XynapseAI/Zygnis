import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { validateSession, apiError, apiSuccess, syncSchema } from '../../../lib/security';
import { allCards } from '../../../utils/cards';

const RARITY_VALUES: Record<string, number> = {
  'Common': 50,
  'Rare': 150,
  'Epic': 500,
  'Mythic': 2000,
  'Legendary': 10000,
};

export async function POST(req: Request) {
  try {
    const { error, email } = await validateSession();
    if (error) return error;

    const body = await req.json();
    
    // 1. Basic Schema Validation
    const validation = syncSchema.safeParse(body);
    if (!validation.success) {
      return apiError('Invalid request data: ' + validation.error.message, 400);
    }

    const { zyg, tapsToday, lastTapDate, inventory } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: email! },
      include: { inventory: true }
    });

    if (!user) {
      return apiError('User not found', 404);
    }

    // 2. Delta Validation (Anti-Cheat)
    const deltaZyg = zyg - user.zyg;
    
    // Calculate taps delta, handling daily reset
    let deltaTaps = 0;
    if (lastTapDate === user.lastTapDate) {
      deltaTaps = tapsToday - user.tapsToday;
    } else {
      // New day, taps today is the delta
      deltaTaps = tapsToday;
    }

    if (deltaTaps < 0) {
      return apiError('Suspicious activity: Negative tap delta', 400);
    }

    // Calculate max possible Zyg gain from burning
    let maxBurnGain = 0;
    for (const dbItem of user.inventory) {
      const newItem = inventory.find(i => i.cardId === dbItem.cardId);
      const newQuantity = newItem ? newItem.quantity : 0;
      
      if (dbItem.quantity > newQuantity) {
        // User burned or fused some cards
        const cardDetails = allCards.find(c => c.id === dbItem.cardId);
        const rarity = cardDetails?.rarity || 'Common';
        const removedCount = dbItem.quantity - newQuantity;
        maxBurnGain += removedCount * (RARITY_VALUES[rarity] || 25);
      }
    }

    const maxAllowedGain = deltaTaps + maxBurnGain + 10; // +10 buffer for rounding/small rewards
    
    if (deltaZyg > maxAllowedGain) {
      console.warn(`[SECURITY] Blocked suspicious Zyg jump for ${email}: Delta ${deltaZyg} > Allowed ${maxAllowedGain}`);
      return apiError('Suspicious activity: Zyg jump detected', 403);
    }

    // 3. Update User Stats
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { zyg, tapsToday, lastTapDate }
    });

    // 4. Sync Inventory
    await prisma.$transaction(
      inventory.map((item) =>
        prisma.inventoryItem.upsert({
          where: {
            userId_cardId: {
              userId: user.id,
              cardId: item.cardId
            }
          },
          update: { quantity: item.quantity },
          create: {
            cardId: item.cardId,
            quantity: item.quantity,
            userId: user.id
          }
        })
      )
    );

    return apiSuccess({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Sync Error:', error);
    return apiError('Internal Server Error', 500);
  }
}
