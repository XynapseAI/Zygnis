import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { rollForCard } from '../utils/rng';
import { CardReveal } from '../components/CardReveal';

export const FusionScreen = () => {
  const { zyg, addZyg, addCard } = useStore();
  const [isFusing, setIsFusing] = useState(false);
  const [revealedCard, setRevealedCard] = useState<string | null>(null);

  const FUSION_COST = 500;

  const handleFusion = () => {
    if (zyg < FUSION_COST || isFusing) return;
    
    setIsFusing(true);
    addZyg(-FUSION_COST);

    // Fake animation delay
    setTimeout(() => {
      const cardId = rollForCard() || "KJV_COM_001"; // Guarantee a card, default to first common if rng fails
      addCard(cardId);
      setRevealedCard(cardId);
      setIsFusing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 flex flex-col items-center">
      <h1 className="text-lg text-yugi-gold mb-8 drop-shadow-md font-bold uppercase tracking-widest">Polymerization</h1>

      <div className="text-center mb-12">
        <p className="text-xs text-gray-400 mb-2">ZYG AVAILABLE:</p>
        <p className="text-2xl text-yugi-gold font-bold">{zyg}</p>
      </div>

      <div className="relative w-64 h-64 border-4 border-dashed border-yugi-purple rounded-full flex items-center justify-center mb-8 bg-black/30">
        {isFusing ? (
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-yugi-purple to-yugi-gold blur-md opacity-80"
          />
        ) : (
          <div className="text-center text-gray-500 text-xs px-8">
            Fuse {FUSION_COST} ZYG to conjure a new card!
          </div>
        )}
      </div>

      <button
        onClick={handleFusion}
        disabled={zyg < FUSION_COST || isFusing}
        className={`btn-pixel w-48 py-4 ${
          zyg < FUSION_COST ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'
        }`}
      >
        {isFusing ? 'FUSING...' : 'FUSE NOW'}
      </button>

      <CardReveal cardId={revealedCard} onClose={() => setRevealedCard(null)} />
    </div>
  );
};
