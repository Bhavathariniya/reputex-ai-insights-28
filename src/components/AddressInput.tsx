
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { detectBlockchain as localDetectBlockchain } from '../lib/detectBlockchain';
import { toast } from '../components/ui/use-toast';

import {
  BitcoinIcon,
  L1XIcon,
  EthereumIcon,
  PolygonIcon,
  ArbitrumIcon,
  OptimismIcon,
  SolanaIcon,
  AvalancheIcon,
  FantomIcon,
  ZkSyncIcon
} from '@/components/icons';

// BNB chain with custom circle image
const BnbChainCircleImage = () => (
  <span
    className="inline-block h-8 w-8 bg-white rounded-full flex items-center justify-center border border-yellow-400 shadow-sm"
  >
    <img
      src="/lovable-uploads/320cfae5-dc37-43b0-90b4-16f8b624cfb2.png"
      alt="BNB Chain"
      className="rounded-full object-contain h-7 w-7"
      draggable={false}
    />
  </span>
);

const BaseCircleImage = () => (
  <span
    className="inline-block h-8 w-8 bg-white rounded-full flex items-center justify-center border border-[#0052FF] shadow-sm"
    style={{
      backgroundColor: "#fff",
    }}
  >
    <img
      src="/lovable-uploads/20b1e6be-88d4-4b75-85a5-0a5a1aa7727e.png"
      alt="Base"
      className="rounded-full object-contain h-7 w-7"
      style={{
        backgroundColor: "transparent",
      }}
      draggable={false}
    />
  </span>
);

// For quickly mapping chain symbols
const BLOCKCHAIN_OPTIONS = [
  { id: 'bitcoin', name: 'Bitcoin', icon: BitcoinIcon },
  { id: 'l1x', name: 'L1X', icon: L1XIcon },
  { id: 'ethereum', name: 'Ethereum', icon: EthereumIcon },
  { id: 'binance', name: 'BNB Chain', icon: BnbChainCircleImage },
  { id: 'polygon', name: 'Polygon', icon: PolygonIcon },
  { id: 'arbitrum', name: 'Arbitrum', icon: ArbitrumIcon },
  { id: 'optimism', name: 'Optimism', icon: OptimismIcon },
  { id: 'solana', name: 'Solana', icon: SolanaIcon },
  { id: 'avalanche', name: 'Avalanche', icon: AvalancheIcon },
  { id: 'fantom', name: 'Fantom', icon: FantomIcon },
  { id: 'base', name: 'Base', icon: BaseCircleImage },
  { id: 'zksync', name: 'zkSync', icon: ZkSyncIcon },
];

interface AddressInputProps {
  onSubmit?: (address: string, network: string) => void;
  isLoading?: boolean;
}

