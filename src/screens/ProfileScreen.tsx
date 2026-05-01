import { useStore } from '../store/useStore';
import { allCards } from '../utils/cards';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { 
  User as UserIcon, 
  Mail, 
  Wallet, 
  Zap, 
  Layers, 
  Trophy, 
  LogOut, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileScreen = () => {
  const { zyg, inventory, tapsToday, syncWithServer, loadUserData } = useStore();
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

  useEffect(() => {
    if (isConnected && address && status === 'authenticated') {
      const linkWallet = async () => {
        try {
          await fetch('/api/user/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address }),
          });
        } catch (error) {
          console.error('Failed to link wallet:', error);
        }
      };
      linkWallet();
    }
  }, [isConnected, address, status]);

  const handleLogin = () => signIn('google');
  const handleLogout = () => signOut();

  const truncateAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const getConnectorName = (connector: any) => {
    if (connector.id === 'coinbaseWalletSDK') return 'Base Account';
    if (connector.id === 'io.metamask' || connector.name.toLowerCase().includes('metamask')) return 'MetaMask';
    if (connector.id === 'injected') return 'Browser Wallet';
    return connector.name;
  };

  return (
    <div className="min-h-screen bg-yugi-dark p-3 pb-20 overflow-y-auto font-pixel">
      <div className="max-w-md mx-auto space-y-3">
        
        {/* Header / Avatar Section */}
        <div className="flex flex-col items-center py-2">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full border-2 border-yugi-gold p-0.5 shadow-[0_0_15px_rgba(255,215,0,0.2)] bg-gray-900 overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-yugi-purple/20">
                  <UserIcon size={24} className="text-yugi-gold opacity-50" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yugi-gold text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-yugi-dark">
              LV {level}
            </div>
          </div>
          <h1 className="mt-2 text-md font-bold text-white tracking-wide leading-tight">
            {session?.user?.name || 'Guest Duelist'}
          </h1>
          <p className="text-[8px] text-gray-500 uppercase tracking-widest">
            Legendary Duelist
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard icon={<Zap size={10} className="text-blue-400" />} label="ZYG" value={zyg} />
          <StatCard icon={<Trophy size={10} className="text-yugi-gold" />} label="Taps" value={`${tapsToday}/200`} />
          <StatCard icon={<Layers size={10} className="text-purple-400" />} label="Cards" value={totalCards} />
          <StatCard icon={<RefreshCw size={10} className="text-green-400" />} label="Prog" value={`${completionPercentage}%`} />
        </div>

        {/* Account Section */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
            <Mail size={14} className="text-yugi-gold" />
            <span className="text-[10px] font-bold text-gray-200">Account</span>
          </div>
          <div className="p-3">
            {!session ? (
              <div className="space-y-2">
                <p className="text-[8px] text-gray-400">
                  Sign in to secure your progress.
                </p>
                <button 
                  onClick={handleLogin} 
                  className="w-full py-2 bg-white text-black text-[9px] font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-2.5 h-2.5" alt="G" />
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-500 uppercase">Email</span>
                    <span className="text-[9px] text-white truncate max-w-[150px]">{session?.user?.email}</span>
                  </div>
                  <div className="bg-green-500/20 text-green-400 text-[7px] px-1.5 py-0.5 rounded-full border border-green-500/30">
                    OK
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => syncWithServer()} 
                    className="py-2 bg-yugi-purple/20 border border-yugi-purple/50 text-white text-[8px] font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={10} />
                    Sync
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={10} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Web3 Wallet Section */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg">
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
            <Wallet size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold text-gray-200">Web3</span>
          </div>
          <div className="p-3">
            {isConnected && address ? (
              <div className="space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-blue-400 uppercase font-bold tracking-tight">Connected</span>
                    <span className="text-[9px] text-white font-mono">{truncateAddress(address)}</span>
                  </div>
                  <ExternalLink size={10} className="text-gray-500" />
                </div>
                <button 
                  onClick={() => disconnect()} 
                  className="w-full py-2 bg-gray-800 border border-white/5 text-gray-400 text-[8px] font-bold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <LogOut size={10} />
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[8px] text-gray-400 leading-tight">
                  Connect your wallet to earn on-chain rewards!
                </p>
                <button 
                  onClick={() => setShowWalletOptions(true)}
                  className="w-full py-2 bg-blue-600 text-white text-[9px] font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                >
                  <Wallet size={10} />
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Options Modal */}
      <AnimatePresence>
        {showWalletOptions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-yugi-dark border-2 border-yugi-gold p-6 rounded-2xl w-full max-w-xs relative shadow-2xl"
            >
              <button 
                onClick={() => setShowWalletOptions(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-sm text-yugi-gold mb-6 uppercase tracking-widest text-center">Select Wallet</h3>
              
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button 
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                      setShowWalletOptions(false);
                    }}
                    className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[10px] font-bold flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      {getConnectorName(connector)}
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
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

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 p-2 rounded-xl flex flex-col items-center justify-center text-center shadow-md hover:border-yugi-gold/30 transition-all group">
    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter">{label}</span>
    <span className="text-[10px] text-white font-bold">{value}</span>
  </div>
);


