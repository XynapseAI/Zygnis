"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCardById, getCardImage } from '../utils/cards';

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", damping: 15, duration: 0.8 }}
            className="relative w-[300px] aspect-[5/7] mx-auto cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front: Full Image */}
            <div 
              className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.4)]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img 
                src={cardImageUrl} 
                alt={card.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Back: Details */}
            <div 
              className="absolute inset-0 bg-yugi-dark rounded-xl shadow-[0_0_40px_rgba(255,215,0,0.4)] overflow-hidden border-2 border-yugi-gold"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full h-full p-4 flex flex-col relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yugi-gold rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yugi-gold rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yugi-gold rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yugi-gold rounded-br-lg" />

                <div className="text-left flex-1 flex flex-col z-10">
                  <h3 className="text-sm font-bold text-yugi-gold uppercase tracking-wider">{card.name}</h3>
                  
                  {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                    <div className="flex my-2">
                      {card.cardType === 'Xyz Monster' ? (
                        Array.from({ length: card.level }).map((_, i) => <span key={i} className="text-gray-400 text-[10px]">⭐</span>)
                      ) : card.cardType === 'Link Monster' ? (
                        <span className="text-blue-400 text-[10px] font-bold">LINK-{card.level}</span>
                      ) : (
                        Array.from({ length: card.level }).map((_, i) => <span key={i} className="text-yellow-500 text-[10px]">⭐</span>)
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">[{card.race} / {card.cardType}]</p>
                  </div>

                  <div className="mt-4 p-2 bg-black/40 rounded border border-white/10 flex-1 overflow-y-auto custom-scrollbar">
                    <p className="text-[9px] text-gray-300 leading-relaxed italic">
                      {card.description}
                    </p>
                  </div>
                  
                  {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="bg-black/60 p-2 rounded border border-red-900/50 flex justify-between items-center">
                        <span className="text-[8px] text-gray-500 uppercase font-bold">ATK</span>
                        <span className="text-xs text-red-400 font-bold tracking-widest">{card.atk}</span>
                      </div>
                      {card.cardType !== 'Link Monster' && (
                        <div className="bg-black/60 p-2 rounded border border-blue-900/50 flex justify-between items-center">
                          <span className="text-[8px] text-gray-500 uppercase font-bold">DEF</span>
                          <span className="text-xs text-blue-400 font-bold tracking-widest">{card.def}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <p className="text-yugi-gold text-xs animate-pulse mb-4">
              {isNew ? `You found a ${card.rarity} card!` : "Tap the card to flip"}
            </p>
            <button className="btn-pixel text-xs" onClick={onClose}>
              {isNew ? "Awesome!" : "Close"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
