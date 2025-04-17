
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
    <polygon points="12 2 18 7 12 12 6 7" />
    <path d="M12 12v10" />
    <path d="M6 7v10l6 5" />
    <path d="M18 7v10l-6 5" />
  </svg>
);

export default ArbitrumIcon;
