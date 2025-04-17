
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import { Database } from 'lucide-react';

interface TokenDistributionProps {
  distribution: {
    name: string;
    value: number;
    color: string;
  }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md border border-muted p-2 rounded-md">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const TokenDistributionChart: React.FC<TokenDistributionProps> = ({ distribution }) => {
  return (
    <Card className="bg-card/60 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-neon-cyan" />
          <CardTitle className="text-xl">Token Distribution</CardTitle>
        </div>
        <CardDescription>
          How the token supply is distributed among holders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDistributionChart;