// Simple explorers for address existence APIs (public endpoints for existence only)
const explorerAPIs: Record<string, (a: string) => Promise<boolean>> = {
  ethereum: async (address: string) => {
    // Etherscan supports free API keys; for MVP just check via contract/txs endpoint
    try {
      const res = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=1&sort=asc`);
      const data = await res.json();
      return !!(data && data.result && data.result.length >= 0); // address exists if there is a valid array
    } catch {
      return false;
    }
  },
  binance: async (address: string) => {
    // Try BSCScan, similar logic as above
    try {
      const res = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=1&sort=asc`);
      const data = await res.json();
      return !!(data && data.result && data.result.length >= 0);
    } catch {
      return false;
    }
  },
  polygon: async (address: string) => {
    try {
      const res = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=1&sort=asc`);
      const data = await res.json();
      return !!(data && data.result && data.result.length >= 0);
    } catch {
      return false;
    }
  },
  arbitrum: async (address: string) => {
    try {
      const res = await fetch(`https://api.arbiscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=1&sort=asc`);
      const data = await res.json();
      return !!(data && data.result && data.result.length >= 0);
    } catch {
      return false;
    }
  },
  optimism: async (address: string) => {
    try {
      const res = await fetch(`https://api-optimistic.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=1&sort=asc`);
      const data = await res.json();
      return !!(data && data.result && data.result.length >= 0);
    } catch {
      return false;
    }
  },
  solana: async (address: string) => {
    try {
      // Use Solscan public API for existence
      const res = await fetch(`https://public-api.solscan.io/account/${address}`);
      // If account exists, 200; otherwise error or 404
      return res.ok;
    } catch {
      return false;
    }
  },
};

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [localLoading, setLocalLoading] = useState(false);

  // Heuristics THEN verify via explorers for best match
  const handleDetectBlockchain = async (input: string) => {
    setLocalLoading(true);
    try {
      // 1. Heuristic detection (fast)
      const detection = localDetectBlockchain(input);

      let detectedId: string | null = detection.id;
      let verifyNetworks: string[] = [];

      if (!detectedId) {
        // If heuristics don't find it, test all
        verifyNetworks = ['ethereum', 'binance', 'polygon', 'arbitrum', 'optimism', 'solana'];
      } else {
        verifyNetworks = [detectedId];
        // If EVM type, also try BNB, Polygon for 0x; Solana check is unique by base58
        if (detectedId === 'ethereum') {
          verifyNetworks = ['ethereum', 'binance', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'base', 'fantom', 'zksync'];
        }
      }

      let finalChain: string | null = null;
      // 2. Check via explorer APIs for confirmed existence (in order)
      for (const network of verifyNetworks) {
        if (explorerAPIs[network]) {
          const has = await explorerAPIs[network](input);
          if (has) {
            finalChain = network;
            break;
          }
        }
      }

      // If no API confirms, fallback to heuristic
      if (!finalChain && detectedId) {
        finalChain = detectedId;
      }

      if (finalChain && finalChain !== selectedBlockchain) {
        setSelectedBlockchain(finalChain);

        const foundName = BLOCKCHAIN_OPTIONS.find(opt => opt.id === finalChain)?.name || finalChain;
        toast({
          title: `Detected: ${foundName}`,
          description: `This address matches ${foundName}.`,
          duration: 2300,
        });
      } else if (!finalChain) {
        toast({
          title: "Unknown Blockchain",
          description: "Unable to detect the blockchain using public lookup. Please check the address.",
          variant: "destructive",
        });
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);

    if (val.length > 8) {
      handleDetectBlockchain(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast({
        title: "Please enter an address or token.",
        variant: "destructive",
      });
      return;
    }
    if (onSubmit) {
      onSubmit(address.trim(), selectedBlockchain);
    } else {
      // fallback toast if no submit handler
      toast({
        title: "No submit handler provided.",
        description: "Please add an onSubmit to AddressInput.",
        variant: "destructive",
      });
    }
  };

  // Use parent loading if provided, else fall back to local detection loading
  const loading = typeof isLoading === 'boolean' ? isLoading : localLoading;

  return (
    <form className="w-full flex flex-col items-center gap-3" onSubmit={handleSubmit}>
      <div className="relative w-full max-w-xl flex items-center rounded-lg bg-background shadow-lg px-2 py-1 border border-muted">
        {/* Blockchain chip */}
        <span className="absolute -left-10 sm:left-2 top-1/2 -translate-y-1/2 z-10">
          {
            BLOCKCHAIN_OPTIONS.find(opt => opt.id === selectedBlockchain)?.icon
              ? React.createElement(BLOCKCHAIN_OPTIONS.find(opt => opt.id === selectedBlockchain)!.icon)
              : null
          }
        </span>
        <input
          className="pl-14 pr-4 py-3 w-full text-base rounded-lg focus:outline-none bg-transparent"
          type="text"
          placeholder="Paste wallet or token address (any chain)"
          value={address}
          onChange={handleInputChange}
          autoCorrect="off"
          spellCheck={false}
          autoFocus
          aria-label="Wallet or Token Address"
          inputMode="text"
        />
        {/* Loading spinner on detection */}
        <button
          type="submit"
          className="ml-2 text-primary hover:scale-105 transition-transform"
          disabled={loading}
          aria-label="Analyze"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
        </button>
      </div>
      {/* Blockchain override dropdown could go here if needed */}
    </form>
  );
};

export default AddressInput;

