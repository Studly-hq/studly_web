import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CourseOutline } from '../components/learning/CourseOutline';
import { LessonContent } from '../components/learning/LessonContent';
import { BobChat } from '../components/learning/BobChat';
import { CompletionModal } from '../components/learning/CompletionModal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getCourseById } from '../data/courses';
import { lessons } from '../data/lessons';

export const LearningInterface = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentSection, setCurrentSection] = useState(1);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load course data
    const courseData = getCourseById(courseId);
    setCourse(courseData);
    setLoading(false);
  }, [courseId]);
  
  const currentLesson = lessons[courseId]?.[currentSection];
  const progress = course ? ((currentSection - 1) / course.totalSections) * 100 : 0;
  
  const handleSectionClick = (sectionId) => {
    setCurrentSection(sectionId);
  };
  
  const handleSectionComplete = () => {
    const isLastSection = currentSection === course?.totalSections;
    
    if (isLastSection) {
      setCompletionModalOpen(true);
    } else {
      // Move to next section
      setCurrentSection(currentSection + 1);
    }
  };
  
  const handleRewind = () => {
    // Reset to beginning of current section
    setCurrentSection(currentSection);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Loading lesson...</div>
      </div>
    );
  }
  
  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Course not found</div>
      </div>
    );
  }
  
  return (
    <div className="flex h-full">
      {/* Left: Course Outline */}
      <CourseOutline
        sections={course.sections}
        currentSection={currentSection}
        onSectionClick={handleSectionClick}
      />
      
      {/* Center: Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Progress Bar */}
        <div className="bg-dark-gray border-b border-white/5 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">
              {course.title}
            </h2>
            <span className="text-sm text-gray-400">
              Section {currentSection} of {course.totalSections}
            </span>
          </div>
          <ProgressBar progress={progress} height="h-1" />
        </div>
        
        {/* Lesson Content */}
        <LessonContent
          lesson={currentLesson}
          onComplete={handleSectionComplete}
          onRewind={handleRewind}
        />
      </div>
      
      {/* Right: Bob Chat */}
      <BobChat lessonContext={currentLesson} />
      
      {/* Completion Modal */}
      <CompletionModal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        sectionData={{
          title: currentLesson.title,
          auraPoints: course.sections[currentSection - 1]?.auraPoints,
          isLast: currentSection === course.totalSections
        }}
        courseData={{
          title: course.title,
          sectionsRemaining: course.totalSections - currentSection
        }}
      />
    </div>
  );
};