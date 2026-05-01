"use client";
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { Flame, Trash2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RARITY_VALUES: Record<string, number> = {
  'Common': 50,
  'Rare': 150,
  'Epic': 500,
  'Mythic': 2000,
  'Legendary': 10000,
};

export const BurnScreen = () => {
  const { inventory, burnCard, syncWithServer } = useStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [burnQuantity, setBurnQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const inventoryCards = inventory.map(item => {
    const details = allCards.find(c => c.id === item.cardId);
    return {
      ...item,
      details: details ? { ...details, imageUrl: getCardImage(details.id) } : null
    };
  }).filter(item => item.details);

  const selectedItem = inventoryCards.find(i => i.cardId === selectedCardId);
  const zygPerCard = selectedItem?.details ? (RARITY_VALUES[selectedItem.details.rarity] || 0) : 0;
  const totalZyg = zygPerCard * burnQuantity;

  const handleBurn = async () => {
    if (selectedCardId && selectedItem) {
      burnCard(selectedCardId, burnQuantity, totalZyg);
      await syncWithServer();
      setShowConfirm(false);
      setSelectedCardId(null);
      setBurnQuantity(1);
    }
  };

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 font-pixel max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4 md:mb-2">
        <Flame className="text-orange-500 animate-pulse" size={20} />
        <h1 className="text-lg text-orange-500 drop-shadow-md uppercase tracking-wider font-bold">Card Splitter</h1>
      </div>

      <p className="text-[9px] text-gray-400 text-center mb-6 md:mb-4">
        Split duplicate cards to receive ancient ZYG.
      </p>

      {/* Selected Card Area */}
      <div className="bg-black/50 border-4 border-orange-900 p-4 rounded-lg mb-4 min-h-[140px] md:min-h-[110px] flex flex-col items-center justify-center relative max-w-sm mx-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent pointer-events-none" />
        
        {selectedItem ? (
          <div className="flex gap-4 w-full animate-in fade-in slide-in-from-bottom-4 justify-center">
            <div className="w-20 h-30 md:w-16 md:h-24 flex-shrink-0 relative">
              <img 
                src={selectedItem.details?.imageUrl} 
                className="w-full h-full object-cover rounded border-2 border-orange-500 shadow-[0_0_10px_rgba(255,165,0,0.3)]"
                alt="Selected card"
              />
              <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[7px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white font-bold z-10 shadow-lg">
                x{selectedItem.quantity}
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="text-xs text-white mb-0.5 uppercase truncate max-w-[120px]">{selectedItem.details?.name}</h3>
              <p className="text-[7px] text-orange-400 mb-2">{selectedItem.details?.rarity}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => setBurnQuantity(prev => Math.max(1, prev - 1))}
                  className="w-5 h-5 bg-orange-900/50 border border-orange-700 text-white rounded flex items-center justify-center text-xs"
                >
                  -
                </button>
                <span className="text-[10px] text-yugi-gold w-6 text-center">{burnQuantity}</span>
                <button 
                  onClick={() => setBurnQuantity(prev => Math.min(selectedItem.quantity, prev + 1))}
                  className="w-5 h-5 bg-orange-900/50 border border-orange-700 text-white rounded flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-1 text-yugi-gold">
                <Zap size={10} className="text-yellow-400" />
                <span className="text-[9px]">Reward: {totalZyg} ZYG</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Trash2 size={32} className="text-orange-900 mx-auto mb-1 opacity-50" />
            <p className="text-[7px] text-orange-900 uppercase tracking-tighter">Select a card to split</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <button 
          onClick={() => setShowConfirm(true)}
          className="btn-pixel bg-orange-600 border-orange-400 text-white w-full max-w-sm mx-auto py-3 md:py-2 mb-6 flex items-center justify-center gap-2 text-[10px] md:text-[8px]"
        >
          <Flame size={14} />
          Split Card
        </button>
      )}

      {/* Inventory Grid */}
      <h2 className="text-[9px] text-yugi-gold uppercase mb-3 tracking-widest px-1 text-center">Your Collection</h2>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2 max-w-xl mx-auto">
        {inventoryCards.map((item) => (
          <button
            key={item.cardId}
            onClick={() => {
              setSelectedCardId(item.cardId);
              setBurnQuantity(1);
            }}
            className={`relative rounded border-2 transition-transform active:scale-95 aspect-[5/7] ${
              selectedCardId === item.cardId ? 'border-orange-500 scale-105 z-10' : 'border-gray-800'
            }`}
          >
            <div className="absolute inset-0 rounded overflow-hidden">
              <img src={item.details?.imageUrl} className="w-full h-full object-cover" alt="Card" />
            </div>
            
            {item.quantity > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[7px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white font-bold z-10 shadow-lg">
                x{item.quantity}
              </div>
            )}
          </button>
        ))}
      </div>


      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-yugi-dark border-4 border-orange-600 p-6 rounded-lg w-full max-w-xs text-center"
            >
              <h3 className="text-sm text-orange-500 mb-4 uppercase">Confirm Split?</h3>
              <p className="text-[8px] text-gray-400 mb-6 leading-relaxed">
                You are about to split <span className="text-white">{burnQuantity}x {selectedItem?.details?.name}</span>. 
                This action is irreversible and will grant you <span className="text-yugi-gold">{totalZyg} ZYG</span>.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="btn-pixel flex-1 text-[8px] bg-gray-700 border-gray-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBurn}
                  className="btn-pixel flex-1 text-[8px] bg-orange-600 border-orange-400"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
