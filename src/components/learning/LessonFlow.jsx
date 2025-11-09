import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import TextBlock from './TextBlock';
import CodeBlock from './CodeBlock';
import MathBlock from './MathBlock';
import Checkpoint from './Checkpoint';
import Quiz from './Quiz';
import Button from '../common/Button';
import { FiChevronRight, FiCheck, FiPlay } from 'react-icons/fi';

const LessonFlow = () => {
  const {
    selectedLesson,
    currentSectionIndex,
    setCurrentSectionIndex,
    updateLessonProgress,
    saveQuizAnswer,
    saveCheckpointState,
    returnToTopicExplorer
  } = useApp();

  const [currentSection, setCurrentSection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [sectionComplete, setSectionComplete] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (selectedLesson && selectedLesson.sections[currentSectionIndex]) {
      setCurrentSection(selectedLesson.sections[currentSectionIndex]);
      setIsAnimating(false);
      setShowContinue(false);
      setSectionComplete(false);
      setShowWelcome(true);
      setHasStarted(false);

      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentSectionIndex, selectedLesson]);

  const handleStartSection = () => {
    setShowWelcome(false);
    setHasStarted(true);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    
    if (currentSection.type === 'text' || currentSection.type === 'code' || currentSection.type === 'math') {
      setShowContinue(true);
    }
  };

  const handleContinue = () => {
    if (!currentSection) return;

    updateLessonProgress(currentSection.id, true);
    setSectionComplete(true);
    setShowContinue(false);

    setTimeout(() => {
      moveToNextSection();
    }, 500);
  };

  const moveToNextSection = () => {
    if (!selectedLesson) return;

    if (currentSectionIndex < selectedLesson.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleCheckpointAnswer = (understood, checkpointId) => {
    saveCheckpointState(checkpointId, understood);

    if (!understood) {
      setIsAnimating(true);
      setShowContinue(false);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      updateLessonProgress(checkpointId, true);
      setTimeout(() => {
        moveToNextSection();
      }, 800);
    }
  };

  const handleQuizComplete = (isCorrect, questionId) => {
    saveQuizAnswer(questionId, null, isCorrect);
    
    setTimeout(() => {
      setShowContinue(true);
    }, 1000);
  };

  if (!selectedLesson || !currentSection) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-600">Loading lesson...</p>
      </div>
    );
  }

  const progress = ((currentSectionIndex + 1) / selectedLesson.sections.length) * 100;
  const isLastSection = currentSectionIndex === selectedLesson.sections.length - 1;

  const getSectionTypeLabel = (type) => {
    const labels = {
      text: 'Learning Content',
      code: 'Code Exercise',
      math: 'Math Concepts',
      checkpoint: 'Understanding Check',
      quiz: 'Knowledge Quiz'
    };
    return labels[type] || 'Learning Section';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Progress Bar */}
      <div className="border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {selectedLesson.title}
          </h2>
          <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Section {currentSectionIndex + 1} of {selectedLesson.sections.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-8 py-8"
      >
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Welcome Screen */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiPlay className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Welcome to Section {currentSectionIndex + 1}
              </h1>
              <p className="text-lg text-slate-600 mb-2">
                
              </p>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Get ready to dive into this section. Click start when you're ready to begin.
              </p>
<Button
  onClick={handleStartSection}
  size="lg"
  className="px-8 py-4 rounded-2xl bg-blue text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all duration-200 shadow-sm flex items-center gap-2"
  icon={<FiPlay className="w-5 h-5" />}
>
  Start Section
</Button>
            </motion.div>
          )}

          {/* Content Blocks - Only show after starting */}
          {hasStarted && !showWelcome && (
            <>
              {currentSection.type === 'text' && (
                <TextBlock
                  content={currentSection.content}
                  onComplete={handleAnimationComplete}
                  shouldAnimate={isAnimating}
                  speed={40}
                />
              )}

              {currentSection.type === 'code' && (
                <CodeBlock
                  content={currentSection.content}
                  language={currentSection.language}
                  onComplete={handleAnimationComplete}
                  shouldAnimate={isAnimating}
                  speed={60}
                />
              )}

              {currentSection.type === 'math' && (
                <MathBlock
                  content={currentSection.content}
                  inline={currentSection.inline}
                  onComplete={handleAnimationComplete}
                  shouldAnimate={isAnimating}
                  speed={80}
                />
              )}

              {currentSection.type === 'checkpoint' && (
                <Checkpoint
                  question={currentSection.question}
                  onAnswer={handleCheckpointAnswer}
                  checkpointId={currentSection.id}
                />
              )}

              {currentSection.type === 'quiz' && (
                <Quiz
                  question={currentSection.question}
                  quizType={currentSection.quizType}
                  options={currentSection.options}
                  correctAnswer={currentSection.correctAnswer}
                  explanation={currentSection.explanation}
                  onComplete={handleQuizComplete}
                  questionId={currentSection.id}
                />
              )}

              {/* Continue Button */}
              {showContinue && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex justify-center"
                >
                  <Button
                    variant="gradient"
                    onClick={handleContinue}
                    size="lg"
                    className="px-8 py-4 rounded-2xl"
                    icon={<FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    iconPosition="right"
                  >
                    Continue to Next Section
                  </Button>
                </motion.div>
              )}

              {/* Final Section Completion */}
              {isLastSection && sectionComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Lesson Complete!
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    You've successfully completed this lesson and mastered the concepts.
                  </p>
                  <Button
                    variant="gradient"
                    onClick={returnToTopicExplorer}
                    size="lg"
                    className="px-8 py-4 rounded-2xl"
                    icon={<FiCheck className="w-5 h-5" />}
                  >
                    Return to Topics
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LessonFlow;