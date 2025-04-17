
import React from 'react';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  FileCheck,
  FileX,
  CircleDollarSign,
  MoveDown,
  MoveUp,
  ShieldAlert,
  Code,
  PieChart,
  Users,
  Globe,
  Twitter,
  MessageCircle,
  Github,
  BarChart3,
  AlertCircle,
  Info,
  Calendar,
  User,
  Copy,
  Search
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface TokenAnalysisProps {
  address: string;
  network: string;
  tokenData: any;
  tokenDetails: any;
  aiScores: any;
}

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ 
  address, 
  network,
  tokenData,
  tokenDetails,
  aiScores
}) => {
  if (!tokenData || !tokenData.supported) {
    return (
      <Card className="w-full mb-6 glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-neon-pink" />
            Token Analysis Not Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed token analysis is only available for EVM-compatible chains.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { 
    safetyScore, 
    safetyLevel,
    ownershipRenounced, 
    liquidityLocked,
    liquidityLockDuration,
    liquidityAmount,
    liquidityPercent,
    isBuyable,
    isSellable,
    honeypotRisk,
    isVerified,
    dangerousFunctions,
    buyFee,
    sellFee,
    totalFee,
    highFees,
    tokenDistribution,
    socialLinks,
    devActivity
  } = tokenData;

  const tokenName = tokenDetails?.name || 'Unknown Token';
  const tokenSymbol = tokenDetails?.symbol || '???';
  const createdAt = tokenDetails?.createdAt ? new Date(tokenDetails.createdAt).toLocaleDateString() : 'Unknown';
  const creator = tokenDetails?.creator || 'Unknown';

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const copyCreatorToClipboard = () => {
    navigator.clipboard.writeText(creator);
    toast.success("Creator address copied to clipboard");
  };

  const getCreatorExplorerUrl = () => {
    const explorers: Record<string, string> = {
      ethereum: 'https://etherscan.io/address/',
      binance: 'https://bscscan.com/address/',
      polygon: 'https://polygonscan.com/address/',
      arbitrum: 'https://arbiscan.io/address/',
      optimism: 'https://optimistic.etherscan.io/address/',
      avalanche: 'https://snowtrace.io/address/',
      fantom: 'https://ftmscan.com/address/',
      l1x: 'https://explorer.l1x.io/address/',
      solana: 'https://solana.fm/address/',
      base: 'https://basescan.org/address/',
      zksync: 'https://explorer.zksync.io/address/',
    };
    
    return (explorers[network] || explorers.ethereum) + creator;
  };

  // Token logo placeholder
  const tokenLogo = `https://via.placeholder.com/64?text=${tokenSymbol.charAt(0)}`;

  return (
    <div className="space-y-6 mb-8">
      {/* Token Overview Card */}
      <Card className="w-full glass-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
              <img src={tokenLogo} alt={tokenName} className="h-full w-full object-cover" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {tokenName} <span className="text-lg text-muted-foreground">({tokenSymbol})</span>
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center">
                  <span className="text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1" 
                    onClick={copyAddressToClipboard}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy address</span>
                  </Button>
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created On:</span>
                <span className="text-sm font-medium">{createdAt}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Creator:</span>
                <a 
                  href={getCreatorExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline flex items-center"
                >
                  {creator.slice(0, 6)}...{creator.slice(-4)}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1" 
                    onClick={copyCreatorToClipboard}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ownership:</span>
                {ownershipRenounced ? (
                  <Badge className="bg-emerald-500/20 text-emerald-500">Renounced</Badge>
                ) : (
                  <Badge className="bg-amber-500/20 text-amber-500">Active Owner</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Audits:</span>
                <span className="text-sm">Coming Soon</span>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* Unified Risk Rating */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-neon-cyan" />
                    <span className="text-sm font-medium">Risk Rating</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="bg-neon-cyan/20 text-neon-cyan">
                          {safetyScore}/100
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Overall safety score based on multiple security factors</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Gradient progress bar for risk rating */}
                <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative mb-1">
                  <div 
                    className="absolute top-0 bottom-0 left-0 rounded-full" 
                    style={{ 
                      width: `${safetyScore}%`, 
                      background: 'linear-gradient(90deg, rgb(239, 68, 68) 0%, rgb(245, 158, 11) 50%, rgb(16, 185, 129) 100%)' 
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>High Risk</span>
                  <span>Moderate</span>
                  <span>Low Risk</span>
                </div>
              </div>
              
              {/* Latest Status */}
              <div className="flex items-center justify-between mt-4 p-3 bg-muted/20 rounded-md">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-neon-purple animate-pulse" />
                  <span className="text-sm font-medium">Latest Status</span>
                </div>
                <Badge className={honeypotRisk === 'Low' ? 'bg-emerald-500/20 text-emerald-500' : honeypotRisk === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}>
                  {isSellable ? 'Not a Honeypot' : 'Possible Honeypot'}
                </Badge>
              </div>
              
              {/* Categories */}
              {aiScores?.categories && aiScores.categories.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Categories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiScores.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Honeypot Test */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-neon-cyan" />
            <span className="font-medium">Honeypot Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoveDown className="h-4 w-4 text-primary" />
                <span>Buy Test</span>
              </div>
              {isBuyable ? 
                <Badge className="bg-emerald-500/20 text-emerald-500">Successful</Badge> : 
                <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
              }
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoveUp className="h-4 w-4 text-primary" />
                <span>Sell Test</span>
              </div>
              {isSellable ? 
                <Badge className="bg-emerald-500/20 text-emerald-500">Successful</Badge> : 
                <Badge className="bg-red-500/20 text-red-500">Failed</Badge>
              }
            </div>
            
            <div className="mt-4 p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {isBuyable && isSellable ? 
                  "This token can be bought and sold without restrictions." :
                  !isBuyable ? 
                  "This token cannot be purchased. It may be paused or have trading restrictions." :
                  "This token cannot be sold after purchase. This is a strong indicator of a honeypot scam."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Pool Info */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {liquidityLocked ? 
              <Lock className="h-5 w-5 text-neon-cyan" /> : 
              <Unlock className="h-5 w-5 text-neon-purple" />
            }
            <span className="font-medium">Liquidity Pool Info</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border border-muted rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Liquidity Amount</div>
                <div className="text-lg font-medium">{liquidityAmount}</div>
              </div>
              
              <div className="p-3 border border-muted rounded-md">
                <div className="text-sm text-muted-foreground mb-1">Liquidity %</div>
                <div className="text-lg font-medium">{liquidityPercent}</div>
              </div>
            </div>
            
            <div className="p-3 border border-muted rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Lock Status</div>
              <div className="flex items-center gap-2">
                {liquidityLocked ? 
                  <Badge className="bg-emerald-500/20 text-emerald-500">
                    Locked for {liquidityLockDuration}
                  </Badge> : 
                  <Badge className="bg-red-500/20 text-red-500">
                    Not Locked
                  </Badge>
                }
              </div>
            </div>
            
            <div className="p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {liquidityLocked ? 
                  `Liquidity is locked for ${liquidityLockDuration}, which protects against rug pulls where developers remove all trading liquidity.` :
                  "Liquidity is not locked, which means the project team can remove liquidity at any time, potentially resulting in a rug pull."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Ownership */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {ownershipRenounced ? 
              <CheckCircle className="h-5 w-5 text-neon-cyan" /> : 
              <AlertTriangle className="h-5 w-5 text-neon-purple" />
            }
            <span className="font-medium">Contract Ownership</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Owner Control Status</span>
              {ownershipRenounced ? 
                <Badge className="bg-emerald-500/20 text-emerald-500">Renounced</Badge> : 
                <Badge className="bg-amber-500/20 text-amber-500">Active Owner</Badge>
              }
            </div>
            
            <div className="flex items-center justify-between">
              <span>Contract Verification</span>
              {isVerified ? 
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Verified</span>
                </div> : 
                <div className="flex items-center gap-2">
                  <FileX className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Unverified</span>
                </div>
              }
            </div>
            
            <div className="p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {ownershipRenounced ? 
                  "Ownership of this contract has been renounced, meaning no single entity can modify the contract behavior. This greatly reduces the risk of malicious contract changes." :
                  "This contract has an active owner who can modify certain contract behaviors. While this allows for upgrades and fixes, it also introduces risk of malicious changes."
                }
              </p>
              {!isVerified && (
                <p className="text-sm text-red-400 mt-2">
                  Warning: This contract's source code is not verified, making it impossible to audit its functionality.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Function Permissions */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-neon-pink" />
            <span className="font-medium">Function Permissions</span>
            {dangerousFunctions.length > 0 && (
              <Badge className="ml-2 bg-red-500/20 text-red-500">{dangerousFunctions.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {dangerousFunctions.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The following functions allow the contract owner or privileged addresses to modify contract behavior:
              </p>
              <div className="space-y-2">
                {dangerousFunctions.map((func, index) => (
                  <div key={index} className="p-2 border border-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-sm">{func.name}()</div>
                      <Badge className={func.risk === 'High' ? 'bg-red-500/20 text-red-500' : func.risk === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}>
                        {func.risk} Risk
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{func.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border border-red-500/20 rounded-md bg-red-500/5">
                <p className="text-sm text-muted-foreground">
                  These functions could potentially be used to modify token behavior in ways that disadvantage holders. 
                  {!ownershipRenounced && " Since ownership is not renounced, these functions remain a risk."}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 border border-emerald-500/20 rounded-md bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">No dangerous functions detected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This contract doesn't contain common dangerous functions that could be used to manipulate the token or harm holders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Fees */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-neon-cyan" />
            <span className="font-medium">Transaction Fees</span>
            {highFees && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-500">High</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 border border-muted rounded-md">
                <div className="text-sm text-muted-foreground">Buy Fee</div>
                <div className="text-xl font-medium">{buyFee}%</div>
              </div>
              
              <div className="p-3 border border-muted rounded-md">
                <div className="text-sm text-muted-foreground">Sell Fee</div>
                <div className="text-xl font-medium">{sellFee}%</div>
              </div>
              
              <div className="p-3 border border-muted rounded-md">
                <div className="text-sm text-muted-foreground">Total Fee</div>
                <div className="text-xl font-medium">{totalFee}%</div>
              </div>
            </div>
            
            <div className="p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {highFees ? 
                  "This token has unusually high transaction fees, which could impact your trading profitability. High fees are sometimes used to fund project development but can also indicate potential issues." :
                  "This token has reasonable transaction fees, which is generally a positive sign."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Distribution */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5 text-neon-purple" />
            <span className="font-medium">Token Distribution</span>
            {tokenDistribution[0].percentage > 20 && (
              <Badge className="ml-2 bg-amber-500/20 text-amber-500">Concentrated</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="relative pt-5">
              <div className="flex mb-2">
                {tokenDistribution.map((item, i) => (
                  <div 
                    key={i}
                    className="h-6" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: 
                        i === 0 ? 'rgba(239, 68, 68, 0.7)' : 
                        i === 1 ? 'rgba(245, 158, 11, 0.7)' :
                        i === 2 ? 'rgba(16, 185, 129, 0.7)' :
                        'rgba(99, 102, 241, 0.7)',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {tokenDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: 
                          i === 0 ? 'rgba(239, 68, 68, 0.7)' : 
                          i === 1 ? 'rgba(245, 158, 11, 0.7)' :
                          i === 2 ? 'rgba(16, 185, 129, 0.7)' :
                          'rgba(99, 102, 241, 0.7)'
                      }}
                    />
                    <span className="text-sm">{item.type}: {item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {tokenDistribution[0].percentage > 25 ? 
                  "The top holder controls a significant portion of the total supply, which presents a risk of price manipulation." :
                  tokenDistribution[0].percentage > 15 ?
                  "Token distribution shows moderate concentration among top holders. While not ideal, this is common for newer tokens." :
                  "This token has a healthy distribution pattern with no concerning concentration among top holders."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social & Dev Activity */}
      <Card className="w-full glass-card">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-neon-cyan" />
            <span className="font-medium">Social & Dev Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Project Links</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.website && (
                  <a 
                    href={socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-muted/80 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-muted/80 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </a>
                )}
                
                {socialLinks.telegram && (
                  <a 
                    href={socialLinks.telegram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-muted/80 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </a>
                )}
                
                {socialLinks.github && (
                  <a 
                    href={socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-muted/80 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                
                {Object.values(socialLinks).every(link => !link) && (
                  <span className="text-sm text-muted-foreground">No official links found</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Developer Activity</h4>
              {devActivity.lastCommit ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Commit</span>
                    <span className="text-sm">
                      {new Date(devActivity.lastCommit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Commit Frequency</span>
                    <span className="text-sm">{devActivity.commitFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contributors</span>
                    <span className="text-sm">{devActivity.contributors}</span>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No GitHub activity data available</span>
              )}
            </div>
            
            <div className="p-3 border border-muted rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground">
                {Object.values(socialLinks).some(link => link) ? 
                  "This project has an established online presence, which is generally a positive sign. Always verify the authenticity of social links." :
                  "No official social links were found for this token, which could be a concern. Legitimate projects typically maintain social channels for community engagement."
                }
                {devActivity.lastCommit && devActivity.commitFrequency !== "No recent activity" ? 
                  " Developer activity shows ongoing project maintenance, suggesting continued development." :
                  " Limited or no developer activity could indicate an abandoned or inactive project."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenAnalysis;
