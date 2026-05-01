import { useState } from 'react';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { CardReveal } from '../components/CardReveal';
import { Filter, ChevronDown, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CollectionScreen = () => {
  const { inventory } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'local' | 'onchain'>('local');

  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  // Map inventory counts to the catalog data
  const ownedCards = allCards.map(card => {
    const invItem = inventory.find(i => i.cardId === card.id);
    return {
      ...card,
      quantity: invItem ? invItem.quantity : 0,
      imageLocalUrl: getCardImage(card.id)
    };
  });

  const filteredCards = filter === 'All'
    ? ownedCards
    : ownedCards.filter(c => c.rarity === filter);

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-lg text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Inventory
            </h1>
            <p className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-widest font-bold">
              {viewMode === 'local' ? 'In-Game Collection' : 'On-Chain Assets'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10">
              <button 
                onClick={() => setViewMode('local')}
                className={`px-3 py-1 rounded-md text-[8px] font-bold uppercase transition-all ${
                  viewMode === 'local' ? 'bg-yugi-gold text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Local
              </button>
              <button 
                onClick={() => setViewMode('onchain')}
                className={`px-3 py-1 rounded-md text-[8px] font-bold uppercase transition-all ${
                  viewMode === 'onchain' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                On-Chain
              </button>
            </div>

          {/* Consolidated Filter Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border-2 border-yugi-gold rounded-lg text-yugi-gold text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
            >
              <Filter size={12} />
              <span>{filter === 'All' ? 'Filter' : filter}</span>
              <ChevronDown size={12} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
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
                        className={`w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${filter === r ? 'text-yugi-gold' : 'text-gray-400'
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
        </div>

        {/* Grid */}
        {viewMode === 'local' ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {filteredCards.map(card => (
              <div 
                key={card.id} 
                onClick={() => card.quantity > 0 && setSelectedCardId(card.id)}
                className={`relative rounded border-2 p-1 transition-transform aspect-[5/7] ${
                  card.quantity > 0 
                    ? 'border-[#cba052] bg-gradient-to-br from-[#cba052] to-[#8b6508] hover:scale-105 cursor-pointer' 
                    : 'border-gray-700 bg-gray-800 grayscale opacity-50 cursor-not-allowed'
                }`}
              >
                <img src={card.imageLocalUrl} alt={card.name} className="w-full object-cover" />

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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-3xl">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-blue-400" size={32} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Base NFT Collection</h3>
            <p className="text-[10px] text-gray-500 text-center max-w-xs px-4">
              Connect your wallet to synchronize and view your minted NFTs on the Base network.
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white text-[9px] font-bold rounded-xl hover:bg-blue-500 transition-all">
              Sync On-Chain Assets
            </button>
          </div>
        )}
      
        {viewMode === 'local' && inventory.length === 0 && (
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

