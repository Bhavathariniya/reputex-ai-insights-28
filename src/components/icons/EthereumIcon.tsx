
import React from 'react';

const EthereumIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 2l-5 9 5 3 5-3z" />
    <path d="M12 14l-5-3v5l5 6 5-6v-5z" />
  </svg>
);

export default EthereumIcon;
