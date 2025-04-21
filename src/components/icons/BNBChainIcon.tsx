
import React from 'react';

const BNBChainIcon = ({ className }: { className?: string }) => {
  return (
    <div className={`bg-black rounded-full w-6 h-6 flex items-center justify-center ${className || ''}`}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.999 0L9.799 1.8L4.599 7L2.799 5.2L7.999 0Z"
          fill="#F0B90B"
        />
        <path
          d="M11.599 3.6L13.399 5.4L4.599 14.2L2.799 12.4L11.599 3.6Z"
          fill="#F0B90B"
        />
        <path
          d="M0.999 7L2.799 8.8L0.999 10.6L-0.801 8.8L0.999 7Z"
          fill="#F0B90B"
        />
        <path
          d="M7.999 7L9.799 8.8L7.999 10.6L6.199 8.8L7.999 7Z"
          fill="#F0B90B"
        />
        <path
          d="M15.001 7L16.801 8.8L15.001 10.6L13.201 8.8L15.001 7Z"
          fill="#F0B90B"
        />
      </svg>
    </div>
  );
};

export default BNBChainIcon;
