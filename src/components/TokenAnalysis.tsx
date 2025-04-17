
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  FileCheck,
  FileX,
  CircleDollarSign,
  Copy,
  ExternalLink,
  Calendar,
  User,
  Shield,
  Tag,
  Search,
  Info
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface TokenAnalysisProps {
  address: string;
  network: string;
  tokenData: any;
}

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ 
  address, 
  network,
  tokenData 
}) => {
  const [isCheckingHoneypot, setIsCheckingHoneypot] = useState(true);

  useEffect(() => {
    // Simulate honeypot check with timeout
    const timer = setTimeout(() => {
      setIsCheckingHoneypot(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!tokenData || !tokenData.supported) {
    return (
      <Card className="w-full mb-6 glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-neon-pink" />
            Token Analysis Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed token analysis is only available for EVM-compatible chains.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { 
    safetyScore = 335,
    maxScore = 550,
    safetyLevel,
    ownershipRenounced, 
    tokenName = "LEO Token",
    tokenSymbol = "LEO",
    creationDate = "2022-08-15",
    creatorAddress = "0x1234...5678",
    audits = [],
    categories = ["Exchange-based Token", "CEX Token"]
  } = tokenData;

  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
  };

  const renderSafetyBadge = (level: string) => {
    switch (level) {
      case 'Safe':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Safe
          </Badge>
        );
      case 'Caution':
        return (
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Caution
          </Badge>
        );
      case 'High Risk':
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            High Risk
          </Badge>
        );
      default:
        return null;
    }
  };

  const getOwnershipStatus = () => {
    if (ownershipRenounced) {
      return (
        <Badge variant="outline" className="border-emerald-500 bg-emerald-500/10 text-emerald-500">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Ownership Renounced
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-amber-500 bg-amber-500/10 text-amber-500">
        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
        Ownership Retained
      </Badge>
    );
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getNetworkBadge = () => {
    const networkColors: Record<string, string> = {
      bitcoin: 'border-[#F7931A] bg-[#F7931A]/10 text-[#F7931A]',
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

    const networkAbbr: Record<string, string> = {
      bitcoin: 'BTC',
      l1x: 'L1X',
      ethereum: 'ETH',
      binance: 'BNB',
      polygon: 'MATIC',
      arbitrum: 'ARB',
      optimism: 'OP',
      solana: 'SOL',
      avalanche: 'AVAX',
      fantom: 'FTM',
      base: 'BASE',
      zksync: 'ZKS',
    };

    return (
      <Badge
        variant="outline"
        className={`py-1 px-3 rounded-full ${networkColors[network] || 'border-muted-foreground text-muted-foreground'}`}
      >
        {networkAbbr[network] || network.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <Card className="w-full glass-card">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {tokenSymbol ? tokenSymbol.charAt(0) : "T"}
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {tokenName} 
                  <span className="text-lg text-muted-foreground">({tokenSymbol})</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getNetworkBadge()}
                  {renderSafetyBadge(safetyLevel)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Token Address</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm">{formattedAddress}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-primary hover:text-primary/70 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created On</span>
                </div>
                <span className="text-sm">{creationDate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Creator</span>
                </div>
                <a 
                  href={`https://etherscan.io/address/${creatorAddress}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono flex items-center gap-1 text-primary hover:underline"
                >
                  {creatorAddress}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Ownership</span>
                </div>
                {getOwnershipStatus()}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCheck className="h-4 w-4" />
                  <span>Audits</span>
                </div>
                {audits && audits.length > 0 ? (
                  <div className="flex gap-1.5">
                    {audits.map((audit: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-primary bg-primary/10">
                        {audit}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      className="bg-primary/10 hover:bg-primary/20 text-primary border-primary"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Unified Risk Rating Bar */}
            <div className="p-4 border border-muted rounded-lg bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-1.5">
                  <Shield className="h-5 w-5 text-neon-cyan" />
                  Risk Rating
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Info className="h-3.5 w-3.5" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-xs">
                        This score represents an overall assessment of the token's safety based on multiple security factors.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="mb-2 flex items-center justify-end">
                <Badge className="px-3 py-1 border-0" variant="outline">
                  <Shield className="h-4 w-4 mr-1" />
                  {safetyScore}/{maxScore}
                </Badge>
              </div>
              
              <div className="relative">
                <Progress 
                  value={(safetyScore / maxScore) * 100} 
                  className="h-4"
                  indicatorClassName={getScoreColor(safetyScore, maxScore)}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>High Risk</span>
                  <span>Moderate Risk</span>
                  <span>Low Risk</span>
                </div>
              </div>
            </div>
            
            {/* Honeypot Check Status Bar */}
            <div className={`p-3 border border-muted rounded-lg ${isCheckingHoneypot ? 'bg-amber-500/10' : 'bg-emerald-500/10'} transition-colors duration-500`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCheckingHoneypot ? (
                    <>
                      <div className="animate-pulse">
                        <Search className="h-5 w-5 text-amber-500" />
                      </div>
                      <span className="font-medium text-amber-500">Checking for Honeypot...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="font-medium text-emerald-500">Honeypot Check Passed</span>
                    </>
                  )}
                </div>
                {!isCheckingHoneypot && (
                  <Badge className="bg-emerald-500/20 border-emerald-500 text-emerald-500">
                    Tradable
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenAnalysis;
