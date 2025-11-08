import React from 'react';
import { User } from 'lucide-react';
import { mockUser } from '../../data/userData';

export const TopBar = ({ customGreeting }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const greeting = customGreeting || `Hey, ${mockUser.displayName}!`;
  
  return (
    <div className="h-16 bg-dark-gray border-b border-white/5 flex items-center justify-between px-6">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-medium text-white">{greeting}</h1>
      </div>
      
      {/* Profile */}
      <div className="flex items-center gap-3">
        {/* User avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center
                        border border-primary/30 cursor-pointer hover:bg-primary/30 transition-smooth">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};