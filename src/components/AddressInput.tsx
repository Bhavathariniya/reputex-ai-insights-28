import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { detectBlockchain } from '@/lib/chain-detection';

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

type NetworkOption = {
  id: string;
  name: string;
  color: string;
};

const networks: NetworkOption[] = [
  { id: 'bitcoin', name: 'Bitcoin', color: 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]' },
  { id: 'l1x', name: 'L1X', color: 'border-[#3D52F4] bg-[#3D52F4]/10 text-[#3D52F4]' },
  { id: 'ethereum', name: 'Ethereum', color: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]' },
  { id: 'binance', name: 'BNB Chain', color: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]' },
  { id: 'polygon', name: 'Polygon', color: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]' },
  { id: 'arbitrum', name: 'Arbitrum', color: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]' },
  { id: 'optimism', name: 'Optimism', color: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]' },
  { id: 'solana', name: 'Solana', color: 'border-[#14F195] bg-[#14F195]/10 text-[#14F195]' },
  { id: 'avalanche', name: 'Avalanche', color: 'border-[#E84142] bg-[#E84142]/10 text-[#E84142]' },
  { id: 'fantom', name: 'Fantom', color: 'border-[#1969FF] bg-[#1969FF]/10 text-[#1969FF]' },
  { id: 'base', name: 'Base', color: 'border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]' },
  { id: 'zksync', name: 'zkSync', color: 'border-[#8C8DFC] bg-[#8C8DFC]/10 text-[#8C8DFC]' },
];

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('ethereum');
  const [detectedNetwork, setDetectedNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAutoDetecting, setIsAutoDetecting] = useState<boolean>(false);

  useEffect(() => {
    if (address.length > 10) {
      setIsAutoDetecting(true);
      const detectChain = async () => {
        try {
          const result = await detectBlockchain(address);
          if (result) {
            setDetectedNetwork(result);
            setNetwork(result);
            toast.success(`Detected as ${networks.find(n => n.id === result)?.name || result} address`);
          } else {
            setDetectedNetwork(null);
          }
        } catch (err) {
          console.error("Error detecting blockchain:", err);
          setDetectedNetwork(null);
        } finally {
          setIsAutoDetecting(false);
        }
      };
      
      detectChain();
    } else {
      setDetectedNetwork(null);
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Please enter an address');
      return;
    }
    
    let isValidAddress = false;
    
    if (network === 'bitcoin') {
      isValidAddress = /^(1|3|bc1)[a-zA-Z0-9]{25,42}$/.test(address);
    } else if (network === 'solana') {
      isValidAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    } else {
      isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    
    if (!isValidAddress) {
      setError(`Please enter a valid ${networks.find(n => n.id === network)?.name || network} address`);
      toast.error('Invalid address format');
      return;
    }
    
    setError(null);
    onSubmit(address, network);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-center mb-1">
          {networks.map((net) => (
            <Badge
              key={net.id}
              variant="outline"
              className={`cursor-pointer ${network === net.id ? net.color : 'opacity-50'}`}
              onClick={() => setNetwork(net.id)}
            >
              {net.name}
              {detectedNetwork === net.id && (
                <span className="ml-1 text-xs">✓</span>
              )}
            </Badge>
          ))}
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <Info className="h-3 w-3" />
                <span className="sr-only">Info</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Supported Networks</h4>
                <p className="text-sm text-muted-foreground">
                  ReputexAI supports analysis across multiple blockchain networks.
                  Enter an address, and we'll attempt to auto-detect the blockchain.
                  You can also manually select the network where your address is deployed.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
            
        <div className="neon-border rounded-lg">
          <div className="flex items-center bg-card rounded-[calc(var(--radius)-1px)]">
            <Input
              type="text"
              placeholder="Enter wallet or token address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6"
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/80 text-white mr-1"
              disabled={isLoading || isAutoDetecting}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : isAutoDetecting ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Detecting...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};

export default AddressInput;
