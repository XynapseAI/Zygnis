"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Layers,
  Flame,
  User,
  Menu,
  X,
  Trophy,
  Hammer,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'TAP', icon: Zap, path: '/' },
  { name: 'CARDS', icon: Layers, path: '/collection' },
  { name: 'FORGE', icon: Hammer, path: '/mint' },
  { name: 'BURN', icon: Flame, path: '/burn' },
  { name: 'FUSE', icon: Sparkles, path: '/fusion' },
  { name: 'RANK', icon: Trophy, path: '/ranking' },
  { name: 'PROFILE', icon: User, path: '/profile' },
];

export const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* PC Burger Menu Toggle - Meticulous Chipped Style */}
      <div className="hidden md:block fixed top-6 left-6 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-stone-chipped !p-2.5 !bg-[#2a1d15] text-hearth-gold shadow-2xl hover:scale-110 active:scale-95 transition-all border-[#3d2b1f] border-2"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Floating Bottom Nav - Meticulous Broken Plank Style */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xl">
        <nav className="stone-broken !bg-[#1a120d] border-[4px] border-[#0a0a0a] flex items-center justify-around px-3 py-2 md:py-3 shadow-[0_20px_60px_rgba(0,0,0,1)] relative">
          {/* Decorative Corner Screws */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-black shadow-inner border border-white/10" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-black shadow-inner border border-white/10" />
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-black shadow-inner border border-white/10" />
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-black shadow-inner border border-white/10" />

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`relative flex flex-col items-center gap-1 group transition-all duration-500 ${isActive ? 'text-hearth-gold scale-105' : 'text-[#8b6b4d] hover:text-[#f0e6d2]'
                  }`}
              >
                <div className={`p-1.5 md:p-2 rounded-sm transition-all duration-500 ${isActive ? 'bg-[#2a1d15] shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)] border border-hearth-gold/20' : ''}`}>
                  <Icon size={isActive ? 18 : 16} className={`${isActive ? 'drop-shadow-[0_0_8px_rgba(244,208,63,0.5)]' : ''}`} />
                </div>
                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] font-hearth drop-shadow-md ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow-hearth"
                    className="absolute -bottom-1 w-full h-0.5 bg-hearth-gold shadow-[0_0_15px_#f4d03f]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[80] hidden md:block"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed top-0 left-0 h-full w-64 stone-broken !bg-[#1a120d] border-r-[8px] border-[#0a0a0a] z-[90] p-8 pt-24 hidden md:block shadow-[30px_0_70px_rgba(0,0,0,1)]"
            >
              {/* Wooden Grain & Chisel Marks */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />
              <div className="absolute inset-0 pointer-events-none chisel-mark opacity-30" />

              <div className="relative space-y-6">
                <div className="mb-12 px-4 text-center border-b-[2px] border-black/20 pb-8">
                  <h2 className="text-3xl font-hearth text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] tracking-[0.1em] font-black uppercase">ZYGNIS</h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-[1px] flex-1 bg-hearth-gold/20" />
                    <p className="text-[9px] text-[#8b6b4d] uppercase tracking-[0.3em] font-black engraved">Tavern Master</p>
                    <div className="h-[1px] flex-1 bg-hearth-gold/20" />
                  </div>
                </div>

                <div className="space-y-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all duration-500 border-2 shadow-xl ${isActive
                          ? 'bg-[#2a1d15] border-hearth-gold text-hearth-gold scale-105 z-10'
                          : 'bg-black/10 border-transparent text-[#8b6b4d] hover:bg-black/30 hover:text-[#f0e6d2] hover:translate-x-2'
                          }`}
                      >
                        <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(244,208,63,0.5)]' : ''} />
                        <span className="text-xs font-black uppercase tracking-[0.15em] font-hearth">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Decorative Corner Detail */}
              <div className="absolute bottom-12 left-8 opacity-5 rotate-12">
                <Zap size={100} className="text-hearth-gold" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};