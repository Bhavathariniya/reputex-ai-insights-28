
import React from 'react';

const ZkSyncIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#8C8DFC"/>
      <path
        fill="#FFF"
        d="M10.5 8.5h11v3h-6.846l6.846 7v3h-11v-3h6.846l-6.846-7z"
      />
    </g>
  </svg>
);

export default ZkSyncIcon;
