
import React from 'react';

const FantomIcon = ({ className }: { className?: string }) => (
  <div className={`relative w-6 h-6 rounded-full overflow-hidden ${className || ''}`}>
    <img
      src="/lovable-uploads/39895e75-2dd2-42f2-beeb-2060f3872280.png"
      alt="Fantom Logo"
      className="w-full h-full object-cover"
    />
  </div>
);

export default FantomIcon;

