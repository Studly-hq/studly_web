import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, height = 'h-2', showLabel = false, className = '' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className="bg-blue h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
            type: "spring",
            stiffness: 50
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;