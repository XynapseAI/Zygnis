"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCardById, getCardImage } from '../utils/cards';
import { Sparkles, Sword, Shield, Star, Info, Scroll } from 'lucide-react';

interface CardRevealProps {
  cardId: string | null;
  onClose: () => void;
  isNew?: boolean;
}

export const CardReveal = ({ cardId, onClose, isNew = true }: CardRevealProps) => {
  const card = cardId ? getCardById(cardId) : null;
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

  const cardImageUrl = getCardImage(card.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="text-center w-full max-w-[340px] px-4">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", damping: 15, duration: 1.2 }}
            className="relative w-full aspect-[5/7] mx-auto cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front: Meticulous Heavy Broken Stone Frame */}
            <div 
              className="absolute inset-0 stone-broken !bg-[#2a2a2a] border-[8px] border-[#1a1a1a] p-3 shadow-[0_30px_60px_rgba(0,0,0,1)] flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden border-[2px] border-black/80 shadow-[inset_0_5px_10px_rgba(0,0,0,1)]">
                <img src={cardImageUrl} alt={card.name} className="w-full h-full object-cover transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pitted-steel.png')]" />
              </div>
              
              {/* Corner Ornaments - Meticulous Engraved Seals */}
              <div className="absolute top-2 left-2 w-4 h-4 bg-hearth-gold rounded-full border-2 border-black/60 shadow-2xl opacity-60 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black/40 rounded-full" />
              </div>
              <div className="absolute top-2 right-2 w-4 h-4 bg-hearth-gold rounded-full border-2 border-black/60 shadow-2xl opacity-60 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black/40 rounded-full" />
              </div>
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-hearth-gold rounded-full border-2 border-black/60 shadow-2xl opacity-60 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black/40 rounded-full" />
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-hearth-gold rounded-full border-2 border-black/60 shadow-2xl opacity-60 flex items-center justify-center">
                 <div className="w-1 h-1 bg-black/40 rounded-full" />
              </div>
            </div>

            {/* Back: Meticulous Parchment Detail Scroll */}
            <div 
              className="absolute inset-0 stone-broken !bg-[#1a1a1a] border-[8px] border-[#0a0a0a]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full h-full p-6 parchment-bg flex flex-col relative m-0.5 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                
                <div className="relative z-10 flex-1 flex flex-col items-start text-left">
                  <div className="w-full flex justify-between items-start mb-4 border-b border-black/10 pb-3">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-hearth font-black text-[#3d2b1f] uppercase tracking-wider drop-shadow-sm leading-none">{card.name}</h3>
                      <p className="text-[10px] text-[#8b4513] uppercase font-black tracking-[0.2em] mt-1.5 engraved">{card.rarity}</p>
                    </div>
                  </div>

                  {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: Math.min(card.level, 12) }).map((_, i) => (
                        <Star key={i} size={10} className="fill-[#8b4513] text-[#8b4513] opacity-40 drop-shadow-sm" />
                      ))}
                    </div>
                  )}

                  <div className="space-y-6 w-full">
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#5d4037] uppercase font-black tracking-[0.4em] engraved">Classification</p>
                      <p className="text-md text-[#3d2b1f] font-black italic drop-shadow-sm">{card.race} / {card.cardType}</p>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="p-4 bg-black/[0.03] rounded-sm border border-black/5 min-h-[120px] shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12">
                           <Scroll size={60} className="text-[#3d2b1f]" />
                        </div>
                        <p className="text-xs text-[#4e342e] leading-relaxed font-black italic drop-shadow-sm relative z-10">"{card.description}"</p>
                      </div>
                    </div>

                    {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                      <div className="grid grid-cols-2 gap-5 mt-6">
                        <div className="bg-[#2a2a2a] p-4 rounded-sm border-b-[6px] border-black/60 flex justify-between items-center shadow-2xl active:translate-y-1 active:border-b-2 transition-all">
                          <Sword size={20} className="text-hearth-gold drop-shadow-md" />
                          <div className="text-right">
                            <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">ATK</p>
                            <p className="text-2xl text-white font-hearth font-black leading-none drop-shadow-md">{card.atk}</p>
                          </div>
                        </div>
                        {card.cardType !== 'Link Monster' && (
                          <div className="bg-[#2a2a2a] p-4 rounded-sm border-b-[6px] border-black/60 flex justify-between items-center shadow-2xl active:translate-y-1 active:border-b-2 transition-all">
                            <Shield size={20} className="text-white/60 drop-shadow-md" />
                            <div className="text-right">
                              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest">DEF</p>
                              <p className="text-2xl text-white font-hearth font-black leading-none drop-shadow-md">{card.def}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Chisel Mark Detail on Parchment */}
                <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10 border-b-2 border-r-2 border-[#3d2b1f]" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="mt-10 space-y-4"
          >
            <p className="text-hearth-gold text-[10px] uppercase tracking-[0.4em] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {isNew ? "A New Legend Manifests" : "Tap the Relic to Flip"}
            </p>
            
            <button className="btn-stone-gold w-full !py-4 shadow-[0_15px_30px_rgba(244,208,63,0.3)] !text-sm font-black tracking-widest" onClick={onClose}>
              {isNew ? "BIND TO COLLECTION" : "EXIT ARCHIVES"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
