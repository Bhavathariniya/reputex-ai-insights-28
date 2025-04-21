
import React from 'react';

const BNBChainIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`relative w-6 h-6 rounded-full overflow-hidden bg-black flex items-center justify-center ${className || ''}`}>
      <img
        src="/lovable-uploads/6b65bd10-fbde-4763-974e-cea4a876890a.png"
        alt="BNB Chain Logo"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default BNBChainIcon;
