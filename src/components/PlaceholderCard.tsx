
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PlaceholderCardProps {
  title: string;
  message?: string;
  chainName?: string;
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({ 
  title, 
  message = "Data not available yet for this chain.", 
  chainName 
}) => {
  return (
    <div className="glowing-card rounded-xl overflow-hidden transition-all duration-300 animate-pulse">
      <div className="h-1 bg-gradient-to-r from-neon-blue/50 to-neon-pink/50"></div>
      
      <div className="p-6 flex flex-col items-center justify-center h-[180px]">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-3 opacity-70" />
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        <p className="text-sm text-muted-foreground text-center">
          {message}
        </p>
        
        {chainName && (
          <span className="mt-2 text-xs text-muted-foreground/70">
            {chainName}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlaceholderCard;
