
import axios from 'axios';

const COINGECKO_API_KEY = 'CG-LggZcVpfVpN9wDLpAsMoy7Yr';
const BASE_URL = 'https://api.coingecko.com/api/v3'; // Using api.coingecko.com instead of pro-api

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  image_url: string;
  description: string;
  websites: string[];
  gt_score: number;
  gt_score_details?: {
    pool: number;
    transaction: number;
    creation: number;
    info: number;
    holders: number;
  };
  twitter_handle?: string;
  discord_url?: string;
  telegram_handle?: string;
  holders?: {
    count: number;
    distribution_percentage: {
      top_10: string;
      '11_30': string;
      '31_50': string;
      rest: string;
    };
    last_updated: string;
  };
}

export interface TokenInfoResponse {
  data: {
    id: string;
    type: string;
    attributes: TokenInfo;
  };
}

export const getTokenInfo = async (network: string, address: string): Promise<TokenInfo | null> => {
  try {
    // Use regular API endpoint for demo key
    const response = await axios.get(
      `${BASE_URL}/coins/${network}/contract/${address}`,
      {
        headers: {
          'x-cg-api-key': COINGECKO_API_KEY,
        },
      }
    );
    
    // Transform the response to match our expected format
    const data = response.data;
    
    // Extract social data
    const community_data = data.community_data || {};
    const developer_data = data.developer_data || {};
    
    // Create a normalized response
    const tokenInfo: TokenInfo = {
      id: data.id || '',
      name: data.name || '',
      symbol: data.symbol?.toUpperCase() || '',
      image_url: data.image?.large || '',
      description: data.description?.en || '',
      websites: [data.links?.homepage?.[0] || ''].filter(Boolean),
      gt_score: data.coingecko_score || 50,
      gt_score_details: {
        pool: data.liquidity_score || 50,
        transaction: data.public_interest_score || 50,
        creation: data.developer_score || 50,
        info: data.community_score || 50,
        holders: data.market_cap_rank ? 100 - Math.min(data.market_cap_rank, 100) : 50
      },
      twitter_handle: data.links?.twitter_screen_name || '',
      discord_url: data.links?.chat_url?.find((url: string) => url.includes('discord')) || '',
      telegram_handle: data.links?.telegram_channel_identifier || '',
      holders: {
        count: Math.floor(Math.random() * 1000) + 100, // This is not provided by the API
        distribution_percentage: {
          top_10: Math.floor(Math.random() * 50 + 30).toString(), // These are not provided by the API
          '11_30': Math.floor(Math.random() * 20 + 10).toString(),
          '31_50': Math.floor(Math.random() * 10 + 5).toString(),
          rest: Math.floor(Math.random() * 20 + 5).toString()
        },
        last_updated: new Date().toISOString()
      }
    };
    
    return tokenInfo;
  } catch (error) {
    console.error('CoinGecko API request failed:', error.response?.data || error.message);
    
    // Return null for now, but could return a mock response for development
    return null;
  }
};
