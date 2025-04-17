
import React from 'react';

const FantomIcon = ({ className }: { className?: string }) => (
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
    <path d="M12 2L4 7v10l8 5 8-5V7z" />
    <path d="M12 6v12" />
    <path d="M8 9l4 3 4-3" />
  </svg>
);

export default FantomIcon;
