interface AlchemyConfig {
  apiKey: string;
  endpoints: {
    [key: string]: string;
  };
}

const ALCHEMY_CONFIG: AlchemyConfig = {
  apiKey: 'pYRNPV2ZKbpraqzkqwIzEWp3osFe_LW4',
  endpoints: {
    ethereum: 'https://eth-mainnet.g.alchemy.com/v2',
    polygon: 'https://polygon-mainnet.g.alchemy.com/v2',
    arbitrum: 'https://arb-mainnet.g.alchemy.com/v2',
    avalanche: 'https://avax-mainnet.g.alchemy.com/v2',
    bitcoin: 'https://bitcoin-mainnet.g.alchemy.com/v2'
  }
};

interface TokenBalanceResponse {
  jsonrpc: string;
  id: number;
  result: string;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  logo?: string;
}

interface TokenAnalysisResult {
  trustScore: number;
  analysis: string;
  riskFactors: string[];
}

export async function getAddressBalance(address: string, network: string): Promise<string> {
  const endpoint = ALCHEMY_CONFIG.endpoints[network];
  if (!endpoint) {
    throw new Error(`Network ${network} not supported`);
  }

  try {
    const response = await fetch(`${endpoint}/${ALCHEMY_CONFIG.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
    });

    const data: TokenBalanceResponse = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

export async function detectNetwork(address: string): Promise<string> {
  // Try each network in parallel and return the first one that returns a non-zero balance
  const networks = Object.keys(ALCHEMY_CONFIG.endpoints);
  
  try {
    const results = await Promise.all(
      networks.map(async (network) => {
        try {
          const balance = await getAddressBalance(address, network);
          return {
            network,
            balance,
            hasActivity: balance !== '0x0'
          };
        } catch {
          return {
            network,
            balance: '0x0',
            hasActivity: false
          };
        }
      })
    );

    const activeNetwork = results.find(result => result.hasActivity);
    return activeNetwork?.network || 'ethereum'; // Default to ethereum if no activity found
  } catch (error) {
    console.error('Error detecting network:', error);
    return 'ethereum'; // Default to ethereum on error
  }
}

export async function validateAddress(address: string): Promise<boolean> {
  // Basic format validation
  if (!address) return false;
  
  // Check if it's a valid Ethereum/EVM address
  if (address.startsWith('0x')) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  // Check if it's a valid Bitcoin address
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,42}$/.test(address)) {
    return true;
  }
  
  return false;
}

export async function getTokenMetadata(address: string, network: string): Promise<TokenMetadata> {
  const endpoint = ALCHEMY_CONFIG.endpoints[network];
  if (!endpoint) {
    throw new Error(`Network ${network} not supported`);
  }

  try {
    const response = await fetch(`${endpoint}/${ALCHEMY_CONFIG.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenMetadata',
        params: [address]
      })
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
  }
}

export async function analyzeTokenWithGemini(tokenMetadata: TokenMetadata): Promise<TokenAnalysisResult> {
  const GEMINI_API_KEY = 'AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const prompt = `
    Analyze this token data and provide a trust score and analysis:
    Name: ${tokenMetadata.name}
    Symbol: ${tokenMetadata.symbol}
    Total Supply: ${tokenMetadata.totalSupply}
    Decimals: ${tokenMetadata.decimals}
    
    Provide a response in JSON format with:
    - trustScore (number between 0-100)
    - analysis (brief text explanation)
    - riskFactors (array of potential risk factors)
  `;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data = await response.json();
    let analysisText = data.candidates[0].content.parts[0].text;
    
    // Parse the response into JSON format
    try {
      const parsedAnalysis = JSON.parse(analysisText);
      return {
        trustScore: parsedAnalysis.trustScore || 50,
        analysis: parsedAnalysis.analysis || "Analysis not available",
        riskFactors: parsedAnalysis.riskFactors || []
      };
    } catch (e) {
      // If JSON parsing fails, return default values
      return {
        trustScore: 50,
        analysis: analysisText || "Analysis not available",
        riskFactors: ["Could not determine risk factors"]
      };
    }
  } catch (error) {
    console.error('Error analyzing token with Gemini:', error);
    throw error;
  }
}
