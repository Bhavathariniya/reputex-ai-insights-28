
import { toast } from 'sonner';

// Define more specific types for our API configurations
type EtherscanStyleConfig = {
  apiKey: string;
  apiUrl: string;
  customRpc?: boolean;
};

type CustomRpcConfig = {
  apiUrl: string;
  customRpc: boolean;
  apiKey?: string;
};

type ApiConfig = EtherscanStyleConfig | CustomRpcConfig;

// API configuration for different blockchains
const API_CONFIG: Record<string, ApiConfig> = {
  ethereum: {
    apiKey: 'VZFDUWB3YGQ1YCDKTCU1D6DDSS',
    apiUrl: 'https://api.etherscan.io/api'
  },
  binance: {
    apiKey: 'ZM8ACMJB67C2IXKKBF8URFUNSY',
    apiUrl: 'https://api.bscscan.com/api'
  },
  avalanche: {
    apiKey: 'ATJQERBKV1CI3GVKNSE3Q7RGEJ',
    apiUrl: 'https://api.snowscan.xyz/api'
  },
  arbitrum: {
    apiKey: 'B6SVGA7K3YBJEQ69AFKJF4YHVX',
    apiUrl: 'https://api.arbiscan.io/api'
  },
  optimism: {
    apiKey: '66N5FRNV1ZD4I87S7MAHCJVXFJ',
    apiUrl: 'https://api-optimistic.etherscan.io/api'
  },
  // For other chains we'll use custom RPCs or partner APIs
  l1x: {
    apiUrl: 'https://explorer.l1x.io/api',
    customRpc: true
  },
  polygon: {
    apiUrl: 'https://api.polygonscan.com/api',
    customRpc: true
  },
  solana: {
    apiUrl: 'https://api.solscan.io',
    customRpc: true
  },
  fantom: {
    apiUrl: 'https://api.ftmscan.com/api',
    customRpc: true
  }
};

// Function to determine if address is token or wallet
export const determineAddressType = async (address: string, network: string): Promise<'token' | 'wallet'> => {
  try {
    // Implement chain-specific logic to detect if this is a contract or wallet
    // For demo, we'll use a simplified version
    const isContract = await isContractAddress(address, network);
    return isContract ? 'token' : 'wallet';
  } catch (error) {
    console.error('Error determining address type:', error);
    return 'wallet'; // Default to wallet if detection fails
  }
};

// Check if address is a contract
const isContractAddress = async (address: string, network: string): Promise<boolean> => {
  try {
    // For EVM chains
    if (['ethereum', 'binance', 'avalanche', 'arbitrum', 'optimism', 'polygon', 'fantom'].includes(network)) {
      const config = API_CONFIG[network];
      if (!config) return false;
      
      // Type guard to check if we have an Etherscan-style API with apiKey
      if ('apiKey' in config && config.apiKey) {
        const response = await fetch(`${config.apiUrl}?module=proxy&action=eth_getCode&address=${address}&apikey=${config.apiKey}`);
        const data = await response.json();
        
        // If code is not "0x", it's a contract
        return data.result && data.result !== '0x';
      }
      
      // For custom RPCs
      if ('customRpc' in config && config.customRpc) {
        // Implement custom RPC logic for contract detection
        // For demo purposes, we'll return a simplified check
        return address.startsWith('0x') && address.length >= 42;
      }
    }
    
    // For non-EVM chains, we would need to implement specific logic
    // Simplified mock for demo
    return address.startsWith('0x') && address.length >= 42;
  } catch (error) {
    console.error('Error checking if address is contract:', error);
    return false;
  }
};

