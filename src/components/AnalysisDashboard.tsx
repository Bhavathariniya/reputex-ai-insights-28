
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import BlockchainSelector from './BlockchainSelector';
import ScoreOverview from './ScoreOverview';
import TokenDistributionChart from './TokenDistributionChart';
import SecurityChecks from './SecurityChecks';
import HolderAnalysis from './HolderAnalysis';
import TaxInfo from './TaxInfo';

interface AnalysisDashboardProps {
  address: string;
  network: string;
  onNetworkChange: (network: string) => void;
}

const mockDistribution = [
  { name: 'Owner', value: 15, color: '#9b87f5' },
  { name: 'Creator', value: 10, color: '#00FFFF' },
  { name: 'Burnt', value: 5, color: '#FF00FF' },
  { name: 'Liquidity', value: 25, color: '#2E8BFF' },
  { name: 'Top 10 Holders', value: 30, color: '#8A2BE2' },
  { name: 'Others', value: 15, color: '#4B0082' },
];

const mockSecurityChecks = [
  {
    name: 'Honeypot Detection',
    status: 'pass' as const,
    description: 'Token can be bought and sold without restrictions'
  },
  {
    name: 'Contract Verification',
    status: 'pass' as const,
    description: 'Smart contract is verified and readable on the blockchain explorer'
  },
  {
    name: 'Owner Privileges',
    status: 'warning' as const,
    description: 'Owner has moderate privileges that could impact token functionality'
  },
  {
    name: 'Mint Function',
    status: 'fail' as const,
    description: 'Contract allows unlimited minting of new tokens by the owner'
  },
  {
    name: 'Liquidity Locked',
    status: 'pass' as const,
    description: 'Liquidity is locked for 365 days, reducing rug pull risk'
  }
];

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  address,
  network,
  onNetworkChange
}) => {
  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Analysis Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive security analysis for <span className="font-mono">{address.slice(0, 8)}...{address.slice(-6)}</span>
            </p>
          </div>
          <BlockchainSelector selectedNetwork={network} onChange={onNetworkChange} />
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Score Overview */}
          <div className="lg:col-span-4">
            <ScoreOverview 
              overallScore={286} 
              maxScore={380} 
              availableChecks={32} 
              totalChecks={38} 
              riskLevel="medium" 
            />
          </div>
          
          {/* Token Distribution */}
          <div className="lg:col-span-8">
            <TokenDistributionChart distribution={mockDistribution} />
          </div>
          
          {/* Security Checks */}
          <div className="lg:col-span-6">
            <SecurityChecks checks={mockSecurityChecks} />
          </div>
          
          {/* Holder Analysis */}
          <div className="lg:col-span-3">
            <HolderAnalysis 
              totalHolders={1526} 
              top3Percentage={35} 
              top10Percentage={58} 
            />
          </div>
          
          {/* Tax Info */}
          <div className="lg:col-span-3">
            <TaxInfo 
              buyTax={5} 
              sellTax={8} 
              transferTax={2} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
