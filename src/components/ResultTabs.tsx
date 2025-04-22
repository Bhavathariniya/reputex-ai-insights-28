
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertTriangle, AreaChart, FileCog, LineChart, ShieldAlert, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { getTokenInfo, TokenInfo } from "@/lib/coingecko-client";
import { analyzeTrustScore, TrustAnalysis } from "@/lib/gemini-client";
import { getCompleteTokenAnalysis } from "@/lib/alchemy-client";
import { TokenData, TokenAnalysisResult, TokenContractData } from "@/lib/types";
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

const ResultTabs = () => {
  const { address } = useParams<{ address: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TrustAnalysis | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [contractData, setContractData] = useState<TokenContractData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [network, setNetwork] = useState("eth");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        if (address.startsWith('0x') && address.length === 42) {
          // Fetch from CoinGecko for high-level token info
          const coinGeckoInfo = await getTokenInfo('ethereum', address);
          if (coinGeckoInfo) {
            setTokenInfo(coinGeckoInfo);
          }
          
          // Fetch from Alchemy for detailed analysis
          const { tokenData, analysisResult, contractData } = await getCompleteTokenAnalysis(address);
          
          setTokenData(tokenData);
          setAnalysisResult(analysisResult);
          setContractData(contractData);
          
          // If we didn't get CoinGecko data but got Alchemy data
          if (!coinGeckoInfo && tokenData) {
            // Create a minimal TokenInfo object from Alchemy data
            setTokenInfo({
              id: address,
              name: tokenData.tokenName,
              symbol: tokenData.tokenSymbol,
              image_url: '',
              description: '',
              websites: [],
              gt_score: analysisResult.trustScore || 50,
              holders: {
                count: tokenData.holderCount,
                distribution_percentage: {
                  top_10: '50', // Placeholder
                  '11_30': '20', // Placeholder
                  '31_50': '10', // Placeholder
                  rest: '20', // Placeholder
                },
                last_updated: new Date().toISOString()
              }
            });
          }
        } else {
          setError('Invalid Ethereum address format');
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        setError('Failed to load token data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, [address]);

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
          <div className="flex flex-col items-center justify-center p-8">
            <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
            <p className="text-lg text-center">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockTokenStats: TokenStatsProps = {
    address: address || "",
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
              `Comprehensive blockchain intelligence for ${address}` : 
              `Analyzing address ${address || "unknown"}`}
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
            {tokenData && (
              <TokenAnalysis 
                address={address || ""} 
                network={network} 
                tokenData={tokenData} 
              />
            )}
          </TabsContent>

          <TabsContent value="contract">
            {contractData && (
              <TokenContractAnalysis 
                address={address || ""} 
                tokenData={contractData} 
              />
            )}
          </TabsContent>

          <TabsContent value="stats">
            <TokenStats {...mockTokenStats} />
          </TabsContent>

          <TabsContent value="report">
            {analysisResult && tokenData && (
              <AnalysisReport 
                address={address || ""}
                network={network}
                scores={{
                  trust_score: analysisResult.trustScore,
                  developer_score: analysisResult.developerScore || 75,
                  liquidity_score: analysisResult.liquidityScore || 60,
                  community_score: analysisResult.communityScore || 80,
                  holder_distribution: analysisResult.holderDistributionScore || 70,
                  fraud_risk: analysisResult.fraudRisk || 15,
                  social_sentiment: analysisResult.socialSentiment || 75
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
