
// Chain detection utility
// This utility helps identify which blockchain an address belongs to
import axios from 'axios';

// Define address patterns for different blockchains
const ADDRESS_PATTERNS = {
  bitcoin: /^(1|3|bc1)[a-zA-Z0-9]{25,42}$/,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  ethereum: /^0x[a-fA-F0-9]{40}$/,
  // All EVM chains share the same address format, so we'll 
  // need additional logic for distinguishing them
};

// Etherscan API key (for supported EVM networks)
const ETHERSCAN_API_KEY = 'VZFDUWB3YGQ1YCDKTCU1D6DDSS';

// Explorer API endpoints for checking activity
const EXPLORER_APIS = {
  ethereum: {
    url: 'https://api.etherscan.io/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  binance: {
    url: 'https://api.bscscan.com/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  polygon: {
    url: 'https://api.polygonscan.com/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  arbitrum: {
    url: 'https://api.arbiscan.io/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  optimism: {
    url: 'https://api-optimistic.etherscan.io/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  avalanche: {
    url: 'https://api.snowtrace.io/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  fantom: {
    url: 'https://api.ftmscan.com/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  base: {
    url: 'https://api.basescan.org/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  },
  zksync: {
    url: 'https://api-zksync-era.etherscan.io/api',
    apiKey: ETHERSCAN_API_KEY,
    module: 'account',
    action: 'txlist'
  }
};

/**
 * Detects which blockchain an address likely belongs to by checking actual on-chain activity
 * @param address The address to check
 * @returns The blockchain identifier or null if detection fails
 */
export async function detectBlockchain(address: string): Promise<string | null> {
  // First check for basic patterns
  if (ADDRESS_PATTERNS.bitcoin.test(address)) {
    return 'bitcoin';
  }
  
  if (ADDRESS_PATTERNS.solana.test(address)) {
    return 'solana';
  }
  
  if (ADDRESS_PATTERNS.ethereum.test(address)) {
    // For EVM-compatible chains, check activity on each chain
    try {
      // Check all EVM chains in parallel
      const evmChains = Object.keys(EXPLORER_APIS);
      const chainCheckPromises = evmChains.map(async (chain) => {
        const api = EXPLORER_APIS[chain as keyof typeof EXPLORER_APIS];
        if (!api) return { chain, txCount: 0 };
        
        try {
          const response = await axios.get(api.url, {
            params: {
              module: api.module,
              action: api.action,
              address: address,
              startblock: 0,
              endblock: 99999999,
              page: 1,
              offset: 10, // We only need to check if transactions exist
              sort: 'desc',
              apikey: api.apiKey
            },
            timeout: 3000 // Set a timeout to avoid long waiting times
          });
          
          // Check if we got a valid response with transactions
          if (response.data && 
              response.data.status === '1' && 
              response.data.result && 
              Array.isArray(response.data.result)) {
            return { 
              chain, 
              txCount: response.data.result.length,
              // If we have full response with transactions, this is likely the right chain
              isValid: response.data.result.length > 0
            };
          }
          
          return { chain, txCount: 0, isValid: false };
        } catch (error) {
          console.error(`Error checking ${chain} for address ${address}:`, error);
          return { chain, txCount: 0, isValid: false };
        }
      });
      
      // Wait for all promises to resolve
      const results = await Promise.allSettled(chainCheckPromises);
      
      // Filter for successful calls and valid chains
      const validChains = results
        .filter((result) => 
          result.status === 'fulfilled' && result.value.isValid === true)
        .map((result) => {
          // We know these are fulfilled results based on the filter
          const fulfilledResult = result as PromiseFulfilledResult<{ chain: string, txCount: number, isValid?: boolean }>;
          return { 
            chain: fulfilledResult.value.chain, 
            txCount: fulfilledResult.value.txCount 
          };
        });
      
      // If we found any valid chains, return the one with the most transactions
      if (validChains.length > 0) {
        // Sort by transaction count (highest first)
        validChains.sort((a, b) => b.txCount - a.txCount);
        return validChains[0].chain;
      }
      
      // Fallback to Ethereum if no activity found on any chain (most common)
      return 'ethereum';
    } catch (error) {
      console.error("Error detecting EVM chain:", error);
      // Default to Ethereum if we can't determine
      return 'ethereum';
    }
  }
  
  // If we get here, we couldn't determine the blockchain
  return null;
}

/**
 * Detects if an address is a wallet or a contract
 * @param address The address to check
 * @param network The blockchain network
 * @returns true if it's a contract, false if it's a wallet
 */
export async function isContract(address: string, network: string): Promise<boolean> {
  // In a real implementation, this would query the chain to check if
  // the address has contract code
  
  // For this MVP, let's randomly decide
  // In reality, this would check for contract bytecode on the blockchain
  const random = Math.random();
  
  // Bias towards wallets (70% wallets, 30% contracts)
  return random > 0.7;
}

/**
 * Analyzes a token contract for security risks (for EVM chains only)
 * @param address The contract address
 * @param network The blockchain network
 * @returns Object containing security analysis results
 */
export async function analyzeTokenSecurity(address: string, network: string): Promise<any> {
  if (network === 'bitcoin' || network === 'solana') {
    return { 
      error: "Token security analysis is only available for EVM-compatible chains",
      supported: false
    };
  }
  
  // For demo purposes, we'll simulate token security analysis
  // In a real implementation, this would perform static analysis of the contract
  // and check for common security issues
  
  const isOwnershipRenounced = Math.random() > 0.5;
  const isLiquidityLocked = Math.random() > 0.4;
  const liquidityLockDuration = isLiquidityLocked ? 
    `${Math.floor(Math.random() * 24) + 1} months` : "Not locked";
  const liquidityAmount = `$${(Math.random() * 1000000).toFixed(2)}`;
  const liquidityPercent = `${Math.floor(Math.random() * 90) + 10}%`;
  
  // Simulated honeypot test
  const isBuyable = Math.random() > 0.2;
  const isSellable = isBuyable ? (Math.random() > 0.3) : false;
  const honeypotRisk = !isSellable ? "High" : (Math.random() > 0.7 ? "Low" : "Medium");
  
  // Simulate contract verification
  const isVerified = Math.random() > 0.3;
  
  // Simulate dangerous functions
  const dangerousFunctions = [
    { name: "mint", exists: Math.random() > 0.6, risk: "High", 
      description: "Allows creation of new tokens" },
    { name: "setMaxTxAmount", exists: Math.random() > 0.7, risk: "Medium", 
      description: "Can limit maximum transaction size" },
    { name: "excludeFromFee", exists: Math.random() > 0.5, risk: "Medium", 
      description: "Can exempt addresses from fees" },
    { name: "setFees", exists: Math.random() > 0.6, risk: "High", 
      description: "Can change transaction fees" },
    { name: "blacklist", exists: Math.random() > 0.8, risk: "High", 
      description: "Can block addresses from trading" },
    { name: "pause", exists: Math.random() > 0.8, risk: "High", 
      description: "Can pause all transactions" },
    { name: "transferOwnership", exists: Math.random() > 0.4, risk: "Medium", 
      description: "Can transfer contract ownership" },
  ].filter(func => func.exists);
  
  // Simulate transaction fees
  const buyFee = Math.floor(Math.random() * 15);
  const sellFee = Math.floor(Math.random() * 20);
  const totalFee = buyFee + sellFee;
  const highFees = totalFee > 10;
  
  // Simulate token distribution
  const tokenDistribution = [
    { type: "Top Holder", percentage: Math.floor(Math.random() * 30) + 10 },
    { type: "Top 10 Holders", percentage: Math.floor(Math.random() * 30) + 40 },
    { type: "Liquidity Pool", percentage: Math.floor(Math.random() * 20) + 10 },
    { type: "Other Holders", percentage: Math.floor(Math.random() * 20) }
  ];
  
  // Calculate total percentage and adjust to ensure it's 100%
  const totalPercentage = tokenDistribution.reduce((sum, item) => sum + item.percentage, 0);
  if (totalPercentage !== 100) {
    const lastIndex = tokenDistribution.length - 1;
    tokenDistribution[lastIndex].percentage += (100 - totalPercentage);
  }
  
  // Simulate social links
  const socialLinks = {
    website: Math.random() > 0.3 ? "https://example.com" : null,
    twitter: Math.random() > 0.4 ? "https://twitter.com/example" : null,
    telegram: Math.random() > 0.5 ? "https://t.me/example" : null,
    discord: Math.random() > 0.6 ? "https://discord.gg/example" : null,
    github: Math.random() > 0.7 ? "https://github.com/example/repo" : null,
  };
  
  // Simulate developer activity
  const devActivity = {
    lastCommit: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString() : null,
    commitFrequency: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}/week` : "No recent activity",
    contributors: Math.floor(Math.random() * 10) + 1
  };
  
  // Calculate overall safety score
  let safetyScore = 0;
  
  // Ownership factor (0-25 points)
  safetyScore += isOwnershipRenounced ? 25 : (dangerousFunctions.length > 3 ? 5 : 15);
  
  // Liquidity factor (0-25 points)
  safetyScore += isLiquidityLocked ? 25 : 0;
  
  // Honeypot factor (0-20 points)
  safetyScore += isSellable ? 20 : 0;
  
  // Verification factor (0-10 points)
  safetyScore += isVerified ? 10 : 0;
  
  // Fees factor (0-10 points)
  safetyScore += highFees ? 0 : 10;
  
  // Token distribution factor (0-10 points)
  const topHolderConcentration = tokenDistribution[0].percentage;
  safetyScore += topHolderConcentration > 25 ? 0 : (topHolderConcentration > 15 ? 5 : 10);
  
  // Safety level determination
  let safetyLevel = "High Risk";
  if (safetyScore >= 80) {
    safetyLevel = "Safe";
  } else if (safetyScore >= 50) {
    safetyLevel = "Caution";
  }
  
  return {
    safetyScore,
    safetyLevel,
    ownershipRenounced: isOwnershipRenounced,
    liquidityLocked: isLiquidityLocked,
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
    devActivity,
    supported: true
  };
}
