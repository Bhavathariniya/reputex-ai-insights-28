
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Sparkles, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TokenReputationProps {
  tokenInfo: any;
  analysis: any;
}

const TokenReputation: React.FC<TokenReputationProps> = ({ tokenInfo, analysis }) => {
  if (!tokenInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Token Reputation</CardTitle>
          <CardDescription>No reputation data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getReputationCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500', icon: <ShieldCheck className="text-green-500" /> };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500', icon: <CheckCircle2 className="text-blue-500" /> };
    if (score >= 40) return { label: 'Average', color: 'bg-yellow-500', icon: <AlertTriangle className="text-yellow-500" /> };
    if (score >= 20) return { label: 'Poor', color: 'bg-orange-500', icon: <ShieldAlert className="text-orange-500" /> };
    return { label: 'High Risk', color: 'bg-red-500', icon: <ShieldAlert className="text-red-500" /> };
  };

  const reputation = getReputationCategory(analysis.trustScore);

  // GT score details if available
  const gtScoreDetails = tokenInfo.gt_score_details || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          Reputation Analysis
        </CardTitle>
        <CardDescription>Comprehensive reputation assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Overall Trust Score</h3>
            <Badge className={`${reputation.color.replace('bg-', 'bg-opacity-20 text-')} border border-current`}>
              {reputation.label}
            </Badge>
          </div>
          <div className="relative pt-1">
            <Progress value={analysis.trustScore} className="h-4" />
            <span className="absolute right-0 top-0 text-sm font-bold">{analysis.trustScore}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CoinGecko Trust Score */}
          {tokenInfo.gt_score && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">CoinGecko Trust Score</h3>
              <div className="relative pt-1">
                <Progress value={tokenInfo.gt_score} className="h-3" />
                <span className="absolute right-0 top-0 text-sm font-medium">{tokenInfo.gt_score.toFixed(1)}/100</span>
              </div>
              
              {/* GT Score Details */}
              {Object.keys(gtScoreDetails).length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Score Components:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(gtScoreDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="font-medium">{Number(value).toFixed(0)}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Holder Distribution */}
          {tokenInfo.holders && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Holder Distribution</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Holders:</span>
                  <span className="font-medium">{tokenInfo.holders.count.toLocaleString()}</span>
                </div>
                
                {tokenInfo.holders.distribution_percentage && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Top 10 Wallets:</span>
                      <span className="font-medium">{tokenInfo.holders.distribution_percentage.top_10}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Wallets 11-30:</span>
                      <span className="font-medium">{tokenInfo.holders.distribution_percentage["11_30"]}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Wallets 31-50:</span>
                      <span className="font-medium">{tokenInfo.holders.distribution_percentage["31_50"]}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Other Wallets:</span>
                      <span className="font-medium">{tokenInfo.holders.distribution_percentage.rest}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenReputation;
