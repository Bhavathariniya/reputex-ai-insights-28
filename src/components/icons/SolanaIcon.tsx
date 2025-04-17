
import React from 'react';

const SolanaIcon = ({ className }: { className?: string }) => (
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
    <path d="M4 7h12a4 4 0 1 1 0 8H4" />
    <path d="M4 11h12a4 4 0 1 1 0 8H4" />
    <path d="M4 15h12a4 4 0 1 0 0-8H4" />
  </svg>
);

export default SolanaIcon;
