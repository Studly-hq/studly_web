import React from 'react';

export const JavaScriptIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Code editor window */}
      <rect 
        x="30" 
        y="30" 
        width="140" 
        height="140" 
        fill="#3b82f6" 
        opacity="0.08" 
        rx="10"
      />
      
      {/* Window header */}
      <rect 
        x="30" 
        y="30" 
        width="140" 
        height="25" 
        fill="#3b82f6" 
        opacity="0.2" 
        rx="10"
      />
      
      {/* Window dots */}
      <circle cx="45" cy="42" r="3" fill="#3b82f6" opacity="0.6"/>
      <circle cx="55" cy="42" r="3" fill="#3b82f6" opacity="0.6"/>
      <circle cx="65" cy="42" r="3" fill="#3b82f6" opacity="0.6"/>
      
      {/* Code lines with bullets */}
      <circle cx="45" cy="70" r="4" fill="#3b82f6" opacity="0.8"/>
      <rect x="55" y="67" width="90" height="6" fill="#3b82f6" opacity="0.6" rx="3"/>
      
      <circle cx="45" cy="90" r="4" fill="#3b82f6" opacity="0.7"/>
      <rect x="55" y="87" width="70" height="6" fill="#3b82f6" opacity="0.5" rx="3"/>
      
      <circle cx="45" cy="110" r="4" fill="#3b82f6" opacity="0.6"/>
      <rect x="55" y="107" width="85" height="6" fill="#3b82f6" opacity="0.4" rx="3"/>
      
      <circle cx="45" cy="130" r="4" fill="#3b82f6" opacity="0.5"/>
      <rect x="55" y="127" width="60" height="6" fill="#3b82f6" opacity="0.3" rx="3"/>
      
      {/* Function brackets */}
      <text 
        x="40" 
        y="158" 
        fill="#3b82f6" 
        fontSize="22" 
        fontFamily="monospace"
        opacity="0.7"
      >
        function()
      </text>
      
      {/* Decorative elements */}
      <circle 
        cx="175" 
        cy="45" 
        r="10" 
        fill="#3b82f6" 
        opacity="0.15"
      />
      <rect 
        x="15" 
        y="150" 
        width="10" 
        height="10" 
        fill="#3b82f6" 
        opacity="0.2" 
        rx="2"
      />
    </svg>
  );
};