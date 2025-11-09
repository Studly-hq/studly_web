import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'rounded-xl font-semibold transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue text-white border-blue  hover:border-blue focus:ring-blue active:scale-95',
    secondary: 'bg-white text-blue border-blue  focus:ring-blue active:scale-95',
    outline: 'bg-white text-slate-700 border-slate-300 hover:border-blue hover:text-blue focus:ring-blue active:scale-95',
    ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-500 active:scale-95',
    gradient: 'bg-gradient-to-r from-blue to-blue text-white border-transparent hover:from-blue hover:to-blue focus:ring-blue active:scale-95'
  };

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-2.5 text-base'
};


  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && icon}
      <span className="text-inherit">{children}</span>
      {icon && iconPosition === 'right' && icon}
    </motion.button>
  );
};

export default Button;