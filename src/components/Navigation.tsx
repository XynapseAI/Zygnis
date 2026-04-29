"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Sparkles, User, Menu, X, Flame, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { to: "/", icon: <Home size={18} />, label: "Tap" },
    { to: "/collection", icon: <Layers size={18} />, label: "Cards" },
    { to: "/fusion", icon: <Sparkles size={18} />, label: "Fusion" },
    { to: "/burn", icon: <Flame size={18} />, label: "Burn" },
    { to: "/ranking", icon: <Trophy size={18} />, label: "Rank" },
    { to: "/profile", icon: <User size={18} />, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-yugi-dark/95 backdrop-blur-md border-t-2 border-yugi-gold p-1 z-50">
        <ul className="flex justify-around items-center w-full">
          {navItems.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </ul>
      </nav>

      {/* PC Menu Toggle Button */}
      <div className="hidden md:block fixed top-6 left-6 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-yugi-dark border-2 border-yugi-gold p-2 rounded-lg text-yugi-gold shadow-[0_0_10px_rgba(255,215,0,0.2)] hover:scale-105 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* PC Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-yugi-dark/95 backdrop-blur-xl border-r-2 border-yugi-gold z-[90] flex-col p-8 pt-24 shadow-2xl"
          >
            <div className="space-y-6">
              {navItems.map(item => {
                const isActive = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-yugi-gold text-black font-bold shadow-[0_0_20px_rgba(255,215,0,0.4)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <span className="uppercase tracking-widest text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const pathname = usePathname();
  const isActive = pathname === to;

  return (
    <li>
      <Link
        href={to}
        className={`flex flex-col items-center p-1.5 text-xs transition-colors ${
          isActive ? 'text-yugi-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {icon}
        <span className="mt-0.5 text-[8px] uppercase tracking-wider font-bold">{label}</span>
      </Link>
    </li>
  );
};

