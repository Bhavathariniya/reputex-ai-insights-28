
import { toast } from "sonner";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

// API endpoints - in a real app, move these to environment variables
const API_ENDPOINTS = {
  ethereum: {
    explorer: "https://api.etherscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/ethereum"
  },
  binance: {
    explorer: "https://api.bscscan.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain"
  },
  polygon: {
    explorer: "https://api.polygonscan.com/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/polygon-pos"
  },
  arbitrum: {
    explorer: "https://api.arbiscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one"
  },
  optimism: {
    explorer: "https://api-optimistic.etherscan.io/api",
    price: "https://api.coingecko.com/api/v3/simple/token_price/optimistic-ethereum"
  }
};

const GITHUB_API_URL = "https://api.github.com";
const SENTIMENT_API_ENDPOINT = "https://api.example.com/sentiment"; // Replace with actual API in production

// For this MVP version, we'll use a placeholder API key
// In production, this should be stored securely in environment variables
const API_KEYS = {
  ethereum: "YOURAPIKEY",
  binance: "YOURAPIKEY",
  polygon: "YOURAPIKEY",
  arbitrum: "YOURAPIKEY",
  optimism: "YOURAPIKEY"
};

// Utility function to fetch data from APIs
export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("API request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`API Error: ${errorMessage}`);
    return { error: errorMessage };
  }
}

// Enhanced blockchain Explorer API functions
export async function getWalletTransactions(address: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would connect to the appropriate blockchain explorer API
  // For MVP, we'll simulate the response with enhanced on-chain metrics
  return simulateApiCall({
    status: "1",
    message: "OK",
    result: {
      wallet_age: `${Math.floor(Math.random() * 5) + 1} years`,
      total_txns: Math.floor(Math.random() * 2000) + 100,
      num_contracts: Math.floor(Math.random() * 10) + 1,
      avg_balance: `${Math.floor(Math.random() * 10000)} USDT`,
      tx_frequency: `${Math.floor(Math.random() * 50) + 5}/week`,
      unusual_tx_patterns: Math.random() > 0.8,
      contract_verified: Math.random() > 0.3,
      network: network,
    }
  });
}

// Enhanced token data API functions
export async function getTokenData(tokenAddress: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would connect to CoinGecko or similar API
  // For MVP, we'll simulate the response with enhanced metrics
  return simulateApiCall({
    liquidity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    price_change_24h: (Math.random() * 20 - 10).toFixed(2) + "%",
    volume_24h: `$${Math.floor(Math.random() * 1000000)}`,
    market_cap: `$${Math.floor(Math.random() * 10000000)}`,
    token_age: `${Math.floor(Math.random() * 24) + 1} months`,
    top_holder_concentration: `${Math.floor(Math.random() * 40) + 10}%`,
    lp_locked: Math.random() > 0.3,
    similar_contracts: Math.floor(Math.random() * 5),
    network: network,
  });
}

// Enhanced GitHub API functions
export async function getRepoActivity(repoUrl: string): Promise<ApiResponse<any>> {
  // In a real implementation, this would connect to GitHub API
  // For MVP, we'll simulate the response with enhanced metrics
  return simulateApiCall({
    repo_commits: Math.floor(Math.random() * 500) + 50,
    contributors: Math.floor(Math.random() * 20) + 1,
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 200),
    last_commit: "2023-12-01T10:30:00Z",
    open_issues: Math.floor(Math.random() * 50),
    closed_issues: Math.floor(Math.random() * 200),
    commit_frequency: `${Math.floor(Math.random() * 10) + 1}/week`,
    developer_reputation: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
  });
}

