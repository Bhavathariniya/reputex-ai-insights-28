
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from 'lucide-react';

interface TaxInfoProps {
  buyTax: number;
  sellTax: number;
  transferTax: number;
}

const TaxInfo: React.FC<TaxInfoProps> = ({ buyTax, sellTax, transferTax }) => {
  const getTaxColor = (taxPercentage: number) => {
    if (taxPercentage > 10) return 'text-red-500';
    if (taxPercentage > 5) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <Card className="bg-card/60 backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-neon-cyan" />
          <CardTitle className="text-xl">Transaction Taxes</CardTitle>
        </div>
        <CardDescription>
          Fees applied to buy, sell, and transfer transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/20">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-muted-foreground" />
              <span>Buy Tax</span>
            </div>
            <div className="flex items-center gap-1">
              <Percent className="h-3 w-3 text-muted-foreground" />
              <span className={`text-lg font-bold ${getTaxColor(buyTax)}`}>{buyTax}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/20">
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5 text-muted-foreground" />
              <span>Sell Tax</span>
            </div>
            <div className="flex items-center gap-1">
              <Percent className="h-3 w-3 text-muted-foreground" />
              <span className={`text-lg font-bold ${getTaxColor(sellTax)}`}>{sellTax}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/20">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
              <span>Transfer Tax</span>
            </div>
            <div className="flex items-center gap-1">
              <Percent className="h-3 w-3 text-muted-foreground" />
              <span className={`text-lg font-bold ${getTaxColor(transferTax)}`}>{transferTax}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxInfo;
