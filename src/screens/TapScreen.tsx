"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { rollForCard } from '../utils/rng';
import { CardReveal } from '../components/CardReveal';
import { Coins, Zap } from 'lucide-react';

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

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const id = Date.now();
    const drift = (Math.random() - 0.5) * 120;
    setFloatingPoints(prev => [...prev, { id, x: centerX, y: centerY, drift }]);

    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1500);

    addZyg(1);
    incrementTaps();

    const cardId = rollForCard();
    if (cardId) {
      addCard(cardId);
      setRevealedCard(cardId);
    }
  };

  const progress = (tapsToday / DAILY_LIMIT) * 100;
  const energy = DAILY_LIMIT - tapsToday;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-32 overflow-hidden relative">
      {/* Tavern Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,69,19,0.2)_0%,_transparent_70%)] pointer-events-none" />

      {/* Header Info - Meticulous Stone Slab (Right Aligned now) */}
      <div className="absolute top-4 md:top-10 w-full px-4 md:px-8 flex justify-end items-start z-20">
        <div className="stone-broken p-0.5 scale-85 md:scale-100 origin-top-right">
          <InfoBox icon={<Coins size={14} className="text-hearth-gold w-3 h-3 md:w-3.5 md:h-3.5" />} value={zyg.toLocaleString()} />
        </div>
      </div>

      {/* Header - Meticulous Stone Label */}
      <div className="text-center mt-16 md:mt-4 mb-6 md:mb-8 space-y-1 relative z-10 px-2">
        <div className="stone-broken inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1 md:py-1.5 bg-[#1a120d] border-[#3d2b1f] shadow-2xl mb-2 scale-90 md:scale-100">
          <Zap className="text-hearth-gold animate-pulse" size={12} />
          <span className="text-[8px] md:text-[9px] text-hearth-gold uppercase tracking-[0.3em] font-hearth font-black">Sacred Grounds</span>
        </div>
        <p className="text-[9px] md:text-[10px] text-[#8b6b4d] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-black engraved">
          Tap the Guardian to harness ancestral power.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative mb-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-hearth-gold/5 blur-[80px] rounded-full group-hover:bg-hearth-gold/10 transition-all duration-1000" />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTap}
            disabled={energy <= 0}
            className={`relative z-10 w-64 h-64 md:w-80 md:h-80 transition-all duration-500 ${energy <= 0 ? 'grayscale opacity-40 cursor-not-allowed' : 'hover:drop-shadow-[0_0_40px_rgba(244,208,63,0.3)]'}`}
          >
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <img src="/dragon.png" className={`w-full h-full object-cover transition-transform duration-1000 ${energy > 0 ? 'group-hover:scale-102' : ''}`} alt="Guardian" />
            </div>

            {energy <= 0 && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 backdrop-blur-sm rounded-full">
                <span className="text-xl font-hearth text-red-600 font-black drop-shadow-[0_4px_8px_rgba(0,0,0,1)] text-center uppercase tracking-widest">
                  ENERGY DEPLETED
                </span>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-sm px-6 relative z-10">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-[10px] font-hearth text-hearth-gold/70 uppercase tracking-[0.2em] font-bold">Remaining energy</span>
          <span className="text-[12px] font-black font-hearth text-hearth-gold">{energy} / {DAILY_LIMIT}</span>
        </div>
        <div className="w-full h-2.5 bg-[#0a0a0a] rounded-sm overflow-hidden border border-black/40 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(energy / DAILY_LIMIT) * 100}%` }}
            className="h-full bg-gradient-to-r from-orange-950 via-orange-800 to-hearth-gold shadow-[0_0_10px_rgba(244,208,63,0.3)]"
          />
        </div>
      </div>

      {/* Floating Points */}
      <AnimatePresence>
        {floatingPoints.map(point => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: point.y - 40, x: point.x, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: point.y - 150,
              x: point.x + point.drift,
              scale: [1, 3, 2.5, 2],
              rotate: [0, point.drift / 4, point.drift / 2],
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 text-hearth-gold text-sm font-hearth pointer-events-none z-50 font-black flex items-center justify-center gap-1"
            style={{
              textShadow: '0 0 30px rgba(244,208,63,0.9), 0 8px 16px rgba(0,0,0,1)',
              marginLeft: '-15px',
              marginTop: '-10px'
            }}
          >
            <Zap size={10} className="fill-hearth-gold stroke-black stroke-2" />
            +1
          </motion.div>
        ))}
      </AnimatePresence>

      <CardReveal cardId={revealedCard} onClose={() => setRevealedCard(null)} />
    </div>
  );
};

const InfoBox = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="bg-[#1a120d] border-2 border-[#3d2b1f] px-2 py-1 md:px-3 md:py-2 rounded-sm flex items-center gap-2 md:gap-3 shadow-inner">
    <div className="bg-black/50 p-1 md:p-1.5 rounded-md shadow-inner border border-white/5">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[7px] md:text-[8px] text-[#8b6b4d] font-black uppercase tracking-widest engraved">ZYG</span>
      <span className="text-sm md:text-base font-bold text-white font-hearth tracking-wider drop-shadow-md leading-none">{value}</span>
    </div>
  </div>
);