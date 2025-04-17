
import React from 'react';

const BNBChainIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 16 6.5 12 11 8 6.5" />
    <polygon points="12 13 16 17.5 12 22 8 17.5" />
    <polygon points="3 8.5 7 13 3 17.5" />
    <polygon points="21 8.5 17 13 21 17.5" />
  </svg>
);

export default BNBChainIcon;
