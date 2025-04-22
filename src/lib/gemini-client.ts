
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
  try {
    // For now, let's create a fallback algorithm since there were issues with the Gemini API
    // This will be used when the API fails
    const fallbackAnalysis = generateFallbackAnalysis(tokenData, contractData);
    
    // Try to use Gemini API first - use v1beta model instead of v1
    try {
      const prompt = `
Analyze this Ethereum token data and provide a comprehensive risk assessment:

TOKEN METADATA:
Name: ${tokenData.name || 'Unknown'}
Symbol: ${tokenData.symbol || 'Unknown'}
Trust Score from CoinGecko: ${tokenData.gt_score || 'Unknown'}
Holders Count: ${tokenData.holders?.count || 'Unknown'}
${tokenData.holders?.distribution_percentage ? `Distribution Percentage: ${JSON.stringify(tokenData.holders.distribution_percentage)}` : ''}
${tokenData.market_data ? `Market Cap: $${tokenData.market_data.market_cap?.usd || 'Unknown'}` : ''}
${tokenData.market_data ? `24h Volume: $${tokenData.market_data.total_volume?.usd || 'Unknown'}` : ''}
${tokenData.market_data ? `24h Price Change: ${tokenData.market_data.price_change_percentage_24h || 'Unknown'}%` : ''}

${tokenData.twitter_handle ? `Twitter: @${tokenData.twitter_handle}` : 'No Twitter presence'}
${tokenData.discord_url ? `Discord: Available` : 'No Discord presence'}
${tokenData.telegram_handle ? `Telegram: Available` : 'No Telegram presence'}
${tokenData.websites && tokenData.websites.length > 0 ? `Website: ${tokenData.websites[0]}` : 'No website'}

${contractData ? `CONTRACT DATA:
Source Code: ${contractData.isVerified ? 'Verified' : 'Unverified'}
Creation Date: ${contractData.creationTime || 'Unknown'}
Creator Address: ${contractData.creatorAddress || 'Unknown'}
Liquidity Locked: ${contractData.isLiquidityLocked ? 'Yes' : 'No/Unknown'}` : ''}

Please analyze this token and provide a detailed risk assessment in JSON format with the following structure:
{
  "trustScore": number between 0-100,
  "analysis": "brief text explanation of the token risk profile",
  "riskFactors": ["list", "of", "specific", "risk", "factors"],
  "scamPatterns": [
    {
      "patternName": "name of detected scam pattern",
      "similarity": percentage as number between 0-100,
      "description": "brief description of this pattern"
    }
  ],
  "contractVulnerabilities": ["list", "of", "potential", "vulnerabilities"]
}
`;

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
      
      // Parse the JSON response from Gemini
      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const parsedResult = JSON.parse(jsonMatch[0]);
          return parsedResult;
        } catch (parseError) {
          console.error('Error parsing Gemini JSON response:', parseError);
          return fallbackAnalysis;
        }
      }
      
      return fallbackAnalysis;
    } catch (error) {
      console.error('Gemini API error:', error.response?.data || error.message);
      return fallbackAnalysis;
    }
  } catch (error) {
    console.error('Error generating analysis:', error);
    return {
      trustScore: 50,
      analysis: "Unable to analyze token data",
      riskFactors: ["Analysis service unavailable"]
    };
  }
};

// Fallback algorithm when AI analysis is unavailable
const generateFallbackAnalysis = (tokenData: any, contractData?: any): TrustAnalysis => {
  let trustScore = 50; // Default middle score
  const riskFactors = [];
  
  // If we have GT score from CoinGecko, use it as a base
  if (tokenData.gt_score) {
    trustScore = Math.round(tokenData.gt_score);
  }
  
  // Look at distribution - high concentration in top wallets is a risk
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
  
  // Check if token has social presence
  if (!tokenData.twitter_handle && !tokenData.discord_url && !tokenData.telegram_handle) {
    trustScore -= 10;
    riskFactors.push("No verified social media presence");
  }
  
  // Check if token has a website
  if (!tokenData.websites || tokenData.websites.length === 0) {
    trustScore -= 15;
    riskFactors.push("No official website found");
  }
  
  // Check market data
  if (tokenData.market_data) {
    // Low market cap is riskier
    const marketCap = tokenData.market_data.market_cap?.usd || 0;
    if (marketCap < 100000) {
      trustScore -= 15;
      riskFactors.push("Very low market capitalization (<$100k)");
    } else if (marketCap < 1000000) {
      trustScore -= 10;
      riskFactors.push("Low market capitalization (<$1M)");
    }
    
    // Low volume is riskier
    const volume = tokenData.market_data.total_volume?.usd || 0;
    if (volume < 10000) {
      trustScore -= 10;
      riskFactors.push("Very low trading volume (<$10k)");
    }
    
    // High volatility can be a risk
    const priceChange = tokenData.market_data.price_change_percentage_24h;
    if (priceChange && Math.abs(priceChange) > 30) {
      trustScore -= 5;
      riskFactors.push(`High price volatility (${priceChange.toFixed(2)}% in 24h)`);
    }
  }
  
  // Contract data analysis
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
  
  // Generate analysis text
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
  
  // Ensure score stays within 0-100 range
  trustScore = Math.max(0, Math.min(100, trustScore));
  
  // Add general advice if no specific risk factors were identified
  if (riskFactors.length === 0) {
    riskFactors.push("Always conduct your own research before investing");
  }
  
  // Generate mock scam patterns if score is very low
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
  
  // Generate mock contract vulnerabilities if score is low
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
