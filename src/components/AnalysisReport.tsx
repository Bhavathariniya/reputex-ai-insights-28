
import React, { useEffect, useState } from 'react';
import ScoreCard from '@/components/ScoreCard';
import TokenAnalysis from '@/components/TokenAnalysis';
import { 
  Sparkles, 
  Clock, 
  Link as LinkIcon, 
  ExternalLink,
  Shield,
  ShieldAlert,
  Droplet,
  Users,
  BarChart2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Volume2,
  MessageCircle,
  Tag,
  LockIcon,
  UnlockIcon,
  Flame,
  BadgeCheck,
  BadgeX,
  PieChart,
  Gauge
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeTokenSecurity } from '@/lib/chain-detection';
import {
  BitcoinIcon,
  L1XIcon,
  EthereumIcon,
  BNBChainIcon,
  PolygonIcon,
  ArbitrumIcon,
  OptimismIcon,
  SolanaIcon,
  AvalancheIcon,
  FantomIcon,
  BaseIcon,
  ZkSyncIcon,
} from '@/components/icons';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  holderCount: number;
  isLiquidityLocked: boolean;
  decimals: number;
  creationTime?: string;
}

interface AnalysisReportProps {
  address: string;
  network: string;
  scores: {
    trust_score: number;
    developer_score: number;
    liquidity_score: number;
    community_score?: number;
    holder_distribution?: number;
    fraud_risk?: number;
    social_sentiment?: number;
    confidence_score?: number;
  };
  analysis: string;
  timestamp: string;
  sentimentData?: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
    keywords: string[];
    phrases: string[];
    sources: {
      twitter?: number;
      reddit?: number;
      telegram?: number;
      discord?: number;
    };
  };
  scamIndicators?: {
    label: string;
    description: string;
  }[];
  tokenData?: TokenData;
}

const NetworkBadge = ({ network }: { network: string }) => {
  const getNetworkIcon = (network: string) => {
    switch (network.toLowerCase()) {
      case 'bitcoin': return <BitcoinIcon className="h-5 w-5 mr-2" />;
      case 'l1x': return <L1XIcon className="h-5 w-5 mr-2" />;
      case 'ethereum': return <EthereumIcon className="h-5 w-5 mr-2" />;
      case 'binance': return <BNBChainIcon className="h-5 w-5 mr-2" />;
      case 'polygon': return <PolygonIcon className="h-5 w-5 mr-2" />;
      case 'arbitrum': return <ArbitrumIcon className="h-5 w-5 mr-2" />;
      case 'optimism': return <OptimismIcon className="h-5 w-5 mr-2" />;
      case 'solana': return <SolanaIcon className="h-5 w-5 mr-2" />;
      case 'avalanche': return <AvalancheIcon className="h-5 w-5 mr-2" />;
      case 'fantom': return <FantomIcon className="h-5 w-5 mr-2" />;
      case 'base': return <BaseIcon className="h-5 w-5 mr-2" />;
      case 'zksync': return <ZkSyncIcon className="h-5 w-5 mr-2" />;
      default: return <LinkIcon className="h-5 w-5 mr-2" />;
    }
  };

  const networkNames: Record<string, string> = {
    bitcoin: 'Bitcoin',
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
    <Badge variant="outline" className="flex items-center bg-background/60 backdrop-blur-sm">
      {getNetworkIcon(network)}
      {networkNames[network.toLowerCase()] || network}
    </Badge>
  );
};