// Fetch token details
export const fetchTokenDetails = async (address: string, network: string) => {
  try {
    toast.info(`Fetching token details for ${network}...`);
    
    // Get network config
    const config = API_CONFIG[network];
    if (!config) throw new Error(`Network ${network} not supported`);
    
    // EVM chain token details
    if (!('customRpc' in config) || !config.customRpc) {
      // Type guard to ensure we're working with Etherscan-style API
      if (!('apiKey' in config) || !config.apiKey) {
        throw new Error(`API key not found for ${network}`);
      }
      
      // Fetch token info
      const tokenInfoUrl = `${config.apiUrl}?module=token&action=tokeninfo&contractaddress=${address}&apikey=${config.apiKey}`;
      const tokenResponse = await fetch(tokenInfoUrl);
      const tokenData = await tokenResponse.json();
      
      if (tokenData.status !== '1') {
        throw new Error(`Failed to fetch token info: ${tokenData.message || 'Unknown error'}`);
      }
      
      // Fetch contract creation info
      const creationUrl = `${config.apiUrl}?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${config.apiKey}`;
      const creationResponse = await fetch(creationUrl);
      const creationData = await creationResponse.json();
      
      // Fetch verification status
      const verificationUrl = `${config.apiUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${config.apiKey}`;
      const verificationResponse = await fetch(verificationUrl);
      const verificationData = await verificationResponse.json();
      
      // Getting ownership status is trickier and might involve analyzing the contract ABI
      // For demo, we'll determine renounced ownership based on a common pattern
      const isOwnershipRenounced = checkIfOwnershipRenounced(verificationData);
      
      return {
        name: tokenData.result[0]?.tokenName || 'Unknown Token',
        symbol: tokenData.result[0]?.symbol || '???',
        decimals: tokenData.result[0]?.divisor || 18,
        totalSupply: tokenData.result[0]?.totalSupply || '0',
        creator: creationData.result?.[0]?.contractCreator || 'Unknown',
        createdAt: new Date().toISOString(), // This would come from creationData in a real implementation
        isVerified: verificationData.result?.[0]?.ABI !== 'Contract source code not verified',
        ownershipRenounced: isOwnershipRenounced,
        network
      };
    }
    
    // For custom RPC chains - mock implementation for demo
    return mockTokenDetails(address, network);
  } catch (error) {
    console.error('Error fetching token details:', error);
    toast.error('Failed to fetch token details');
    return mockTokenDetails(address, network); // Fallback to mock data
  }
};

// Mock token details for demo
const mockTokenDetails = (address: string, network: string) => {
  const networkNames: Record<string, string> = {
    l1x: 'L1X',
    ethereum: 'Ethereum',
    binance: 'BNB Chain',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum',
    optimism: 'Optimism',
    solana: 'Solana',
    avalanche: 'Avalanche',
    fantom: 'Fantom'
  };
  
  const randomNames = ['ReputeX', 'SafeMoon', 'Shiba', 'Doge', 'Pepe', 'Meme', 'DEX', 'Swap', 'Yield', 'Farm'];
  const name = `${randomNames[Math.floor(Math.random() * randomNames.length)]} Token`;
  const symbol = name.split(' ')[0].toUpperCase().substring(0, 4);
  
  return {
    name,
    symbol,
    decimals: 18,
    totalSupply: (Math.random() * 1000000000).toFixed(0),
    creator: `0x${Math.random().toString(16).substring(2, 12)}...${Math.random().toString(16).substring(2, 6)}`,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
    isVerified: Math.random() > 0.3, // 70% chance of being verified
    ownershipRenounced: Math.random() > 0.6, // 40% chance of renounced ownership
    network: networkNames[network] || network
  };
};

// Check if ownership is renounced based on contract verification data
const checkIfOwnershipRenounced = (verificationData: any): boolean => {
  // This is a simplified implementation
  // In a real scenario, we would analyze the contract ABI and look for ownership-related functions
  // and check if the owner is set to the zero address
  
  // Mock implementation for demo
  return Math.random() > 0.6; // 40% chance of renounced ownership
};

// Fetch token security analysis
export const fetchTokenSecurity = async (address: string, network: string) => {
  try {
    toast.info(`Analyzing security for ${network} token...`);
    
    // In a real implementation, we would:
    // 1. Check for honeypot (using honeypot.is API or similar)
    // 2. Analyze contract for dangerous functions
    // 3. Check liquidity locks
    // 4. Check buy/sell fees
    // 5. Analyze token distribution
    
    // For demo, we'll return mock data
    return generateMockSecurityAnalysis(address);
  } catch (error) {
    console.error('Error fetching token security:', error);
    toast.error('Failed to analyze token security');
    return generateMockSecurityAnalysis(address);
  }
};

