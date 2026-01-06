import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../../data/courseBankData';

const CourseFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {categories.map((category, index) => {
        const isActive = activeCategory === category;

        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategoryChange(category)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border
              ${isActive
                ? 'text-white border-reddit-orange bg-reddit-orange/10'
                : 'text-white/60 border-white/10 hover:border-white/30 hover:text-white bg-transparent'
              }
            `}
          >
            {category}

            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-reddit-orange/10 rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CourseFilter;