// New function to get social sentiment data
export async function getSocialSentiment(address: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would connect to a social sentiment API
  // For MVP, we'll simulate the response
  
  // Generate random sentiment data
  const sentimentOptions = ['positive', 'negative', 'neutral', 'mixed'];
  const sentiment = sentimentOptions[Math.floor(Math.random() * sentimentOptions.length)];
  
  // Generate random keywords based on sentiment
  const positiveKeywords = ['bullish', 'moon', 'gem', 'hold', 'legit', 'growth', 'potential', 'partnership'];
  const negativeKeywords = ['scam', 'rug', 'dump', 'avoid', 'fake', 'suspicious', 'copy', 'ponzi'];
  const neutralKeywords = ['project', 'token', 'launch', 'update', 'team', 'roadmap', 'development'];
  
  let selectedKeywords;
  if (sentiment === 'positive') {
    selectedKeywords = [...positiveKeywords];
  } else if (sentiment === 'negative') {
    selectedKeywords = [...negativeKeywords];
  } else if (sentiment === 'neutral') {
    selectedKeywords = [...neutralKeywords];
  } else {
    // Mixed sentiment
    selectedKeywords = [...positiveKeywords, ...negativeKeywords, ...neutralKeywords];
  }
  
  // Shuffle and take random keywords
  const shuffled = [...selectedKeywords].sort(() => 0.5 - Math.random());
  const keywords = shuffled.slice(0, Math.floor(Math.random() * 5) + 3);
  
  // Generate random phrases
  const positiveExpressions = [
    "This project has strong fundamentals",
    "Team is very responsive and professional",
    "Great roadmap and transparency",
    "Solid tokenomics and use case",
    "Strong community backing this one"
  ];
  
  const negativeExpressions = [
    "Devs dumped their tokens last week",
    "Contract looks similar to known scams",
    "Team is anonymous with no track record",
    "Liquidity is very low and concerning",
    "High wallet concentration is a red flag"
  ];
  
  const neutralExpressions = [
    "Project is still in early development",
    "Waiting for more updates from the team",
    "Average performance compared to similar tokens",
    "Team needs to communicate more regularly",
    "Looking forward to the next milestone"
  ];
  
  let selectedExpressions;
  if (sentiment === 'positive') {
    selectedExpressions = [...positiveExpressions];
  } else if (sentiment === 'negative') {
    selectedExpressions = [...negativeExpressions];
  } else if (sentiment === 'neutral') {
    selectedExpressions = [...neutralExpressions];
  } else {
    // Mixed sentiment
    selectedExpressions = [
      ...positiveExpressions.slice(0, 2), 
      ...negativeExpressions.slice(0, 2),
      ...neutralExpressions.slice(0, 1)
    ];
  }
  
  // Shuffle and take random expressions
  const shuffledExpressions = [...selectedExpressions].sort(() => 0.5 - Math.random());
  const phrases = shuffledExpressions.slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Generate random source counts
  const twitterCount = Math.floor(Math.random() * 500) + 50;
  const redditCount = Math.floor(Math.random() * 300) + 20;
  const telegramCount = Math.floor(Math.random() * 400) + 30;
  const discordCount = Math.floor(Math.random() * 250) + 25;
  
  return simulateApiCall({
    sentiment: sentiment,
    keywords: keywords,
    phrases: phrases,
    sources: {
      twitter: twitterCount,
      reddit: redditCount,
      telegram: telegramCount,
      discord: discordCount
    },
    sentiment_score: Math.floor(Math.random() * 100),
    fud_detection: sentiment === 'negative' ? 'high' : sentiment === 'mixed' ? 'medium' : 'low',
    social_mentions: twitterCount + redditCount + telegramCount + discordCount
  });
}

