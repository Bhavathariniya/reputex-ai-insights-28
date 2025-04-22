
export interface TokenData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  holderCount: number;
  isLiquidityLocked: boolean;
  decimals: number;
  creationTime?: string;
  contractCreator?: string;
  isVerified: boolean;
  compilerVersion?: string;
}

export interface TokenAnalysisResult {
  trustScore: number;
  analysis: string;
  riskFactors: string[];
  communityScore?: number;
  developerScore?: number;
  liquidityScore?: number;
  holderDistributionScore?: number;
  fraudRisk?: number;
  socialSentiment?: number;
}

export interface TokenContractData {
  tokenOverview: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    totalSupply: string;
    deployer: string;
    creationTime: string;
  };
  rugPullRisk: {
    score: number;
    level: string;
    indicators: Array<{term: string; found: boolean; risk: string}>;
    ownershipRenounced: boolean;
  };
  honeypotCheck: {
    isHoneypot: boolean;
    risk: string;
    indicators: Array<{term: string; found: boolean; risk: string}>;
  };
  contractVulnerability: {
    isVerified: boolean;
    riskyFunctions: Array<{term: string; found: boolean; risk: string}>;
    liquidityLocked: boolean;
  };
  sybilAttack: {
    score: number;
    level: string;
    suspiciousAddresses: number;
    uniqueReceivers: number;
    uniqueSenders: number;
  };
  walletReputation: {
    score: number;
    level: string;
    previousScams: number;
  };
  scamPatternMatch: string;
  timestamp: string;
}
