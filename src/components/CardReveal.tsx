"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cardsData from '../data/cards.json';

interface CardRevealProps {
  cardId: string | null;
  onClose: () => void;
  isNew?: boolean;
}

export const CardReveal = ({ cardId, onClose, isNew = true }: CardRevealProps) => {
  const card = cardsData.find(c => c.id === cardId);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;

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
            className="relative w-64 h-96 mx-auto cursor-pointer"
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front: Full Image */}
            <div 
              className="absolute inset-0 bg-yugi-gold rounded-xl p-2 shadow-[0_0_30px_rgba(255,215,0,0.5)]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full h-full object-cover rounded-lg border-2 border-[#8b6508]"
              />
            </div>

            {/* Back: Details */}
            <div 
              className="absolute inset-0 bg-yugi-gold rounded-xl p-2 shadow-[0_0_30px_rgba(255,215,0,0.5)]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full h-full bg-yugi-dark rounded-lg p-4 flex flex-col border-2 border-[#8b6508]">
                <div className="text-left flex-1 flex flex-col">
                  <h3 className="text-sm text-yugi-gold uppercase">{card.name}</h3>
                  
                  {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                    <div className="flex my-2">
                      {card.cardType === 'Xyz Monster' ? (
                        Array.from({ length: card.level }).map((_, i) => <span key={i} className="text-gray-400 text-xs">⭐</span>)
                      ) : card.cardType === 'Link Monster' ? (
                        <span className="text-blue-400 text-xs font-bold">LINK-{card.level}</span>
                      ) : (
                        Array.from({ length: card.level }).map((_, i) => <span key={i} className="text-yellow-500 text-xs">⭐</span>)
                      )}
                    </div>
                  )}
                  
                  <p className="text-[10px] text-gray-400 mt-2">[{card.race} / {card.cardType}]</p>
                  <div className="text-[10px] mt-4 leading-relaxed flex-1 overflow-y-auto pr-1">
                    {card.description}
                  </div>
                  
                  {card.cardType !== 'Spell Card' && card.cardType !== 'Trap Card' && (
                    <div className="flex justify-between mt-4 text-[10px] bg-black/50 p-2 rounded border border-[#8b6508]">
                      <span className="text-red-400 font-bold">ATK {card.atk}</span>
                      {card.cardType !== 'Link Monster' && (
                        <span className="text-blue-400 font-bold">DEF {card.def}</span>
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
