import axios from 'axios';

const COINGECKO_API_KEY = 'CG-LggZcVpfVpN9wDLpAsMoy7Yr';
const BASE_URL = 'https://api.coingecko.com/api/v3'; // Using non-pro API URL

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
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    price_change_percentage_24h?: number;
  };
  developer_data?: {
    forks?: number;
    stars?: number;
    subscribers?: number;
    total_issues?: number;
    closed_issues?: number;
    commit_count_4_weeks?: number;
  };
  community_data?: {
    twitter_followers?: number;
    reddit_subscribers?: number;
    telegram_channel_user_count?: number;
  };
}

export interface TokenInfoResponse {
  data: {
    id: string;
    type: string;
    attributes: TokenInfo;
  };
}

// Interface for CoinGecko coin data
interface CoinGeckoTokenData {
  id: string;
  name: string;
  symbol: string;
  image: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  description: {
    en?: string;
  };
  links: {
    homepage: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
    chat_url?: string[];
    subreddit_url?: string;
    repos_url?: {
      github?: string[];
    };
  };
  coingecko_score?: number;
  market_data?: {
    current_price?: {
      usd?: number;
    };
    market_cap?: {
      usd?: number;
    };
    total_volume?: {
      usd?: number;
    };
    price_change_percentage_24h?: number;
  };
  developer_data?: {
    forks?: number;
    stars?: number;
    subscribers?: number;
    total_issues?: number;
    closed_issues?: number;
    commit_count_4_weeks?: number;
  };
  community_data?: {
    twitter_followers?: number;
    reddit_subscribers?: number;
    telegram_channel_user_count?: number;
  };
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

export const getTokenInfo = async (network: string, address: string): Promise<TokenInfo | null> => {
  try {
    // Using the correct endpoint format for the non-pro API
    const response = await axios.get<CoinGeckoTokenData>(
      `${BASE_URL}/coins/${network}/contract/${address}`,
      {
        headers: {
          'x-cg-pro-api-key': COINGECKO_API_KEY
        },
        params: {
          localization: false,
          tickers: false,
          community_data: true,
          developer_data: true,
          sparkline: false
        }
      }
    );
    
    const data = response.data;
    
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image_url: data.image?.small || '',
      description: data.description?.en || '',
      websites: data.links?.homepage?.filter(Boolean) || [],
      gt_score: data.coingecko_score || 50,
      twitter_handle: data.links?.twitter_screen_name,
      discord_url: data.links?.chat_url?.[0],
      telegram_handle: data.links?.telegram_channel_identifier,
      market_data: {
        current_price: { usd: data.market_data?.current_price?.usd },
        market_cap: { usd: data.market_data?.market_cap?.usd },
        total_volume: { usd: data.market_data?.total_volume?.usd },
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h
      },
      developer_data: data.developer_data,
      community_data: data.community_data,
      holders: data.holders
    };

  } catch (error) {
    console.warn('CoinGecko API request failed:', error);
    return null;
  }
};

export const getTokenMarketData = async (address: string): Promise<any | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/ethereum/contract/${address}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: 30
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('CoinGecko market data request failed:', error.response?.data || error.message);
    return null;
  }
};
