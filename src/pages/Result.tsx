
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultTabs from '@/components/ResultTabs';
import { toast } from 'sonner';
import { detectNetwork, getCompleteTokenAnalysis } from '@/lib/alchemy-client';
import { TokenData, TokenAnalysisResult, TokenContractData } from '@/lib/types';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addressFromParams = searchParams.get('address');
  const networkFromParams = searchParams.get('network');
  
  const { address = addressFromParams, network = networkFromParams || 'ethereum' } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [contractData, setContractData] = useState<TokenContractData | null>(null);
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
        setError(null);

        const detectedNetwork = network === 'auto' ? await detectNetwork(address) : network;
        
        // Use our updated API client to get comprehensive analysis
        const { tokenData, analysisResult, contractData } = await getCompleteTokenAnalysis(address);
        
        if (!tokenData || !analysisResult) {
          throw new Error('Failed to analyze token');
        }

        setTokenData(tokenData);
        setContractData(contractData);
        
        setAnalysisData({
          scores: {
            trust_score: analysisResult.trustScore,
            developer_score: analysisResult.developerScore || 75,
            liquidity_score: analysisResult.liquidityScore || 60,
            community_score: analysisResult.communityScore || 80,
            holder_distribution: analysisResult.holderDistributionScore || 70,
            fraud_risk: analysisResult.fraudRisk || 15,
            social_sentiment: analysisResult.socialSentiment || 75
          },
          analysis: analysisResult.analysis,
          scamIndicators: analysisResult.riskFactors.map(risk => ({
            label: "Risk Factor",
            description: risk
          })),
          timestamp: new Date().toISOString(),
          tokenData: tokenData
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
                  {analysisData && tokenData && (
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
