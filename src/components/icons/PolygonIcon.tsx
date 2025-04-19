
import React from 'react';

const PolygonIcon = ({ className }: { className?: string }) => (
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
    <polygon points="12 2 4 8 12 14 20 8" />
    <line x1="4" y1="8" x2="4" y2="16" />
    <line x1="20" y1="8" x2="20" y2="16" />
    <polygon points="12 14 4 20 12 22 20 20" />
  </svg>
);

export default PolygonIcon;
