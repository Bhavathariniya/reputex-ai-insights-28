
import React from 'react';

const BitcoinIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 2 L4 12 L12 22 L20 12 Z" />
    <line x1="12" y1="7" x2="12" y2="17" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default BitcoinIcon;
