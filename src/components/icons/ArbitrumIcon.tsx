
import React from 'react';

const ArbitrumIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <defs>
      <linearGradient id="arbitrum-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#12AAFF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1A4CFF', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <g fill="none">
      <path
        d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0"
        fill="#213147"
      />
      <path
        d="M21.41 17.315l-4.319 6.987a1.07 1.07 0 01-1.821 0l-4.319-6.987a1.07 1.07 0 010-1.157l4.319-6.987a1.07 1.07 0 011.821 0l4.319 6.987a1.07 1.07 0 010 1.157"
        fill="url(#arbitrum-gradient)"
      />
      <path
        d="M16 6.5l-6 9.75L16 25.5l6-9.25L16 6.5z"
        fill="#FFF"
        fillOpacity="0.3"
      />
    </g>
  </svg>
);

export default ArbitrumIcon;
