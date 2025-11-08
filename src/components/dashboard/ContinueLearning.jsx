import React from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { CourseCardSkeleton } from '../ui/SkeletonLoader';
import { staggerContainer, slideUp } from '../../utils/animations';

export const ContinueLearning = ({ courses, loading = false }) => {
  if (!loading && (!courses || courses.length === 0)) {
    return null;
  }
  
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Header */}
      <motion.h2 
        variants={slideUp}
        className="text-2xl font-bold text-white"
      >
        Continue Learning
      </motion.h2>
      
      {/* Course Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {loading ? (
          <>
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </>
        ) : (
          courses.map((course, index) => (
            <motion.div
              key={course.courseId}
              variants={slideUp}
              custom={index}
            >
              <CourseCard course={course} showProgress={true} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};