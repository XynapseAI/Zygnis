"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { Shield, Zap, AlertCircle, Flame, Ghost } from 'lucide-react';

const RARITY_VALUES: Record<string, number> = {
  'Common': 50,
  'Rare': 150,
  'Epic': 500,
  'Mythic': 2000,
  'Legendary': 10000,
};

export const BurnScreen = () => {
  const { zyg, inventory, burnCard } = useStore();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isBurning, setIsBurning] = useState(false);
  const [burnQuantity, setBurnQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  const inventoryCards = inventory.map(item => {
    const details = allCards.find(c => c.id === item.cardId);
    return {
      ...item,
      details: details ? { ...details, imageUrl: getCardImage(details.id) } : null
    };
  }).filter(item => item.details && item.quantity > 0);

  const selectedItem = inventoryCards.find(i => i.cardId === selectedCardId);
  const zygPerCard = selectedItem?.details ? (RARITY_VALUES[selectedItem.details.rarity] || 25) : 25;
  const totalZyg = zygPerCard * burnQuantity;

  const handleBurn = () => {
    if (!selectedCardId || isBurning) return;

    setIsBurning(true);
    setTimeout(() => {
      burnCard(selectedCardId, burnQuantity, totalZyg);
      setSelectedCardId(null);
      setBurnQuantity(1);
      setIsBurning(false);
      setShowConfirm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 pb-32 max-w-6xl mx-auto overflow-y-auto">
      {/* Header - Meticulous Stone Label */}
      <div className="text-center mt-4 mb-8 space-y-1">
        <div className="stone-broken inline-flex items-center gap-3 px-4 py-1.5 bg-[#1a120d] border-[#3d2b1f] shadow-2xl mb-2">
          <Flame className="text-orange-600 animate-pulse" size={14} />
          <span className="text-[9px] text-orange-700 uppercase tracking-[0.3em] font-hearth font-black">Muspelheim's Flame</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-hearth font-black text-white tracking-[0.1em] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase">Burn Cards</h1>
        <p className="text-[10px] text-[#8b6b4d] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-black engraved italic">
          Burn your duplicates to claim their essence.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start px-2">
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-4 px-4 border-b-[3px] border-[#3d2b1f] pb-4">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#3d2b1f]" />
              <h2 className="text-sm font-hearth text-white uppercase tracking-[0.2em] font-black drop-shadow-md">Available Relics</h2>
            </div>
            <span className="text-[10px] text-hearth-gold font-black font-hearth tracking-[0.1em] uppercase">{inventoryCards.length} RELICS IN POSSESSION</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
            {inventoryCards.map((item) => (
              <button
                key={item.cardId}
                onClick={() => {
                  setSelectedCardId(item.cardId);
                  setBurnQuantity(1);
                }}
                className={`group relative aspect-[5/7] rounded-sm border-[2px] transition-all duration-500 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,1)] hover:scale-105 ${selectedCardId === item.cardId
                  ? 'border-hearth-gold bg-[#2a1d15] scale-105 z-10 shadow-[0_40px_80px_rgba(244,208,63,0.3)]'
                  : 'border-[#1a120d] bg-[#1a120d] grayscale group-hover:grayscale-0'
                  }`}
              >
                <div className="absolute inset-0 rounded-sm overflow-hidden m-0.5 border border-black/60 shadow-inner">
                  <img src={item.details?.imageUrl || ''} className="w-full h-full object-cover" alt="Card" />
                </div>

                {item.quantity > 1 && (
                  <div className="absolute -top-3 -right-3 bg-red-950 text-white text-[12px] w-8 h-8 flex items-center justify-center rounded-full border-[2px] border-black/80 font-black z-10 shadow-2xl">
                    {item.quantity}
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none chisel-mark opacity-40" />
              </button>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
          <div className="stone-broken p-6 bg-[#2a2a2a] border-[8px] border-[#1a1a1a] shadow-[0_25px_50px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="text-md font-hearth font-black text-hearth-gold uppercase tracking-[0.3em] mb-8 drop-shadow-lg">Sacrificial Pyre</h3>

              <div className="aspect-[5/7] w-full max-w-[200px] mx-auto relative mb-10">
                <AnimatePresence mode="wait">
                  {selectedItem ? (
                    <motion.div
                      key={selectedItem.cardId}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.1, filter: 'brightness(4) blur(10px)' }}
                      className="w-full h-full stone-broken !p-1 legendary-border"
                    >
                      <div className="w-full h-full rounded-sm overflow-hidden shadow-2xl relative border-[2px] border-[#1a120d]">
                        <img src={selectedItem.details?.imageUrl || ''} className="w-full h-full object-cover" alt="Selected" />
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full stone-broken bg-[#1a120d] border-[#3d2b1f] border-dashed border-[4px] flex flex-col items-center justify-center p-8 opacity-30">
                      <Ghost size={48} className="text-[#3d2b1f] mb-4 animate-pulse" />
                      <p className="text-[9px] text-[#8b6b4d] uppercase tracking-[0.2em] font-black engraved">Select a Relic</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {selectedItem && (
                <div className="space-y-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] text-[#8b6b4d] uppercase font-black tracking-[0.2em] engraved">Offering Count</span>
                    <div className="flex items-center justify-center gap-6">
                      <button onClick={() => setBurnQuantity(prev => Math.max(1, prev - 1))} className="w-10 h-10 stone-broken !bg-[#1a120d] border-[#3d2b1f] flex items-center justify-center text-hearth-gold hover:text-white transition-colors text-xl font-black">-</button>
                      <span className="text-2xl font-hearth font-black text-white w-10">{burnQuantity}</span>
                      <button onClick={() => setBurnQuantity(prev => Math.min(selectedItem.quantity, prev + 1))} className="w-10 h-10 stone-broken !bg-[#1a120d] border-[#3d2b1f] flex items-center justify-center text-hearth-gold hover:text-white transition-colors text-xl font-black">+</button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-black/20">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] text-[#8b6b4d] uppercase font-black engraved">Essence Gain</span>
                      <span className="text-xl font-hearth font-black text-hearth-gold">+{totalZyg.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedCardId || isBurning}
                className="btn-stone-chipped w-full !py-4 !bg-red-950 !text-white !border-red-900/50 text-[11px] font-black tracking-[0.3em]"
              >
                {isBurning ? 'BURNING...' : 'BURN'}
              </button>
            </div>
          </div>

          <div className="parchment-bg p-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle size={20} className="text-red-950" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-hearth font-black uppercase text-[#2a1d15]">Odin's Warning</h4>
                <p className="text-[11px] text-[#4a3224] leading-relaxed italic font-black">"Once burned, the relic turns to ashes forever. There is no turning back."</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              className="stone-broken w-full max-w-md relative p-16 border-[20px] border-[#1a1a1a] bg-[#2a2a2a] text-center"
            >
              <h3 className="text-4xl font-hearth font-black text-white mb-6 uppercase">THE FINAL ASHES</h3>
              <p className="text-[14px] text-[#8b6b4d] mb-16 italic">
                "Are you prepared to burn {burnQuantity}x {selectedItem?.details?.name}?"
              </p>
              <div className="flex gap-8">
                <button onClick={() => setShowConfirm(false)} className="btn-stone-chipped flex-1 !py-5 font-black">ABORT</button>
                <button onClick={handleBurn} className="btn-stone-chipped !bg-red-950 !text-white flex-1 !py-5 font-black">EXECUTE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};