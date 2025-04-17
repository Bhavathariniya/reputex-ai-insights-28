
import React, { useState, useEffect } from 'react';
import { 
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  FileCheck,
  FileX,
  Tag,
  Shield,
  Landmark,
  Search,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface TokenAnalysisProps {
  address: string;
  network: string;
  tokenData: any;
}

// Helper function to truncate addresses
const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to format date
const formatDate = (timestamp: string | number | Date) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ 
  address, 
  network,
  tokenData 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [honeypotStatus, setHoneypotStatus] = useState<'checking' | 'safe' | 'warning' | 'danger'>('checking');
  
  // Fetch token data from various APIs
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!address || !network) return;
      
      setIsLoading(true);
      try {
        // Simulate API calls (replace with actual API calls)
        
        // 1. Fetch basic token info from CoinGecko (in real implementation)
        const coinGeckoData = await simulateCoinGeckoAPI(address, network);
        
        // 2. Fetch contract info from Etherscan (in real implementation)
        const etherscanData = await simulateEtherscanAPI(address, network);
        
        // 3. Check honeypot status (in real implementation)
        const honeypotData = await simulateHoneypotAPI(address, network);
        
        // Merge all data
        const mergedData = {
          ...coinGeckoData,
          ...etherscanData,
          ...honeypotData,
          // Add any other data sources
        };
        
        setTokenInfo(mergedData);
        setHoneypotStatus(mergedData.honeypotRisk === 'High' ? 'danger' : 
                         mergedData.honeypotRisk === 'Medium' ? 'warning' : 'safe');
      } catch (error) {
        console.error("Error fetching token data:", error);
        toast.error("Failed to fetch token data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenData();
  }, [address, network]);
  
  // Simulate CoinGecko API
  const simulateCoinGeckoAPI = async (address: string, network: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data (in real implementation, fetch from CoinGecko)
    return {
      name: "Sample Token",
      symbol: "SMPL",
      logo: "https://assets.coingecko.com/coins/images/8418/small/leo-token-logo.png",
      marketCap: "$1,234,567,890",
      tags: ["Exchange-based Token", "CEX Token", "Utility"],
      category: "Exchange Token",
      description: "A sample token for exchange operations",
    };
  };
  
  // Simulate Etherscan API
  const simulateEtherscanAPI = async (address: string, network: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return mock data (in real implementation, fetch from Etherscan)
    return {
      creationDate: new Date("2023-05-15"),
      creatorAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      isVerified: Math.random() > 0.3, // 70% chance of being verified
      ownershipRenounced: Math.random() > 0.5, // 50% chance of being renounced
    };
  };
  
  // Simulate Honeypot API
  const simulateHoneypotAPI = async (address: string, network: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data (in real implementation, fetch from Honeypot.is)
    const risks = ["Low", "Medium", "High"];
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    
    return {
      honeypotRisk: randomRisk,
      isBuyable: randomRisk !== "High",
      isSellable: randomRisk !== "High",
      buyTax: randomRisk === "High" ? "25%" : randomRisk === "Medium" ? "10%" : "2%",
      sellTax: randomRisk === "High" ? "35%" : randomRisk === "Medium" ? "15%" : "2%",
      riskScore: randomRisk === "High" ? 150 : randomRisk === "Medium" ? 320 : 480,
      maxScore: 550,
    };
  };
  
  const getExplorerUrl = (addressToExplore: string) => {
    const explorers: Record<string, string> = {
      ethereum: 'https://etherscan.io/address/',
      binance: 'https://bscscan.com/address/',
      polygon: 'https://polygonscan.com/address/',
      arbitrum: 'https://arbiscan.io/address/',
      optimism: 'https://optimistic.etherscan.io/address/',
      // Add more networks as needed
    };
    
    return (explorers[network] || explorers.ethereum) + addressToExplore;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied to clipboard");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy address");
    });
  };
  
  const getNetworkBadgeColor = (network: string) => {
    const networkColors: Record<string, string> = {
      ethereum: 'border-[#627EEA] bg-[#627EEA]/10 text-[#627EEA]',
      binance: 'border-[#F3BA2F] bg-[#F3BA2F]/10 text-[#F3BA2F]',
      polygon: 'border-[#8247E5] bg-[#8247E5]/10 text-[#8247E5]',
      arbitrum: 'border-[#28A0F0] bg-[#28A0F0]/10 text-[#28A0F0]',
      optimism: 'border-[#FF0420] bg-[#FF0420]/10 text-[#FF0420]',
      // Add more networks as needed
    };
    
    return networkColors[network] || 'border-muted-foreground text-muted-foreground';
  };
  
  const getNetworkName = (network: string) => {
    const networkNames: Record<string, string> = {
      ethereum: 'ETH',
      binance: 'BSC',
      polygon: 'POLY',
      arbitrum: 'ARB',
      optimism: 'OPT',
      // Add more networks as needed
    };
    
    return networkNames[network] || network.toUpperCase();
  };
  
  const renderRiskMeter = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    
    let indicatorClass = "";
    if (percentage < 40) {
      indicatorClass = "bg-gradient-to-r from-red-500 to-red-400";
    } else if (percentage < 70) {
      indicatorClass = "bg-gradient-to-r from-yellow-500 to-yellow-400";
    } else {
      indicatorClass = "bg-gradient-to-r from-green-500 to-green-400";
    }
    
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Risk Score</span>
          <span className="text-sm font-bold">{score}/{maxScore}</span>
        </div>
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            indicatorClassName={indicatorClass}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>High Risk</span>
          <span>Medium Risk</span>
          <span>Low Risk</span>
        </div>
      </div>
    );
  };
  
  const renderHoneypotStatus = (status: 'checking' | 'safe' | 'warning' | 'danger') => {
    if (status === 'checking') {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking for Honeypot</span>
        </div>
      );
    } else if (status === 'safe') {
      return (
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle className="h-4 w-4" />
          <span>Safe to Trade</span>
        </div>
      );
    } else if (status === 'warning') {
      return (
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle className="h-4 w-4" />
          <span>Caution Advised</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-red-500">
          <XCircle className="h-4 w-4" />
          <span>Likely Honeypot</span>
        </div>
      );
    }
  };
  
  if (!tokenData || !tokenData.supported) {
    return (
      <div className="w-full mb-6 glass-card p-6 rounded-xl">
        <div className="flex items-center gap-2 text-neon-pink">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-medium">Token Analysis Not Available</h3>
        </div>
        <p className="text-muted-foreground mt-2">
          Detailed token analysis is only available for EVM-compatible chains.
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-6 mb-8 animate-fade-in">
      <div className="glass-card border-neon-cyan p-6 rounded-xl">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Token Header */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden border border-muted flex items-center justify-center bg-muted/30">
                {tokenInfo?.logo ? (
                  <img 
                    src={tokenInfo.logo} 
                    alt={`${tokenInfo.name} logo`} 
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <Tag className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{tokenInfo?.name || "Unknown Token"}</h2>
                  <Badge 
                    variant="outline" 
                    className={getNetworkBadgeColor(network)}
                  >
                    {getNetworkName(network)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tokenInfo?.symbol || "???"}
                </div>
              </div>
            </div>
            
            {/* Token Details */}
            <div className="space-y-4">
              {/* Contract Address */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{truncateAddress(address)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => copyToClipboard(address)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy address</span>
                  </Button>
                  <a 
                    href={getExplorerUrl(address)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="h-6 w-6 flex items-center justify-center text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">View on explorer</span>
                  </a>
                </div>
              </div>
              
              {/* Creation Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created On</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">
                    {tokenInfo?.creationDate ? formatDate(tokenInfo.creationDate) : "Unknown"}
                  </span>
                </div>
              </div>
              
              {/* Creator Address */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Creator Address</span>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <a 
                    href={tokenInfo?.creatorAddress ? getExplorerUrl(tokenInfo.creatorAddress) : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-mono hover:underline text-primary"
                  >
                    {tokenInfo?.creatorAddress ? truncateAddress(tokenInfo.creatorAddress) : "Unknown"}
                  </a>
                </div>
              </div>
              
              {/* Verification Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract Verified</span>
                <div className="flex items-center gap-2">
                  {tokenInfo?.isVerified ? (
                    <Badge variant="outline" className="border-emerald-500 bg-emerald-500/10 text-emerald-500">
                      <FileCheck className="h-3.5 w-3.5 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-500 bg-red-500/10 text-red-500">
                      <FileX className="h-3.5 w-3.5 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Ownership Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ownership Status</span>
                <div className="flex items-center gap-2">
                  {tokenInfo?.ownershipRenounced ? (
                    <Badge variant="outline" className="border-emerald-500 bg-emerald-500/10 text-emerald-500">
                      <Shield className="h-3.5 w-3.5 mr-1" />
                      Renounced
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500 bg-amber-500/10 text-amber-500">
                      <Landmark className="h-3.5 w-3.5 mr-1" />
                      Owned
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Audits */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Audits Done</span>
                <span className="text-sm">Coming Soon</span>
              </div>
              
              {/* Categories/Tags */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Categories</span>
                <div className="flex flex-wrap gap-2">
                  {tokenInfo?.tags ? (
                    tokenInfo.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-neon-cyan bg-neon-cyan/10 text-neon-cyan">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No categories available</span>
                  )}
                </div>
              </div>
              
              {/* Risk Score */}
              <div className="pt-2">
                {renderRiskMeter(tokenInfo?.riskScore || 0, tokenInfo?.maxScore || 550)}
              </div>
              
              {/* Honeypot Status */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Last Known Status</span>
                {renderHoneypotStatus(honeypotStatus)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAnalysis;
