
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Award, ArrowRight, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface TokenEntry {
  address: string;
  name: string;
  symbol: string;
  network: string;
  trustScore?: number;
  riskLevel?: 'Low Risk' | 'Medium Risk' | 'High Risk';
  timestamp: string;
}

interface TokenStatsProps {
  trendingTokens: TokenEntry[];
  trustedTokens: TokenEntry[];
  recentTokens: TokenEntry[];
}

const TokenStats: React.FC<TokenStatsProps> = ({ trendingTokens, trustedTokens, recentTokens }) => {
  // Helper to format addresses
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Helper to format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Helper to render risk badge
  const renderRiskBadge = (riskLevel?: string) => {
    if (!riskLevel) return null;
    
    switch (riskLevel) {
      case 'Low Risk':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Safe
          </Badge>
        );
      case 'Medium Risk':
        return (
          <Badge className="bg-amber-500/20 text-amber-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Caution
          </Badge>
        );
      case 'High Risk':
        return (
          <Badge className="bg-red-500/20 text-red-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Risky
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Trending Tokens */}
      <Card className="glass-card border-neon-pink">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-neon-pink" />
            Trending Tokens
          </CardTitle>
          <CardDescription>
            Most analyzed tokens in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTokens.length > 0 ? (
              trendingTokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {token.symbol}
                      {renderRiskBadge(token.riskLevel)}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {formatAddress(token.address)}
                    </div>
                  </div>
                  <Link to={`/?address=${token.address}&network=${token.network}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm">No trending tokens yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Trusted Tokens */}
      <Card className="glass-card border-neon-cyan">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-neon-cyan" />
            Top Trusted Tokens
          </CardTitle>
          <CardDescription>
            Highest trust scores on our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trustedTokens.length > 0 ? (
              trustedTokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {token.symbol}
                      <Badge className="bg-emerald-500/20 text-emerald-500">
                        <Shield className="h-3 w-3 mr-1" />
                        {token.trustScore}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {formatAddress(token.address)}
                    </div>
                  </div>
                  <Link to={`/?address=${token.address}&network=${token.network}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm">No trusted tokens yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recently Analyzed Tokens */}
      <Card className="glass-card border-neon-purple">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-neon-purple" />
            Recently Analyzed
          </CardTitle>
          <CardDescription>
            Latest token analyses on our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTokens.length > 0 ? (
              recentTokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {token.symbol}
                      {renderRiskBadge(token.riskLevel)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(token.timestamp)}
                    </div>
                  </div>
                  <Link to={`/?address=${token.address}&network=${token.network}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-sm">No recent analyses yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenStats;
