
import React from 'react';

const OptimismIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#FF0420"/>
      <path
        fill="#FFF"
        d="M16.5 20.5a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5zm0 2.25A7.5 7.5 0 1116.5 8a7.5 7.5 0 010 15z"
      />
    </g>
  </svg>
);

export default OptimismIcon;
