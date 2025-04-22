import { Alchemy, Network } from 'alchemy-sdk';

const ALCHEMY_CONFIG = {
  apiKey: 'pYRNPV2ZKbpraqzkqwIzEWp3osFe_LW4',
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(ALCHEMY_CONFIG);

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
  error: string | null;
}

interface TokenBalancesResponse {
  address: string;
  tokenBalances: TokenBalance[];
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
  try {
    const balance = await alchemy.core.getBalance(address);
    return balance.toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

export async function detectNetwork(address: string): Promise<string> {
  try {
    const balance = await alchemy.core.getBalance(address);
    return balance.gt(0) ? 'ethereum' : 'ethereum'; // Default to ethereum for now
  } catch (error) {
    console.error('Error detecting network:', error);
    return 'ethereum';
  }
}

export async function validateAddress(address: string): Promise<boolean> {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function getTokenBalances(address: string): Promise<TokenBalancesResponse> {
  try {
    const balances = await alchemy.core.getTokenBalances(address, ['erc20']);
    return {
      address: balances.address,
      tokenBalances: balances.tokenBalances.map(balance => ({
        contractAddress: balance.contractAddress,
        tokenBalance: balance.tokenBalance,
        error: balance.error
      }))
    };
  } catch (error) {
    console.error('Error fetching token balances:', error);
    throw error;
  }
}

export async function getTokenAllowance(
  contractAddress: string,
  ownerAddress: string,
  spenderAddress: string
): Promise<string> {
  try {
    // Make a raw JSON-RPC request to use the alchemy_getTokenAllowance method directly
    const response = await alchemy.core.provider.send("alchemy_getTokenAllowance", [{
      contract: contractAddress,
      owner: ownerAddress,
      spender: spenderAddress
    }]);
    
    return response || '0';
  } catch (error) {
    console.error('Error fetching token allowance:', error);
    throw error;
  }
}

export async function getTokenMetadata(address: string): Promise<TokenMetadata> {
  try {
    const metadata = await alchemy.core.getTokenMetadata(address);
    
    // For total supply, we need to use getTokenBalances instead of getTokenBalance
    // We'll get token balances for this token address from a major holder or the token contract itself
    const balances = await alchemy.core.getTokenBalances(address, [address]);
    const balance = balances.tokenBalances[0]?.tokenBalance || '0';
    
    return {
      name: metadata.name || 'Unknown Token',
      symbol: metadata.symbol || 'UNKNOWN',
      totalSupply: balance.toString(),
      decimals: metadata.decimals || 18,
      logo: metadata.logo || undefined
    };
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
    
    // Handle potential Gemini API errors by providing default values
    if (!data.candidates || data.error) {
      console.error('Gemini API error:', data.error || 'No candidates returned');
      return {
        trustScore: 50,
        analysis: "Unable to perform detailed analysis at this time. Please check token details manually.",
        riskFactors: ["Analysis service unavailable"]
      };
    }

    let analysisText = data.candidates[0].content.parts[0].text;
    
    try {
      const parsedAnalysis = JSON.parse(analysisText);
      return {
        trustScore: parsedAnalysis.trustScore || 50,
        analysis: parsedAnalysis.analysis || "Analysis not available",
        riskFactors: parsedAnalysis.riskFactors || []
      };
    } catch (e) {
      return {
        trustScore: 50,
        analysis: analysisText || "Analysis not available",
        riskFactors: ["Could not determine risk factors"]
      };
    }
  } catch (error) {
    console.error('Error analyzing token with Gemini:', error);
    return {
      trustScore: 50,
      analysis: "Failed to analyze token. Please try again later.",
      riskFactors: ["Analysis service error"]
    };
  }
}
