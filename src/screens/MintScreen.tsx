"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { allCards, getCardImage } from '../utils/cards';
import { Sparkles, Shield, Wallet, Zap, ExternalLink, ChevronRight, CheckCircle2, Hammer, Cpu, Flame, Scroll } from 'lucide-react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const NFT_CONTRACT_ADDRESS = "0x385f49ef823Ea58E0a45BBFAa579f11C7578703B";
const BUILDER_CODE = "bc_8kd8fkpm";

export const MintScreen = () => {
  const { zyg, inventory, addZyg } = useStore();
  const { address, isConnected } = useAccount();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const MINT_FEE = 10;

  const inventoryCards = inventory.map(item => {
    const details = allCards.find(c => c.id === item.cardId);
    return {
      ...item,
      details: details ? { ...details, imageUrl: getCardImage(details.id) } : null
    };
  }).filter(item => item.details);

  const selectedCard = inventoryCards.find(i => i.cardId === selectedCardId);

  const abi = [
    {
      name: 'mint',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'tokenURI', type: 'string' },
        { name: 'builderCode', type: 'string' }
      ],
      outputs: [],
    },
  ] as const;

  const handleMintSuccess = () => {
    addZyg(-MINT_FEE);
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
    <div className="min-h-screen p-4 pb-32 max-w-6xl mx-auto overflow-y-auto">
      <div className="text-center mt-4 mb-8 space-y-1">
        <div className="stone-broken inline-flex items-center gap-3 px-4 py-1.5 bg-[#1a120d] border-[#3d2b1f] shadow-2xl mb-2">
          <Hammer className="text-hearth-gold animate-bounce" size={14} />
          <span className="text-[9px] text-hearth-gold uppercase tracking-[0.3em] font-hearth font-black">NFT Forge</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-hearth font-black text-white tracking-[0.1em] drop-shadow-[0_4px_12px_rgba(0,0,0,1)] uppercase">Mint NFT</h1>
        <p className="text-[10px] text-[#8b6b4d] uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed font-black engraved">
          Forge your cards into permanent NFTs.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start px-2">
        <div className="space-y-4 order-2 lg:order-1 lg:col-span-2">
          <div className="stone-broken p-6 relative overflow-hidden bg-[#2a2a2a] border-[8px] border-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,1)]">
            <div className="absolute -top-12 -right-12 opacity-5 rotate-12">
              <Flame size={180} className="text-orange-950" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 border-b border-black/20 pb-3">
                <h2 className="text-md font-hearth font-black uppercase tracking-widest text-hearth-gold drop-shadow-lg">Forge Specs</h2>
                <div className="px-2 py-0.5 bg-indigo-950/40 border border-indigo-500/20 rounded-sm text-indigo-400 text-[8px] font-black uppercase tracking-[0.1em] shadow-inner">Base Portal</div>
              </div>
              <div className="space-y-6">
                <ForgeRow label="Minting Cost" value={`${MINT_FEE} ZYG`} subText={`Pool: ${zyg.toLocaleString()}`} />
                <ForgeRow label="Relic Grade" value={selectedCard?.details?.rarity?.toUpperCase() || '---'} subText="Blockchain Tier" />
                <ForgeRow label="Portal Speed" value="INSTANT" subText="Portal Velocity" />
              </div>
              <div className="mt-8">
                {!isConnected ? (
                  <div className="stone-broken p-4 bg-[#1a120d] border-[#3d2b1f] text-center shadow-inner border-2">
                    <Wallet size={28} className="mx-auto mb-3 text-[#3d2b1f] opacity-40" />
                    <p className="text-[9px] text-[#8b6b4d] uppercase tracking-[0.1em] font-black engraved">Astral Key Connection Required</p>
                  </div>
                ) : !selectedCard ? (
                  <div className="stone-broken p-4 bg-[#1a120d] border-[#3d2b1f] text-center shadow-inner border-2">
                    <Zap size={28} className="mx-auto mb-3 text-[#3d2b1f] opacity-40 animate-pulse" />
                    <p className="text-[9px] text-[#8b6b4d] uppercase tracking-[0.1em] font-black engraved">Select a card to forge</p>
                  </div>
                ) : zyg < MINT_FEE ? (
                  <div className="stone-broken p-4 bg-red-950/20 border-red-900/30 text-center shadow-inner border-2">
                    <Flame size={28} className="text-red-900 mx-auto mb-3 opacity-40" />
                    <p className="text-[9px] text-red-700 uppercase tracking-[0.1em] font-black engraved italic">Insufficient Spiritual Energy</p>
                  </div>
                ) : (
                  <Transaction
                    chainId={baseSepolia.id}
                    calls={calls}
                    onSuccess={handleMintSuccess}
                  >
                    <TransactionButton
                      text="INITIATE FORGE"
                      className="w-full btn-stone-gold !py-4 shadow-[0_12px_25px_rgba(244,208,63,0.35)] !text-[11px] font-black tracking-[0.3em]"
                    />
                    <TransactionStatus>
                      <TransactionStatusLabel className="text-[10px] text-[#8b6b4d] uppercase font-black tracking-[0.1em] mt-4 text-center w-full engraved" />
                      <TransactionStatusAction className="text-hearth-gold text-[9px] font-black uppercase tracking-[0.2em] block text-center mt-1 underline" />
                    </TransactionStatus>
                  </Transaction>
                )}
              </div>
            </div>
          </div>
          <div className="parchment-bg p-5 border-t-[5px] border-[#8b4513] shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <Scroll size={14} className="text-[#3d2b1f] opacity-60" />
              <span className="text-[10px] font-hearth font-black uppercase tracking-[0.2em] text-[#3d2b1f]">Ancient Laws</span>
            </div>
            <div className="grid grid-cols-1 gap-4 relative z-10">
              <p className="text-[11px] text-[#2a1d15] leading-relaxed italic font-black drop-shadow-sm">"Manifest your digital spirit into an eternal on-chain relic."</p>
              <div className="flex justify-between items-center bg-black/10 p-3 border-2 border-black/5 shadow-inner">
                <span className="text-[9px] text-[#3d2b1f] font-black uppercase tracking-[0.2em] engraved">Portal Bridge Active</span>
                <ExternalLink size={12} className="text-[#3d2b1f] opacity-40" />
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-3">
          <div className="flex items-center justify-between mb-6 px-4 border-b-[3px] border-[#3d2b1f] pb-4">
            <h2 className="text-sm font-hearth text-white uppercase tracking-[0.2em] font-black drop-shadow-md">Available Vessels</h2>
            <span className="text-[10px] text-hearth-gold font-black font-hearth tracking-[0.1em] uppercase">{inventoryCards.length} Spirits Ready</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
            {inventoryCards.map((item) => (
              <button
                key={item.cardId}
                onClick={() => setSelectedCardId(item.cardId)}
                className={`group relative aspect-[5/7] rounded-sm border-[2px] transition-all duration-700 active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,1)] hover:scale-105 hover:z-10 ${selectedCardId === item.cardId
                    ? 'border-hearth-gold bg-[#2a1d15] scale-105 z-10 shadow-[0_20px_40px_rgba(244,208,63,0.3)]'
                    : 'border-[#1a120d] bg-[#1a120d] grayscale group-hover:grayscale-0'
                  }`}
              >
                <div className="absolute inset-0 rounded-sm overflow-hidden m-0.5 border border-black/60 shadow-inner">
                  <img src={item.details?.imageUrl || ''} className="w-full h-full object-cover transition-all duration-1000" alt="Card" />
                </div>
                {item.quantity > 0 && (
                  <div className="absolute -top-2.5 -right-2.5 bg-red-950 text-white text-[10px] w-7 h-7 flex items-center justify-center rounded-full border-[2px] border-black/80 font-black z-10 shadow-xl">
                    {item.quantity}
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none chisel-mark opacity-30" />
              </button>
            ))}
            {inventoryCards.length === 0 && (
              <div className="col-span-full py-32 text-center stone-broken bg-[#1a120d] border-[#3d2b1f] border-dashed border-[8px]">
                <p className="text-md text-[#8b6b4d] uppercase tracking-[0.4em] font-hearth font-black drop-shadow-md">The Pedestals remain vacant, Seeker.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ForgeRow = ({ label, value, subText }: { label: string; value: string; subText: string }) => (
  <div className="flex justify-between items-end py-4 border-b border-black/10">
    <div className="flex flex-col">
      <span className="text-[10px] text-[#8b6b4d] uppercase tracking-[0.2em] font-black engraved">{label}</span>
      <span className="text-[9px] text-white/10 uppercase font-black tracking-widest">{subText}</span>
    </div>
    <span className="text-lg font-hearth font-black text-white tracking-[0.1em] drop-shadow-md">{value}</span>
  </div>
);