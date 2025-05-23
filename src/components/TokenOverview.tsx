
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { TokenInfo } from '@/lib/coingecko-client';
import { TrustAnalysis } from '@/lib/gemini-client';

interface TokenOverviewProps {
  tokenInfo: TokenInfo | null;
  analysis: TrustAnalysis | null;
}

const TokenOverview: React.FC<TokenOverviewProps> = ({ tokenInfo, analysis }) => {
  if (!tokenInfo || !analysis) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Token Overview</CardTitle>
          <CardDescription>No token data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">We couldn't find data for this token</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This token may not be listed on CoinGecko or may have an invalid contract address.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          {tokenInfo.image_url && (
            <img 
              src={tokenInfo.image_url} 
              alt={tokenInfo.name} 
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <CardTitle>{tokenInfo.name} ({tokenInfo.symbol})</CardTitle>
            <CardDescription>Trust Score: {analysis.trustScore}/100</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.analysis}</p>
          </div>
          
          <Separator />
          
          {tokenInfo.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {tokenInfo.description.length > 300 
                  ? `${tokenInfo.description.substring(0, 300)}...` 
                  : tokenInfo.description}
              </p>
            </div>
          )}
          
          {tokenInfo.websites && tokenInfo.websites.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Official Resources</h3>
              <div className="space-y-2">
                {tokenInfo.websites.map((website: string, index: number) => (
                  <a 
                    key={index}
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink size={16} />
                    {website}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            {tokenInfo.twitter_handle && (
              <a 
                href={`https://twitter.com/${tokenInfo.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
              >
                Twitter
              </a>
            )}
            {tokenInfo.telegram_handle && (
              <a 
                href={`https://t.me/${tokenInfo.telegram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
              >
                Telegram
              </a>
            )}
            {tokenInfo.discord_url && (
              <a 
                href={tokenInfo.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
              >
                Discord
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenOverview;
