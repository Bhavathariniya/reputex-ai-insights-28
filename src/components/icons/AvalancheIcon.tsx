
import React from 'react';

const AvalancheIcon = ({ className }: { className?: string }) => (
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
    <polygon points="12 2 19 21 12 17 5 21 12 2" />
    <path d="M9 13l3-2 3 2" />
  </svg>
);

export default AvalancheIcon;
