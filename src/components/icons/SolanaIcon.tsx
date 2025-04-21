
import React from 'react';

const SolanaIcon = ({ className }: { className?: string }) => (
  <div className={`relative w-6 h-6 ${className || ''}`}>
    <img 
      src="/lovable-uploads/51614c73-55a0-47e4-a682-900c96aa009f.png" 
      alt="Solana Logo" 
      className="w-full h-full rounded-full"
    />
  </div>
);

export default SolanaIcon;
