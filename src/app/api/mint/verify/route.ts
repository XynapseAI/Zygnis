import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { validateSession, apiError, apiSuccess, mintVerifySchema, publicClient, NFT_CONTRACT_ADDRESS } from '../../../../lib/security';
import { decodeFunctionData } from 'viem';

const abi = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' },
      { name: 'builderCode', type: 'string' }
    ],
    outputs: [],
  },
] as const;

export async function POST(req: Request) {
  try {
    const { error, email } = await validateSession();
    if (error) return error;

    const body = await req.json();
    const validation = mintVerifySchema.safeParse(body);
    if (!validation.success) {
      return apiError('Invalid request data: ' + validation.error.message, 400);
    }

    const { transactionHash, cardId } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: email! }
    });

    if (!user) return apiError('User not found', 404);
    if (!user.walletAddress) return apiError('Wallet not connected', 400);

    // 1. Fetch Transaction
    const tx = await publicClient.getTransaction({ hash: transactionHash as `0x${string}` });
    const receipt = await publicClient.getTransactionReceipt({ hash: transactionHash as `0x${string}` });

    // 2. Security Checks
    if (receipt.status !== 'success') return apiError('Transaction failed', 400);
    if (tx.to?.toLowerCase() !== NFT_CONTRACT_ADDRESS.toLowerCase()) return apiError('Invalid contract', 400);
    if (tx.from.toLowerCase() !== user.walletAddress.toLowerCase()) return apiError('Transaction sender mismatch', 403);

    // 3. Verify Transaction Data (Correct Card ID)
    const { args } = decodeFunctionData({
      abi,
      data: tx.input
    });

    const tokenURI = args?.[1] as string;
    if (!tokenURI || !tokenURI.includes(cardId)) {
      return apiError('Transaction data mismatch (Card ID)', 400);
    }

    // 4. Update Inventory (User minted, so they lose a local card and gain an "on-chain" status)
    // Actually, we usually just update the inventory to reflect they have it.
    // Or we can mark it as "minted" if we have a field for that.
    // For now, let's just ensure they have at least 1 in their DB inventory.
    
    await prisma.inventoryItem.upsert({
      where: {
        userId_cardId: {
          userId: user.id,
          cardId: cardId
        }
      },
      update: { quantity: { increment: 0 } }, // Just ensure it exists
      create: {
        userId: user.id,
        cardId: cardId,
        quantity: 1
      }
    });

    return apiSuccess({ success: true, transactionHash });
  } catch (error) {
    console.error('Mint Verification Error:', error);
    return apiError('Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
  }
}
