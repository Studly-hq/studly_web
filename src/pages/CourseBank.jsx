import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryTabs } from '../components/coursebank/CategoryTabs';
import { CourseGrid } from '../components/coursebank/CourseGrid';
import { CourseOverviewModal } from '../components/coursebank/CourseOverviewModal';
import { courses } from '../data/courses';
import { pageTransition } from '../utils/animations';

export const CourseBank = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);
  
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedCourse(null), 200);
  };
  
  return (
    <motion.div
      {...pageTransition}
      className="p-8 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Course Bank
        </h1>
        <p className="text-gray-400 text-lg">
          Browse and start learning from our curated collection of courses
        </p>
      </div>
      
      {/* Category Tabs */}
      <CategoryTabs 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      {/* Course Grid */}
      <CourseGrid 
        courses={filteredCourses}
        onCourseClick={handleCourseClick}
      />
      
      {/* Course Overview Modal */}
      <CourseOverviewModal 
        isOpen={modalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
    </motion.div>
  );
};