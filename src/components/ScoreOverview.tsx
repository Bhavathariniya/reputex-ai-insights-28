
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface ScoreOverviewProps {
  overallScore: number;
  maxScore: number;
  availableChecks: number;
  totalChecks: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  overallScore,
  maxScore,
  availableChecks,
  totalChecks,
  riskLevel
}) => {
  const scorePercentage = Math.min(100, Math.max(0, (overallScore / maxScore) * 100));
  
  const getScoreColor = () => {
    if (riskLevel === 'low') return 'text-green-500';
    if (riskLevel === 'medium') return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getScoreIndicatorClass = () => {
    if (riskLevel === 'low') return 'bg-green-500';
    if (riskLevel === 'medium') return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getScoreIcon = () => {
    if (riskLevel === 'low') return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (riskLevel === 'medium') return <AlertCircle className="h-6 w-6 text-amber-500" />;
    return <AlertTriangle className="h-6 w-6 text-red-500" />;
  };
  
  const getRiskLabel = () => {
    if (riskLevel === 'low') return 'Low Risk';
    if (riskLevel === 'medium') return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Card className="bg-card/60 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-neon-cyan" />
            <CardTitle className="text-xl">Market Score</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getScoreIcon()}
            <span className={`text-sm font-medium ${getScoreColor()}`}>{getRiskLabel()}</span>
          </div>
        </div>
        <CardDescription>
          Overall security and trust assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-sm text-muted-foreground">Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${getScoreColor()}`}>{overallScore}</span>
                <span className="text-sm text-muted-foreground">/ {maxScore}</span>
              </div>
            </div>
            
            <Progress 
              value={scorePercentage} 
              className="h-3 bg-muted/50" 
              indicatorClassName={getScoreIndicatorClass()}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>High Risk</span>
              <span>Medium Risk</span>
              <span>Low Risk</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 px-3 rounded-md bg-muted/20">
            <span className="text-sm">Available Checks</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{availableChecks}</span>
              <span className="text-muted-foreground">/ {totalChecks}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreOverview;
