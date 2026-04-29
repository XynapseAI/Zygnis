import cardsData from '../data/cards.json';

// Probabilities (out of 1000 to handle 0.5%)
const WEIGHTS = {
  'Nothing': 950, // 95%
  'Common': 25,   // 2.5%
  'Rare': 15,     // 1.5%
  'Super Rare': 7, // 0.7%
  'Ultra Rare': 3   // 0.3%
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
  const availableCards = cardsData.filter(c => c.rarity === selectedRarity);
  if (availableCards.length === 0) return null; // Fallback if no cards of rarity exist

  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex].id;
};
