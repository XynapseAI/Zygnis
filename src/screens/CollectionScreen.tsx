"use client";
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { CardReveal } from '../components/CardReveal';
import { Filter, ChevronDown, Check, Sparkles, Book, Coins, Box, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CollectionScreen = () => {
  const { inventory } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'local' | 'onchain'>('local');

  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

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
    <div className="min-h-screen p-4 pb-32 flex flex-col items-center">
      <div className="w-full max-w-6xl mt-4">
        {/* Meticulous Stone Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-8 px-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-hearth text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] tracking-widest uppercase">MY COLLECTION</h1>
            <div className="flex items-center gap-2">
              <Scroll size={16} className="text-hearth-gold opacity-40" />
              <p className="text-[9px] md:text-[11px] text-[#8b6b4d] uppercase tracking-[0.4em] font-black engraved">
                {viewMode === 'local' ? 'Spirit Vault' : 'NFT Collection'}
              </p>
            </div>
          </div>

          {/* Đưa Vault/Ascended và Filter lên cùng 1 hàng ngang ở mobile */}
          <div className="flex flex-row items-center justify-between w-full md:w-auto gap-2 md:gap-6">
            {/* View Mode Select - Broken Stone Style */}
            <div className="stone-broken p-1 bg-[#1a120d] flex shadow-inner">
              <button
                onClick={() => setViewMode('local')}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'local' ? 'bg-hearth-gold text-[#3d2b1f] shadow-[0_4px_15px_rgba(244,208,63,0.3)]' : 'text-[#8b6b4d] hover:text-[#f0e6d2]'
                  }`}
              >
                <Box size={12} className="md:w-[14px] md:h-[14px]" />
                CARDS
              </button>
              <button
                onClick={() => setViewMode('onchain')}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${viewMode === 'onchain' ? 'bg-indigo-900 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)]' : 'text-[#8b6b4d] hover:text-[#f0e6d2]'
                  }`}
              >
                <Sparkles size={12} className="md:w-[14px] md:h-[14px]" />
                NFTs
              </button>
            </div>

            {/* Filter - Meticulous Chipped Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn-stone-chipped flex items-center justify-center gap-1.5 md:gap-3 !py-2 md:!py-3 px-3 md:px-8 text-[9px] md:text-xs"
              >
                <Filter size={12} className="md:w-4 md:h-4" />
                <span>{filter === 'All' ? 'FILTER' : filter.toUpperCase()}</span>
                <ChevronDown size={12} className={`md:w-4 md:h-4 transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      className="absolute right-0 mt-2 md:mt-4 w-40 md:w-60 bg-[#2a1d15] border-[6px] md:border-[10px] border-[#1a120d] rounded-sm overflow-hidden z-50 p-1 shadow-[0_30px_60px_rgba(0,0,0,1)]"
                    >
                      {rarities.map(r => (
                        <button
                          key={r}
                          onClick={() => {
                            setFilter(r);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full px-3 py-2 md:px-5 md:py-4 text-left text-[9px] md:text-[12px] font-black uppercase tracking-[0.2em] flex items-center justify-between rounded-sm transition-all duration-300 ${filter === r ? 'bg-[#3d2b1f] text-hearth-gold' : 'text-[#8b6b4d] hover:bg-white/5 hover:text-[#f0e6d2]'
                            }`}
                        >
                          {r}
                          {filter === r && <Check size={12} className="md:w-[14px] md:h-[14px] text-hearth-gold" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid Section - Chipped Stone Pedestals */}
        {viewMode === 'local' ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 px-4">
            {filteredCards.map(card => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => card.quantity > 0 && setSelectedCardId(card.id)}
                className="group flex flex-col gap-3"
              >
                <div className={`relative rounded-sm border-2 transition-all duration-700 aspect-[5/7] cursor-pointer shadow-[0_15px_30px_rgba(0,0,0,1)] hover:z-10 ${card.quantity > 0
                  ? 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-hearth-gold hover:shadow-[0_25px_50px_rgba(244,208,63,0.2)]'
                  : 'border-[#1a120d] bg-[#0a0a0a] grayscale opacity-40 cursor-not-allowed shadow-none'
                  }`}>
                  <div className="absolute inset-0 rounded-sm overflow-hidden border border-black/60 shadow-inner">
                    <img src={card.imageLocalUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-1000" />
                  </div>

                  {card.quantity > 0 && (
                    <div className="absolute -top-3 -right-3 bg-red-900 text-white text-[11px] w-7 h-7 flex items-center justify-center rounded-full border-[3px] border-black/80 font-black z-10 shadow-2xl">
                      {card.quantity}
                    </div>
                  )}

                  {/* Chisel Marks on Pedestal */}
                  <div className="absolute inset-0 pointer-events-none chisel-mark opacity-40" />
                </div>

                <div className="text-[10px] text-center text-[#8b6b4d] font-black truncate uppercase tracking-widest drop-shadow-sm px-1">
                  {card.name}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mx-4 p-20 stone-broken flex flex-col items-center text-center bg-[#1a120d] border-[#3d2b1f] border-dashed border-[8px]">
            <div className="w-24 h-24 bg-indigo-900/10 rounded-full flex items-center justify-center mb-10 border-[4px] border-indigo-500/20 shadow-[0_0_60px_rgba(79,70,229,0.3)]">
              <Sparkles className="text-indigo-400" size={48} />
            </div>
            <h3 className="text-3xl font-hearth text-white mb-4 uppercase tracking-[0.3em] drop-shadow-lg">NFT GALLERY</h3>
            <p className="text-md text-[#8b6b4d] max-w-sm px-8 leading-relaxed mb-12 font-bold italic">
              "Connect your wallet to view your permanent NFTs."
            </p>
            <button className="btn-stone-chipped !bg-indigo-900 !text-white !border-indigo-600/30 !py-5 px-12 shadow-[0_15px_40px_rgba(79,70,229,0.4)]">
              CONNECT WALLET
            </button>
          </div>
        )}

        {viewMode === 'local' && inventory.length === 0 && (
          <div className="text-center mt-32 space-y-8">
            <p className="text-[#8b6b4d] text-2xl font-hearth uppercase tracking-[0.4em] font-black drop-shadow-md">The Archives are vacant, Seeker.</p>
            <button className="btn-stone-gold px-16 !py-5 shadow-2xl" onClick={() => window.location.href = '/'}>BEGIN THE QUEST</button>
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