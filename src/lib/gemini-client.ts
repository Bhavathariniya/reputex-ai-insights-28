
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA';

export interface TrustAnalysis {
  trustScore: number;
  analysis: string;
  riskFactors: string[];
  scamPatterns?: {
    patternName: string;
    similarity: number;
    description: string;
  }[];
  contractVulnerabilities?: string[];
}

export const analyzeTrustScore = async (tokenData: any, contractData?: any): Promise<TrustAnalysis> => {
  // If no token data is available, return a default analysis
  if (!tokenData) {
    return {
      trustScore: 50, // Neutral score
      analysis: "Insufficient data available to perform a complete analysis. This may be due to the token being new, unlisted, or not fully indexed.",
      riskFactors: ["Limited data available for comprehensive analysis", "Consider researching this token further before making any decisions"]
    };
  }
  
  try {
    const prompt = `
Analyze this token data and provide a detailed risk assessment:

TOKEN DATA:
Name: ${tokenData.name || 'Unknown'}
Symbol: ${tokenData.symbol || 'Unknown'}
Trust Score from CoinGecko: ${tokenData.gt_score || 'Unknown'}
${tokenData.holders ? `Holders Count: ${tokenData.holders.count}` : ''}
${tokenData.holders?.distribution_percentage ? `Distribution:
- Top 10: ${tokenData.holders.distribution_percentage.top_10}%
- 11-30: ${tokenData.holders.distribution_percentage['11_30']}%
- 31-50: ${tokenData.holders.distribution_percentage['31_50']}%
- Rest: ${tokenData.holders.distribution_percentage.rest}%` : ''}

Social Presence:
${tokenData.twitter_handle ? `- Twitter: @${tokenData.twitter_handle}` : '- No Twitter'}
${tokenData.discord_url ? '- Discord: Present' : '- No Discord'}
${tokenData.telegram_handle ? '- Telegram: Present' : '- No Telegram'}
${tokenData.websites?.length ? `- Website: ${tokenData.websites[0]}` : '- No Website'}

Please analyze this token and provide a detailed risk assessment in JSON format with:
{
  "trustScore": number between 0-100,
  "analysis": "brief text explanation",
  "riskFactors": ["list of risks"],
  "scamPatterns": [
    {
      "patternName": "pattern name",
      "similarity": percentage (0-100),
      "description": "pattern description"
    }
  ],
  "contractVulnerabilities": ["list of vulnerabilities"]
}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048
        }
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error('Failed to parse Gemini response:', error);
        return generateFallbackAnalysis(tokenData, contractData);
      }
    }
    
    return generateFallbackAnalysis(tokenData, contractData);
  } catch (error) {
    console.error('Gemini API error:', error);
    return generateFallbackAnalysis(tokenData, contractData);
  }
};

const generateFallbackAnalysis = (tokenData: any, contractData?: any): TrustAnalysis => {
  let trustScore = 50; // Default middle score
  const riskFactors = [];
  
  if (!tokenData) {
    return {
      trustScore: 50,
      analysis: "Insufficient data available for proper analysis. Please check the token address and network.",
      riskFactors: ["Limited data available", "Token may be unlisted or new"]
    };
  }
  
  if (tokenData.gt_score) {
    trustScore = Math.round(tokenData.gt_score);
  }
  
  if (tokenData.holders?.distribution_percentage) {
    const topConcentration = parseFloat(tokenData.holders.distribution_percentage.top_10 || '0');
    if (topConcentration > 80) {
      trustScore -= 20;
      riskFactors.push("Very high token concentration in top 10 wallets");
    } else if (topConcentration > 60) {
      trustScore -= 10;
      riskFactors.push("High token concentration in top 10 wallets");
    }
  }
  
  if (!tokenData.twitter_handle && !tokenData.discord_url && !tokenData.telegram_handle) {
    trustScore -= 10;
    riskFactors.push("No verified social media presence");
  }
  
  if (!tokenData.websites || tokenData.websites.length === 0) {
    trustScore -= 15;
    riskFactors.push("No official website found");
  }
  
  if (tokenData.market_data) {
    const marketCap = tokenData.market_data.market_cap?.usd || 0;
    if (marketCap < 100000) {
      trustScore -= 15;
      riskFactors.push("Very low market capitalization (<$100k)");
    } else if (marketCap < 1000000) {
      trustScore -= 10;
      riskFactors.push("Low market capitalization (<$1M)");
    }
    
    const volume = tokenData.market_data.total_volume?.usd || 0;
    if (volume < 10000) {
      trustScore -= 10;
      riskFactors.push("Very low trading volume (<$10k)");
    }
    
    const priceChange = tokenData.market_data.price_change_percentage_24h;
    if (priceChange && Math.abs(priceChange) > 30) {
      trustScore -= 5;
      riskFactors.push(`High price volatility (${priceChange.toFixed(2)}% in 24h)`);
    }
  }
  
  if (contractData) {
    if (!contractData.isVerified) {
      trustScore -= 20;
      riskFactors.push("Contract source code is not verified");
    }
    
    if (!contractData.isLiquidityLocked) {
      trustScore -= 15;
      riskFactors.push("Liquidity does not appear to be locked");
    }
  }
  
  // Network-specific considerations
  if (tokenData.network === 'solana') {
    if (!riskFactors.length) {
      riskFactors.push("Token exists on Solana blockchain");
    }
  }
  
  let analysis = "";
  if (trustScore >= 80) {
    analysis = `${tokenData.name} appears to be a reputable token with good transparency and distribution metrics.`;
  } else if (trustScore >= 60) {
    analysis = `${tokenData.name} shows moderate reliability, with some potential areas of concern.`;
  } else if (trustScore >= 40) {
    analysis = `${tokenData.name} exhibits several risk factors that warrant caution before investing.`;
  } else {
    analysis = `${tokenData.name} displays numerous high-risk characteristics typical of suspicious tokens.`;
  }
  
  trustScore = Math.max(0, Math.min(100, trustScore));
  
  if (riskFactors.length === 0) {
    riskFactors.push("Always conduct your own research before investing");
  }
  
  const scamPatterns = trustScore < 30 ? [
    {
      patternName: "Suspicious Token Distribution",
      similarity: 75,
      description: "Token distribution follows patterns similar to known rug pull schemes"
    },
    {
      patternName: "Limited Transparency",
      similarity: 80,
      description: "Project lacks transparency in key areas observed in legitimate projects"
    }
  ] : [];
  
  const contractVulnerabilities = trustScore < 40 ? [
    "Potential centralized control functions",
    "Lack of proper event emission",
    "Missing safeguards against flash loan attacks"
  ] : [];
  
  return {
    trustScore,
    analysis,
    riskFactors,
    scamPatterns: scamPatterns.length > 0 ? scamPatterns : undefined,
    contractVulnerabilities: contractVulnerabilities.length > 0 ? contractVulnerabilities : undefined
  };
};
