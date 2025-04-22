
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA';

export interface TrustAnalysis {
  trustScore: number;
  analysis: string;
  riskFactors: string[];
}

export const analyzeTrustScore = async (tokenData: any): Promise<TrustAnalysis> => {
  try {
    // For now, let's create a fallback algorithm since there were issues with the Gemini API
    // This will be used when the API fails
    const fallbackAnalysis = generateFallbackAnalysis(tokenData);
    
    // Try to use Gemini API first
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `
                    Analyze this token data and provide a trust score and analysis:
                    Name: ${tokenData.name}
                    Symbol: ${tokenData.symbol}
                    GT Score: ${tokenData.gt_score || 'Unknown'}
                    Holders Count: ${tokenData.holders?.count || 'Unknown'}
                    Distribution Percentage: ${JSON.stringify(tokenData.holders?.distribution_percentage || {})}
                    
                    Provide a response in JSON format with:
                    - trustScore (number between 0-100)
                    - analysis (brief text explanation)
                    - riskFactors (array of potential risk factors)
                  `
                }
              ]
            }
          ]
        }
      );
      
      // Parse the JSON response from Gemini
      const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
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
const generateFallbackAnalysis = (tokenData: any): TrustAnalysis => {
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
  
  return {
    trustScore,
    analysis,
    riskFactors
  };
};
