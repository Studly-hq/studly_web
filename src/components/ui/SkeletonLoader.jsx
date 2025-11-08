import React from 'react';

export const SkeletonLoader = ({ 
  variant = 'rectangular', 
  width = 'w-full', 
  height = 'h-4',
  className = '' 
}) => {
  const baseStyles = 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-200 animate-shimmer';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded'
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${width} ${height} ${className}`}
    />
  );
};

// Pre-built skeleton patterns
export const CourseCardSkeleton = () => {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <SkeletonLoader height="h-32" />
      <SkeletonLoader height="h-6" width="w-3/4" />
      <SkeletonLoader height="h-4" width="w-1/2" />
      <SkeletonLoader height="h-2" />
      <SkeletonLoader height="h-10" />
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="glass rounded-xl p-6 space-y-3">
      <SkeletonLoader height="h-4" width="w-1/3" />
      <SkeletonLoader height="h-8" width="w-2/3" />
    </div>
  );
};