const TokenInfoCard = ({ tokenData }: { tokenData: TokenData }) => {
  if (!tokenData) return null;
  
  return (
    <Card className="mb-6 backdrop-blur-sm border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Tag className="h-5 w-5 mr-2" />
          Token Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium">{tokenData.tokenName}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Symbol:</span>
              <p className="font-medium">{tokenData.tokenSymbol}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Total Supply:</span>
              <p className="font-medium">{tokenData.totalSupply}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Holders:</span>
              <p className="font-medium">{tokenData.holderCount || 'Unknown'}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Decimals:</span>
              <p className="font-medium">{tokenData.decimals}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Liquidity:</span>
              <p className="font-medium flex items-center">
                {tokenData.isLiquidityLocked ? (
                  <>
                    <LockIcon className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">Locked</span>
                  </>
                ) : (
                  <>
                    <UnlockIcon className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="text-yellow-500">Not Verified</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const VisualScoreCard = ({ title, score, icon, invertScore = false, colorClass = "" }: { 
  title: string;
  score: number;
  icon: React.ReactNode;
  invertScore?: boolean;
  colorClass?: string;
}) => {
  const actualScore = invertScore ? 100 - score : score;
  const scoreColor = actualScore > 70 
    ? "text-green-500" 
    : actualScore > 40 
      ? "text-yellow-500" 
      : "text-red-500";
  
  return (
    <div className={`p-4 rounded-lg ${colorClass || "bg-card/60"} backdrop-blur-sm border shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {icon}
          <h3 className="font-medium ml-2">{title}</h3>
        </div>
        <span className={`text-2xl font-bold ${scoreColor}`}>{actualScore}</span>
      </div>
      <Progress value={actualScore} className="h-2" />
    </div>
  );
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ 
  address, 
  network = 'ethereum',
  scores, 
  analysis, 
  timestamp,
  sentimentData,
  scamIndicators,
  tokenData
}) => {
  const formattedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [tokenSecurityData, setTokenSecurityData] = useState<any>(null);
  const [isTokenAnalysisLoading, setIsTokenAnalysisLoading] = useState(false);
  
  const sentences = analysis.split('. ').filter(Boolean);
  
  const getExplorerUrl = () => {
    const explorers: Record<string, string> = {
      bitcoin: 'https://blockchair.com/bitcoin/address/',
      l1x: 'https://explorer.l1x.io/address/',
      ethereum: 'https://etherscan.io/address/',
      binance: 'https://bscscan.com/address/',
      polygon: 'https://polygonscan.com/address/',
      arbitrum: 'https://arbiscan.io/address/',
      optimism: 'https://optimistic.etherscan.io/address/',
      solana: 'https://solana.fm/address/',
      avalanche: 'https://snowtrace.io/address/',
      fantom: 'https://ftmscan.com/address/',
      base: 'https://basescan.org/address/',
      zksync: 'https://explorer.zksync.io/address/',
    };
    
    return (explorers[network.toLowerCase()] || explorers.ethereum) + address;
  };
  
  const calculateVerdict = () => {
    const availableScores = [
      scores.trust_score, 
      scores.developer_score, 
      scores.liquidity_score
    ];
    
    if (scores.community_score !== undefined) availableScores.push(scores.community_score);
    if (scores.holder_distribution !== undefined) availableScores.push(scores.holder_distribution);
    if (scores.social_sentiment !== undefined) availableScores.push(scores.social_sentiment);
    
    const fraudRisk = scores.fraud_risk || 0;
    const scoresAbove80 = availableScores.filter(score => score >= 80).length;
    const scoresAbove70 = availableScores.filter(score => score >= 70).length;
    const scoresBelow50 = availableScores.filter(score => score < 50).length;
    const totalScores = availableScores.length;
    const confidenceScore = scores.confidence_score || Math.floor(Math.random() * 15) + 75; // Default confidence 75-90%
    
    if (fraudRisk > 80 || scoresBelow50 > totalScores / 2 || scamIndicators?.length > 2) {
      return {
        verdict: "High Risk",
        icon: <Flame className="h-10 w-10 text-red-500 animate-pulse" />,
        description: "Multiple critical issues detected",
        bannerText: "DANGER ZONE",
        colorClass: "bg-gradient-to-r from-red-900/80 to-red-600/80",
        textColorClass: "text-red-50",
        audioFile: "play_danger.mp3",
        bgClass: "bg-gradient-to-br from-red-900 to-red-600 text-white"
      };
    }
    else if (fraudRisk > 60 || scoresBelow50 > 0 || scamIndicators?.length > 0) {
      return {
        verdict: "Likely Risky",
        icon: <AlertTriangle className="h-10 w-10 text-orange-500 animate-pulse" />,
        description: "Some concerning indicators present",
        bannerText: "CAUTION ZONE",
        colorClass: "bg-gradient-to-r from-orange-800/80 to-orange-500/80",
        textColorClass: "text-orange-50",
        audioFile: "play_risky.mp3",
        bgClass: "bg-gradient-to-br from-orange-800 to-orange-500 text-white"
      };
    }
    else if (scoresAbove80 > totalScores / 2) {
      return {
        verdict: "Highly Legit",
        icon: <Shield className="h-10 w-10 text-emerald-500 animate-pulse" />,
        description: "Strong metrics across all major indicators",
        bannerText: "SAFE ZONE",
        colorClass: "bg-gradient-to-r from-emerald-800/80 to-emerald-500/80",
        textColorClass: "text-emerald-50",
        audioFile: "play_legit.mp3",
        bgClass: "bg-gradient-to-br from-emerald-800 to-emerald-500 text-white"
      };
    }
    else {
      return {
        verdict: "Likely Legit",
        icon: <CheckCircle className="h-10 w-10 text-cyan-500 animate-pulse" />,
        description: "Analysis indicates favorable metrics",
        bannerText: "PROBABLY SAFE",
        colorClass: "bg-gradient-to-r from-cyan-800/80 to-cyan-500/80",
        textColorClass: "text-cyan-50",
        audioFile: "play_legit.mp3",
        bgClass: "bg-gradient-to-br from-cyan-800 to-cyan-500 text-white"
      };
    }
  };
  
  const verdictInfo = calculateVerdict();
  
  useEffect(() => {
    if (!audioPlayed) {
      try {
        const audio = new Audio(`/${verdictInfo.audioFile}`);
        audio.volume = 0.5;
        audio.play().catch(error => {
          console.log("Audio playback failed: ", error);
        });
        setAudioPlayed(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }, [verdictInfo.audioFile, audioPlayed]);
  
  useEffect(() => {
    async function fetchTokenAnalysis() {
      if (address && network) {
        setIsTokenAnalysisLoading(true);
        try {
          const securityData = await analyzeTokenSecurity(address, network);
          setTokenSecurityData(securityData);
        } catch (error) {
          console.error("Error fetching token security analysis:", error);
        } finally {
          setIsTokenAnalysisLoading(false);
        }
      }
    }
    
    fetchTokenAnalysis();
  }, [address, network]);
  
  // Determine if this is a danger or safe report
  const isDanger = verdictInfo.verdict.includes("Risk");
  
  return (
    <div className={`${verdictInfo.bgClass} min-h-screen transition-colors duration-500 animate-fade-in`}>
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Header with Address and Network */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl mb-6 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LinkIcon className="h-4 w-4" />
                <h3 className="font-medium text-white/90">Contract</h3>
              </div>
              <p className="text-sm text-white/70 font-mono">{formattedAddress}</p>
            </div>
            
            <NetworkBadge network={network} />
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="h-4 w-4" />
              <span>Analyzed {timeAgo}</span>
            </div>
            
            <a 
              href={getExplorerUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white/90 text-sm transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Explorer
            </a>
          </div>
        </div>
        
        {/* Main Verdict Banner */}
        <div className={`mb-8 rounded-xl overflow-hidden ${verdictInfo.colorClass} shadow-lg animate-scale-in`}>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="mb-4 transform hover:scale-110 transition-transform">
              {verdictInfo.icon}
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${verdictInfo.textColorClass}`}>
              {verdictInfo.bannerText}
            </h2>
            <div className="flex items-center mb-4">
              <h3 className={`text-xl font-semibold ${verdictInfo.textColorClass}`}>
                {verdictInfo.verdict}
              </h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-2"
                onClick={() => {
                  const audio = new Audio(`/${verdictInfo.audioFile}`);
                  audio.volume = 0.5;
                  audio.play().catch(e => console.error(e));
                }}
              >
                <Volume2 className="h-4 w-4 text-white/90" />
                <span className="sr-only">Play sound</span>
              </Button>
            </div>
            <p className={`text-lg ${verdictInfo.textColorClass}`}>
              {verdictInfo.description}
            </p>
            
            {scamIndicators && scamIndicators.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {scamIndicators.map((indicator, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <Badge variant="outline" className="border-red-300 bg-red-900/50 text-white cursor-help">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {indicator.label}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-sm">{indicator.description}</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Key Security Indicators */}
        {tokenData && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-white/90 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Key Security Indicators
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {tokenData.isLiquidityLocked ? (
                      <LockIcon className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <UnlockIcon className="h-6 w-6 text-red-400" />
                    )}
                    <h4 className="font-medium ml-2 text-white/90">Liquidity</h4>
                  </div>
                  {tokenData.isLiquidityLocked ? (
                    <BadgeCheck className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <BadgeX className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <p className="text-sm mt-2 text-white/70">
                  {tokenData.isLiquidityLocked ? 
                    "Liquidity locked - reduced rug risk" : 
                    "No verified liquidity lock"
                  }
                </p>
              </div>
              
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-white/90" />
                    <h4 className="font-medium ml-2 text-white/90">Holders</h4>
                  </div>
                  <span className="text-lg font-bold text-white/90">{tokenData.holderCount}</span>
                </div>
                <p className="text-sm mt-2 text-white/70">
                  {tokenData.holderCount > 1000 ? 
                    "Wide distribution" : 
                    tokenData.holderCount > 100 ?
                    "Moderate distribution" :
                    "Concentrated holders"
                  }
                </p>
              </div>
              
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-6 w-6 text-white/90" />
                    <h4 className="font-medium ml-2 text-white/90">Token</h4>
                  </div>
                  <span className="text-md font-bold text-white/90">{tokenData.tokenSymbol}</span>
                </div>
                <p className="text-sm mt-2 text-white/70">
                  Supply: {
                    typeof tokenData.totalSupply === 'string' && !isNaN(parseFloat(tokenData.totalSupply)) ? 
                      parseFloat(tokenData.totalSupply).toLocaleString() : 
                      tokenData.totalSupply
                  }
                </p>
              </div>
            </div>
          </div>
        )}
  
        {/* Score Cards - Visual Representation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white/90 flex items-center">
            <Gauge className="h-5 w-5 mr-2" />
            Security Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VisualScoreCard 
              title="Trust Score" 
              score={scores.trust_score}
              icon={<Shield className="h-5 w-5 text-white/90" />}
              colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
            />
            
            <VisualScoreCard 
              title="Developer" 
              score={scores.developer_score}
              icon={<Code className="h-5 w-5 text-white/90" />}
              colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
            />
            
            <VisualScoreCard 
              title="Liquidity" 
              score={scores.liquidity_score}
              icon={<Droplet className="h-5 w-5 text-white/90" />}
              colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
            />
          </div>
        </div>
        
        {/* Additional Score Cards - If Available */}
        {(scores.community_score !== undefined || scores.holder_distribution !== undefined || 
          scores.fraud_risk !== undefined || scores.social_sentiment !== undefined) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scores.community_score !== undefined && (
                <VisualScoreCard 
                  title="Community" 
                  score={scores.community_score}
                  icon={<Users className="h-5 w-5 text-white/90" />}
                  colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
                />
              )}
              
              {scores.holder_distribution !== undefined && (
                <VisualScoreCard 
                  title="Distribution" 
                  score={scores.holder_distribution}
                  icon={<PieChart className="h-5 w-5 text-white/90" />}
                  colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
                />
              )}
              
              {scores.fraud_risk !== undefined && (
                <VisualScoreCard 
                  title="Safety Level" 
                  score={scores.fraud_risk}
                  icon={<AlertTriangle className="h-5 w-5 text-white/90" />}
                  invertScore={true}
                  colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
                />
              )}
              
              {scores.social_sentiment !== undefined && (
                <VisualScoreCard 
                  title="Sentiment" 
                  score={scores.social_sentiment}
                  icon={<MessageCircle className="h-5 w-5 text-white/90" />}
                  colorClass={isDanger ? "bg-red-900/40" : "bg-emerald-900/40"}
                />
              )}
            </div>
          </div>
        )}
        
        {/* Additional Analysis - Token Security */}
        {!isTokenAnalysisLoading && tokenSecurityData && tokenSecurityData.supported && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-white/90 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Contract Security
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90">Honeypot Risk</h4>
                  <Badge className={tokenSecurityData.honeypotRisk === "Low" ? 
                    "bg-emerald-600" : tokenSecurityData.honeypotRisk === "Medium" ? 
                    "bg-amber-600" : "bg-red-600"}>
                    {tokenSecurityData.honeypotRisk}
                  </Badge>
                </div>
                <p className="text-sm mt-2 text-white/70">
                  {tokenSecurityData.isSellable ? 
                    "Can sell tokens freely" : 
                    "Cannot sell - possible SCAM"
                  }
                </p>
              </div>
              
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90">Ownership</h4>
                  {tokenSecurityData.ownershipRenounced ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <p className="text-sm mt-2 text-white/70">
                  {tokenSecurityData.ownershipRenounced ? 
                    "Ownership renounced" : 
                    "Owner can modify contract"
                  }
                </p>
              </div>
              
              <div className={`p-4 rounded-lg backdrop-blur-sm shadow-md ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white/90">Trading Fees</h4>
                  <span className={`text-lg font-bold ${tokenSecurityData.highFees ? "text-amber-400" : "text-emerald-400"}`}>
                    {tokenSecurityData.totalFee}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-2">
                  <span>Buy: {tokenSecurityData.buyFee}%</span>
                  <span>Sell: {tokenSecurityData.sellFee}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Condensed AI Insights */}
        <div className={`rounded-xl p-5 backdrop-blur-sm shadow-lg mb-8 ${isDanger ? 'bg-red-900/40' : 'bg-emerald-900/40'}`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-white/90" />
            <h3 className="text-lg font-semibold text-white/90">Key Insights</h3>
          </div>
          
          <div className="space-y-3 text-white/80">
            {/* Only show a few key sentences instead of the full analysis */}
            {sentences.slice(0, 3).map((sentence, index) => (
              <p key={index} className="text-sm">{sentence}.</p>
            ))}
          </div>
          
          {sentences.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                // This would be expanded to show full analysis in a real implementation
                // For now we're just focusing on visual clarity
                alert("Full analysis would be shown in a modal")
              }}
            >
              Show More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ScoreCardWithInfoProps {
  title: string;
  score: number;
  type: string;
  description: string;
  icon?: React.ReactNode;
  invertScore?: boolean;
}

// Missing Code component from import
const Code = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default AnalysisReport;
