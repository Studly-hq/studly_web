import React from 'react';

export const PythonIllustration = ({ className = "w-full h-full" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Terminal window */}
      <rect 
        x="25" 
        y="35" 
        width="150" 
        height="130" 
        fill="#3b82f6" 
        opacity="0.08" 
        rx="12"
      />
      
      {/* Terminal header */}
      <rect 
        x="25" 
        y="35" 
        width="150" 
        height="30" 
        fill="#3b82f6" 
        opacity="0.15" 
        rx="12"
      />
      
      {/* Terminal prompt */}
      <text 
        x="40" 
        y="85" 
        fill="#3b82f6" 
        fontSize="16" 
        fontFamily="monospace"
        opacity="0.7"
      >
        &gt;&gt;&gt;
      </text>
      
      {/* Code blocks with indentation */}
      <rect x="75" y="78" width="80" height="6" fill="#3b82f6" opacity="0.6" rx="3"/>
      <rect x="75" y="95" width="90" height="6" fill="#3b82f6" opacity="0.5" rx="3"/>
      
      {/* Indented block */}
      <rect x="90" y="110" width="70" height="6" fill="#3b82f6" opacity="0.4" rx="3"/>
      <rect x="90" y="123" width="65" height="6" fill="#3b82f6" opacity="0.4" rx="3"/>
      
      {/* Another line */}
      <rect x="75" y="140" width="75" height="6" fill="#3b82f6" opacity="0.5" rx="3"/>
      
      {/* Python icon suggestion - two interlocking shapes */}
      <path 
        d="M 140 120 Q 150 120, 150 130 L 150 145 Q 150 155, 140 155 L 130 155 Q 120 155, 120 145 L 120 140" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="3" 
        opacity="0.3"
      />
      
      {/* Decorative dots */}
      <circle cx="160" cy="50" r="8" fill="#3b82f6" opacity="0.2"/>
      <circle cx="35" cy="160" r="10" fill="#3b82f6" opacity="0.15"/>
    </svg>
  );
};