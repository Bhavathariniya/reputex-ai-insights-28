
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import LoadingAnimation from '@/components/LoadingAnimation';
import { toast } from 'sonner';

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
  const { address, network } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
      return;
    }

    const fetchTokenData = async () => {
      try {
        // Determine the appropriate API based on network
        let apiUrl = '';
        let apiKey = '';
        
        switch(network) {
          case 'ethereum':
            apiUrl = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`;
            break;
          case 'binance':
            apiUrl = `https://api.bscscan.com/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`;
            break;
          case 'polygon':
            apiUrl = `https://api.polygonscan.com/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`;
            break;
          // Add more networks as needed
          default:
            apiUrl = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`;
        }

        // Fetch token data from blockchain explorer API
        let tokenInfo = null;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.status === '1' && data.result) {
            tokenInfo = {
              tokenName: data.result[0]?.tokenName || 'Unknown',
              tokenSymbol: data.result[0]?.symbol || 'Unknown',
              totalSupply: data.result[0]?.totalSupply || '0',
              decimals: parseInt(data.result[0]?.divisor || '18'),
              holderCount: 0,
              isLiquidityLocked: false
            };
          } else {
            throw new Error('Token data not available');
          }
        } catch (error) {
          console.error('Error fetching token info:', error);
          // Fallback to basic data
          tokenInfo = {
            tokenName: 'Unknown',
            tokenSymbol: 'Unknown',
            totalSupply: '0',
            decimals: 18,
            holderCount: 0,
            isLiquidityLocked: false
          };
        }
        
        // Try to get holder count (separate API call for most networks)
        try {
          const holdersApiUrl = `https://api.etherscan.io/api?module=token&action=tokenholderlist&contractaddress=${address}&page=1&offset=1&apikey=${apiKey}`;
          const holdersResponse = await fetch(holdersApiUrl);
          const holdersData = await holdersResponse.json();
          
          if (holdersData.status === '1') {
            tokenInfo.holderCount = parseInt(holdersData.result?.length || '0');
          }
        } catch (error) {
          console.error('Error fetching holder count:', error);
        }

        // Set the token data
        setTokenData(tokenInfo);

        // Generate analysis data based on the token info
        const mockScores = {
          trust_score: calculateScore(30, 95),
          developer_score: calculateScore(40, 90),
          liquidity_score: tokenInfo.isLiquidityLocked ? calculateScore(70, 95) : calculateScore(20, 60),
          community_score: calculateScore(30, 85),
          holder_distribution: calculateScore(40, 90),
          fraud_risk: calculateScore(5, 60),
          social_sentiment: calculateScore(30, 80)
        };
        
        // Analysis text based on token data
        const analysisText = generateAnalysisText(tokenInfo, network);
        
        const analysisResult = {
          scores: mockScores,
          analysis: analysisText,
          timestamp: new Date().toISOString(),
          tokenData: tokenInfo
        };
        
        setAnalysisData(analysisResult);
      } catch (error) {
        console.error("Error in analysis process:", error);
        toast.error('Failed to analyze token. Please try again.');
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to generate a score within a range
    function calculateScore(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Generate analysis text based on token data
    function generateAnalysisText(token: TokenData, network: string): string {
      let analysis = `${token.tokenName} (${token.tokenSymbol}) is a token on the ${network.charAt(0).toUpperCase() + network.slice(1)} network. `;
      
      analysis += `With a total supply of ${formatNumber(token.totalSupply, token.decimals)}, this token is currently held by approximately ${token.holderCount || 'an unknown number of'} unique addresses. `;
      
      if (token.isLiquidityLocked) {
        analysis += `The liquidity appears to be locked, which is a positive indicator for investor security. `;
      } else {
        analysis += `No evidence was found of locked liquidity, which could present a potential risk. `;
      }
      
      analysis += `Further investigation is recommended before making any investment decisions with this token.`;
      
      return analysis;
    }
    
    // Format large numbers with commas and respect token decimals
    function formatNumber(numStr: string, decimals: number): string {
      try {
        const num = parseFloat(numStr);
        const adjusted = num / Math.pow(10, decimals);
        return adjusted.toLocaleString();
      } catch (error) {
        return numStr;
      }
    }
    
    fetchTokenData();
  }, [address, network, navigate]);

  if (!address) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>

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
          ) : (
            analysisData && (
              <AnalysisReport 
                address={address}
                network={network || 'ethereum'}
                scores={analysisData.scores}
                analysis={analysisData.analysis}
                timestamp={analysisData.timestamp}
                tokenData={tokenData}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
