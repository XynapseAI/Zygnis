"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { Sparkles, Shield, Wallet, Zap, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction
} from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

// NFT Contract Address (Placeholder for user to replace)
const NFT_CONTRACT_ADDRESS = "0x385f49ef823Ea58E0a45BBFAa579f11C7578703B";
// Base Builder Code: bc_8kd8fkpm
const BUILDER_CODE = "bc_8kd8fkpm";

export const MintScreen = () => {
  const { zyg, inventory, addZyg } = useStore();
  const { address, isConnected } = useAccount();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const MINT_FEE = 10;

  const inventoryCards = inventory.map(item => {
    const details = allCards.find(c => c.id === item.cardId);
    return {
      ...item,
      details: details ? { ...details, imageUrl: getCardImage(details.id) } : null
    };
  }).filter(item => item.details);

  const selectedCard = inventoryCards.find(i => i.cardId === selectedCardId);

  // ABI for a standard mint function
  const abi = [
    {
      name: 'mint',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'tokenURI', type: 'string' },
        { name: 'builderCode', type: 'string' } // Assuming the contract accepts builder code
      ],
      outputs: [],
    },
  ] as const;

  const handleMintSuccess = () => {
    // Deduct ZYG on successful mint
    addZyg(-MINT_FEE);
    // In a real app, we might want to mark the card as 'minted' in the DB
    setIsMinting(false);
    setSelectedCardId(null);
  };

  const calls = selectedCardId ? [
    {
      address: NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: 'mint',
      args: [
        address as `0x${string}`,
        `${window.location.origin}/api/nft/${selectedCardId}`,
        BUILDER_CODE
      ],
    },
  ] : [];

  return (
    <div className="min-h-screen bg-yugi-dark p-4 pb-24 font-pixel max-w-4xl mx-auto overflow-y-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-yugi-purple/20 border border-yugi-purple/50 rounded-full mb-4">
          <Sparkles className="text-yugi-gold animate-pulse" size={12} />
          <span className="text-[9px] text-yugi-gold uppercase tracking-widest font-bold">NFT Forge</span>
        </div>
        <h1 className="text-lg text-white font-bold drop-shadow-md mb-1">On-Chain Ascension</h1>
        <p className="text-[9px] text-gray-400 max-w-md mx-auto">
          Transform your digital collection into permanent, tradable assets on the Base network.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: Card Preview & Minting Info */}
        <div className="space-y-6 order-2 md:order-1">
          <div className="bg-gray-900/40 backdrop-blur-md border-2 border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield size={80} className="text-yugi-gold" />
            </div>

            <div className="relative z-10">
              <h2 className="text-sm text-yugi-gold uppercase mb-6 flex items-center gap-2">
                <Zap size={16} />
                Minting Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] text-gray-400">Minting Fee</span>
                  <div className="text-right">
                    <span className="text-md text-white font-bold">{MINT_FEE.toLocaleString()} ZYG</span>
                    <p className="text-[8px] text-gray-500">Current: {zyg.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] text-gray-400">Network</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] text-white">Base Sepolia</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {!isConnected ? (
                  <div className="text-center p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <Wallet size={32} className="text-blue-400 mx-auto mb-3 opacity-50" />
                    <p className="text-[10px] text-gray-300 mb-4">Connect your wallet to proceed with minting.</p>
                  </div>
                ) : !selectedCard ? (
                  <div className="text-center p-6 bg-white/5 border border-dashed border-white/20 rounded-xl">
                    <p className="text-[10px] text-gray-500">Select a card from your inventory to forge.</p>
                  </div>
                ) : zyg < MINT_FEE ? (
                  <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-[10px] text-red-400">Insufficient ZYG. Keep tapping to earn more!</p>
                  </div>
                ) : (
                  <Transaction
                    chainId={baseSepolia.id}
                    calls={calls}
                    onSuccess={handleMintSuccess}
                  >
                    <TransactionButton
                      text="FORGE NFT"
                      className="w-full btn-pixel bg-yugi-gold border-yugi-gold/50 text-black py-4 !h-auto"
                    />
                    <TransactionStatus>
                      <TransactionStatusLabel className="text-[10px] text-gray-400" />
                      <TransactionStatusAction className="text-yugi-gold" />
                    </TransactionStatus>
                    <TransactionToast>
                      <TransactionToastIcon />
                      <TransactionToastLabel className="text-xs" />
                      <TransactionToastAction />
                    </TransactionToast>
                  </Transaction>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={12} className="text-green-400" />
              <span className="text-[9px] text-gray-300 uppercase font-bold">Ownership Perks</span>
            </div>
            <ul className="text-[8px] text-gray-500 space-y-1.5 ml-4 list-disc">
              <li>True ownership on the Base blockchain</li>
              <li>Tradable on secondary markets like OpenSea</li>
              <li>Exclusive in-game boosts (Coming Soon)</li>
            </ul>
          </div>
        </div>

        {/* Right: Card Selection Grid */}
        <div className="order-1 md:order-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[10px] text-yugi-gold uppercase font-bold tracking-widest">Select Card</h2>
            <span className="text-[10px] text-gray-500">{inventoryCards.length} Cards Owned</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {inventoryCards.map((item) => (
              <button
                key={item.cardId}
                onClick={() => setSelectedCardId(item.cardId)}
                className={`group relative aspect-[5/7] rounded-xl border-2 transition-all active:scale-95 ${selectedCardId === item.cardId
                  ? 'border-yugi-gold scale-105 z-10 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                  : 'border-white/10 hover:border-white/30 grayscale hover:grayscale-0'
                  }`}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <img src={item.details?.imageUrl || ''} className="w-full h-full object-cover" alt="Card" />
                  <div className={`absolute inset-0 bg-yugi-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                </div>
                
                {item.quantity > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[7px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-white font-bold z-10 shadow-lg">
                    x{item.quantity}
                  </div>
                )}
                {selectedCardId === item.cardId && (
                  <div className="absolute top-1 right-1 bg-yugi-gold rounded-full p-0.5">
                    <CheckCircle2 size={10} className="text-black" />
                  </div>
                )}
              </button>
            ))}

            {inventoryCards.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-[10px] text-gray-500">Your inventory is empty.</p>
                <p className="text-[8px] text-yugi-gold animate-pulse mt-1">Tap the crystal to earn cards!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
