
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Wallet, Users, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface WalletDetailsProps {
  tokenInfo: any;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ tokenInfo }) => {
  if (!tokenInfo || !tokenInfo.holders) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>No wallet data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Parse distribution percentages
  const distributionData = tokenInfo.holders.distribution_percentage || {};
  const top10Percent = parseFloat(distributionData.top_10 || '0');
  const next20Percent = parseFloat(distributionData["11_30"] || '0');
  const next20More = parseFloat(distributionData["31_50"] || '0');
  const restPercent = parseFloat(distributionData.rest || '0');
  
  // Determine concentration risk
  const getConcentrationRisk = (top10: number) => {
    if (top10 > 80) return { level: 'Very High', color: 'bg-red-500' };
    if (top10 > 60) return { level: 'High', color: 'bg-orange-500' };
    if (top10 > 40) return { level: 'Moderate', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-green-500' };
  };
  
  const concentrationRisk = getConcentrationRisk(top10Percent);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet size={20} />
          Wallet Distribution
        </CardTitle>
        <CardDescription>Analysis of token holder distribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span className="font-semibold">Total Holders:</span>
          </div>
          <span className="text-lg font-bold">{tokenInfo.holders.count.toLocaleString()}</span>
        </div>
        
        <div>
          <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
            <ArrowUpDown size={16} />
            Token Distribution
          </h3>
          
          <div className="relative h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
            <div 
              className="absolute h-full bg-red-500" 
              style={{ width: `${top10Percent}%` }}
              title={`Top 10 wallets: ${top10Percent}%`}
            ></div>
            <div 
              className="absolute h-full bg-orange-500" 
              style={{ left: `${top10Percent}%`, width: `${next20Percent}%` }}
              title={`Wallets 11-30: ${next20Percent}%`}
            ></div>
            <div 
              className="absolute h-full bg-yellow-500" 
              style={{ left: `${top10Percent + next20Percent}%`, width: `${next20More}%` }}
              title={`Wallets 31-50: ${next20More}%`}
            ></div>
            <div 
              className="absolute h-full bg-green-500" 
              style={{ left: `${top10Percent + next20Percent + next20More}%`, width: `${restPercent}%` }}
              title={`Remaining wallets: ${restPercent}%`}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span>Top 10: {top10Percent}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
              <span>11-30: {next20Percent}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <span>31-50: {next20More}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span>Rest: {restPercent}%</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              Concentration Risk
            </h3>
            <Badge className={`${concentrationRisk.color} text-white`}>
              {concentrationRisk.level}
            </Badge>
          </div>
          
          <p className="text-sm">
            {top10Percent > 60 ? 
              `Warning: ${top10Percent}% of tokens are held by just 10 wallets, indicating a high concentration risk. This could lead to price manipulation and volatility.` : 
              `Token distribution shows ${top10Percent}% held by top 10 wallets, which is a relatively ${top10Percent > 40 ? 'moderate' : 'healthy'} distribution.`}
          </p>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-1 items-center">
              <span className="font-medium">Last Updated:</span>
              <span>{new Date(tokenInfo.holders.last_updated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletDetails;
