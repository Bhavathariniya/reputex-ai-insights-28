
import React from 'react';

const SolanaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#14F195"/>
      <path
        fill="#FFF"
        d="M9.925 19.687h11.294a.639.639 0 01.452 1.091l-4.484 4.483a.642.642 0 01-.452.187H5.441a.639.639 0 01-.452-1.091l4.484-4.483a.642.642 0 01.452-.187zm0-11.812h11.294a.639.639 0 01.452 1.091l-4.484 4.483a.642.642 0 01-.452.187H5.441a.639.639 0 01-.452-1.091l4.484-4.483a.642.642 0 01.452-.187zm16.61 5.906a.639.639 0 01-.452 1.091H14.789a.642.642 0 01-.452-.187l-4.484-4.483a.639.639 0 01.452-1.091h11.294c.17 0 .332.067.452.187l4.484 4.483z"
      />
    </g>
  </svg>
);

export default SolanaIcon;
