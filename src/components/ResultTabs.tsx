import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertTriangle, AreaChart, FileCog, LineChart, ShieldAlert, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { getTokenInfo, TokenInfo } from "@/lib/coingecko-client";
import { analyzeTrustScore, TrustAnalysis } from "@/lib/gemini-client";
import TokenOverview from "./TokenOverview";
import TokenReputation from "./TokenReputation";
import RiskAnalysis from "./RiskAnalysis";
import WalletDetails from "./WalletDetails";
import ScamPattern from "./ScamPattern";
import SentimentMeter from "./SentimentMeter";
import ScoreCard from "./ScoreCard";
import TokenAnalysis from "./TokenAnalysis";
import TokenContractAnalysis from "./TokenContractAnalysis";
import TokenStats, { TokenStatsProps } from "./TokenStats";
import AnalysisReport from "./AnalysisReport";
import LoadingAnimation from "./LoadingAnimation";
import { toast } from "sonner";

interface TokenData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  holderCount: number;
  isLiquidityLocked: boolean;
  decimals: number;
  creationTime?: string;
  contractCreator?: string;
  isVerified: boolean;
  compilerVersion?: string;
}

// Map networks to their ID values used by API services
const NETWORK_MAP: Record<string, string> = {
  'ethereum': 'eth',
  'eth': 'eth',
  'binance': 'bsc',
  'bsc': 'bsc',
  'polygon': 'polygon',
  'arbitrum': 'arbitrum',
  'optimism': 'optimism',
  'avalanche': 'avalanche',
  'fantom': 'fantom',
  'solana': 'solana',
  'base': 'base',
  'zksync': 'zksync'
};

