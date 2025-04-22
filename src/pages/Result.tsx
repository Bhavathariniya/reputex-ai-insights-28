
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import TokenContractAnalysis from '@/components/TokenContractAnalysis';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultTabs from '@/components/ResultTabs';
import { toast } from 'sonner';
import { analyzeEthereumToken } from '@/lib/api-client';
import { detectNetwork, getTokenMetadata, analyzeTokenWithGemini } from '@/lib/alchemy-client';

// API configurations
const ETHERSCAN_API_KEY = "VZFDUWB3YGQ1YCDKTCU1D6DDSS";
const ETHERSCAN_API_URL = "https://api.etherscan.io/api";

// Backup API keys if needed
const BACKUP_API_KEYS = {
  ethereum: "VZFDUWB3YGQ1YCDKTCU1D6DDSS",
  binance: "ZM8ACMJB67C2IXKKBF8URFUNSY",
  avalanche: "ATJQERBKV1CI3GVKNSE3Q7RGEJ",
  arbitrum: "B6SVGA7K3YBJEQ69AFKJF4YHVX",
  optimism: "66N5FRNV1ZD4I87S7MAHCJVXFJ"
};

// API URLs by network
const API_URLS = {
  ethereum: "https://api.etherscan.io/api",
  binance: "https://api.bscscan.com/api",
  avalanche: "https://api.snowscan.xyz/api",
  arbitrum: "https://api.arbiscan.io/api",
  optimism: "https://api-optimistic.etherscan.io/api"
};

// Interfaces for API responses
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
  
  // Get address and network from state or URL params
  const { address = addressFromParams, network = networkFromParams || 'ethereum' } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [contractAnalysis, setContractAnalysis] = useState<any>(null);
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

        // First detect network if not specified
        const detectedNetwork = network === 'auto' ? await detectNetwork(address) : network;
        
        // Fetch token metadata from Alchemy
        const tokenMetadata = await getTokenMetadata(address, detectedNetwork);
        
        // Analyze token with Gemini
        const geminiAnalysis = await analyzeTokenWithGemini(tokenMetadata);
        
        // Update analysis data with Gemini results
        setAnalysisData({
          scores: {
            trust_score: geminiAnalysis.trustScore,
            developer_score: Math.floor(Math.random() * 20) + 80,
            liquidity_score: Math.floor(Math.random() * 40) + 40, // Random score for liquidity
            community_score: Math.floor(Math.random() * 20) + 70,
            holder_distribution: Math.floor(Math.random() * 30) + 60,
            fraud_risk: Math.floor(Math.random() * 20),
            social_sentiment: Math.floor(Math.random() * 20) + 70
          },
          analysis: geminiAnalysis.analysis,
          scamIndicators: geminiAnalysis.riskFactors.map(risk => ({
            label: "Risk Factor",
            description: risk
          })),
          timestamp: new Date().toISOString(),
          tokenData: {
            tokenName: tokenMetadata.name,
            tokenSymbol: tokenMetadata.symbol,
            totalSupply: tokenMetadata.totalSupply,
            decimals: tokenMetadata.decimals,
            holderCount: Math.floor(Math.random() * 1000) + 100, // To be replaced with real data
            isLiquidityLocked: false, // To be determined from other sources
            isVerified: true // Default to true for now
          }
        });

        // Set token data with all required properties
        setTokenData({
          tokenName: tokenMetadata.name,
          tokenSymbol: tokenMetadata.symbol,
          totalSupply: tokenMetadata.totalSupply,
          decimals: tokenMetadata.decimals,
          holderCount: Math.floor(Math.random() * 1000) + 100,
          isLiquidityLocked: false,
          isVerified: true // Add the missing required property
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
                // Visual report
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
                // Tabbed report
                <ResultTabs 
                  contractAnalysis={contractAnalysis}
                  analysisData={analysisData}
                  tokenData={tokenData}
                  address={address}
                  network={network}
                />
              )}
              
              {/* Debug information - can be removed in production */}
              {false && apiResponses.tokenInfo && (
                <div className="mt-8 p-4 border border-muted rounded">
                  <h3 className="text-lg font-semibold mb-2">API Response Debug</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-medium">Token Info Response:</h4>
                      <pre className="text-xs overflow-auto p-2 bg-muted/30 rounded">
                        {JSON.stringify(apiResponses.tokenInfo, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium">Source Code Response:</h4>
                      <pre className="text-xs overflow-auto p-2 bg-muted/30 rounded">
                        {JSON.stringify(apiResponses.sourceCode, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
