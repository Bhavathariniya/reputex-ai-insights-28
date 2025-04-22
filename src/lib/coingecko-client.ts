
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
    const response = await axios.get<TokenInfoResponse>(
      `${BASE_URL}/onchain/networks/${network}/tokens/${address}/info`,
      {
        headers: {
          'x-cg-pro-api-key': COINGECKO_API_KEY,
        },
      }
    );
    console.log('CoinGecko API response:', response.data);
    return response.data.data.attributes;
  } catch (error) {
    console.error('CoinGecko API request failed:', error.response?.data || error.message);
    return null;
  }
};
