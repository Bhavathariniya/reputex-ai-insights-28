
import React from 'react';
import { 
  Twitter, 
  MessageCircle, 
  Send, 
  Hash, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface SentimentMeterProps {
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
  keywords?: string[];
  phrases?: string[];
  score?: number;
  size?: 'small' | 'medium' | 'large';
  sources?: {
    twitter?: number;
    reddit?: number;
    telegram?: number;
    discord?: number;
  };
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ 
  sentiment = 'neutral',
  keywords = [],
  phrases = [],
  score = 50,
  size = 'medium',
  sources = {}
}) => {
  // Determine sentiment based on score if not explicitly provided
  const derivedSentiment = sentiment || (
    score >= 70 ? 'positive' : 
    score <= 30 ? 'negative' : 
    'neutral'
  );
  
  // Define colors and styles based on sentiment
  const meterColors = {
    positive: {
      gradient: 'from-neon-cyan to-neon-blue',
      bgGradient: 'from-neon-cyan/10 to-neon-blue/10',
      textColor: 'text-neon-cyan',
      borderColor: 'border-neon-cyan/40',
      icon: <ArrowUpRight className="h-5 w-5 text-neon-cyan" />
    },
    neutral: {
      gradient: 'from-neon-purple to-neon-blue',
      bgGradient: 'from-neon-purple/10 to-neon-blue/10',
      textColor: 'text-neon-purple',
      borderColor: 'border-neon-purple/40',
      icon: <Minus className="h-5 w-5 text-neon-purple" />
    },
    negative: {
      gradient: 'from-neon-pink to-neon-red',
      bgGradient: 'from-neon-pink/10 to-neon-red/10',
      textColor: 'text-neon-pink',
      borderColor: 'border-neon-pink/40',
      icon: <ArrowDownRight className="h-5 w-5 text-neon-pink" />
    },
    mixed: {
      gradient: 'from-neon-orange to-neon-purple',
      bgGradient: 'from-neon-orange/10 to-neon-purple/10',
      textColor: 'text-neon-orange',
      borderColor: 'border-neon-orange/40',
      icon: <Minus className="h-5 w-5 text-neon-orange" />
    }
  };
  
  const colors = meterColors[derivedSentiment];
  
  const sentimentLabels = {
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    mixed: 'Mixed'
  };
  
  // Calculate the position of the indicator
  const indicatorPosition = 
    derivedSentiment === 'positive' ? '75%' :
    derivedSentiment === 'negative' ? '25%' :
    derivedSentiment === 'mixed' ? '40%' : '50%';
    
  // Get total data points
  const totalMentions = Object.values(sources).reduce((sum, current) => sum + (current || 0), 0);
  
  // Adjust size
  const sizeClasses = {
    small: "p-2 text-sm",
    medium: "p-4",
    large: "p-6"
  };
  
  // For small size, only show the meter
  if (size === 'small') {
    return (
      <div className={`relative h-4 w-16 bg-gradient-to-r from-neon-red/20 via-neon-purple/20 to-neon-cyan/20 rounded-full`}>
        <div 
          className={`absolute top-0 w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} -ml-2`}
          style={{ left: indicatorPosition }}
        ></div>
      </div>
    );
  }
  
  return (
    <div className={`glass-card rounded-xl border ${colors.borderColor} ${sizeClasses[size]}`}>
      <div className="flex items-center gap-2 mb-4">
        {colors.icon}
        <h3 className={`text-lg font-semibold ${colors.textColor}`}>
          {score !== undefined ? `Trust Score: ${score}/100` : `Community Sentiment: ${sentimentLabels[derivedSentiment]}`}
        </h3>
        <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
          <span>Based on {totalMentions || 'recent'} mentions</span>
        </div>
      </div>
      
      {/* Visual Sentiment Meter */}
      <div className="mb-6 relative">
        <div className="h-6 bg-gradient-to-r from-neon-red/20 via-neon-purple/20 to-neon-cyan/20 rounded-full"></div>
        
        {/* Sentiment Labels */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
        
        {/* Indicator */}
        <div 
          className={`absolute top-0 w-6 h-6 rounded-full bg-gradient-to-r ${colors.gradient} -ml-3`}
          style={{ left: indicatorPosition }}
        ></div>
      </div>
      
      {/* Only show social media and keywords if we have them */}
      {(Object.keys(sources).length > 0 || keywords.length > 0) && (
        <>
          {/* Social Media Sources */}
          {Object.keys(sources).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {sources.twitter && (
                <Badge variant="outline" className="border-[#1DA1F2] bg-[#1DA1F2]/10 text-[#1DA1F2]">
                  <Twitter className="h-3 w-3 mr-1" />
                  Twitter ({sources.twitter})
                </Badge>
              )}
              
              {sources.reddit && (
                <Badge variant="outline" className="border-[#FF4500] bg-[#FF4500]/10 text-[#FF4500]">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Reddit ({sources.reddit})
                </Badge>
              )}
              
              {sources.telegram && (
                <Badge variant="outline" className="border-[#0088cc] bg-[#0088cc]/10 text-[#0088cc]">
                  <Send className="h-3 w-3 mr-1" />
                  Telegram ({sources.telegram})
                </Badge>
              )}
              
              {sources.discord && (
                <Badge variant="outline" className="border-[#5865F2] bg-[#5865F2]/10 text-[#5865F2]">
                  <Hash className="h-3 w-3 mr-1" />
                  Discord ({sources.discord})
                </Badge>
              )}
            </div>
          )}
          
          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Trending Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className={`bg-gradient-to-r ${colors.bgGradient}`}>
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Sentiment Phrases */}
      {phrases.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recent Community Mentions</h4>
          <div className="space-y-2">
            {phrases.map((phrase, index) => (
              <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
                <MessageSquare className="h-3 w-3 inline mr-1 opacity-70" />
                "{phrase}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentMeter;
