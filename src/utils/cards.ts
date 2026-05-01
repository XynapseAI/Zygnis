import commonCards from '../data/kaiju_dota_common.json';
import rareCards from '../data/kaiju_dota_rare.json';
import epicCards from '../data/kaiju_dota_epic.json';
import mythicCards from '../data/kaiju_dota_mythic.json';
import legendaryCards from '../data/kaiju_dota_legendary.json';

export interface Card {
  id: string;
  name: string;
  description: string;
  rarity: string;
  attribute: string;
  cardType: string;
  race: string;
  level: number;
  atk: number;
  def: number;
  imageUrl: string;
  imagePrompt: string;
}

// Combine all cards
export const allCards: Card[] = [
  ...commonCards,
  ...rareCards,
  ...epicCards,
  ...mythicCards,
  ...legendaryCards,
];

// Helper to get image path based on ID
// The pattern is [ID]_202605011113.jpeg
export const getCardImage = (id: string) => {
  return `/cards/${id}_202605011113.jpeg`;
};

export const getCardById = (id: string) => {
  return allCards.find(c => c.id === id);
};
