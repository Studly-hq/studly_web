import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All Courses' },
  { id: 'Coding', label: 'Coding' },
  { id: 'Maths', label: 'Maths' },
  { id: 'Science', label: 'Science' },
  { id: 'Humanities', label: 'Humanities' },
  { id: 'Business', label: 'Business' }
];

export const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-6 py-2 rounded-lg font-medium whitespace-nowrap
              transition-smooth relative
              ${isActive 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
            
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};