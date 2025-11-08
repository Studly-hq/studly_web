import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glass = true,
  onClick,
  ...props 
}) => {
  const baseStyles = 'rounded-xl transition-smooth';
  const glassStyles = glass ? 'glass' : 'bg-dark-gray';
  const hoverStyles = hover ? 'cursor-pointer hover:glow-primary-hover' : '';
  
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};