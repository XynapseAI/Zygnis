"use client";
import { useStore } from '../store/useStore';
import { allCards } from '../utils/cards';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  User as UserIcon,
  Wallet,
  Zap,
  Layers,
  Trophy,
  LogOut,
  ChevronRight,
  X,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileScreen = () => {
  const { zyg, inventory, tapsToday, syncWithServer } = useStore();
  const { data: session, status } = useSession();
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const totalCards = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const uniqueCards = inventory.length;
  const completionPercentage = Math.round((uniqueCards / allCards.length) * 100);
  const level = Math.floor(zyg / 1000) + 1;

  useEffect(() => {
    if (status === 'authenticated') {
      syncWithServer();
    }
  }, [status]);

  const handleLogin = () => signIn('google');
  const handleLogout = () => signOut();

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const getConnectorName = (connector: any) => {
    if (connector.id === 'coinbaseWalletSDK') return 'Base Account';
    if (connector.id === 'io.metamask' || connector.name.toLowerCase().includes('metamask')) return 'MetaMask';
    if (connector.id === 'injected') return 'Browser Wallet';
    return connector.name;
  };

  return (
    <div className="h-full p-4 pb-20 overflow-y-auto max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col items-center pt-2 pb-2 relative">
          <div className="relative group">
            <div className="w-14 h-14 rounded-sm p-1 bg-[#2a2a2a] border-[3px] border-[#1a1a1a] shadow-[0_15px_30px_rgba(0,0,0,1)] legendary-border group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-sm bg-[#0a0a0a] overflow-hidden flex items-center justify-center border-2 border-black/80 shadow-inner">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={28} className="text-[#3d2b1f] opacity-40" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 stone-broken bg-hearth-gold text-[#1a120d] text-[8px] font-hearth font-black px-2 py-0.5 border-[2px] border-[#1a120d] shadow-xl z-10">
              LV.{level}
            </div>
          </div>
          <h1 className="mt-2 text-lg font-hearth font-black tracking-tight text-white drop-shadow-lg uppercase tracking-[0.1em]">
            {session?.user?.name || 'GUEST DUELIST'}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 opacity-60">
            <ShieldCheck size={10} className="text-hearth-gold" />
            <span className="text-[8px] text-hearth-gold uppercase font-black tracking-[0.2em] engraved">Vanguard Seeker</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatBox icon={<Zap size={14} className="text-hearth-gold fill-hearth-gold/20" />} label="ZYG" value={zyg.toLocaleString()} subText="Total Energy" />
          <StatBox icon={<Trophy size={14} className="text-orange-600" />} label="Today" value={`${tapsToday}/200`} subText="Daily Limit" />
          <StatBox icon={<Layers size={14} className="text-purple-600" />} label="Cards" value={totalCards} subText="Vessels Owned" />
          <StatBox icon={<Globe size={14} className="text-green-600" />} label="Process" value={`${completionPercentage}%`} subText="Collection" />
        </div>

        <div className="relative pt-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[92%] h-4 bg-[#8b4513] rounded-full border-[3px] border-[#3d2b1f] shadow-2xl z-20" />
          <div className="parchment-bg p-4 pt-6 shadow-[0_25px_50px_rgba(0,0,0,0.8)] border-x-[6px] border-[#8b4513]/20">
            {!session ? (
              <div className="text-center py-2">
                <p className="text-[10px] text-[#2a1d15] mb-4 font-black leading-relaxed italic drop-shadow-sm px-4">"Login to preserve your data."</p>
                <button onClick={handleLogin} className="btn-stone-gold w-full !py-2.5 text-[10px] flex items-center justify-center gap-3">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
                  CONNECT GOOGLE
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-sm bg-black/10 border border-black/5 shadow-inner flex justify-between items-center group">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-[#8b4513] uppercase font-black tracking-[0.3em] engraved">Email:</span>
                  <span className="text-[11px] text-[#2a1d15] font-black truncate max-w-[180px]">{session.user?.email}</span>
                </div>
                <button onClick={handleLogout} className="text-red-950 opacity-40 hover:opacity-100"><LogOut size={16} /></button>
              </div>
            )}
          </div>
        </div>

        <div className="stone-broken p-4 bg-[#1a120d] border-[#3d2b1f]/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-950/30 rounded-sm border border-indigo-500/20 shadow-inner">
              <Wallet size={16} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-hearth font-black text-white uppercase tracking-[0.2em]">On-Chain Identity</h3>
              <p className="text-[8px] text-[#8b6b4d] uppercase font-black tracking-[0.4em] engraved">Portal Bridge</p>
            </div>
          </div>
          <div className="space-y-3">
            {isConnected && address ? (
              <div className="p-3 rounded-sm bg-black/30 border border-indigo-900/30 flex items-center justify-between shadow-inner">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-indigo-400 uppercase font-black tracking-[0.3em] engraved">Wallet Address</span>
                  <span className="text-[11px] text-white font-mono font-black tracking-tight">{truncateAddress(address)}</span>
                </div>
                <button onClick={() => disconnect()} className="text-indigo-400 opacity-40 hover:opacity-100"><LogOut size={16} /></button>
              </div>
            ) : (
              <button onClick={() => setShowWalletOptions(true)} className="btn-stone-chipped w-full !py-2.5 text-[10px] !bg-indigo-950/80 !text-indigo-100">
                SYNC WEB3 WALLET
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWalletOptions && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
              className="stone-broken w-full max-w-sm relative p-6 border-[12px] border-[#1a1a1a] bg-[#2a2a2a]"
            >
              <button onClick={() => setShowWalletOptions(false)} className="absolute top-6 right-6 text-[#8b6b4d] hover:text-white transition-all"><X size={24} /></button>
              <h3 className="text-xl font-hearth font-black text-hearth-gold mb-2 text-center uppercase tracking-[0.2em]">CONNECT WALLET</h3>
              <div className="space-y-4 mt-8">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => { connect({ connector }); setShowWalletOptions(false); }}
                    className="w-full rounded-xl bg-[#1a120d] border-[2px] border-[#3d2b1f] hover:border-hearth-gold transition-all flex items-center justify-between group shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-black/50 flex items-center justify-center border border-white/5"><Wallet size={20} className="text-indigo-400" /></div>
                      <span className="text-xs font-black text-white/90 font-hearth uppercase tracking-[0.15em]">{getConnectorName(connector)}</span>
                    </div>
                    <ChevronRight size={20} className="text-[#3d2b1f] group-hover:text-hearth-gold transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatBox = ({ icon, label, value, subText }: { icon: React.ReactNode; label: string; value: string | number; subText: string }) => (
  <div className="stone-broken !p-2 bg-[#1a120d] border-[#3d2b1f] border-2 flex items-center gap-2 group h-12 transition-all hover:bg-[#211812] shadow-xl">
    <div className="w-8 h-8 flex-shrink-0 rounded-sm bg-black/40 flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5">
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1">
        <span className="text-[8px] text-white/80 font-hearth font-black uppercase tracking-tight truncate">{label}</span>
        <span className="text-[10px] font-hearth font-black text-hearth-gold tracking-tighter truncate">{value}</span>
      </div>
      <span className="text-[7px] text-[#8b6b4d] font-black uppercase opacity-60 tracking-widest italic engraved truncate">{subText}</span>
    </div>
  </div>
);