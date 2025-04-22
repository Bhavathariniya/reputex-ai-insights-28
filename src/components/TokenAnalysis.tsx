
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenAnalysisProps {
  address: string;
  network: string;
  tokenData?: any;
}

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ address, network, tokenData }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Token Analysis</CardTitle>
        <CardDescription>Analysis for {address} on {network}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Detailed token analysis will be shown here.</p>
        {tokenData && (
          <pre className="text-xs overflow-auto p-2 bg-muted/30 rounded mt-4">
            {JSON.stringify(tokenData, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenAnalysis;
