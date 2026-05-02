// src/app/api/nft/[id]/route.ts
import { NextResponse } from 'next/server';
import { getCardById, getCardImage } from '../../../../utils/cards';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const card = getCardById(id);

  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 });
  }

  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const imageUrl = `${baseUrl}${getCardImage(card.id)}`;

  const metadata = {
    name: card.name,
    description: card.description,
    image: imageUrl,
    attributes: [
      { trait_type: 'Rarity', value: card.rarity },
      { trait_type: 'Attribute', value: card.attribute },
      { trait_type: 'Type', value: card.cardType },
      { trait_type: 'Race', value: card.race },
      { display_type: 'number', trait_type: 'Level', value: card.level },
      { display_type: 'number', trait_type: 'ATK', value: card.atk },
      { display_type: 'number', trait_type: 'DEF', value: card.def },
    ],
  };

  return NextResponse.json(metadata);
}