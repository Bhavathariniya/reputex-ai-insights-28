
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { detectBlockchain } from '../lib/detectBlockchain';
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

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [localLoading, setLocalLoading] = useState(false);

  // New: Detect blockchain and update selected automatically
  const handleDetectBlockchain = async (input: string) => {
    setLocalLoading(true);
    try {
      const detection = detectBlockchain(input);

      if (detection.id && detection.id !== selectedBlockchain) {
        setSelectedBlockchain(detection.id);

        toast({
          title: `Detected: ${detection.name}`,
          description: `The address matches the ${detection.name} blockchain format.`,
          duration: 2300,
        });
      } else if (!detection.id) {
        toast({
          title: "Unknown Blockchain",
          description: "Unable to detect the blockchain from the input format.",
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

    if (val.length > 7) {
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
      {/* Optional: Show dropdown of detected blockchain for manual override (not required) */}
    </form>
  );
};

export default AddressInput;