// New function to detect scam indicators
export async function detectScamIndicators(address: string, tokenData: any, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would use various heuristics to detect scam patterns
  // For MVP, we'll simulate the response
  
  const possibleIndicators = [
    {
      label: "Honeypot Function",
      description: "Contract contains code that may prevent selling tokens once purchased",
      probability: Math.random()
    },
    {
      label: "Copied Contract",
      description: "Contract appears to be a duplicate of another project with minimal changes",
      probability: Math.random()
    },
    {
      label: "Hidden Owner Functions",
      description: "Contract contains privileged functions that allow owner to manipulate token",
      probability: Math.random()
    },
    {
      label: "Unverified Contract",
      description: "Source code is not verified on blockchain explorer",
      probability: Math.random()
    },
    {
      label: "High Whale Concentration",
      description: "Few wallets control a large percentage of total supply",
      probability: Math.random()
    },
    {
      label: "Pump & Dump Pattern",
      description: "Price and volume patterns match typical pump and dump schemes",
      probability: Math.random()
    },
    {
      label: "Malicious Approval",
      description: "Contract requests excessive token approvals",
      probability: Math.random()
    },
    {
      label: "Locked Liquidity",
      description: "Liquidity cannot be withdrawn by token holders",
      probability: Math.random()
    }
  ];
  
  // Filter out indicators with low probability
  const threshold = 0.7; // 70% probability threshold
  const detectedIndicators = possibleIndicators
    .filter(indicator => indicator.probability > threshold)
    .map(({ label, description }) => ({ label, description }));
  
  return simulateApiCall({
    address: address,
    network: network,
    scam_indicators: detectedIndicators,
    risk_score: Math.floor(Math.random() * 100),
    confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
  });
}

// Function to simulate API call with a delay
async function simulateApiCall<T>(mockData: T): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({ data: mockData });
    }, 1000);
  });
}

