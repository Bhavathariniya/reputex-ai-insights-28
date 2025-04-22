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

interface CoinGeckoTokenData {
  id: string;
  attributes: {
    name: string;
    symbol: string;
    image_url: string;
    decimals: number;
    total_supply: string;
    price_usd: string;
    fdv_usd: string;
    total_reserve_in_usd: string;
    volume_usd: {
      h24: string;
    };
    market_cap_usd: string;
  };
  relationships: {
    top_pools: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

interface CoinGeckoResponse {
  data: CoinGeckoTokenData;
  included?: Array<any>;
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
    // Since getProvider returns a Promise, we need to await it first
    const provider = await alchemy.config.getProvider();
    const response = await provider.send("alchemy_getTokenAllowance", [{
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

async function getCoinGeckoTokenData(address: string, network: string = 'eth'): Promise<CoinGeckoResponse | null> {
  try {
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/onchain/networks/${network}/tokens/multi/${address}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-cg-pro-api-key': 'CG-LggZcVpfVpN9wDLpAsMoy7Yr'
        }
      }
    );

    if (!response.ok) {
      console.warn('CoinGecko API request failed:', await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return null;
  }
}

export async function getTokenMetadata(address: string): Promise<TokenMetadata> {
  try {
    const [alchemyMetadata, geckoData] = await Promise.all([
      alchemy.core.getTokenMetadata(address),
      getCoinGeckoTokenData(address)
    ]);
    
    const balances = await alchemy.core.getTokenBalances(address, [address]);
    const balance = balances.tokenBalances[0]?.tokenBalance || '0';
    
    return {
      name: alchemyMetadata.name || geckoData?.data?.attributes?.name || 'Unknown Token',
      symbol: alchemyMetadata.symbol || geckoData?.data?.attributes?.symbol || 'UNKNOWN',
      totalSupply: geckoData?.data?.attributes?.total_supply || balance.toString(),
      decimals: alchemyMetadata.decimals || geckoData?.data?.attributes?.decimals || 18,
      logo: alchemyMetadata.logo || geckoData?.data?.attributes?.image_url || undefined
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
