import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  HTMLIllustration, 
  CSSIllustration, 
  JavaScriptIllustration, 
  PythonIllustration,
  MathIllustration 
} from '../../illustrations';
import { staggerContainer, slideUp } from '../../utils/animations';

const illustrationMap = {
  html: HTMLIllustration,
  css: CSSIllustration,
  javascript: JavaScriptIllustration,
  python: PythonIllustration,
  math: MathIllustration
};

export const CourseGrid = ({ courses, onCourseClick }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {courses.map((course) => {
        const Illustration = illustrationMap[course.illustration] || HTMLIllustration;
        
        return (
          <motion.div
            key={course.id}
            variants={slideUp}
          >
            <Card hover className="p-6 space-y-4 h-full flex flex-col">
              {/* Illustration */}
              <div className="h-40 rounded-lg overflow-hidden bg-primary/5 flex items-center justify-center p-6">
                <Illustration className="w-full h-full" />
              </div>
              
              {/* Course Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {course.description}
                </p>
                
                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.difficulty}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <Button 
                onClick={() => onCourseClick(course)}
                className="w-full"
              >
                Start Learning
              </Button>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};