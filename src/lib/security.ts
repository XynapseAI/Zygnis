import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { z } from 'zod';
import { allCards } from '../utils/cards';

/**
 * Validates the session and returns the user email or a 401 response.
 */
export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  return { error: null, session, email: session.user.email };
}

/**
 * Standard API error response helper.
 */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard API success response helper.
 */
export function apiSuccess(data: any) {
  return NextResponse.json(data);
}

/**
 * Zod schemas for common entities
 */
const validCardIds = allCards.map(c => c.id);

export const syncSchema = z.object({
  zyg: z.number().min(0).max(100000), // More realistic max zyg
  tapsToday: z.number().min(0).max(200), // Enforce the 200 tap limit
  lastTapDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  inventory: z.array(z.object({
    cardId: z.string().refine(id => validCardIds.includes(id), {
      message: "Invalid card ID"
    }),
    quantity: z.number().min(0).max(100) // Sane limit per card
  }))
});

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

/**
 * Web3 client for verification
 */
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export const NFT_CONTRACT_ADDRESS = "0x385f49ef823Ea58E0a45BBFAa579f11C7578703B";

export const mintVerifySchema = z.object({
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  cardId: z.string()
});

export const walletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
});
