"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { Sparkles, Shield, Zap, Ghost, X } from 'lucide-react';
import { CardReveal } from '../components/CardReveal';

export const FusionScreen = () => {
  const { inventory, addCard, removeCard } = useStore();
  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);

  const [fusedCardId, setFusedCardId] = useState<string | null>(null);

  const inventoryCards = inventory.map(item => {
    const details = allCards.find(c => c.id === item.cardId);
    return {
      ...item,
      details: details ? { ...details, imageUrl: getCardImage(details.id) } : null
    };
  }).filter(item => item.details && item.quantity > 0);

  const getRandomFusedCard = () => {
    const rand = Math.random() * 100;
    let targetRarity = 'Common';

    if (rand < 0.5) {
      targetRarity = 'Mythic'
    } else if (rand < 2.0) {
      targetRarity = 'Legendary';
    } else if (rand < 5.0) {
      targetRarity = 'Epic';
    } else if (rand < 20.0) {
      targetRarity = 'Rare';
    } else {
      targetRarity = 'Common';
    }

    const cardsOfRarity = allCards.filter(c => c.rarity === targetRarity);

    if (cardsOfRarity.length === 0) {
      return allCards[Math.floor(Math.random() * allCards.length)].id;
    }

    const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    return randomCard.id;
  };

  const handleFusion = () => {
    if (!slot1 || !slot2 || isFusing) return;
    setIsFusing(true);

    setTimeout(() => {
      removeCard(slot1, 1);
      removeCard(slot2, 1);
      const newCardId = getRandomFusedCard();
      addCard(newCardId);

      setSlot1(null);
      setSlot2(null);
      setIsFusing(false);
      setFusedCardId(newCardId);
    }, 2500);
  };

  return (
    <div className="min-h-screen p-4 pb-32 max-w-6xl mx-auto overflow-y-auto">
      <div className="text-center mt-4 mb-8 space-y-1">
        <div className="stone-broken inline-flex items-center gap-3 px-4 py-1.5 bg-[#1a120d] border-[#3d2b1f] shadow-2xl mb-2">
          <Sparkles className="text-purple-500 animate-pulse" size={14} />
          <span className="text-[9px] text-purple-600 uppercase tracking-[0.3em] font-hearth font-black">Valhalla's Forge</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-hearth font-black text-white tracking-[0.1em] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase">Fuse Relics</h1>
        <p className="text-[10px] text-[#8b6b4d] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-black engraved italic">
          Combine your duplicates to forge a mythical artifact.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start px-2">
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-4 px-4 border-b-[3px] border-[#3d2b1f] pb-4">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#3d2b1f]" />
              <h2 className="text-sm font-hearth text-white uppercase tracking-[0.2em] font-black drop-shadow-md">Available Cards</h2>
            </div>
            <span className="text-[10px] text-hearth-gold font-black font-hearth tracking-[0.1em] uppercase">{inventoryCards.length} CARDS READY</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
            {inventoryCards.map((item) => {
              const isUsed = item.cardId === slot1 || item.cardId === slot2;
              return (
                <button
                  key={item.cardId}
                  onClick={() => {
                    if (!slot1) setSlot1(item.cardId);
                    else if (!slot2 && item.cardId !== slot1) setSlot2(item.cardId);
                  }}
                  className={`group relative aspect-[5/7] rounded-sm border-[2px] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,1)] ${isUsed ? 'border-hearth-gold bg-[#2a1d15] scale-105 z-10' : 'border-[#1a120d] bg-[#1a120d] hover:scale-105'}`}
                >
                  <div className="absolute inset-0 rounded-sm overflow-hidden m-0.5 border border-black/60 shadow-inner">
                    <img src={item.details?.imageUrl || ''} className="w-full h-full object-cover" alt="Card" />
                  </div>
                  <div className="absolute inset-0 pointer-events-none chisel-mark opacity-40" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-2 space-y-6">
          <div className="stone-broken p-6 bg-[#2a2a2a] border-[8px] border-[#1a1a1a] shadow-[0_25px_50px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h3 className="text-md font-hearth font-black text-hearth-gold uppercase tracking-[0.3em] mb-8">Valhalla's Anvil</h3>
              <div className="flex justify-center items-center gap-4 mb-8">
                <RitualSlot cardId={slot1} onClear={() => setSlot1(null)} />
                <Zap size={20} className="text-hearth-gold animate-pulse" />
                <RitualSlot cardId={slot2} onClear={() => setSlot2(null)} />
              </div>
              <button
                onClick={handleFusion}
                disabled={!slot1 || !slot2 || isFusing}
                className={`btn-stone-chipped w-full !py-4 !bg-purple-950 !text-white !border-purple-900/50 font-black tracking-[0.3em] !text-[11px] ${!slot1 || !slot2 || isFusing ? 'grayscale opacity-20' : 'hover:!bg-purple-900'}`}
              >
                {isFusing ? 'FUSING...' : 'FUSE RELICS'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <CardReveal
        cardId={fusedCardId}
        onClose={() => setFusedCardId(null)}
        isNew={true}
      />
    </div>
  );
};

const RitualSlot = ({ cardId, onClear }: { cardId: string | null; onClear: () => void }) => {
  const card = allCards.find(c => c.id === cardId);
  const imageUrl = cardId ? getCardImage(cardId) : null;
  return (
    <div className="relative group">
      <div onClick={cardId ? onClear : undefined} className={`w-28 h-40 stone-broken !p-1 transition-all duration-500 cursor-pointer overflow-hidden ${cardId ? 'legendary-border scale-105' : 'bg-[#1a120d] border-[#3d2b1f] border-dashed border-[4px] opacity-30'}`}>
        <div className="w-full h-full rounded-sm overflow-hidden relative border border-[#1a120d]">
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="Slot" /> : <Ghost size={32} className="text-[#3d2b1f] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
      </div>
      {cardId && (
        <div className="absolute -top-3 -right-3 bg-red-950 text-white p-1 rounded-full border-2 border-black/80 z-10" onClick={onClear}>
          <X size={12} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};