
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Percent } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HolderAnalysisProps {
  totalHolders: number;
  top3Percentage: number;
  top10Percentage: number;
}

const HolderAnalysis: React.FC<HolderAnalysisProps> = ({
  totalHolders,
  top3Percentage,
  top10Percentage
}) => {
  const getConcentrationRisk = (percentage: number) => {
    if (percentage > 60) return { label: 'High Concentration', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (percentage > 40) return { label: 'Medium Concentration', color: 'text-amber-500', bgColor: 'bg-amber-500' };
    return { label: 'Healthy Distribution', color: 'text-green-500', bgColor: 'bg-green-500' };
  };
  
  const top3Risk = getConcentrationRisk(top3Percentage);
  const top10Risk = getConcentrationRisk(top10Percentage);

  return (
    <Card className="bg-card/60 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-neon-cyan" />
          <CardTitle className="text-xl">Holder Analysis</CardTitle>
        </div>
        <CardDescription>
          Token concentration and holder distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>Total Holders</span>
            </div>
            <span className="text-xl font-bold">{totalHolders.toLocaleString()}</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Top 3 Holders</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-sm font-medium ${top3Risk.color}`}>{top3Percentage}%</span>
                </div>
              </div>
              <Progress value={top3Percentage} className="h-2" indicatorClassName={top3Risk.bgColor} />
              <p className="text-xs text-muted-foreground mt-1">{top3Risk.label}</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Top 10 Holders</span>
                </div>
                <div className="flex items-center gap-1">
                  <Percent className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-sm font-medium ${top10Risk.color}`}>{top10Percentage}%</span>
                </div>
              </div>
              <Progress value={top10Percentage} className="h-2" indicatorClassName={top10Risk.bgColor} />
              <p className="text-xs text-muted-foreground mt-1">{top10Risk.label}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HolderAnalysis;
