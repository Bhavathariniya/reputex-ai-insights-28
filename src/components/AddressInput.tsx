
import React, { useState } from 'react';
import { Search, Loader2, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8">
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
          
          <Select
            value={network}
            onValueChange={handleNetworkChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-40 bg-transparent py-6 border-muted focus:ring-neon-cyan">
              <SelectValue placeholder="Blockchain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  Auto Detect
                </div>
              </SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="l1x">L1X</SelectItem>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="binance">BNB Chain</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="avalanche">Avalanche</SelectItem>
              <SelectItem value="fantom">Fantom</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="zksync">zkSync</SelectItem>
            </SelectContent>
          </Select>
          
          <Button type="submit" className="bg-neon-cyan hover:bg-neon-cyan/80 py-6" disabled={isLoading}>
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
