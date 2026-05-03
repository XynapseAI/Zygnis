// src/utils/rng.ts
import { allCards } from './cards';

const WEIGHTS = [
  { rarity: 'Nothing', weight: 950 }, // 95.0%
  { rarity: 'Common', weight: 25 },  // 2.5%
  { rarity: 'Rare', weight: 15 },  // 1.5%
  { rarity: 'Epic', weight: 7 },   // 0.7%
  { rarity: 'Mythic', weight: 2 },   // 0.2%
  { rarity: 'Legendary', weight: 1 }    // 0.1%
];

export const rollForCard = (): string | null => {

  const totalWeight = WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  const roll = Math.random() * totalWeight;

  let cumulative = 0;
  let selectedRarity = 'Nothing';

  for (const { rarity, weight } of WEIGHTS) {
    cumulative += weight;
    if (roll <= cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  if (selectedRarity === 'Nothing') {
    return null;
  }

  const availableCards = allCards.filter(c => c.rarity === selectedRarity);
  if (availableCards.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex].id;
};