import { allCards } from './cards';

// Probabilities (out of 1000 to handle small % - now including Legendary)
const WEIGHTS = {
  'Nothing': 950,    // 95%
  'Common': 25,     // 2.5%
  'Rare': 15,       // 1.5%
  'Epic': 7,       // 0.7%
  'Mythic': 2,      // 0.2%
  'Legendary': 1    // 0.1%
};

export const rollForCard = (): string | null => {
  const roll = Math.random() * 1000;
  let cumulative = 0;
  let selectedRarity = 'Nothing';
  
  for (const [rarity, weight] of Object.entries(WEIGHTS)) {
    cumulative += weight;
    if (roll <= cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  if (selectedRarity === 'Nothing') {
    return null;
  }

  // Select a random card of that rarity
  const availableCards = allCards.filter(c => c.rarity === selectedRarity);
  if (availableCards.length === 0) return null; // Fallback if no cards of rarity exist

  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex].id;
};
