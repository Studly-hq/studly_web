import React from 'react';

export const CSSIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer container */}
      <rect 
        x="40" 
        y="40" 
        width="120" 
        height="120" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="3" 
        rx="12"
      />
      
      {/* Layered boxes representing CSS styling */}
      <rect 
        x="60" 
        y="60" 
        width="80" 
        height="20" 
        fill="#3b82f6" 
        opacity="0.3" 
        rx="6"
      />
      <rect 
        x="60" 
        y="90" 
        width="80" 
        height="20" 
        fill="#3b82f6" 
        opacity="0.5" 
        rx="6"
      />
      <rect 
        x="60" 
        y="120" 
        width="80" 
        height="20" 
        fill="#3b82f6" 
        opacity="0.7" 
        rx="6"
      />
      
      {/* CSS curly brace */}
      <text 
        x="50" 
        y="70" 
        fill="#3b82f6" 
        fontSize="24" 
        fontFamily="monospace"
        opacity="0.6"
      >
        {'{'}
      </text>
      <text 
        x="145" 
        y="70" 
        fill="#3b82f6" 
        fontSize="24" 
        fontFamily="monospace"
        opacity="0.6"
      >
        {'}'}
      </text>
      
      {/* Decorative elements */}
      <circle 
        cx="30" 
        cy="30" 
        r="10" 
        fill="#3b82f6" 
        opacity="0.2"
      />
      <circle 
        cx="175" 
        cy="170" 
        r="12" 
        fill="#3b82f6" 
        opacity="0.15"
      />
      
      {/* Color palette dots */}
      <circle cx="65" cy="155" r="4" fill="#3b82f6" opacity="0.8"/>
      <circle cx="75" cy="155" r="4" fill="#3b82f6" opacity="0.6"/>
      <circle cx="85" cy="155" r="4" fill="#3b82f6" opacity="0.4"/>
    </svg>
  );
};