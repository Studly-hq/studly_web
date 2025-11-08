import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ 
  progress = 0, 
  height = 'h-2', 
  showLabel = false,
  className = '' 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">{clampedProgress}%</span>
        </div>
      )}
      
      <div className={`w-full bg-medium-gray rounded-full overflow-hidden ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-primary rounded-full"
          style={{ 
            boxShadow: clampedProgress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none' 
          }}
        />
      </div>
    </div>
  );
};