// Generate mock security analysis
const generateMockSecurityAnalysis = (address: string) => {
  const safetyScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const honeypotRisk = Math.random() > 0.9 ? 'High' : Math.random() > 0.7 ? 'Medium' : 'Low';
  const ownershipRenounced = Math.random() > 0.6; // 40% chance
  const liquidityLocked = Math.random() > 0.3; // 70% chance
  const liquidityLockDuration = liquidityLocked ? `${Math.floor(Math.random() * 24) + 1} months` : 'Not locked';
  const liquidityAmount = `$${(Math.random() * 1000000).toFixed(2)}`;
  const liquidityPercent = `${Math.floor(Math.random() * 30) + 70}%`; // 70-100%
  
  const isBuyable = Math.random() > 0.1; // 90% chance
  const isSellable = Math.random() > 0.2; // 80% chance
  const isVerified = Math.random() > 0.3; // 70% chance
  
  const buyFee = Math.floor(Math.random() * 15); // 0-15%
  const sellFee = Math.floor(Math.random() * 20); // 0-20%
  const totalFee = buyFee + sellFee;
  const highFees = totalFee > 10;
  
  // Dangerous functions
  const dangerousFunctions = [];
  if (Math.random() > 0.6) {
    dangerousFunctions.push({
      name: 'mint',
      risk: 'High',
      description: 'Allows the contract owner to create new tokens at will'
    });
  }
  if (Math.random() > 0.7) {
    dangerousFunctions.push({
      name: 'pause',
      risk: 'High',
      description: 'Allows the contract owner to pause all token transfers'
    });
  }
  if (Math.random() > 0.8) {
    dangerousFunctions.push({
      name: 'excludeFromFee',
      risk: 'Medium',
      description: 'Allows the contract owner to exclude addresses from paying fees'
    });
  }
  
  // Token distribution
  const tokenDistribution = [
    { type: 'Top Holder', percentage: Math.floor(Math.random() * 25) + 5 }, // 5-30%
    { type: 'Top 10 Holders', percentage: Math.floor(Math.random() * 20) + 30 }, // 30-50%
    { type: 'Liquidity Pool', percentage: Math.floor(Math.random() * 15) + 10 }, // 10-25%
    { type: 'Others', percentage: 0 } // Will be calculated
  ];
  
  // Calculate "Others" to make sure total is 100%
  const allocatedPercentage = tokenDistribution.reduce((sum, item) => sum + item.percentage, 0);
  tokenDistribution[3].percentage = 100 - allocatedPercentage;
  
  // Social links
  const socialLinks = {
    website: Math.random() > 0.3 ? 'https://example.com' : '',
    twitter: Math.random() > 0.4 ? 'https://twitter.com/example' : '',
    telegram: Math.random() > 0.5 ? 'https://t.me/example' : '',
    github: Math.random() > 0.7 ? 'https://github.com/example' : ''
  };
  
  // Dev activity
  const devActivity = {
    lastCommit: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString() : null,
    commitFrequency: Math.random() > 0.6 ? `${Math.floor(Math.random() * 10) + 1} per week` : 'No recent activity',
    contributors: Math.floor(Math.random() * 10) + 1
  };
  
  // Determine safety level based on various factors
  let safetyLevel = 'Safe';
  if (honeypotRisk === 'High' || !isSellable || dangerousFunctions.length > 1) {
    safetyLevel = 'High Risk';
  } else if (honeypotRisk === 'Medium' || !liquidityLocked || highFees || tokenDistribution[0].percentage > 20) {
    safetyLevel = 'Caution';
  }
  
  return {
    supported: true,
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
  };
};

// Fetch wallet analysis
export const fetchWalletAnalysis = async (address: string, network: string) => {
  try {
    toast.info(`Analyzing wallet on ${network}...`);
    
    // In a real implementation, we would:
    // 1. Fetch transaction history
    // 2. Analyze transaction patterns
    // 3. Check for connections to known scam addresses
    // 4. Analyze token holdings
    
    // For demo, we'll return mock data
    return generateMockWalletAnalysis(address);
  } catch (error) {
    console.error('Error fetching wallet analysis:', error);
    toast.error('Failed to analyze wallet');
    return generateMockWalletAnalysis(address);
  }
};

// Generate mock wallet analysis
const generateMockWalletAnalysis = (address: string) => {
  return {
    transactionCount: Math.floor(Math.random() * 1000),
    firstTransaction: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
    lastTransaction: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
    totalValue: `$${(Math.random() * 100000).toFixed(2)}`,
    riskScore: Math.floor(Math.random() * 100),
    tokenHoldings: Math.floor(Math.random() * 50),
    interactedWithScam: Math.random() > 0.7,
    knownLabels: Math.random() > 0.8 ? ['Exchange', 'Whale'] : []
  };
};

// Generate AI analysis using Gemini API
export const generateAIAnalysis = async (data: any) => {
  try {
    toast.info('Generating AI analysis...');
    
    // In a real implementation, we would call the Gemini API
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-goog-api-key': 'AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA'
    //   },
    //   body: JSON.stringify({
    //     contents: [{
    //       parts: [{
    //         text: `Analyze this blockchain data and provide a security assessment: ${JSON.stringify(data)}`
    //       }]
    //     }]
    //   })
    // });
    
    // For demo, we'll return mock AI analysis
    return generateMockAIAnalysis(data);
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    toast.error('Failed to generate AI analysis');
    return generateMockAIAnalysis(data);
  }
};

