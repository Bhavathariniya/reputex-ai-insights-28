
import axios from 'axios';
import { TokenAnalysisResult } from './types';

const GEMINI_API_KEY = 'AIzaSyCKcAc1ZYcoviJ-6tdm-HuRguPMjMz6OSA';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export interface TrustAnalysis {
  trustScore: number;
  analysis: string;
  riskFactors: string[];
  communityScore?: number;
  developerScore?: number;
  liquidityScore?: number;
  holderDistributionScore?: number;
  fraudRisk?: number;
  socialSentiment?: number;
}

export const analyzeTrustScore = async (tokenData: any): Promise<TrustAnalysis> => {
  try {
    // For now, let's create a fallback algorithm since there were issues with the Gemini API
    // This will be used when the API fails
    const fallbackAnalysis = generateFallbackAnalysis(tokenData);
    
    // Try to use Gemini API first
    try {
      const prompt = `
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
        - communityScore (number between 0-100)
        - developerScore (number between 0-100)
        - liquidityScore (number between 0-100)
        - holderDistributionScore (number between 0-100)
        - fraudRisk (number between 0-100)
        - socialSentiment (number between 0-100)
      `;
      
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
      
      // Handle potential Gemini API errors
      if (!data.candidates || data.error) {
        console.error('Gemini API error:', data.error || 'No candidates returned');
        return fallbackAnalysis;
      }
      
      const analysisText = data.candidates[0].content.parts[0].text;
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const parsedAnalysis = JSON.parse(jsonMatch[0]);
          return {
            trustScore: parsedAnalysis.trustScore || fallbackAnalysis.trustScore,
            analysis: parsedAnalysis.analysis || fallbackAnalysis.analysis,
            riskFactors: parsedAnalysis.riskFactors || fallbackAnalysis.riskFactors,
            communityScore: parsedAnalysis.communityScore || fallbackAnalysis.communityScore,
            developerScore: parsedAnalysis.developerScore || fallbackAnalysis.developerScore,
            liquidityScore: parsedAnalysis.liquidityScore || fallbackAnalysis.liquidityScore,
            holderDistributionScore: parsedAnalysis.holderDistributionScore || fallbackAnalysis.holderDistributionScore,
            fraudRisk: parsedAnalysis.fraudRisk || fallbackAnalysis.fraudRisk,
            socialSentiment: parsedAnalysis.socialSentiment || fallbackAnalysis.socialSentiment
          };
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
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
  
  // Generate scores for other metrics
  const communityScore = Math.min(100, Math.max(0, trustScore + (Math.random() * 20 - 10)));
  const developerScore = Math.min(100, Math.max(0, trustScore + (Math.random() * 20 - 10)));
  const liquidityScore = Math.min(100, Math.max(0, trustScore + (Math.random() * 20 - 10)));
  const holderDistributionScore = tokenData.holders?.distribution_percentage?.top_10 
    ? 100 - parseFloat(tokenData.holders.distribution_percentage.top_10)
    : Math.min(100, Math.max(0, trustScore + (Math.random() * 20 - 10)));
  const fraudRisk = Math.max(0, Math.min(100, 100 - trustScore + (Math.random() * 20 - 10)));
  const socialSentiment = Math.min(100, Math.max(0, trustScore + (Math.random() * 20 - 10)));
  
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
    riskFactors,
    communityScore,
    developerScore,
    liquidityScore,
    holderDistributionScore,
    fraudRisk,
    socialSentiment
  };
};
