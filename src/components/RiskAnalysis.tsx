
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, CheckCircle, ShieldOff, DollarSign, Users } from 'lucide-react';

interface RiskAnalysisProps {
  tokenInfo: any;
  analysis: any;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ tokenInfo, analysis }) => {
  if (!tokenInfo || !analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
          <CardDescription>No risk data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Determine overall risk level based on trust score
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Moderate Risk', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { level: 'Caution', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 20) return { level: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Extreme Risk', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel(analysis.trustScore);
  
  // Determine positive indicators
  const positiveIndicators = [];
  if (tokenInfo.gt_score && tokenInfo.gt_score > 70) positiveIndicators.push('High CoinGecko trust score');
  if (tokenInfo.websites && tokenInfo.websites.length > 0) positiveIndicators.push('Has official website');
  if (tokenInfo.twitter_handle) positiveIndicators.push('Active Twitter presence');
  if (tokenInfo.holders && tokenInfo.holders.count > 1000) positiveIndicators.push('Large holder base');
  
  // Additional risk factors (beyond what's in the analysis)
  let combinedRiskFactors = [...analysis.riskFactors];
  if (tokenInfo.holders && tokenInfo.holders.distribution_percentage) {
    const topConcentration = parseFloat(tokenInfo.holders.distribution_percentage.top_10 || '0');
    if (topConcentration > 80 && !combinedRiskFactors.includes("Very high token concentration in top 10 wallets")) {
      combinedRiskFactors.push("Very high token concentration in top 10 wallets");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldOff className={riskLevel.color} size={20} />
          Risk Analysis
        </CardTitle>
        <CardDescription>Assessment of potential risks and concerns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`${riskLevel.bgColor} ${riskLevel.color} p-4 rounded-lg font-medium flex items-center gap-2`}>
          <AlertTriangle size={20} />
          Overall Risk Level: {riskLevel.level}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
          {combinedRiskFactors.length > 0 ? (
            <ul className="space-y-2">
              {combinedRiskFactors.map((risk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="text-red-500 mt-1 shrink-0" size={16} />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No significant risk factors identified</p>
          )}
        </div>
        
        {positiveIndicators.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Positive Indicators</h3>
            <ul className="space-y-2">
              {positiveIndicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={16} />
                  <span className="text-sm">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-500" size={18} />
              <h3 className="font-semibold">Holder Risk</h3>
            </div>
            <p className="text-sm">
              {tokenInfo.holders && tokenInfo.holders.distribution_percentage && 
               parseFloat(tokenInfo.holders.distribution_percentage.top_10 || '0') > 60 ? 
                "High concentration of tokens in top wallets poses liquidity and manipulation risks." : 
                "Holder distribution appears reasonable, reducing manipulation risk."}
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-green-500" size={18} />
              <h3 className="font-semibold">Investment Advice</h3>
            </div>
            <p className="text-sm">
              {analysis.trustScore < 50 ? 
                "Exercise extreme caution. Consider this a high-risk investment if pursuing." : 
                "As with all investments, diversify your portfolio and only invest what you can afford to lose."}
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-yellow-500" size={18} />
              <h3 className="font-semibold">Additional Precautions</h3>
            </div>
            <p className="text-sm">
              Always verify token contracts on blockchain explorers. Beware of tokens with similar names to established projects.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysis;