const ResultTabs = () => {
  // Get address from URL parameters
  const { address: paramAddress } = useParams<{ address: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Try to get address from multiple sources
  const addressFromParams = searchParams.get('address');
  const address = paramAddress || addressFromParams || (location.state?.address as string);
  
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TrustAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [network, setNetwork] = useState("eth");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get network from localStorage, URL params or state
    const storedNetwork = localStorage.getItem('selectedNetwork') || 'eth';
    const networkParam = searchParams.get('network');
    const networkFromState = location.state?.network;
    
    // Use network param if provided, otherwise use stored network
    const selectedNetwork = networkParam ? 
      NETWORK_MAP[networkParam.toLowerCase()] || networkParam.toLowerCase() : 
      networkFromState ? 
        NETWORK_MAP[networkFromState.toLowerCase()] || networkFromState.toLowerCase() :
        storedNetwork;
    
    setNetwork(selectedNetwork);
    
    const fetchTokenData = async () => {
      if (!address) {
        setError("No token address provided");
        return;
      }
      
      console.log("Fetching data for address:", address, "on network:", selectedNetwork);
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First, validate the address format (basic check)
        let isValidAddress = false;
        
        // Check if it's a valid Ethereum/EVM address
        if (selectedNetwork !== 'solana') {
          isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
        } 
        // Check if it's a valid Solana address
        else {
          isValidAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        }
        
        if (!isValidAddress) {
          throw new Error(`Invalid ${selectedNetwork} address format`);
        }
        
        // Get token info from CoinGecko
        const info = await getTokenInfo(selectedNetwork, address);
        
        if (info) {
          // Add network information to the token info
          const enrichedInfo = {
            ...info,
            network: selectedNetwork
          };
          
          setTokenInfo(enrichedInfo);
          
          // Analyze the token using the Gemini API
          const analysis = await analyzeTrustScore(enrichedInfo);
          setAnalysisResult(analysis);
          
          toast.success(`Successfully analyzed ${info.name || 'token'}`);
        } else {
          throw new Error(`Token information not found. The token may not be listed on CoinGecko.`);
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        setError((error as Error).message || 'Failed to analyze token. Please check the contract address and network.');
        toast.error('Failed to analyze token');
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      fetchTokenData();
    } else {
      setError("No token address provided");
    }
  }, [address, searchParams, location.state]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <LoadingAnimation />
            <p className="mt-4 text-lg">Analyzing blockchain data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-medium mb-4">{error}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Please check that you've entered a valid contract address for the {network} network.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock data for UI display when real data isn't available
  const mockTokenStats: TokenStatsProps = {
    address: address,
    trendingTokens: [
      {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        name: "Sample Token 1",
        symbol: "ST1",
        network: "ethereum",
        trustScore: 85,
        riskLevel: "Low Risk",
        timestamp: new Date().toISOString()
      },
      {
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        name: "Sample Token 2",
        symbol: "ST2",
        network: "ethereum",
        trustScore: 65,
        riskLevel: "Medium Risk",
        timestamp: new Date().toISOString()
      }
    ],
    trustedTokens: [
      {
        address: "0x1234567890abcdef1234567890abcdef12345678",
        name: "Sample Token 1",
        symbol: "ST1",
        network: "ethereum",
        trustScore: 95,
        timestamp: new Date().toISOString()
      }
    ],
    recentTokens: [
      {
        address: "0xabcdef1234567890abcdef1234567890abcdef12",
        name: "Sample Token 2",
        symbol: "ST2",
        network: "ethereum",
        riskLevel: "Medium Risk",
        timestamp: new Date().toISOString()
      }
    ]
  };

  const mockContractData = {
    tokenOverview: {
      name: tokenInfo?.name || "Unknown Token",
      symbol: tokenInfo?.symbol || "???",
      address: address || "",
      decimals: 18,
      totalSupply: "1000000000000000000000000",
      deployer: "0x1234567890abcdef1234567890abcdef12345678",
      creationTime: new Date().toISOString()
    },
    rugPullRisk: {
      score: 20,
      level: "Low Risk",
      indicators: [],
      ownershipRenounced: true
    },
    honeypotCheck: {
      isHoneypot: false,
      risk: "Low",
      indicators: []
    },
    contractVulnerability: {
      isVerified: true,
      riskyFunctions: [],
      liquidityLocked: true
    },
    sybilAttack: {
      score: 15,
      level: "Low Risk",
      suspiciousAddresses: 2,
      uniqueReceivers: 45,
      uniqueSenders: 38
    },
    walletReputation: {
      score: 85,
      level: "Trustworthy",
      previousScams: 0
    },
    scamPatternMatch: "This token does not match known scam patterns.",
    timestamp: new Date().toISOString()
  };

  const tokenData: TokenData = {
    tokenName: tokenInfo?.name || "Unknown Token",
    tokenSymbol: tokenInfo?.symbol || "???",
    totalSupply: "1000000000000000000000000",
    holderCount: tokenInfo?.holders?.count || 500,
    isLiquidityLocked: true,
    decimals: 18,
    isVerified: true
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {tokenInfo?.name ? `Analysis for ${tokenInfo.name} (${tokenInfo.symbol})` : "Analysis Results"}
            </CardTitle>
            
            {analysisResult && (
              <div className="flex items-center">
                <SentimentMeter score={analysisResult.trustScore} size="small" />
                <div className="ml-2">
                  <p className="text-lg font-bold">{analysisResult.trustScore}/100</p>
                  <p className="text-xs text-gray-500">Trust Score</p>
                </div>
              </div>
            )}
          </div>
          <CardDescription>
            {tokenInfo ? 
              `Comprehensive blockchain intelligence for ${address} on ${network}` : 
              `Analyzing address ${address || "unknown"} on ${network}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsList className="grid w-full grid-cols-5 md:grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="reputation" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Reputation</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden md:inline">Risk Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">Wallet Details</span>
            </TabsTrigger>
            <TabsTrigger value="scam" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden md:inline">Scam Pattern</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TokenOverview tokenInfo={tokenInfo} analysis={analysisResult} />
          </TabsContent>

          <TabsContent value="reputation">
            <TokenReputation tokenInfo={tokenInfo} analysis={analysisResult} />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAnalysis tokenInfo={tokenInfo} analysis={analysisResult} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletDetails tokenInfo={tokenInfo} />
          </TabsContent>

          <TabsContent value="scam">
            <ScamPattern tokenInfo={tokenInfo} analysis={analysisResult} />
          </TabsContent>

          <TabsContent value="transactions">
            <TokenAnalysis address={address || ""} network={network} tokenData={tokenData} />
          </TabsContent>

          <TabsContent value="contract">
            <TokenContractAnalysis address={address || ""} tokenData={mockContractData} />
          </TabsContent>

          <TabsContent value="stats">
            <TokenStats {...mockTokenStats} />
          </TabsContent>

          <TabsContent value="report">
            {analysisResult && (
              <AnalysisReport 
                address={address || ""}
                network={network}
                scores={{
                  trust_score: analysisResult.trustScore,
                  developer_score: 75,
                  liquidity_score: 60,
                  community_score: 80,
                  holder_distribution: 70,
                  fraud_risk: 15,
                  social_sentiment: 75
                }}
                analysis={analysisResult.analysis}
                timestamp={new Date().toISOString()}
                tokenData={tokenData}
                scamIndicators={analysisResult.riskFactors.map(risk => ({
                  label: "Risk Factor",
                  description: risk
                }))}
              />
            )}
          </TabsContent>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            Data provided by CoinGecko and blockchain analysis. Last updated: {new Date().toLocaleString()}
          </p>
        </CardFooter>
      </Card>
    </Tabs>
  );
};

export default ResultTabs;
