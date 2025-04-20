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

// API keys from user input
const API_KEYS = {
  ethereum: "VZFDUWB3YGQ1YCDKTCU1D6DDSS",
  binance: "ZM8ACMJB67C2IXKKBF8URFUNSY",
  avalanche: "ATJQERBKV1CI3GVKNSE3Q7RGEJ",
  arbitrum: "B6SVGA7K3YBJEQ69AFKJF4YHVX",
  optimism: "66N5FRNV1ZD4I87S7MAHCJVXFJ"
};

// API URLs
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
    contractCreation?: string;
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

interface TokenData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  holderCount: number;
  isLiquidityLocked: boolean;
  decimals: number;
  creationTime?: string;
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

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
      return;
    }

    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        
        // First try tokeninfo endpoint
        const tokenInfoUrl = `${API_URLS[network as keyof typeof API_URLS] || API_URLS.ethereum}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${API_KEYS[network as keyof typeof API_KEYS] || API_KEYS.ethereum}`;
        const sourceCodeUrl = `${API_URLS[network as keyof typeof API_URLS] || API_URLS.ethereum}?module=contract&action=getsourcecode&address=${address}&apikey=${API_KEYS[network as keyof typeof API_KEYS] || API_KEYS.ethereum}`;

        const [tokenInfoResponse, sourceCodeResponse] = await Promise.all([
          fetch(tokenInfoUrl),
          fetch(sourceCodeUrl)
        ]);

        const tokenInfoData: TokenInfoResponse = await tokenInfoResponse.json();
        const sourceCodeData: SourceCodeResponse = await sourceCodeResponse.json();

        console.log('Token Info Response:', tokenInfoData);
        console.log('Source Code Response:', sourceCodeData);

        let tokenInfo: TokenData = {
          tokenName: 'Unverified Contract',
          tokenSymbol: 'UNKNOWN',
          totalSupply: '0',
          decimals: 18,
          holderCount: 0,
          isLiquidityLocked: false
        };

        // Try to get token info from tokeninfo endpoint first
        if (tokenInfoData.status === '1' && tokenInfoData.result.length > 0) {
          const result = tokenInfoData.result[0];
          tokenInfo = {
            tokenName: result.tokenName || 'Unverified Contract',
            tokenSymbol: result.symbol || 'UNKNOWN',
            totalSupply: result.totalSupply || '0',
            decimals: parseInt(result.divisor || '18'),
            holderCount: 0,
            isLiquidityLocked: false,
            creationTime: result.contractCreation ? 
              new Date(parseInt(result.contractCreation) * 1000).toISOString() : undefined
          };
        }
        // Fallback to source code data if tokeninfo fails
        else if (sourceCodeData.status === '1' && sourceCodeData.result.length > 0) {
          const result = sourceCodeData.result[0];
          tokenInfo = {
            ...tokenInfo,
            tokenName: result.ContractName !== 'Unknown' ? result.ContractName : 'Unverified Contract',
            creationTime: result.DeployedTimestamp ? 
              new Date(parseInt(result.DeployedTimestamp) * 1000).toISOString() : undefined
          };
        }

        // If using our enhanced Etherscan API analysis
        if (network === 'ethereum') {
          try {
            const ethAnalysisResponse = await analyzeEthereumToken(address);
            if (ethAnalysisResponse.data) {
              setContractAnalysis(ethAnalysisResponse.data);
              
              // Update token info with any additional data
              const overviewData = ethAnalysisResponse.data.tokenOverview;
              tokenInfo = {
                ...tokenInfo,
                tokenName: overviewData.name || tokenInfo.tokenName,
                tokenSymbol: overviewData.symbol || tokenInfo.tokenSymbol,
                totalSupply: overviewData.totalSupply || tokenInfo.totalSupply,
                decimals: overviewData.decimals || tokenInfo.decimals,
                holderCount: Math.floor(Math.random() * 1000) + 100, // To be replaced with real data
                isLiquidityLocked: ethAnalysisResponse.data.contractVulnerability.liquidityLocked,
                creationTime: overviewData.creationTime || tokenInfo.creationTime
              };
            }
          } catch (ethError) {
            console.error("Error in Etherscan analysis:", ethError);
          }
        }

        setTokenData(tokenInfo);
        
        // Generate analysis data
        const analysisScores = {
          trust_score: Math.floor(Math.random() * 30) + 70,
          developer_score: Math.floor(Math.random() * 20) + 80,
          liquidity_score: tokenInfo.isLiquidityLocked ? 85 : 45,
          community_score: Math.floor(Math.random() * 20) + 70,
          holder_distribution: Math.floor(Math.random() * 30) + 60,
          fraud_risk: Math.floor(Math.random() * 20),
          social_sentiment: Math.floor(Math.random() * 20) + 70
        };

        const analysisText = `${tokenInfo.tokenName} (${tokenInfo.tokenSymbol}) was analyzed. The contract ${sourceCodeData.status === '1' ? 'is verified' : 'is not verified'} on ${network}. ${tokenInfo.isLiquidityLocked ? 'The liquidity appears to be locked.' : 'No verified liquidity lock was found.'}`;

        setAnalysisData({
          scores: analysisScores,
          analysis: analysisText,
          timestamp: new Date().toISOString(),
          tokenData: tokenInfo
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
            >
              {showVisualReport ? "Show Tabbed Report" : "Show Visual Report"}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Analysis Results</h1>
            <div className="text-sm text-muted-foreground">
              Network: {network}
            </div>
          </div>

          <div className="bg-card rounded-lg p-4">
            <p className="text-sm font-mono bg-muted/30 p-2 rounded">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
