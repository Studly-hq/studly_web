import React from 'react';

export const HTMLIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background shape */}
      <rect 
        x="30" 
        y="40" 
        width="140" 
        height="120" 
        fill="#3b82f6" 
        opacity="0.1" 
        rx="12"
      />
      
      {/* Main document shape */}
      <rect 
        x="40" 
        y="50" 
        width="120" 
        height="100" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2" 
        rx="8"
      />
      
      {/* Header bar */}
      <rect 
        x="50" 
        y="60" 
        width="100" 
        height="12" 
        fill="#3b82f6" 
        opacity="0.6"
        rx="4"
      />
      
      {/* Content lines */}
      <rect 
        x="50" 
        y="80" 
        width="80" 
        height="6" 
        fill="#3b82f6" 
        opacity="0.4"
        rx="3"
      />
      <rect 
        x="50" 
        y="92" 
        width="90" 
        height="6" 
        fill="#3b82f6" 
        opacity="0.4"
        rx="3"
      />
      <rect 
        x="50" 
        y="104" 
        width="70" 
        height="6" 
        fill="#3b82f6" 
        opacity="0.4"
        rx="3"
      />
      
      {/* Tag brackets */}
      <text 
        x="50" 
        y="130" 
        fill="#3b82f6" 
        fontSize="20" 
        fontFamily="monospace"
        opacity="0.7"
      >
        &lt;/&gt;
      </text>
      
      {/* Decorative circles */}
      <circle 
        cx="170" 
        cy="35" 
        r="12" 
        fill="#3b82f6" 
        opacity="0.2"
      />
      <circle 
        cx="25" 
        cy="160" 
        r="15" 
        fill="#3b82f6" 
        opacity="0.15"
      />
    </svg>
  );
};