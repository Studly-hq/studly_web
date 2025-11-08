import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { 
  HTMLIllustration, 
  CSSIllustration, 
  JavaScriptIllustration, 
  PythonIllustration,
  MathIllustration 
} from '../../illustrations';

const illustrationMap = {
  html: HTMLIllustration,
  css: CSSIllustration,
  javascript: JavaScriptIllustration,
  python: PythonIllustration,
  math: MathIllustration
};

export const CourseCard = ({ course, showProgress = true }) => {
  const navigate = useNavigate();
  const Illustration = illustrationMap[course.illustration] || HTMLIllustration;
  
  const handleContinue = () => {
    navigate(`/learn/${course.courseId}`);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card hover className="p-4 space-y-4 min-w-[280px]">
        {/* Illustration */}
        <div className="h-32 rounded-lg overflow-hidden bg-primary/5 flex items-center justify-center p-4">
          <Illustration className="w-full h-full" />
        </div>
        
        {/* Course Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-400">
            {showProgress 
              ? `Lesson ${course.currentSection}: ${course.title.split(' ')[0]} Basics`
              : course.description
            }
          </p>
        </div>
        
        {/* Progress Bar */}
        {showProgress && (
          <ProgressBar progress={course.progress} />
        )}
        
        {/* Action Button */}
        <Button 
          onClick={handleContinue}
          className="w-full"
        >
          {showProgress ? 'Continue' : 'Start Learning'}
        </Button>
      </Card>
    </motion.div>
  );
};