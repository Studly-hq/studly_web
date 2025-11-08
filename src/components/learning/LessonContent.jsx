import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypewriter } from '../../hooks/useTypewriter';
import { QuizCard } from './QuizCard';
import { ComprehensionCheck } from './ComprehensionCheck';
import { Button } from '../ui/Button';
import { fadeIn } from '../../utils/animations';

export const LessonContent = ({ lesson, onComplete, onRewind }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [completedContent, setCompletedContent] = useState([]);
  const [showingContent, setShowingContent] = useState(true);
  
  const currentContent = lesson?.content?.[currentContentIndex];
  const isLastContent = currentContentIndex === (lesson?.content?.length - 1);
  
  // Typewriter for text content
  const { displayedText, isTyping, skipTyping } = useTypewriter(
    currentContent?.type === 'text' ? currentContent.text : '',
    25
  );
  
  useEffect(() => {
    // Reset when lesson changes
    setCurrentContentIndex(0);
    setCompletedContent([]);
    setShowingContent(true);
  }, [lesson]);
  
  const handleNext = () => {
    setCompletedContent([...completedContent, currentContentIndex]);
    
    if (isLastContent) {
      onComplete();
    } else {
      setCurrentContentIndex(currentContentIndex + 1);
      setShowingContent(true);
    }
  };
  
  const handleQuizAnswer = (correct) => {
    if (correct) {
      // Wait a bit before moving to next
      setTimeout(() => handleNext(), 1500);
    }
  };
  
  const handleComprehensionCheck = (understood) => {
    if (understood) {
      handleNext();
    } else {
      // Rewind to checkpoint
      const rewindIndex = currentContent.rewindTo || 0;
      setCurrentContentIndex(rewindIndex);
      onRewind();
    }
  };
  
  // Render content based on type
  const renderContent = () => {
    if (!currentContent) return null;
    
    switch (currentContent.type) {
      case 'text':
        return (
          <motion.div
            key={`text-${currentContentIndex}`}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="prose prose-invert max-w-none"
          >
            <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-blink" />
              )}
            </p>
            
            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button onClick={handleNext}>
                  {isLastContent ? 'Complete Section' : 'Continue'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        );
      
      case 'quiz':
        return (
          <QuizCard
            question={currentContent.question}
            options={currentContent.options}
            explanation={currentContent.explanation}
            onAnswer={handleQuizAnswer}
          />
        );
      
      case 'checkpoint':
        return (
          <ComprehensionCheck
            question={currentContent.question}
            onAnswer={handleComprehensionCheck}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="flex-1 p-8 overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-primary mb-8"
        >
          Section {lesson?.id}: {lesson?.title}
        </motion.h1>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          {showingContent && renderContent()}
        </AnimatePresence>
        
        {/* Skip typing button (optional) */}
        {isTyping && currentContent?.type === 'text' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button 
              variant="ghost" 
              size="sm"
              onClick={skipTyping}
            >
              Skip typing
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};