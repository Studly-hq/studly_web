import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuizCard from '../components/quiz/QuizCard';
import { getAllQuizzes } from '../data/quizData';

const QuizFeed = () => {
  const navigate = useNavigate();
  const [quizzes] = useState(getAllQuizzes());
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0);

  const currentQuiz = quizzes[currentQuizIndex];
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      handleNext();
    }
    if (isDownSwipe) {
      handlePrevious();
    }
  };

  const handleNext = () => {
    setShowOptions(false);
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevious = () => {
    setShowOptions(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      const prevQuiz = quizzes[currentQuizIndex - 1];
      setCurrentQuestionIndex(prevQuiz.questions.length - 1);
    }
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleOptions();
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuizIndex, currentQuestionIndex, showOptions]);

  // Improved scroll wheel navigation with debouncing
  useEffect(() => {
    let scrollTimeout;

    const handleWheel = (e) => {
      e.preventDefault();

      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.current;

      if (timeSinceLastScroll > 500) {
        scrollAccumulator.current = 0;
      }

      scrollAccumulator.current += e.deltaY;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        const threshold = 100;

        if (Math.abs(scrollAccumulator.current) > threshold) {
          if (scrollAccumulator.current > 0) {
            handleNext();
          } else {
            handlePrevious();
          }
          scrollAccumulator.current = 0;
        }

        lastScrollTime.current = now;
      }, 150);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      };
    }
  }, [currentQuizIndex, currentQuestionIndex]);

  if (!currentQuiz) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">No quizzes available</h2>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
          >
            Create a Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="h-screen w-full overflow-hidden bg-gradient-to-b from-gray-950 to-black fixed inset-0"
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 bg-black/50 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <span className="text-white/60 text-xs sm:text-sm font-medium">
          Quiz {currentQuizIndex + 1}/{quizzes.length}
        </span>

        <div className="w-9 sm:w-10" /> {/* Spacer */}
      </div>

      {/* Main quiz feed */}
      <div className="h-full w-full flex items-center justify-center px-2 sm:px-4 pt-14 sm:pt-16 pb-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentQuizIndex}-${currentQuestionIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <QuizCard
              quiz={currentQuiz}
              questionIndex={currentQuestionIndex}
              onNext={handleNext}
              showOptions={showOptions}
              onToggleOptions={toggleOptions}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizFeed;