// Enhanced function to get AI analysis (simulated)
export async function getAIAnalysis(aggregatedData: any): Promise<ApiResponse<any>> {
  // In a real implementation, this would call an AI API endpoint
  // For MVP, we'll simulate the response with enhanced metrics
  
  // Generate random scores with higher statistical variation
  const trustScore = Math.floor(Math.random() * 40) + 60; // 60-100
  const developerScore = Math.floor(Math.random() * 60) + 40; // 40-100
  const liquidityScore = Math.floor(Math.random() * 50) + 50; // 50-100
  const communityScore = Math.floor(Math.random() * 40) + 50; // 50-90
  const holderDistribution = Math.floor(Math.random() * 50) + 40; // 40-90
  const fraudRisk = Math.floor(Math.random() * 50) + 20; // 20-70
  const socialSentiment = Math.floor(Math.random() * 50) + 40; // 40-90
  const confidenceScore = Math.floor(Math.random() * 20) + 75; // 75-95
  
  const network = aggregatedData.network || 'ethereum';
  
  // Different analysis texts based on network with enhanced content
  const analysisTexts: Record<string, string[]> = {
    ethereum: [
      "The Ethereum address shows consistent transaction history and good liquidity, indicating reliability and operational stability. Developer activity is moderate but steady. Based on transaction volume and age, this appears to be an established project with reasonable trust indicators. Social sentiment analysis reveals generally positive community perception with occasional concerns about development pace.",
      "Analysis of this Ethereum address reveals strong developer commitment with frequent commits and updates. Liquidity levels are adequate for current market cap. The address has a solid transaction history with diverse interactions, suggesting legitimate operations. On-chain metrics show healthy holder distribution without concerning concentration patterns. Community sentiment is mixed but trending positive over the last 30 days."
    ],
    binance: [
      "This BNB Chain address demonstrates patterns typical of established projects. The transaction count and wallet age suggest continuous development and user engagement. Contract interactions appear standard, and the balance history indicates proper treasury management. Social media analysis indicates some community concerns about recent team changes, but sentiment remains cautiously optimistic.",
      "The BNB Chain token shows reasonable liquidity metrics and healthy trading volume. Developer activity is present though moderately active. The holder distribution indicates a relatively well-distributed token without excessive concentration. Social sentiment has been volatile but is currently stabilizing after recent market fluctuations. GitHub analytics show consistent but moderate developer engagement."
    ],
    polygon: [
      "The Polygon address demonstrates strong on-chain activity with consistent transactions and interaction patterns. Liquidity appears adequate and the project shows signs of active development and community engagement. Social sentiment analysis reveals growing positive momentum, particularly on Twitter and Telegram. Contract verification status and transaction patterns align with legitimate project indicators.",
      "Analysis of this Polygon token reveals a healthy trading volume and reasonable market depth. The development team appears active with regular updates. Community growth metrics suggest increasing adoption. Social media sentiment is predominantly positive with some isolated concerns about competition in the sector. Contract analysis indicates proper security measures are in place."
    ],
    arbitrum: [
      "This Arbitrum address shows promising metrics with good transaction volume and regular activity. Developer engagement is above average and liquidity ratios indicate healthy market participation. Social sentiment across platforms is moderately positive with notable enthusiasm on Discord. Holder distribution shows a healthy ecosystem without concerning centralization.",
      "The Arbitrum token demonstrates prudent treasury management and reasonable liquidity metrics. Code quality appears solid based on contract analysis, and community sentiment is generally positive. Social analysis reveals some temporary FUD that appears to be driven by market conditions rather than project-specific concerns. Transaction patterns show organic trading without manipulation indicators."
    ],
    optimism: [
      "The Optimism address shows healthy transaction patterns and active usage. Developer commitment appears strong with regular updates and improvements. Market liquidity is sufficient for current trading volume. Social sentiment analysis shows growing community support with positive mentions across multiple platforms. Wallet distribution metrics indicate a healthy ecosystem without concerning whale concentration.",
      "Analysis of this Optimism token reveals stable growth metrics and reasonable holder distribution. Contract security appears satisfactory and the project demonstrates signs of long-term viability. Social media sentiment analysis shows predominantly positive community perception with occasional questions about roadmap timelines. GitHub activity indicates an active development team with regular contributions."
    ]
  };
  
  // Select an analysis text based on network, or default to ethereum
  const networkTexts = analysisTexts[network] || analysisTexts.ethereum;
  const analysisIndex = Math.floor(Math.random() * networkTexts.length);
  
  // Determine a verdict category based on scores
  let verdict = 'Likely Legit';
  if (trustScore >= 80 && fraudRisk < 40 && liquidityScore >= 70) {
    verdict = 'Highly Legit';
  } else if (fraudRisk > 70 || trustScore < 50) {
    verdict = 'High Risk';
  } else if (fraudRisk > 50 || trustScore < 60) {
    verdict = 'Likely Risky';
  }
  
  // Generate scam indicators if high risk
  let scamIndicators: { label: string, description: string }[] = [];
  
  if (verdict === 'High Risk' || verdict === 'Likely Risky') {
    const possibleIndicators = [
      { label: "Honeypot Function", description: "Contract contains code that may prevent selling tokens once purchased" },
      { label: "Copied Contract", description: "Contract appears to be a duplicate of another project with minimal changes" },
      { label: "Hidden Owner Functions", description: "Contract contains privileged functions that allow owner to manipulate token" },
      { label: "Unverified Contract", description: "Source code is not verified on blockchain explorer" },
      { label: "High Whale Concentration", description: "Few wallets control a large percentage of total supply" },
      { label: "Pump & Dump Pattern", description: "Price and volume patterns match typical pump and dump schemes" },
    ];
    
    // Select random indicators
    const numIndicators = verdict === 'High Risk' ? 
      Math.floor(Math.random() * 3) + 2 : // 2-4 indicators for High Risk
      Math.floor(Math.random() * 2) + 1;  // 1-2 indicators for Likely Risky
    
    // Shuffle and select random indicators
    const shuffled = [...possibleIndicators].sort(() => 0.5 - Math.random());
    scamIndicators = shuffled.slice(0, numIndicators);
  }
  
  // Generate social sentiment data
  const sentimentOptions = ['positive', 'negative', 'neutral', 'mixed'];
  let sentiment;
  
  if (verdict === 'Highly Legit') {
    // 80% chance of positive sentiment for highly legit projects
    sentiment = Math.random() < 0.8 ? 'positive' : (Math.random() < 0.5 ? 'mixed' : 'neutral');
  } else if (verdict === 'High Risk') {
    // 80% chance of negative sentiment for high risk projects
    sentiment = Math.random() < 0.8 ? 'negative' : (Math.random() < 0.5 ? 'mixed' : 'neutral');
  } else if (verdict === 'Likely Risky') {
    // Mixed sentiment more likely for risky projects
    sentiment = Math.random() < 0.5 ? 'mixed' : (Math.random() < 0.6 ? 'negative' : 'neutral');
  } else {
    // Generally positive sentiment for likely legit projects
    sentiment = Math.random() < 0.6 ? 'positive' : (Math.random() < 0.6 ? 'neutral' : 'mixed');
  }
  
  // Generate keywords based on sentiment
  const positiveKeywords = ['bullish', 'moon', 'gem', 'hold', 'legit', 'growth', 'potential', 'partnership'];
  const negativeKeywords = ['scam', 'rug', 'dump', 'avoid', 'fake', 'suspicious', 'copy', 'ponzi'];
  const neutralKeywords = ['project', 'token', 'launch', 'update', 'team', 'roadmap', 'development'];
  
  let selectedKeywords = [];
  if (sentiment === 'positive') {
    selectedKeywords = [...positiveKeywords];
  } else if (sentiment === 'negative') {
    selectedKeywords = [...negativeKeywords];
  } else if (sentiment === 'neutral') {
    selectedKeywords = [...neutralKeywords];
  } else {
    // Mixed sentiment
    selectedKeywords = [...positiveKeywords, ...negativeKeywords, ...neutralKeywords];
  }
  
  // Shuffle and take random keywords
  const shuffledKeywords = [...selectedKeywords].sort(() => 0.5 - Math.random());
  const keywords = shuffledKeywords.slice(0, Math.floor(Math.random() * 5) + 3);
  
  // Generate random phrases
  const positiveExpressions = [
    "This project has strong fundamentals",
    "Team is very responsive and professional",
    "Great roadmap and transparency",
    "Solid tokenomics and use case",
    "Strong community backing this one"
  ];
  
  const negativeExpressions = [
    "Devs dumped their tokens last week",
    "Contract looks similar to known scams",
    "Team is anonymous with no track record",
    "Liquidity is very low and concerning",
    "High wallet concentration is a red flag"
  ];
  
  const neutralExpressions = [
    "Project is still in early development",
    "Waiting for more updates from the team",
    "Average performance compared to similar tokens",
    "Team needs to communicate more regularly",
    "Looking forward to the next milestone"
  ];
  
  let selectedExpressions = [];
  if (sentiment === 'positive') {
    selectedExpressions = [...positiveExpressions];
  } else if (sentiment === 'negative') {
    selectedExpressions = [...negativeExpressions];
  } else if (sentiment === 'neutral') {
    selectedExpressions = [...neutralExpressions];
  } else {
    // Mixed sentiment
    selectedExpressions = [
      ...positiveExpressions.slice(0, 2), 
      ...negativeExpressions.slice(0, 2),
      ...neutralExpressions.slice(0, 1)
    ];
  }
  
  // Shuffle and take random expressions
  const shuffledExpressions = [...selectedExpressions].sort(() => 0.5 - Math.random());
  const phrases = shuffledExpressions.slice(0, Math.floor(Math.random() * 3) + 2);
  
  // Generate random source counts
  const twitterCount = Math.floor(Math.random() * 500) + 50;
  const redditCount = Math.floor(Math.random() * 300) + 20;
  const telegramCount = Math.floor(Math.random() * 400) + 30;
  const discordCount = Math.floor(Math.random() * 250) + 25;
  
  return simulateApiCall({
    trust_score: trustScore,
    developer_score: developerScore,
    liquidity_score: liquidityScore,
    community_score: communityScore,
    holder_distribution: holderDistribution,
    fraud_risk: fraudRisk,
    social_sentiment: socialSentiment,
    confidence_score: confidenceScore,
    analysis: networkTexts[analysisIndex],
    timestamp: new Date().toISOString(),
    network: network,
    verdict: verdict,
    scam_indicators: scamIndicators,
    sentiment_data: {
      sentiment: sentiment,
      keywords: keywords,
      phrases: phrases,
      sources: {
        twitter: twitterCount,
        reddit: redditCount,
        telegram: telegramCount,
        discord: discordCount
      }
    }
  });
}

