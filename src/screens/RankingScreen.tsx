"use client";
import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const MAX_PAGES = 10; // Top 100

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
      <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
        <div className="w-16 h-16 border-[6px] border-[#1a120d] border-t-hearth-gold rounded-full animate-spin shadow-[0_20px_40px_rgba(0,0,0,1)]" />
        <p className="text-sm text-hearth-gold uppercase tracking-[0.4em] font-hearth font-black drop-shadow-xl animate-pulse">Reading the Hall...</p>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.min(Math.ceil(rankings.length / ITEMS_PER_PAGE), MAX_PAGES) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // Get only top 100, then slice for current page
  const displayedRankings = rankings.slice(0, ITEMS_PER_PAGE * MAX_PAGES).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="min-h-screen p-4 pb-32 max-w-xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="text-center mt-4 mb-6 space-y-2 px-2">
        <div className="stone-broken inline-flex items-center gap-3 px-5 py-1.5 bg-[#1a120d] border-[#3d2b1f] shadow-2xl mb-2">
          <Trophy className="text-hearth-gold animate-bounce" size={14} />
          <span className="text-[9px] text-hearth-gold uppercase tracking-[0.4em] font-hearth font-black">Legendary Heroes</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-hearth font-black text-white tracking-[0.15em] drop-shadow-[0_6px_12px_rgba(0,0,0,1)] uppercase">Hall of Fame</h1>
        <p className="text-[10px] text-[#8b6b4d] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-black engraved italic">
          Honoring those who reached the pinnacle.
        </p>
      </div>

      {/* Ranking List */}
      <div className="relative pt-4">
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[92%] h-6 bg-[#5d2e0a] rounded-full border-[4px] border-[#1a120d] shadow-[0_15px_30px_rgba(0,0,0,0.9)] z-20" />

        <div className="parchment-bg p-2 md:p-4 rounded-sm shadow-[0_40px_80px_rgba(0,0,0,1)] border-x-[8px] border-[#8b4513]/20 relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="relative z-10 space-y-1.5 py-3 px-1 md:px-2 flex-1">
            {displayedRankings.map((user, index) => {
              // Calculate global rank
              const rank = startIndex + index + 1;
              const isTop3 = rank <= 3;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={user.id}
                  className={`flex items-center p-1.5 md:p-2 border-b border-black/10 last:border-0 transition-all duration-500 hover:bg-black/5 rounded-sm ${isTop3 ? 'bg-[#2a1d15]/5 shadow-inner' : ''
                    }`}
                >
                  {/* Rank Icon / Number */}
                  <div className="w-8 md:w-10 flex justify-center items-center flex-shrink-0">
                    {rank === 1 && <Crown className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" size={20} />}
                    {rank === 2 && <Medal className="text-gray-400 drop-shadow-md" size={16} />}
                    {rank === 3 && <Medal className="text-orange-800 drop-shadow-md" size={16} />}
                    {rank > 3 && <span className="text-xs font-hearth font-black text-[#5d4037] opacity-60">#{rank}</span>}
                  </div>

                  {/* Avatar & Info */}
                  <div className="flex items-center flex-1 ml-2 min-w-0">
                    <div className={`relative flex-shrink-0 rounded-sm p-0.5 shadow-xl transition-transform duration-500 hover:scale-105 ${isTop3 ? 'w-9 h-9 bg-[#2a1d15] border-[2px] border-[#8b4513] legendary-border' : 'w-7 h-7 bg-[#1a120d]'
                      }`}>
                      <div className="w-full h-full rounded-sm bg-black/80 overflow-hidden flex items-center justify-center border border-black/40 shadow-inner">
                        {user.image ? (
                          <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Shield size={14} className="text-[#3d2b1f] opacity-40" />
                        )}
                      </div>
                    </div>

                    <div className="ml-2 md:ml-3 flex flex-col justify-center min-w-0">
                      <p className={`text-[11px] md:text-sm font-hearth font-black uppercase tracking-[0.05em] truncate drop-shadow-md ${isTop3 ? 'text-[#2a1d15]' : 'text-[#4e342e]'
                        }`}>
                        {user.name || 'UNKNOWN HERO'}
                      </p>
                      <div className="flex items-center gap-1.5 opacity-70">
                        <span className="text-[7px] text-[#8b4513] uppercase font-black tracking-[0.2em] engraved truncate">
                          Level {Math.floor(user.zyg / 1000) + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className={`px-2 py-1 rounded-sm flex flex-col items-end flex-shrink-0 min-w-[60px] shadow-inner border transition-all duration-500 ${isTop3 ? 'bg-[#2a1d15] text-hearth-gold border-hearth-gold/20' : 'bg-black/5 text-[#3d2b1f] border-transparent'
                    }`}>
                    <span className="text-[6px] font-black uppercase tracking-[0.2em] engraved opacity-50">ESSENCE</span>
                    <span className="text-xs md:text-sm font-hearth font-black tracking-[0.05em] drop-shadow-md">{user.zyg.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 pt-4 border-t-2 border-[#8b4513]/10 flex items-center justify-between px-2 relative z-10 pb-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-sm flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all
                  ${currentPage === 1 ? 'opacity-40 cursor-not-allowed text-[#5d4037]' : 'text-[#8b4513] hover:bg-[#8b4513]/10 hover:text-[#2a1d15]'}`}
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="text-[10px] font-black text-[#5d4037] tracking-[0.2em] engraved">
                PAGE {currentPage} OF {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-sm flex items-center gap-1 text-[9px] font-black uppercase tracking-wider transition-all
                  ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed text-[#5d4037]' : 'text-[#8b4513] hover:bg-[#8b4513]/10 hover:text-[#2a1d15]'}`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Bottom Decorative Bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92%] h-4 bg-[#3d2b1f] rounded-t-full border-t-[3px] border-[#1a120d] opacity-60" />
        </div>
      </div>
    </div>
  );
};