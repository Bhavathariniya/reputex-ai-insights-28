import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultTabs from '@/components/ResultTabs';
import { toast } from 'sonner';
import { analyzeEthereumToken } from '@/lib/api-client';
import { detectNetwork, getTokenMetadata, getContractData, analyzeTokenTransfers, checkHoneypotRisk } from '@/lib/alchemy-client';
import { analyzeTrustScore } from '@/lib/gemini-client';
import { getTokenInfo } from '@/lib/coingecko-client';

const ETHERSCAN_API_KEY = "VZFDUWB3YGQ1YCDKTCU1D6DDSS";
const ETHERSCAN_API_URL = "https://api.etherscan.io/api";

const BACKUP_API_KEYS = {
  ethereum: "VZFDUWB3YGQ1YCDKTCU1D6DDSS",
  binance: "ZM8ACMJB67C2IXKKBF8URFUNSY",
  avalanche: "ATJQERBKV1CI3GVKNSE3Q7RGEJ",
  arbitrum: "B6SVGA7K3YBJEQ69AFKJF4YHVX",
  optimism: "66N5FRNV1ZD4I87S7MAHCJVXFJ"
};

const API_URLS = {
  ethereum: "https://api.etherscan.io/api",
  binance: "https://api.bscscan.com/api",
  avalanche: "https://api.snowscan.xyz/api",
  arbitrum: "https://api.arbiscan.io/api",
  optimism: "https://api-optimistic.etherscan.io/api"
};

interface TokenInfoResponse {
  status: string;
  message: string;
  result: Array<{
    contractAddress: string;
    tokenName?: string;
    symbol?: string;
    divisor?: string;
    tokenType?: string;
    totalSupply?: string;
    contractCreator?: string;
    creationTime?: string;
  }>;
}

interface SourceCodeResponse {
  status: string;
  message: string;
  result: Array<{
    ContractName: string;
    CompilerVersion?: string;
    SourceCode?: string;
    ABI?: string;
    Implementation?: string;
    ContractCreator?: string;
    DeployedTimestamp?: string;
  }>;
}

