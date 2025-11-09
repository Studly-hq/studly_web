import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiMessageCircle, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import CourseOutline from '../components/learning/CourseOutline';
import LessonFlow from '../components/learning/LessonFlow';
import BobChat from '../components/learning/BobChat';

const LearningInterface = () => {
  const { selectedLesson, currentSectionIndex, navigateToSection, lessonProgress } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!selectedLesson) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowOutline(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-slate-300"
          >
            <FiMenu className="text-slate-700 text-lg" />
          </button>
          <h2 className="text-base font-semibold text-slate-900 flex-1 text-center truncate px-2">
            {selectedLesson.title}
          </h2>
          <button
            onClick={() => setShowChat(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300 border border-slate-300"
          >
            <FiMessageCircle className="text-slate-700 text-lg" />
          </button>
        </div>
      )}

      {/* Desktop Layout - Three Columns */}
      {!isMobile && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Course Outline */}
          <div className="w-80 flex-shrink-0 border-r border-slate-200 bg-white">
            <CourseOutline
              lesson={selectedLesson}
              currentSectionIndex={currentSectionIndex}
              onNavigate={navigateToSection}
              lessonProgress={lessonProgress}
            />
          </div>

          {/* Center Panel - Lesson Flow */}
          <div className="flex-1 overflow-hidden bg-white">
            <LessonFlow />
          </div>

          {/* Right Panel - Bob Chat */}
          <div className="w-96 flex-shrink-0 border-l border-slate-200 bg-white">
            <BobChat isOpen={true} isMobile={false} />
          </div>
        </div>
      )}

      {/* Mobile Layout - Full Width Center */}
      {isMobile && (
        <div className="flex-1 overflow-hidden bg-white">
          <LessonFlow />
        </div>
      )}

      {/* Mobile - Outline Modal */}
      <AnimatePresence>
        {isMobile && showOutline && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowOutline(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 border-r border-slate-200"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Course Outline</h3>
                <button
                  onClick={() => setShowOutline(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
                >
                  <FiX className="text-slate-600" />
                </button>
              </div>
              <CourseOutline
                lesson={selectedLesson}
                currentSectionIndex={currentSectionIndex}
                onNavigate={(index) => {
                  navigateToSection(index);
                  setShowOutline(false);
                }}
                lessonProgress={lessonProgress}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile - Bob Chat Modal */}
      {isMobile && (
        <BobChat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          isMobile={true}
        />
      )}

      {/* Mobile - FAB for Bob Chat */}
      {isMobile && !showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl flex items-center justify-center z-30 border border-blue-700"
        >
          <FiMessageCircle className="text-xl" />
        </motion.button>
      )}
    </div>
  );
};

export default LearningInterface;