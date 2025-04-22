import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import TokenStats from "./TokenStats";
import AnalysisReport from "./AnalysisReport";
import LoadingAnimation from "./LoadingAnimation";

const ResultTabs = () => {
  const { address } = useParams<{ address: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<TrustAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        // Try to detect if the address is a token contract
        if (address.startsWith('0x') && address.length === 42) {
          // Fetch token info from CoinGecko
          // Default to Ethereum network, but in a full implementation we would detect the network
          const info = await getTokenInfo('eth', address);
          
          if (info) {
            setTokenInfo(info);
            
            // Generate trust analysis
            const analysis = await analyzeTrustScore(info);
            setAnalysisResult(analysis);
          }
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
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
            <TokenAnalysis address={address || ""} />
          </TabsContent>

          <TabsContent value="contract">
            <TokenContractAnalysis address={address || ""} />
          </TabsContent>

          <TabsContent value="stats">
            <TokenStats address={address || ""} />
          </TabsContent>

          <TabsContent value="report">
            <AnalysisReport address={address || ""} />
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