// Update the blockchain contract interface (simulated)
export async function checkBlockchainForScore(address: string, network: string = 'ethereum'): Promise<ApiResponse<any>> {
  // In a real implementation, this would query a blockchain smart contract
  // For MVP, we'll simulate by checking localStorage
  try {
    const storedData = localStorage.getItem(`reputex_score_${network}_${address}`);
    if (storedData) {
      return { data: JSON.parse(storedData) };
    }
    return { data: null };
  } catch (error) {
    console.error("Error checking for blockchain data:", error);
    return { data: null };
  }
}

export async function storeScoreOnBlockchain(address: string, scoreData: any): Promise<ApiResponse<boolean>> {
  // In a real implementation, this would store data on a blockchain via smart contract
  // For MVP, we'll simulate by using localStorage
  try {
    const network = scoreData.network || 'ethereum';
    
    // Save to localStorage with a timestamp
    const dataToStore = {
      ...scoreData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`reputex_score_${network}_${address}`, JSON.stringify(dataToStore));
    
    // Add to history
    const historyString = localStorage.getItem('reputex_history') || '[]';
    const history = JSON.parse(historyString);
    
    // Check if address already exists in history
    const existingIndex = history.findIndex((item: any) => 
      item.address === address && item.network === network
    );
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = { 
        address, 
        network,
        trustScore: scoreData.trust_score,
        timestamp: new Date().toISOString(),
        verdict: scoreData.verdict || 'Likely Legit',
        scamIndicators: scoreData.scam_indicators ? 
          scoreData.scam_indicators.map((i: any) => i.label) : []
      };
    } else {
      // Add new entry
      history.push({ 
        address, 
        network,
        trustScore: scoreData.trust_score,
        timestamp: new Date().toISOString(),
        verdict: scoreData.verdict || 'Likely Legit',
        scamIndicators: scoreData.scam_indicators ? 
          scoreData.scam_indicators.map((i: any) => i.label) : []
      });
    }
    
    // Save updated history
    localStorage.setItem('reputex_history', JSON.stringify(history));
    
    return { data: true };
  } catch (error) {
    console.error("Error storing blockchain data:", error);
    return { error: "Failed to store data on blockchain" };
  }
}

