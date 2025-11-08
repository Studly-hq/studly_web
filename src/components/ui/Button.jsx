import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed',
    secondary: 'bg-medium-gray text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 disabled:border-gray-600 disabled:text-gray-600',
    ghost: 'text-white hover:bg-white/5 disabled:text-gray-600'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};