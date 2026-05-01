"use client";
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface RankingUser {
  id: string;
  name: string | null;
  image: string | null;
  zyg: number;
}

export const RankingScreen = () => {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/ranking');
        if (response.ok) {
          const data = await response.json();
          setRankings(data);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-pixel text-yugi-gold animate-pulse">
        Fetching Legends...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 font-pixel">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Crown className="text-yugi-gold" size={20} />
        <h1 className="text-lg text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] font-bold">Hall of ZYG</h1>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {rankings.map((user, index) => {
          const isTop3 = index < 3;
          const rankColors = [
            'border-yugi-gold bg-yugi-gold/10',
            'border-gray-400 bg-gray-400/10',
            'border-orange-600 bg-orange-600/10'
          ];

          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={user.id}
              className={`flex items-center p-3 rounded-xl border-2 ${
                isTop3 ? rankColors[index] : 'border-white/5 bg-white/5'
              } transition-transform active:scale-95`}
            >
              {/* Rank Icon/Number */}
              <div className="w-10 flex justify-center items-center">
                {index === 0 && <Crown className="text-yugi-gold" size={20} />}
                {index === 1 && <Medal className="text-gray-400" size={20} />}
                {index === 2 && <Medal className="text-orange-600" size={20} />}
                {index > 2 && <span className="text-xs text-gray-500">#{index + 1}</span>}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-gray-900 mr-3">
                {user.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                    ?
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className={`text-[10px] uppercase truncate max-w-[120px] ${isTop3 ? 'text-white' : 'text-gray-400'}`}>
                  {user.name || 'Anonymous'}
                </p>
              </div>

              {/* ZYG Score */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                <Zap size={10} className="text-yugi-gold" />
                <span className="text-[10px] text-yugi-gold font-bold">{user.zyg}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
