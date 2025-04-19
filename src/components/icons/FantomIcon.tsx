
import React from 'react';

const FantomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="24"
    height="24"
    className={className}
  >
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#1969FF"/>
      <path
        fill="#FFF"
        d="M17.2 12.9l3.6-2.1V15zm3.6 8L16 23.3l-4.8-2.4v-4.8l4.8 2.4v4.8l4.8-2.4zm-9.6-11.2l3.6 2.1-3.6 2.1zm5.4 3.1l3.6 2.1-3.6 2.1zm-1.2 4.2L11.8 15l3.6-2.1zm4.8-8.4L16 10.8l-4.2-2.2L16 6.3zM11 18.8l-1.8-.9v-5.8L16 8.5l6.8 3.6v5.8L21 18.8v-4.4l-5-2.5-5 2.5z"
      />
    </g>
  </svg>
);

export default FantomIcon;