export async function getScoreHistory(): Promise<ApiResponse<any[]>> {
  // In a real implementation, this would query historical data from blockchain
  // For MVP, we'll simulate by using localStorage
  try {
    const historyString = localStorage.getItem('reputex_history') || '[]';
    const history = JSON.parse(historyString);
    return { data: history };
  } catch (error) {
    console.error("Error fetching history:", error);
    return { error: "Failed to retrieve score history" };
  }
}

export async function deleteHistoryItem(address: string, network: string = 'ethereum'): Promise<ApiResponse<boolean>> {
  try {
    // Delete from history
    const historyString = localStorage.getItem('reputex_history') || '[]';
    let history = JSON.parse(historyString);
    
    // Filter out the item to delete
    history = history.filter((item: any) => 
      !(item.address === address && item.network === network)
    );
    
    // Save updated history
    localStorage.setItem('reputex_history', JSON.stringify(history));
    
    // Also remove the corresponding score data
    localStorage.removeItem(`reputex_score_${network}_${address}`);
    
    return { data: true };
  } catch (error) {
    console.error("Error deleting history item:", error);
    return { error: "Failed to delete history item" };
  }
}

export async function clearAllHistory(): Promise<ApiResponse<boolean>> {
  try {
    // Get current history to identify items to remove
    const historyString = localStorage.getItem('reputex_history') || '[]';
    const history = JSON.parse(historyString);
    
    // Remove all individual score items
    for (const item of history) {
      const { address, network = 'ethereum' } = item;
      localStorage.removeItem(`reputex_score_${network}_${address}`);
    }
    
    // Clear history array
    localStorage.setItem('reputex_history', '[]');
    
    return { data: true };
  } catch (error) {
    console.error("Error clearing history:", error);
    return { error: "Failed to clear history" };
  }
}
