
import React from 'react';

const L1XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <defs>
      <linearGradient id="l1x-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#l1x-gradient)"/>
    <path
      d="M10.5 8h2v16h-2zm4.5 0h2v16h-2zm4.5 2l6 6-6 6V10z"
      fill="#FFFFFF"
    />
  </svg>
);

export default L1XIcon;
