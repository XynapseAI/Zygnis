import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { rollForCard } from '../utils/rng';
import { CardReveal } from '../components/CardReveal';

export const TapScreen = () => {
  const { zyg, tapsToday, addZyg, incrementTaps, addCard, checkAndResetDaily } = useStore();
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; x: number; y: number; drift: number }[]>([]);
  const [revealedCard, setRevealedCard] = useState<string | null>(null);

  const DAILY_LIMIT = 200;

  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (tapsToday >= DAILY_LIMIT) return;

    // Get coordinates for floating point animation
    let clientX = 0;
    let clientY = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const id = Date.now();
    const drift = (Math.random() - 0.5) * 40; // Random horizontal drift
    setFloatingPoints(prev => [...prev, { id, x: window.innerWidth / 2, y: window.innerHeight / 2, drift }]);
    
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1000);

    // Logic
    addZyg(1);
    incrementTaps();

    // Roll for card
    const cardId = rollForCard();
    if (cardId) {
      addCard(cardId);
      setRevealedCard(cardId);
    }
  };

  const progress = (tapsToday / DAILY_LIMIT) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-24">
      {/* Header Stats */}
      <div className="absolute top-8 w-full px-4 flex justify-end items-center gap-2">
        <div className="bg-black/50 border-2 border-yugi-gold p-2 rounded text-[10px]">
          <span className="text-gray-400">ZYG: </span>
          <span className="text-yugi-gold">{zyg}</span>
        </div>
        <div className="bg-black/50 border-2 border-yugi-gold p-2 rounded text-[10px]">
          <span className="text-gray-400">TAPS: </span>
          <span className={tapsToday >= DAILY_LIMIT ? "text-red-500" : "text-green-400"}>
            {tapsToday}/{DAILY_LIMIT}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-20 w-full px-4">
        <div className="w-full h-2 bg-black/50 border border-yugi-gold rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-yugi-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Tap Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleTap}
        disabled={tapsToday >= DAILY_LIMIT}
        className={`relative w-64 h-64 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500
          ${tapsToday >= DAILY_LIMIT 
            ? 'grayscale opacity-80 shadow-none' 
            : 'shadow-[0_0_80px_rgba(100,149,237,0.5)] hover:shadow-[0_0_120px_rgba(100,149,237,0.8)] bg-gradient-to-br from-blue-900/40 to-black'}`}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
        <img 
          src="/dragon.png" 
          alt="Tap Dragon" 
          className={`w-full h-full object-cover z-10 ${tapsToday >= DAILY_LIMIT ? 'opacity-50' : ''}`}
        />
        {tapsToday >= DAILY_LIMIT && (
          <span className="absolute text-xl text-red-500 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,1)] z-20 bg-black/70 px-4 py-2 rounded-xl text-center leading-tight">
            LIMIT<br/>REACHED
          </span>
        )}
      </motion.button>

      {/* Floating Points */}
      <AnimatePresence>
        {floatingPoints.map(point => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.8, y: point.y - 20, x: point.x - 20, scale: 0.8, filter: 'blur(0px)' }}
            animate={{ 
              opacity: 0, 
              y: point.y - 120, 
              x: point.x - 20 + point.drift,
              scale: 1.5,
              filter: 'blur(4px)'
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className="fixed text-white text-xl pointer-events-none z-50 font-bold drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
          >
            +1
          </motion.div>
        ))}
      </AnimatePresence>

      <CardReveal cardId={revealedCard} onClose={() => setRevealedCard(null)} />
    </div>
  );
};
