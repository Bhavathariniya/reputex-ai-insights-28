
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlockchainSelectorProps {
  selectedNetwork: string;
  onChange: (network: string) => void;
}

const networks = [
  { id: 'auto', name: 'Auto Detect', icon: '🔍' },
  { id: 'l1x', name: 'L1X', icon: '🔵' },
  { id: 'ethereum', name: 'Ethereum', icon: '💎' },
  { id: 'binance', name: 'BNB Chain', icon: '🟡' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'solana', name: 'Solana', icon: '🟢' },
  { id: 'avalanche', name: 'Avalanche', icon: '❄️' },
  { id: 'fantom', name: 'Fantom', icon: '👻' },
  { id: 'base', name: 'Base', icon: '🟦' },
  { id: 'zksync', name: 'zkSync', icon: '⚡' },
];

const NetworkBadge = ({ network }: { network: string }) => {
  const networkColors: Record<string, string> = {
    auto: 'border-gray-400 bg-gray-400/10 text-gray-400',
    l1x: 'border-[#3D52F4] bg-[#3D52F4]/10 text-[#3D52F4]',
    ethereum: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]',
    binance: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]',
    polygon: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]',
    arbitrum: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]',
    optimism: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]',
    solana: 'border-[#14F195] bg-[#14F195]/10 text-[#14F195]',
    avalanche: 'border-[#E84142] bg-[#E84142]/10 text-[#E84142]',
    fantom: 'border-[#1969FF] bg-[#1969FF]/10 text-[#1969FF]',
    base: 'border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]',
    zksync: 'border-[#8C8DFC] bg-[#8C8DFC]/10 text-[#8C8DFC]',
  };

  const networkNames: Record<string, string> = {
    auto: 'Auto Detect',
    l1x: 'L1X',
    ethereum: 'Ethereum',
    binance: 'BNB Chain',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    solana: 'Solana',
    avalanche: 'Avalanche',
    fantom: 'Fantom',
    base: 'Base',
    zksync: 'zkSync',
  };

  return (
    <div className={`px-2 py-1 rounded-md text-sm font-medium border ${networkColors[network] || 'border-muted-foreground text-muted-foreground'}`}>
      {networkNames[network] || network}
    </div>
  );
};

const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ selectedNetwork, onChange }) => {
  const selectedNetworkData = networks.find(net => net.id === selectedNetwork) || networks[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-auto py-2 px-3 border-muted">
          <span className="mr-1">{selectedNetworkData.icon}</span>
          <NetworkBadge network={selectedNetwork} />
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Select Blockchain</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {networks.map((network) => (
          <DropdownMenuCheckboxItem
            key={network.id}
            checked={selectedNetwork === network.id}
            onCheckedChange={() => onChange(network.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{network.icon}</span>
              <span>{network.name}</span>
            </div>
            {selectedNetwork === network.id && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlockchainSelector;
