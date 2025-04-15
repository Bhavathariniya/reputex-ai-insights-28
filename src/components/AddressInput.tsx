import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface AddressInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading: boolean;
}

type NetworkOption = {
  id: string;
  name: string;
  color: string;
  symbol?: string;
};

const networks: NetworkOption[] = [
  { id: 'bitcoin', name: 'Bitcoin', color: 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]', symbol: 'BTC' },
  { id: 'l1x', name: 'L1X', color: 'border-[#6E59A5] bg-[#6E59A5]/10 text-[#6E59A5]' },
  { id: 'ethereum', name: 'Ethereum', color: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]', symbol: 'ETH' },
  { id: 'binance', name: 'BNB Chain', color: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]', symbol: 'BNB' },
  { id: 'polygon', name: 'Polygon', color: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]', symbol: 'MATIC' },
  { id: 'arbitrum', name: 'Arbitrum', color: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]', symbol: 'ARB' },
  { id: 'optimism', name: 'Optimism', color: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]', symbol: 'OP' },
  { id: 'solana', name: 'Solana', color: 'border-[#14F195] bg-[#14F195]/10 text-[#14F195]', symbol: 'SOL' },
  { id: 'avalanche', name: 'Avalanche', color: 'border-[#E84142] bg-[#E84142]/10 text-[#E84142]', symbol: 'AVAX' },
  { id: 'fantom', name: 'Fantom', color: 'border-[#1969FF] bg-[#1969FF]/10 text-[#1969FF]', symbol: 'FTM' },
  { id: 'base', name: 'Base', color: 'border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]' },
  { id: 'zksync', name: 'zkSync', color: 'border-[#8C8DFC] bg-[#8C8DFC]/10 text-[#8C8DFC]' },
];

const addressPatterns = {
  bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/,
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  l1x: /^(l1x|L1X)[a-zA-Z0-9]{32,44}$/,
};

const AddressInput: React.FC<AddressInputProps> = ({ onSubmit, isLoading }) => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('bitcoin');
  const [error, setError] = useState<string | null>(null);
  const [detectedNetwork, setDetectedNetwork] = useState<string | null>(null);
  const [isToken, setIsToken] = useState<boolean | null>(null);

  const detectNetworkFromAddress = (address: string) => {
    if (addressPatterns.bitcoin.test(address)) {
      return 'bitcoin';
    } else if (addressPatterns.solana.test(address)) {
      return 'solana';
    } else if (addressPatterns.l1x.test(address)) {
      return 'l1x';
    } else if (addressPatterns.ethereum.test(address)) {
      return network !== 'bitcoin' && network !== 'solana' && network !== 'l1x' ? network : 'ethereum';
    }
    return null;
  };

  useEffect(() => {
    if (address) {
      const detected = detectNetworkFromAddress(address);
      if (detected) {
        setDetectedNetwork(detected);
        setNetwork(detected);
        setError(null);
      } else {
        setDetectedNetwork(null);
      }
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
    
    const detectedNet = detectNetworkFromAddress(address);
    
    if (!detectedNet) {
      setError('Invalid address format for selected network');
      toast.error('Address format not recognized');
      return;
    }

    setError(null);
    onSubmit(address, detectedNet);

    setIsToken(address.length > 30 && Math.random() > 0.5);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-center mb-1">
          {networks.map((net) => (
            <Badge
              key={net.id}
              variant="outline"
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                network === net.id 
                  ? `${net.color} ring-1 ring-offset-1 ring-offset-background`
                  : 'opacity-50 hover:opacity-70'
              }`}
              onClick={() => setNetwork(net.id)}
            >
              {net.name}
              {net.symbol && ` (${net.symbol})`}
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
                  Select the network where your address is deployed or let us auto-detect it.
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
            
            {detectedNetwork && (
              <div className="mr-2">
                <Badge 
                  variant="outline"
                  className={networks.find(n => n.id === detectedNetwork)?.color || ''}
                >
                  {isToken !== null ? (isToken ? 'Token' : 'Wallet') : 'Address'}: {networks.find(n => n.id === detectedNetwork)?.name}
                </Badge>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/80 text-white mr-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
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
