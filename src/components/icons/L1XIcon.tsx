
import React from 'react';

const L1XIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <path
      fill="#1E293B"
      d="M16,0 L29.8564065,8 L29.8564065,24 L16,32 L2.14359347,24 L2.14359347,8 L16,0 Z"
    />
    <g transform="translate(6, 8)" fill="#FFFFFF">
      <rect width="3" height="14" x="0" y="0" />
      <rect width="3" height="14" x="5" y="0" />
      <polygon points="12,0 20,7 12,14" fill="#2563EB" />
    </g>
  </svg>
);

export default L1XIcon;
