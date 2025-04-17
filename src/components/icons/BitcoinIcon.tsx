
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
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9.5h4a2 2 0 0 1 0 4h-4m1-4v-2.5M10.5 13.5v2.5" />
    <path d="M10 9.5h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4" />
  </svg>
);

export default BitcoinIcon;
