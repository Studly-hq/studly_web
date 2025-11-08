import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

export const CourseOutline = ({ sections, currentSection, onSectionClick }) => {
  const getSectionIcon = (sectionId) => {
    if (sectionId < currentSection) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (sectionId === currentSection) {
      return <PlayCircle className="w-5 h-5 text-primary animate-pulse" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="w-64 h-full bg-dark-gray border-r border-white/5 p-4 overflow-y-auto scrollbar-thin">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        Course Outline
      </h3>
      
      <div className="space-y-2">
        {sections.map((section) => {
          const isActive = section.id === currentSection;
          const isCompleted = section.id < currentSection;
          const isLocked = section.id > currentSection;
          
          return (
            <motion.button
              key={section.id}
              onClick={() => !isLocked && onSectionClick(section.id)}
              disabled={isLocked}
              className={`
                w-full flex items-start gap-3 p-3 rounded-lg text-left
                transition-smooth
                ${isActive 
                  ? 'bg-primary/10 border border-primary/30' 
                  : isCompleted
                    ? 'hover:bg-white/5'
                    : 'opacity-50 cursor-not-allowed'
                }
              `}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
            >
              {/* Icon */}
              <div className="mt-0.5">
                {getSectionIcon(section.id)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`
                  text-sm font-medium mb-1
                  ${isActive ? 'text-primary' : isCompleted ? 'text-white' : 'text-gray-500'}
                `}>
                  Section {section.id}
                </div>
                <div className={`
                  text-sm
                  ${isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {section.title}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};