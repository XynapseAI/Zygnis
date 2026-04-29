import { useState } from 'react';
import { useStore } from '../store/useStore';
import cardsData from '../data/cards.json';
import { CardReveal } from '../components/CardReveal';
import { Filter, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CollectionScreen = () => {
  const { inventory } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const rarities = ['All', 'Common', 'Rare', 'Super Rare', 'Ultra Rare'];

  // Map inventory counts to the catalog data
  const ownedCards = cardsData.map(card => {
    const invItem = inventory.find(i => i.cardId === card.id);
    return {
      ...card,
      quantity: invItem ? invItem.quantity : 0
    };
  });

  const filteredCards = filter === 'All' 
    ? ownedCards 
    : ownedCards.filter(c => c.rarity === filter);

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-yugi-gold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-bold">Collection</h1>
          
          {/* Consolidated Filter Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-2 border-yugi-gold rounded-xl text-yugi-gold text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
            >
              <Filter size={14} />
              <span>{filter === 'All' ? 'Filter' : filter}</span>
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-yugi-dark border-2 border-yugi-gold rounded-xl overflow-hidden z-50 shadow-2xl"
                  >
                    {rarities.map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          setFilter(r);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                          filter === r ? 'text-yugi-gold' : 'text-gray-400'
                        }`}
                      >
                        {r}
                        {filter === r && <Check size={12} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {filteredCards.map(card => (
          <div 
            key={card.id} 
            onClick={() => card.quantity > 0 && setSelectedCardId(card.id)}
            className={`relative rounded border-2 p-1 transition-transform ${
              card.quantity > 0 
                ? 'border-[#cba052] bg-gradient-to-br from-[#cba052] to-[#8b6508] hover:scale-105 cursor-pointer' 
                : 'border-gray-700 bg-gray-800 grayscale opacity-50 cursor-not-allowed'
            }`}
          >
            <img src={card.imageUrl} alt={card.name} className="w-full object-cover" />
            
            {card.quantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] w-5 h-5 flex items-center justify-center rounded-full border border-white font-bold z-10 shadow-lg">
                x{card.quantity}
              </div>
            )}
            
            <div className="mt-1 text-[6px] text-center text-black font-bold truncate bg-white/80 p-[2px] rounded uppercase tracking-tighter">
              {card.name}
            </div>
          </div>
        ))}
      </div>
      
      {inventory.length === 0 && (
        <div className="text-center mt-20 text-gray-500 text-xs">
          <p>No cards yet.</p>
          <p className="mt-2 font-bold text-yugi-gold animate-pulse">Go tap to earn some!</p>
        </div>
      )}

      <CardReveal 
        cardId={selectedCardId} 
        onClose={() => setSelectedCardId(null)} 
        isNew={false} 
      />
      </div>
    </div>
  );
};

