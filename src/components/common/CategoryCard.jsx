import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import ProgressBar from './ProgressBar';
import Button from './Button';

const CategoryCard = ({ subject, onViewTopics }) => {
  const getCategoryColor = (category) => {
    const colors = {
      STEM: 'bg-gradient-to-br from-green-500 to-emerald-600',
      Languages: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      Tech: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      Arts: 'bg-gradient-to-br from-pink-500 to-rose-600',
      Business: 'bg-gradient-to-br from-orange-500 to-red-600',
      default: 'bg-gradient-to-br from-slate-500 to-slate-600'
    };
    return colors[category] || colors.default;
  };

  const getCategoryBorderColor = (category) => {
    const colors = {
      STEM: 'border-green-200 hover:border-green-300',
      Languages: 'border-blue-200 hover:border-blue-300',
      Tech: 'border-purple-200 hover:border-purple-300',
      Arts: 'border-pink-200 hover:border-pink-300',
      Business: 'border-orange-200 hover:border-orange-300',
      default: 'border-slate-200 hover:border-slate-300'
    };
    return colors[category] || colors.default;
  };

  const getCategoryButtonColor = (category) => {
    const colors = {
      STEM: 'text-green-600 hover:text-green-700 hover:bg-green-50',
      Languages: 'text-blue hover:text-blue hover:bg-blue-50',
      Tech: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50',
      Arts: 'text-pink-600 hover:text-pink-700 hover:bg-pink-50',
      Business: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50',
      default: 'text-slate-600 hover:text-slate-700 hover:bg-slate-50'
    };
    return colors[category] || colors.default;
  };

  return (
    <motion.div
      className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${getCategoryBorderColor(subject.category)}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex flex-col h-full">
        {/* Header with Icon and Category */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${getCategoryColor(subject.category)} flex items-center justify-center border-2 border-white/30`}>
            <FiBookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full capitalize border border-slate-200">
            {subject.category.toLowerCase()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {subject.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {subject.tagline}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span className="font-medium text-slate-700">{subject.progress}%</span>
          </div>
          <ProgressBar progress={subject.progress} />
        </div>

        {/* Action Button - Enhanced with category-specific colors */}
          <div
            onClick={() => onViewTopics(subject.id)}
            variant="ghost"
            size="sm"

            className={`group/btn transition-all duration-300 ${getCategoryButtonColor(subject.category)} flex justify-between items-center mt-4 py-2 px-2 border-t rounded-lg border`}
          >
            <span>Explore Topics</span>
            <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </div>
    </motion.div>
  );
};

export default CategoryCard;