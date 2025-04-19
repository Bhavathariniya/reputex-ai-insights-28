
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisReport from '@/components/AnalysisReport';
import LoadingAnimation from '@/components/LoadingAnimation';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, network } = location.state || {};

  useEffect(() => {
    if (!address) {
      navigate('/', { replace: true });
    }
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

          <AnalysisReport />
        </div>
      </div>
    </div>
  );
};

export default Result;
