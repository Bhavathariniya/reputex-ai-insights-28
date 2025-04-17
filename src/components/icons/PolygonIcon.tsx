
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
    <path d="M12 2L4 8v8l8 6 8-6V8z" />
    <path d="M12 8v8" />
    <path d="M8 11l4 4 4-4" />
  </svg>
);

export default PolygonIcon;
