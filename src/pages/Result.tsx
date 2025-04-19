
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import LoadingAnimation from '@/components/LoadingAnimation';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, network } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
      return;
    }

    // Simulate fetching analysis data
    const fetchAnalysis = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data for demonstration
        const mockData = {
          scores: {
            trust_score: Math.floor(Math.random() * 100),
            developer_score: Math.floor(Math.random() * 100),
            liquidity_score: Math.floor(Math.random() * 100),
            community_score: Math.floor(Math.random() * 100),
            holder_distribution: Math.floor(Math.random() * 100),
            fraud_risk: Math.floor(Math.random() * 100),
            social_sentiment: Math.floor(Math.random() * 100)
          },
          analysis: "This address shows typical transaction patterns for a retail wallet. Activity level is moderate with regular interactions across DeFi protocols. No suspicious patterns detected in recent transactions. The wallet maintains a diversified portfolio of assets with normal trading behavior across multiple DEXs.",
          timestamp: new Date().toISOString(),
        };
        
        setAnalysisData(mockData);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [address, navigate]);

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
            <AnalysisReport 
              address={address}
              network={network || 'ethereum'}
              scores={analysisData.scores}
              analysis={analysisData.analysis}
              timestamp={analysisData.timestamp}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
