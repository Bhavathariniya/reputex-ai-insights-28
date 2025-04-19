
import React from 'react';

const BaseIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#0052FF"/>
      <path
        fill="#FFF"
        d="M16 6l9 5.2v9.6L16 26l-9-5.2v-9.6L16 6zm0 2.31l-6.88 3.97v7.94L16 23.69l6.88-3.97v-7.94L16 8.31z"
      />
    </g>
  </svg>
);

export default BaseIcon;