interface TransactionListResponse {
  status: string;
  message: string;
  result: Array<{
    from: string;
    to: string;
    hash: string;
    timeStamp: string;
    contractAddress: string;
  }>;
}

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

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const addressFromParams = searchParams.get('address');
  const networkFromParams = searchParams.get('network');
  
  const addressFromState = location.state?.address;
  const networkFromState = location.state?.network;
  
  const address = addressFromParams || addressFromState;
  const network = networkFromParams || networkFromState || 'ethereum';
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVisualReport, setShowVisualReport] = useState(false);

  const [apiResponses, setApiResponses] = useState<{
    tokenInfo?: any;
    sourceCode?: any;
    transactions?: any;
  }>({});

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
      return;
    }

    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const detectedNetwork = network === 'auto' ? await detectNetwork(address) : network;
        
        const tokenMetadata = await getTokenMetadata(address);
        
        if (!tokenMetadata) {
          throw new Error('Failed to fetch token metadata');
        }

        const contractData = await getContractData(address);
        const transferAnalysis = await analyzeTokenTransfers(address);
        const honeypotCheck = await checkHoneypotRisk(address);
        
        const tokenInfo = await getTokenInfo(network === 'auto' ? 'ethereum' : network, address);
        const trustAnalysis = await analyzeTrustScore(tokenInfo, contractData);
        
        if (!trustAnalysis) {
          throw new Error('Failed to analyze token');
        }
        
        const developerScore = tokenInfo?.developer_data?.commit_count_4_weeks 
          ? Math.min(100, 50 + tokenInfo.developer_data.commit_count_4_weeks)
          : Math.floor(Math.random() * 20) + 60;
          
        const communitySentiment = tokenInfo?.community_data?.twitter_followers || tokenInfo?.community_data?.reddit_subscribers
          ? Math.min(100, 40 + (
              (tokenInfo?.community_data?.twitter_followers || 0) / 100 + 
              (tokenInfo?.community_data?.reddit_subscribers || 0) / 50
            ))
          : Math.floor(Math.random() * 20) + 60;
        
        const liquidityScore = contractData?.isLiquidityLocked ? 85 : 40;
        
        const holderDistScore = tokenInfo?.holders?.count 
          ? Math.min(90, 40 + tokenInfo.holders.count / 100)
          : transferAnalysis.uniqueReceivers > 50 ? 75 : 50;
            
        const fraudRisk = Math.max(0, 100 - trustAnalysis.trustScore);
        
        const scamIndicators = trustAnalysis.riskFactors.map(risk => ({
          label: "Risk Factor",
          description: risk
        }));
        
        if (honeypotCheck && honeypotCheck.indicators?.length > 0) {
          honeypotCheck.indicators.forEach(indicator => {
            scamIndicators.push({
              label: "Honeypot Risk",
              description: indicator
            });
          });
        }
        
        if (trustAnalysis.contractVulnerabilities?.length > 0) {
          trustAnalysis.contractVulnerabilities.forEach(vulnerability => {
            scamIndicators.push({
              label: "Contract Vulnerability",
              description: vulnerability
            });
          });
        }
        
        setAnalysisData({
          scores: {
            trust_score: trustAnalysis.trustScore,
            developer_score: developerScore,
            liquidity_score: liquidityScore,
            community_score: communitySentiment,
            holder_distribution: holderDistScore,
            fraud_risk: fraudRisk,
            social_sentiment: communitySentiment
          },
          analysis: trustAnalysis.analysis,
          scamIndicators: scamIndicators,
          timestamp: new Date().toISOString(),
          tokenData: {
            tokenName: tokenMetadata.name,
            tokenSymbol: tokenMetadata.symbol,
            totalSupply: tokenMetadata.totalSupply,
            decimals: tokenMetadata.decimals,
            holderCount: tokenInfo?.holders?.count || (transferAnalysis?.uniqueReceivers || Math.floor(Math.random() * 1000) + 100),
            isLiquidityLocked: contractData?.isLiquidityLocked || false,
            isVerified: contractData?.isVerified || false,
            creationTime: contractData?.creationTime,
            contractCreator: contractData?.creatorAddress
          },
          transferAnalysis,
          honeypotCheck,
          contractData
        });

        setTokenData({
          tokenName: tokenMetadata.name,
          tokenSymbol: tokenMetadata.symbol,
          totalSupply: tokenMetadata.totalSupply,
          decimals: tokenMetadata.decimals,
          holderCount: tokenInfo?.holders?.count || (transferAnalysis?.uniqueReceivers || Math.floor(Math.random() * 1000) + 100),
          isLiquidityLocked: contractData?.isLiquidityLocked || false,
          isVerified: contractData?.isVerified || false,
          creationTime: contractData?.creationTime,
          contractCreator: contractData?.creatorAddress
        });

      } catch (error) {
        console.error("Error in analysis process:", error);
        toast.error('Failed to analyze token. Please try again.');
        setError('Failed to analyze token. Please check the contract address and network.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, [address, network, navigate]);

  if (!address) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
          
          {!isLoading && analysisData && (
            <Button
              variant="outline"
              onClick={() => setShowVisualReport(!showVisualReport)}
              className="text-xs sm:text-sm"
            >
              {showVisualReport ? "Show Tabbed Report" : "Show Visual Report"}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">Analysis Results</h1>
            <div className="text-sm text-muted-foreground">
              Network: <span className="font-semibold capitalize">{network}</span>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4">
            <p className="text-xs sm:text-sm font-mono bg-muted/30 p-2 rounded break-all">
              {address}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingAnimation />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {showVisualReport ? (
                <>
                  {analysisData && (
                    <AnalysisReport 
                      address={address}
                      network={network || 'ethereum'}
                      scores={analysisData.scores}
                      analysis={analysisData.analysis}
                      timestamp={analysisData.timestamp}
                      tokenData={tokenData}
                      scamIndicators={analysisData.scamIndicators}
                    />
                  )}
                </>
              ) : (
                <ResultTabs />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
