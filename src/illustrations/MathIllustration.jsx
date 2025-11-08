import React from 'react';

export const MathIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="70" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2" 
        opacity="0.2"
      />
      
      {/* Grid lines */}
      <line x1="30" y1="100" x2="170" y2="100" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      <line x1="100" y1="30" x2="100" y2="170" stroke="#3b82f6" strokeWidth="2" opacity="0.3"/>
      
      {/* Mathematical curve/parabola */}
      <path 
        d="M 50 140 Q 100 50, 150 140" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="3" 
        opacity="0.6"
      />
      
      {/* Points on curve */}
      <circle cx="75" cy="95" r="4" fill="#3b82f6" opacity="0.8"/>
      <circle cx="100" cy="60" r="4" fill="#3b82f6" opacity="0.8"/>
      <circle cx="125" cy="95" r="4" fill="#3b82f6" opacity="0.8"/>
      
      {/* Math symbols */}
      <text 
        x="60" 
        y="165" 
        fill="#3b82f6" 
        fontSize="24" 
        fontFamily="serif"
        opacity="0.5"
      >
        π
      </text>
      <text 
        x="115" 
        y="165" 
        fill="#3b82f6" 
        fontSize="24" 
        fontFamily="serif"
        opacity="0.5"
      >
        Σ
      </text>
      
      {/* Decorative elements */}
      <rect 
        x="40" 
        y="40" 
        width="15" 
        height="15" 
        fill="#3b82f6" 
        opacity="0.2" 
        rx="2"
        transform="rotate(45 47.5 47.5)"
      />
      <circle 
        cx="165" 
        cy="45" 
        r="8" 
        fill="#3b82f6" 
        opacity="0.15"
      />
      
      {/* Angle arc */}
      <path 
        d="M 110 100 A 10 10 0 0 1 100 90" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="2" 
        opacity="0.4"
      />
    </svg>
  );
};