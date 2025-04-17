
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BLOCKCHAINS = [
  { id: 'bitcoin', name: 'Bitcoin', icon: 'B' },
  { id: 'l1x', name: 'L1X', icon: 'L' },
  { id: 'ethereum', name: 'Ethereum', icon: 'E' },
  { id: 'binance', name: 'BNB Chain', icon: 'B' },
  { id: 'polygon', name: 'Polygon', icon: 'P' },
  { id: 'arbitrum', name: 'Arbitrum', icon: 'A' },
  { id: 'optimism', name: 'Optimism', icon: 'O' },
  { id: 'solana', name: 'Solana', icon: 'S' },
  { id: 'avalanche', name: 'Avalanche', icon: 'A' },
  { id: 'fantom', name: 'Fantom', icon: 'F' },
  { id: 'base', name: 'Base', icon: 'B' },
  { id: 'zksync', name: 'zkSync', icon: 'Z' },
];

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

const BlockchainSelector: React.FC<{
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
  disabled?: boolean;
}> = ({ selectedNetwork, onNetworkChange, disabled = false }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {BLOCKCHAINS.map((blockchain) => (
        <button
          key={blockchain.id}
          type="button"
          disabled={disabled}
          onClick={() => onNetworkChange(blockchain.id)}
          className={cn(
            "px-3 py-1 rounded-full text-sm transition-all duration-300 ease-in-out",
            "border border-transparent hover:border-neon-cyan/50",
            "flex items-center gap-1",
            selectedNetwork === blockchain.id
              ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan"
              : "bg-muted/20 text-muted-foreground hover:bg-muted/40",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="font-bold mr-1">{blockchain.icon}</span>
          {blockchain.name}
        </button>
      ))}
    </div>
  );
};

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('auto');
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value.trim());
  };
  
  const handleNetworkChange = (value: string) => {
    setNetwork(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate address format (very basic validation)
    if (!address) {
      toast.error('Please enter an address');
      return;
    }
    
    // Check for minimum address length
    if (address.length < 20) {
      toast.error('Address seems too short. Please check and try again.');
      return;
    }
    
    onSubmit(address, network);
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8">
      <BlockchainSelector 
        selectedNetwork={network}
        onNetworkChange={handleNetworkChange}
        disabled={isLoading}
      />
      
      <div className="glowing-card p-2 rounded-xl">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Input
              placeholder="Enter wallet or token address (0x...)"
              value={address}
              onChange={handleAddressChange}
              className="pl-10 py-6 bg-transparent border-muted focus-visible:ring-neon-cyan"
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Button 
            type="submit" 
            className="bg-neon-cyan hover:bg-neon-cyan/80 py-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>Analyze</>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddressInput;
