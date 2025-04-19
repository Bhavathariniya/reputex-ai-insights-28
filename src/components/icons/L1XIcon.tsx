
import React from 'react';

const L1XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <circle cx="16" cy="16" r="16" fill="#FFFFFF"/>
    <g transform="translate(6, 6)">
      <path
        fill="#FF4B4B"
        d="M10 0L13.5 3.5L10 7L6.5 3.5z"
      />
      <path
        fill="#FF8730"
        d="M20 10L16.5 13.5L13 10L16.5 6.5z"
      />
      <path
        fill="#8B5CF6"
        d="M10 20L6.5 16.5L10 13L13.5 16.5z"
      />
      <path
        fill="#3B82F6"
        d="M0 10L3.5 6.5L7 10L3.5 13.5z"
      />
    </g>
  </svg>
);

export default L1XIcon;
