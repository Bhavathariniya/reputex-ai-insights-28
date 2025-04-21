
import React from 'react';

const BNBChainIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center ${className || ''}`}>
      <img
        src="/lovable-uploads/5a975098-c4a6-4ea3-bbc6-1d8f71741791.png"
        alt="BNB Chain Logo"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default BNBChainIcon;
