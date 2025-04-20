import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Lock, Code, Users, BarChart2, Flame, CheckCircle } from 'lucide-react';
import TokenContractAnalysis from '@/components/TokenContractAnalysis';
import TokenAnalysis from '@/components/TokenAnalysis';
import ScoreCard from '@/components/ScoreCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ResultTabsProps {
  contractAnalysis: any;
  analysisData: any;
  tokenData: any;
  address: string;
  network: string;
}

const ResultTabs: React.FC<ResultTabsProps> = ({ 
  contractAnalysis, 
  analysisData, 
  tokenData,
  address,
  network 
}) => {
  if (!contractAnalysis && !analysisData) {
    return null;
  }

  const formatTokenAmount = (amount: string, decimals: number): string => {
    if (!amount || isNaN(Number(amount))) return '0';
    const amountNum = parseFloat(amount);
    const formattedAmount = amountNum / Math.pow(10, decimals);
    return formattedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <Tabs defaultValue="overview" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 md:gap-2">
        <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <Shield className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="reputation" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <BarChart2 className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Reputation</span>
        </TabsTrigger>
        <TabsTrigger value="risk-analysis" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Risk Analysis</span>
        </TabsTrigger>
        <TabsTrigger value="wallet-details" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <Users className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Wallet Details</span>
        </TabsTrigger>
        <TabsTrigger value="scam-pattern" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <Flame className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Scam Pattern</span>
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        {tokenData && (
          <Card className="glass-card border-neon-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-neon-cyan" />
                Token Overview
              </CardTitle>
              <CardDescription>
                Basic information about the token contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Token Name</h3>
                  <p className="font-semibold text-lg">{tokenData.tokenName}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Symbol</h3>
                  <p className="font-semibold text-lg">{tokenData.tokenSymbol}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Total Supply</h3>
                  <p className="font-semibold text-lg">{formatTokenAmount(tokenData.totalSupply, tokenData.decimals)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Decimals</h3>
                  <p className="font-semibold text-lg">{tokenData.decimals}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-sm text-muted-foreground mb-1">Contract Address</h3>
                  <div className="font-mono text-sm bg-muted/30 p-2 rounded break-all">
                    {address}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Contract Verified</h3>
                  <div className="font-medium flex items-center">
                    {tokenData.isVerified ? (
                      <Badge className="bg-emerald-500/20 text-emerald-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </div>
                </div>
                {tokenData.compilerVersion && (
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Compiler Version</h3>
                    <p className="text-sm">{tokenData.compilerVersion}</p>
                  </div>
                )}
                {tokenData.contractCreator && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm text-muted-foreground mb-1">Contract Creator</h3>
                    <div className="font-mono text-xs bg-muted/30 p-2 rounded break-all">
                      {tokenData.contractCreator}
                    </div>
                  </div>
                )}
                {tokenData.creationTime && (
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Creation Date</h3>
                    <p className="text-sm">{new Date(tokenData.creationTime).toLocaleDateString()} {new Date(tokenData.creationTime).toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreCard 
              title="Trust Score" 
              score={analysisData.scores.trust_score}
              type="trust" 
              description="Overall trustworthiness of this token" 
            />
            <ScoreCard 
              title="Developer Score" 
              score={analysisData.scores.developer_score}
              type="developer" 
              description="Reputation of the contract deployer"
            />
            <ScoreCard 
              title="Liquidity Score" 
              score={analysisData.scores.liquidity_score}
              type="liquidity" 
              description="Assessment of token liquidity security"
            />
          </div>
        )}

        {analysisData && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Analysis Summary</CardTitle>
              <CardDescription>Overview analysis of this token</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{analysisData.analysis}</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Reputation Metrics Tab */}
      <TabsContent value="reputation" className="space-y-4">
        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.scores.community_score !== undefined && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Community Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-lg font-bold">{analysisData.scores.community_score}%</span>
                  </div>
                  <Progress value={analysisData.scores.community_score} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">Measure of community engagement and growth around this token</p>
                </CardContent>
              </Card>
            )}
            
            {analysisData.scores.holder_distribution !== undefined && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Holder Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-lg font-bold">{analysisData.scores.holder_distribution}%</span>
                  </div>
                  <Progress value={analysisData.scores.holder_distribution} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">How well distributed the token is among holders</p>
                </CardContent>
              </Card>
            )}
            
            {analysisData.scores.fraud_risk !== undefined && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Fraud Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Risk</span>
                    <span className="text-lg font-bold">{analysisData.scores.fraud_risk}%</span>
                  </div>
                  <Progress value={analysisData.scores.fraud_risk} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">Likelihood of fraudulent behavior based on analysis</p>
                </CardContent>
              </Card>
            )}
            
            {analysisData.scores.social_sentiment !== undefined && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Social Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-lg font-bold">{analysisData.scores.social_sentiment}%</span>
                  </div>
                  <Progress value={analysisData.scores.social_sentiment} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">Overall sentiment across social media platforms</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {tokenData && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Token Holder Metrics</CardTitle>
              <CardDescription>Distribution and holder information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Holder Count</div>
                  <div className="text-lg font-medium">{tokenData.holderCount}</div>
                </div>
                
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Liquidity Status</div>
                  <div className="text-lg font-medium flex items-center">
                    {tokenData.isLiquidityLocked ? (
                      <Badge className="bg-emerald-500/20 text-emerald-500">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/20 text-amber-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Creation Date</div>
                  <div className="text-lg font-medium">
                    {tokenData.creationTime ? new Date(tokenData.creationTime).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {contractAnalysis?.walletReputation && (
          <Card className="glass-card border-neon-cyan">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-neon-cyan" />
                  Deployer Wallet Reputation
                </CardTitle>
                <Badge className={contractAnalysis.walletReputation.level === 'Trustworthy' 
                  ? "bg-emerald-500/20 text-emerald-500"
                  : contractAnalysis.walletReputation.level === 'Neutral'
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-red-500/20 text-red-500"
                }>
                  {contractAnalysis.walletReputation.level}
                </Badge>
              </div>
              <CardDescription>
                Analysis of the contract deployer's wallet history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Reputation Score</span>
                  <span className="text-lg font-bold">{contractAnalysis.walletReputation.score}%</span>
                </div>
                <Progress 
                  value={contractAnalysis.walletReputation.score} 
                  className="h-2.5" 
                />
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Risk Analysis Tab */}
      <TabsContent value="risk-analysis" className="space-y-4">
        {contractAnalysis?.rugPullRisk && (
          <Card className="glass-card border-neon-pink">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-neon-pink" />
                  Rug Pull Risk Score
                </CardTitle>
                <Badge className={contractAnalysis.rugPullRisk.level === 'Low Risk' 
                  ? "bg-emerald-500/20 text-emerald-500"
                  : contractAnalysis.rugPullRisk.level === 'Medium Risk' 
                  ? "bg-amber-500/20 text-amber-500" 
                  : "bg-red-500/20 text-red-500"}>
                  {contractAnalysis.rugPullRisk.level}
                </Badge>
              </div>
              <CardDescription>
                Analysis of contract features that could enable a rug pull
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Risk Level</span>
                  <span className="text-lg font-bold">{contractAnalysis.rugPullRisk.score}%</span>
                </div>
                <Progress 
                  value={contractAnalysis.rugPullRisk.score} 
                  className="h-2.5" 
                />
              </div>
              
              {contractAnalysis.rugPullRisk.indicators?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Risk Indicators</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractAnalysis.rugPullRisk.indicators.map((indicator: any, i: number) => (
                      <Badge key={i} variant="outline" className="border-red-500 bg-red-500/10 text-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {indicator.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {contractAnalysis?.honeypotCheck && (
          <Card className="glass-card border-neon-orange">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-neon-orange" />
                  Honeypot Check
                </CardTitle>
                {contractAnalysis.honeypotCheck.isHoneypot ? (
                  <Badge className="bg-red-500/20 text-red-500">
                    Potential Honeypot
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-500">
                    Not a Honeypot
                  </Badge>
                )}
              </div>
              <CardDescription>
                Analysis of whether the token allows selling after purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contractAnalysis.honeypotCheck.indicators?.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">Honeypot Indicators</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractAnalysis.honeypotCheck.indicators.map((indicator: any, i: number) => (
                      <Badge key={i} variant="outline" className="border-red-500 bg-red-500/10 text-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {indicator.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 border border-emerald-500/20 rounded-md bg-emerald-500/5">
                  <p className="text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 inline-block mr-1 text-emerald-500" />
                    No honeypot indicators detected. Our analysis suggests that this token allows normal buying and selling operations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {contractAnalysis?.contractVulnerability && (
          <Card className="glass-card border-neon-purple">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-neon-purple" />
                  Contract Vulnerability Analysis
                </CardTitle>
                {contractAnalysis.contractVulnerability.isVerified ? (
                  <Badge className="bg-emerald-500/20 text-emerald-500">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-500">
                    Unverified
                  </Badge>
                )}
              </div>
              <CardDescription>
                Assessment of contract features that could pose risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="text-sm font-medium mb-2">Contract Status</h3>
                <div className="flex flex-wrap gap-2">
                  {contractAnalysis.contractVulnerability.isVerified ? (
                    <Badge className="bg-emerald-500/20 text-emerald-500">
                      Source Code Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-500">
                      Source Code Not Verified
                    </Badge>
                  )}
                  
                  {contractAnalysis.contractVulnerability.liquidityLocked ? (
                    <Badge className="bg-emerald-500/20 text-emerald-500">
                      <Lock className="h-3 w-3 mr-1" />
                      Liquidity Locked
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-500">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Liquidity Not Locked
                    </Badge>
                  )}
                </div>
              </div>
              
              {contractAnalysis.contractVulnerability.riskyFunctions?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Risky Functions</h3>
                  <div className="flex flex-wrap gap-2">
                    {contractAnalysis.contractVulnerability.riskyFunctions.map((func: any, i: number) => (
                      <Badge key={i} variant="outline" className="border-red-500 bg-red-500/10 text-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {func.term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Wallet Details Tab */}
      <TabsContent value="wallet-details" className="space-y-4">
        {contractAnalysis?.sybilAttack && (
          <Card className="glass-card border-neon-blue">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-neon-blue" />
                  Sybil Attack / Bot Activity Score
                </CardTitle>
                <Badge className={contractAnalysis.sybilAttack.level === 'Low Risk' 
                  ? "bg-emerald-500/20 text-emerald-500"
                  : contractAnalysis.sybilAttack.level === 'Medium Risk' 
                  ? "bg-amber-500/20 text-amber-500" 
                  : "bg-red-500/20 text-red-500"}>
                  {contractAnalysis.sybilAttack.level}
                </Badge>
              </div>
              <CardDescription>
                Analysis of token transfer patterns for manipulation detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Risk Level</span>
                  <span className="text-lg font-bold">{contractAnalysis.sybilAttack.score}%</span>
                </div>
                <Progress 
                  value={contractAnalysis.sybilAttack.score} 
                  className="h-2.5" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Suspicious Addresses</div>
                  <div className="text-lg font-medium">{contractAnalysis.sybilAttack.suspiciousAddresses}</div>
                </div>
                
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Unique Receivers</div>
                  <div className="text-lg font-medium">{contractAnalysis.sybilAttack.uniqueReceivers}</div>
                </div>
                
                <div className="p-3 border border-muted rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Unique Senders</div>
                  <div className="text-lg font-medium">{contractAnalysis.sybilAttack.uniqueSenders}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {tokenData && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Deployer Details</CardTitle>
              <CardDescription>Information about the contract deployer</CardDescription>
            </CardHeader>
            <CardContent>
              {contractAnalysis?.tokenOverview ? (
                <div className="space-y-4">
                  <div className="p-3 border border-muted rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Deployer Address</div>
                    <div className="font-mono text-sm break-all">{contractAnalysis.tokenOverview.deployer}</div>
                  </div>
                  
                  <div className="p-3 border border-muted rounded-md">
                    <div className="text-sm text-muted-foreground mb-1">Creation Time</div>
                    <div className="text-sm">{new Date(contractAnalysis.tokenOverview.creationTime).toLocaleDateString()} {new Date(contractAnalysis.tokenOverview.creationTime).toLocaleTimeString()}</div>
                  </div>
                  
                  {contractAnalysis.walletReputation && (
                    <div className="p-3 border border-muted rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">Previous Scams</div>
                      <div className="text-lg font-medium">{contractAnalysis.walletReputation.previousScams || 0}</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No deployer details available</p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Scam Pattern Tab */}
      <TabsContent value="scam-pattern" className="space-y-4">
        {contractAnalysis?.scamPatternMatch && (
          <Card className="glass-card border-neon-yellow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-neon-yellow" />
                Scam Pattern Similarity
              </CardTitle>
              <CardDescription>
                AI comparison with known scam contract patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-muted rounded-md bg-muted/30">
                <p className="text-lg font-medium mb-2">Analysis Result:</p>
                <p className="text-muted-foreground">
                  {contractAnalysis.scamPatternMatch}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {analysisData?.scamIndicators && analysisData.scamIndicators.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Scam Indicators</CardTitle>
              <CardDescription>Potential warning signs identified in the contract</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisData.scamIndicators.map((indicator: any, index: number) => (
                  <div key={index} className="p-3 border border-red-200 rounded-md bg-red-50/10">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-500">{indicator.label}</h4>
                        <p className="text-sm text-muted-foreground">{indicator.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {!contractAnalysis?.scamPatternMatch && (!analysisData?.scamIndicators || analysisData.scamIndicators.length === 0) && (
          <div className="flex flex-col items-center justify-center py-8">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scam Patterns Detected</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Our analysis did not detect any known scam patterns in this contract. However, always conduct your own research before interacting with any token.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ResultTabs;
