
import React from 'react';

const EthereumIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="evenodd">
        <path fillRule="nonzero" d="M16 4l-.18.624v15.348l.18.18L23.5 16z" opacity=".8"/>
        <path fillRule="nonzero" d="M16 4L8.5 16l7.5 4.152V4z"/>
        <path fillRule="nonzero" d="M16 21.968l-.092.113v5.39l.092.27L23.5 18z" opacity=".8"/>
        <path fillRule="nonzero" d="M16 27.741v-5.773L8.5 18z"/>
        <path fillRule="nonzero" d="M16 20.152l7.5-4.152-7.5-3.36z" opacity=".4"/>
        <path fillRule="nonzero" d="M8.5 16l7.5 4.152v-7.512z" opacity=".8"/>
      </g>
    </g>
  </svg>
);

export default EthereumIcon;
