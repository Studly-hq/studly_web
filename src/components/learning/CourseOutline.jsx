import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiLock, FiCircle } from 'react-icons/fi';

const CourseOutline = ({ lesson, currentSectionIndex, onNavigate, lessonProgress }) => {
  if (!lesson || !lesson.sections) return null;

  const getSectionStatus = (sectionIndex) => {
    if (sectionIndex < currentSectionIndex) return 'completed';
    if (sectionIndex === currentSectionIndex) return 'in-progress';
    return 'locked';
  };

  const getSectionIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="text-green-600" />;
      case 'in-progress':
        return <FiCircle className="text-blue-600" />;
      default:
        return <FiLock className="text-gray-400" />;
    }
  };

  return (
    <div className="h-full bg-gray-50 border-r-2 border-gray-200 overflow-y-auto scrollbar-thin">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Outline
        </h3>

        <div className="space-y-2">
          {lesson.sections.map((section, index) => {
            const status = getSectionStatus(index);
            const isClickable = status === 'completed' || status === 'in-progress';

            return (
              <motion.button
                key={section.id}
                onClick={() => isClickable && onNavigate(index)}
                disabled={!isClickable}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                  status === 'in-progress'
                    ? 'bg-blue-50 border-blue-600'
                    : status === 'completed'
                    ? 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-600'
                    : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                }`}
                whileHover={isClickable ? { scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getSectionIcon(status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">
                        Section {index + 1}
                      </span>
                    </div>
                    <p className={`text-sm font-medium line-clamp-2 ${
                      status === 'in-progress' ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {section.type === 'text' && section.content.split('\n')[0].substring(0, 40)}
                      {section.type === 'code' && `Code: ${section.language}`}
                      {section.type === 'math' && 'Mathematical Equation'}
                      {section.type === 'checkpoint' && 'Understanding Check'}
                      {section.type === 'quiz' && 'Quiz Question'}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseOutline;