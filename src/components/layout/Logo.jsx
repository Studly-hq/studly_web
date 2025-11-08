import React from 'react';
import { Sparkles } from 'lucide-react';

export const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sparkle icon */}
      <Sparkles className="w-6 h-6 text-primary" />
      
      {/* Text logo */}
      <span className="text-xl font-bold text-white tracking-tight">
        Studly
      </span>
    </div>
  );
};