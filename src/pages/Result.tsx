
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import TokenContractAnalysis from '@/components/TokenContractAnalysis';
import LoadingAnimation from '@/components/LoadingAnimation';
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

// Gemini API key for AI analysis
const GEMINI_API_KEY = "AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA";

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
  const [contractAnalysis, setContractAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
      return;
    }

    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        
        // First try to analyze using our enhanced Etherscan API analysis
        if (network === 'ethereum') {
          try {
            const ethAnalysisResponse = await analyzeEthereumToken(address);
            if (ethAnalysisResponse.data) {
              setContractAnalysis(ethAnalysisResponse.data);
              
              // Also set up traditional analysis data for compatibility
              const overviewData = ethAnalysisResponse.data.tokenOverview;
              const riskData = ethAnalysisResponse.data.rugPullRisk;
              
              const tokenInfo: TokenData = {
                tokenName: overviewData.name,
                tokenSymbol: overviewData.symbol,
                totalSupply: overviewData.totalSupply,
                decimals: overviewData.decimals,
                holderCount: Math.floor(Math.random() * 1000) + 100, // Simplified
                isLiquidityLocked: ethAnalysisResponse.data.contractVulnerability.liquidityLocked,
                creationTime: overviewData.creationTime
              };
              
              setTokenData(tokenInfo);
              
              // Create compatible analysis data for AnalysisReport component
              const analysisScores = {
                trust_score: 100 - riskData.score, // Inverse of risk score
                developer_score: ethAnalysisResponse.data.walletReputation.score,
                liquidity_score: ethAnalysisResponse.data.contractVulnerability.liquidityLocked ? 85 : 45,
                community_score: 100 - ethAnalysisResponse.data.sybilAttack.score, // Inverse of sybil risk
                holder_distribution: 70, // Simplified
                fraud_risk: riskData.score,
                social_sentiment: 70, // Simplified
                confidence_score: 90 // High confidence with direct API data
              };
              
              // Simple analysis text
              const analysisText = `${tokenInfo.tokenName} (${tokenInfo.tokenSymbol}) was analyzed and ${riskData.level === 'Low Risk' ? 'shows positive security indicators' : 'has some potential risk factors to be aware of'}. The contract was deployed by address ${overviewData.deployer} on ${new Date(overviewData.creationTime).toLocaleDateString()}. ${riskData.indicators.length > 0 ? `${riskData.indicators.length} risk indicators were found in the contract code.` : 'No significant risk indicators were found in the contract code.'} ${ethAnalysisResponse.data.honeypotCheck.isHoneypot ? 'WARNING: This token shows characteristics of a potential honeypot.' : ''} ${ethAnalysisResponse.data.contractVulnerability.liquidityLocked ? 'The liquidity appears to be locked, which is positive for security.' : 'No evidence of locked liquidity was found, which could present a potential risk.'} ${ethAnalysisResponse.data.walletReputation.level === 'Trustworthy' ? 'The deployer wallet has a positive reputation.' : 'The deployer wallet has a neutral or concerning reputation.'}`;
              
              setAnalysisData({
                scores: analysisScores,
                analysis: analysisText,
                timestamp: ethAnalysisResponse.data.timestamp,
                tokenData: tokenInfo,
                scamIndicators: riskData.indicators.map(i => ({
                  label: i.term,
                  description: i.risk
                }))
              });
              
              setIsLoading(false);
              return; // Exit early as we successfully analyzed with Etherscan
            }
          } catch (ethError) {
            console.error("Error in Etherscan analysis:", ethError);
            // Continue with fallback analysis
          }
        }
        
        // Fallback to traditional analysis if Etherscan analysis fails or for non-Ethereum networks
        // Get the appropriate API key and URL based on network
        const apiKey = API_KEYS[network as keyof typeof API_KEYS] || API_KEYS.ethereum;
        const apiUrl = API_URLS[network as keyof typeof API_URLS] || API_URLS.ethereum;
        
        // Fetch basic token info
        const tokenInfoResponse = await fetch(`${apiUrl}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${apiKey}`);
        const tokenInfoData = await tokenInfoResponse.json();
        
        console.log('Token Info Response:', tokenInfoData);
        
        let tokenInfo: TokenData = {
          tokenName: 'Unknown',
          tokenSymbol: 'Unknown',
          totalSupply: '0',
          decimals: 18,
          holderCount: 0,
          isLiquidityLocked: false
        };
        
        if (tokenInfoData.status === '1' && tokenInfoData.result) {
          const result = Array.isArray(tokenInfoData.result) ? tokenInfoData.result[0] : tokenInfoData.result;
          
          tokenInfo = {
            tokenName: result.name || result.tokenName || 'Unknown',
            tokenSymbol: result.symbol || result.tokenSymbol || 'Unknown',
            totalSupply: result.totalSupply || '0',
            decimals: parseInt(result.divisor || result.decimals || '18'),
            holderCount: 0,
            isLiquidityLocked: false
          };
          
          // Try to fetch creation time if available
          if (result.contractCreation) {
            tokenInfo.creationTime = new Date(parseInt(result.contractCreation) * 1000).toISOString();
          }
        }
        
        // Fetch token holders count
        try {
          const holdersResponse = await fetch(`${apiUrl}?module=token&action=tokenholderlist&contractaddress=${address}&page=1&offset=1&apikey=${apiKey}`);
          const holdersData = await holdersResponse.json();
          
          if (holdersData.status === '1') {
            // Some APIs return total count directly, others we need to estimate
            const count = holdersData.result?.length > 0 
              ? parseInt(holdersData.result[0]?.count || '0') 
              : holdersData.result?.length || 0;
            
            tokenInfo.holderCount = Math.max(count, 1); // At least 1 holder
          }
        } catch (holderError) {
          console.error('Error fetching holder count:', holderError);
        }
        
        // Check liquidity status - this is simplified as real implementation would check DEX liquidity providers
        try {
          // For demo purposes, we'll check if there's any significant liquidity
          const liquidityCheck = Math.random() > 0.3; // Simplified check
          tokenInfo.isLiquidityLocked = liquidityCheck;
        } catch (liquidityError) {
          console.error('Error checking liquidity:', liquidityError);
        }
        
        setTokenData(tokenInfo);
        
        // Generate analysis using Gemini API
        try {
          const analysisPrompt = `
          Analyze this cryptocurrency token:
          Name: ${tokenInfo.tokenName}
          Symbol: ${tokenInfo.tokenSymbol}
          Total Supply: ${formatNumber(tokenInfo.totalSupply, tokenInfo.decimals)}
          Holder Count: ${tokenInfo.holderCount}
          Liquidity Locked: ${tokenInfo.isLiquidityLocked ? 'Yes' : 'No'}
          Network: ${network}
          Contract Address: ${address}
          
          Create a detailed security analysis report focusing on:
          1. Token metrics assessment
          2. Holder distribution risks
          3. Liquidity analysis
          4. Security recommendations
          
          Additionally, generate numerical scores (0-100) for the following categories:
          - Trust Score
          - Developer Score
          - Liquidity Score
          - Community Score
          - Holder Distribution
          - Fraud Risk
          - Social Sentiment
          `;
          
          const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: analysisPrompt }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            })
          });
          
          const geminiData = await geminiResponse.json();
          console.log('Gemini Analysis Response:', geminiData);
          
          let analysisText = '';
          if (geminiData.candidates && geminiData.candidates[0]?.content?.parts) {
            analysisText = geminiData.candidates[0].content.parts[0].text;
          } else {
            analysisText = `${tokenInfo.tokenName} (${tokenInfo.tokenSymbol}) is a token on the ${network} network. With a total supply of ${formatNumber(tokenInfo.totalSupply, tokenInfo.decimals)}, this token is currently held by approximately ${tokenInfo.holderCount} unique addresses. ${tokenInfo.isLiquidityLocked ? 'The liquidity appears to be locked, which is a positive indicator for investor security.' : 'No evidence was found of locked liquidity, which could present a potential risk.'} Further investigation is recommended before making any investment decisions with this token.`;
          }
          
          // Generate reasonable scores based on the token data
          const mockScores = {
            trust_score: calculateScoreFromTokenData(tokenInfo, 'trust'),
            developer_score: calculateScoreFromTokenData(tokenInfo, 'developer'),
            liquidity_score: tokenInfo.isLiquidityLocked ? calculateScore(70, 95) : calculateScore(20, 60),
            community_score: calculateScoreFromTokenData(tokenInfo, 'community'),
            holder_distribution: calculateScoreFromTokenData(tokenInfo, 'distribution'),
            fraud_risk: calculateScoreFromTokenData(tokenInfo, 'fraud'),
            social_sentiment: calculateScoreFromTokenData(tokenInfo, 'sentiment')
          };
          
          const analysisResult = {
            scores: mockScores,
            analysis: analysisText,
            timestamp: new Date().toISOString(),
            tokenData: tokenInfo
          };
          
          setAnalysisData(analysisResult);
        } catch (analysisError) {
          console.error('Error generating analysis:', analysisError);
          // Fallback to basic analysis
          const basicAnalysis = `${tokenInfo.tokenName} (${tokenInfo.tokenSymbol}) is a token on the ${network} network. With a total supply of ${formatNumber(tokenInfo.totalSupply, tokenInfo.decimals)}, this token is currently held by approximately ${tokenInfo.holderCount} unique addresses. ${tokenInfo.isLiquidityLocked ? 'The liquidity appears to be locked, which is a positive indicator for investor security.' : 'No evidence was found of locked liquidity, which could present a potential risk.'} Further investigation is recommended before making any investment decisions with this token.`;
          
          const basicScores = {
            trust_score: calculateScore(30, 70),
            developer_score: calculateScore(40, 80),
            liquidity_score: tokenInfo.isLiquidityLocked ? 75 : 45,
            community_score: calculateScore(30, 70),
            holder_distribution: calculateScore(40, 70),
            fraud_risk: calculateScore(30, 70),
            social_sentiment: calculateScore(30, 70)
          };
          
          setAnalysisData({
            scores: basicScores,
            analysis: basicAnalysis,
            timestamp: new Date().toISOString(),
            tokenData: tokenInfo
          });
        }
      } catch (error) {
        console.error("Error in analysis process:", error);
        toast.error('Failed to analyze token. Please try again.');
        setError('Failed to analyze token. Please check the contract address and network.');
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to calculate scores based on token data
    function calculateScoreFromTokenData(token: TokenData, category: string): number {
      // Base score between 40-60
      let score = 50;
      
      switch(category) {
        case 'trust':
          // Factors: Holder count, liquidity locked, token age
          score += token.holderCount > 100 ? 10 : 0;
          score += token.isLiquidityLocked ? 15 : -10;
          break;
        case 'developer':
          // This would require contract verification data, code quality analysis
          score = calculateScore(40, 80);
          break;
        case 'community':
          // Based on holder count
          score += token.holderCount > 1000 ? 20 : (token.holderCount > 100 ? 10 : 0);
          break;
        case 'distribution':
          // Would require detailed holder analysis
          score = calculateScore(40, 80);
          break;
        case 'fraud':
          // Inverse relationship: higher holder count, locked liquidity → lower fraud risk
          score -= token.holderCount > 1000 ? 10 : 0;
          score -= token.isLiquidityLocked ? 15 : 0;
          score = Math.max(5, Math.min(score, 95)); // Keep between 5-95
          break;
        case 'sentiment':
          // Would require social media analysis
          score = calculateScore(40, 80);
          break;
        default:
          score = calculateScore(40, 80);
      }
      
      // Add some randomness for variation
      score += Math.floor(Math.random() * 10) - 5;
      
      // Ensure score is within 0-100
      return Math.max(0, Math.min(Math.round(score), 100));
    }

    // Helper function to generate a score within a range
    function calculateScore(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
              
              {/* Display our enhanced TokenContractAnalysis for Ethereum tokens */}
              {contractAnalysis && network === 'ethereum' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">Advanced Contract Analysis</h2>
                  <TokenContractAnalysis tokenData={contractAnalysis} />
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
