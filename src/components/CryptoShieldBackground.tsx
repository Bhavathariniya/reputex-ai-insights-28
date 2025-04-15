
import React from 'react';
import { Shield } from 'lucide-react';

const CryptoShieldBackground: React.FC = () => {
  return (
    <div className="crypto-shield-background">
      <div 
        className="shield-container fixed"
        style={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: -1
        }}
      >
        <div className="shield-pulse-ring"></div>
        <div className="shield-multi-pulse-ring"></div>
        <div className="shield-glow">
          <Shield className="shield-icon" size={80} />
        </div>
      </div>
      <style jsx>{`
        .shield-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid rgba(155, 135, 245, 0.2);
          animation: pulse 3s infinite;
        }
        
        .shield-multi-pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 250px;
          height: 250px;
          border-radius: 50%;
          border: 2px solid rgba(30, 174, 219, 0.1);
          animation: pulse 4s infinite 1s;
        }
        
        .shield-glow {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          filter: drop-shadow(0 0 15px rgba(155, 135, 245, 0.7));
        }
        
        .shield-icon {
          color: rgba(155, 135, 245, 0.7);
          animation: glow 3s infinite alternate;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.7;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.7;
          }
        }
        
        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 5px rgba(155, 135, 245, 0.7));
            color: rgba(155, 135, 245, 0.7);
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(30, 174, 219, 0.8));
            color: rgba(30, 174, 219, 0.8);
          }
          100% {
            filter: drop-shadow(0 0 5px rgba(217, 70, 239, 0.7));
            color: rgba(217, 70, 239, 0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default CryptoShieldBackground;
