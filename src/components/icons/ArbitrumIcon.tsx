
import React from 'react';

const ArbitrumIcon = ({ className }: { className?: string }) => (
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
    <polygon points="12 2 4 8 12 14 20 8" />
    <polyline points="4 8 12 14 20 8" />
    <line x1="12" y1="14" x2="12" y2="22" />
  </svg>
);

export default ArbitrumIcon;
