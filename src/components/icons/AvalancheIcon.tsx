
import React from 'react';

const AvalancheIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#E84142"/>
      <path
        fill="#FFF"
        d="M19.363 19.115l2.664-4.62c.42-.76-.106-1.71-.98-1.71h-1.483c-.386 0-.742.212-.927.55L14.89 19.95c-.366.675.114 1.49.874 1.49h5.039c.76 0 1.24-.815.874-1.49l-1.07-1.855a.117.117 0 01-.004-.021.116.116 0 01.217-.084l.006.01-1.463 1.115zm-4.602-8c.386 0 .742.212.927.55l1.177 2.04a.117.117 0 01-.102.174h-3.834c-.874 0-1.4-.972-.927-1.764l1.832-2.04c.185-.338.541-.55.927-.55h.874-1.874z"
      />
    </g>
  </svg>
);

export default AvalancheIcon;