// Generate mock AI analysis
const generateMockAIAnalysis = (data: any) => {
  // Generate trust metrics
  const trust_score = Math.floor(Math.random() * 40) + 60; // 60-100
  const developer_score = Math.floor(Math.random() * 40) + 60;
  const liquidity_score = Math.floor(Math.random() * 40) + 60;
  const community_score = Math.floor(Math.random() * 40) + 60;
  const holder_distribution = Math.floor(Math.random() * 40) + 60;
  const fraud_risk = Math.floor(Math.random() * 40); // 0-40 (lower is better)
  const social_sentiment = Math.floor(Math.random() * 40) + 60;
  const confidence_score = Math.floor(Math.random() * 15) + 85; // 85-100
  
  // Generate categories
  const potentialCategories = ['Meme Token', 'DeFi', 'Governance', 'Utility', 'GameFi', 'NFT', 'CEX Token', 'Exchange-based'];
  const categories = [];
  const categoryCount = Math.floor(Math.random() * 3) + 1; // 1-3 categories
  for (let i = 0; i < categoryCount; i++) {
    const randomCategory = potentialCategories[Math.floor(Math.random() * potentialCategories.length)];
    if (!categories.includes(randomCategory)) {
      categories.push(randomCategory);
    }
  }
  
  // Generate scam indicators
  const potentialScamIndicators = [
    { label: 'High Mint Risk', description: 'Contract allows unlimited minting of new tokens' },
    { label: 'Honeypot', description: 'Token cannot be sold after purchase' },
    { label: 'Unlocked Liquidity', description: 'Liquidity can be removed at any time by the project team' },
    { label: 'High Fees', description: 'Token has unusually high buy/sell fees' },
    { label: 'Concentrated Holdings', description: 'Top holder controls a significant portion of the supply' },
    { label: 'Unverified Contract', description: 'Contract source code is not verified on the blockchain' }
  ];
  
  const scamIndicators = [];
  const indicatorCount = Math.floor(Math.random() * 3); // 0-2 indicators
  for (let i = 0; i < indicatorCount; i++) {
    const randomIndicator = potentialScamIndicators[Math.floor(Math.random() * potentialScamIndicators.length)];
    if (!scamIndicators.some(indicator => indicator.label === randomIndicator.label)) {
      scamIndicators.push(randomIndicator);
    }
  }
  
  // Generate AI analysis text
  const analysisFragments = [
    "This token shows a solid development history with regular commits and updates.",
    "The liquidity is adequately locked, reducing the risk of a rug pull.",
    "Token distribution indicates a relatively healthy spread among holders, though there is some concentration among top wallets.",
    "Contract contains standard functionality without suspicious mint or pause functions.",
    "Social media presence appears authentic with active community engagement.",
    "Transaction patterns suggest normal trading activity without signs of wash trading or price manipulation.",
    "The creator address has a good reputation with no history of fraudulent projects.",
    "Token metrics align with industry averages for this type of project."
  ];
  
  // Select random fragments to create analysis
  const analysisFragmentCount = Math.floor(Math.random() * 3) + 3; // 3-5 fragments
  let analysis = '';
  for (let i = 0; i < analysisFragmentCount; i++) {
    const randomFragment = analysisFragments[Math.floor(Math.random() * analysisFragments.length)];
    if (!analysis.includes(randomFragment)) {
      analysis += randomFragment + ' ';
    }
  }
  
  return {
    trust_score,
    developer_score,
    liquidity_score,
    community_score,
    holder_distribution,
    fraud_risk,
    social_sentiment,
    confidence_score,
    analysis: analysis.trim(),
    timestamp: new Date().toISOString(),
    categories,
    scam_indicators: scamIndicators
  };
};

// Get aggregated analysis for an address
export const getAggregatedAnalysis = async (address: string, network: string) => {
  try {
    // Determine if this is a token or wallet
    const addressType = await determineAddressType(address, network);
    
    // Fetch appropriate data based on address type
    if (addressType === 'token') {
      // For tokens
      const tokenDetails = await fetchTokenDetails(address, network);
      const securityAnalysis = await fetchTokenSecurity(address, network);
      
      // Generate AI analysis
      const combinedData = {
        ...tokenDetails,
        ...securityAnalysis,
        addressType
      };
      
      const aiAnalysis = await generateAIAnalysis(combinedData);
      
      return {
        addressType,
        tokenDetails,
        securityAnalysis,
        aiAnalysis
      };
    } else {
      // For wallets
      const walletAnalysis = await fetchWalletAnalysis(address, network);
      
      // Generate AI analysis
      const aiAnalysis = await generateAIAnalysis(walletAnalysis);
      
      return {
        addressType,
        walletAnalysis,
        aiAnalysis
      };
    }
  } catch (error) {
    console.error('Error getting aggregated analysis:', error);
    toast.error('Analysis failed. Please try again.');
    throw error;
  }
};
