import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Check, X } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const QuizCard = ({ quiz, questionIndex, onNext, showOptions, onToggleOptions }) => {
  const { currentUser, isAuthenticated } = useStudyGram();
  const [isLiked, setIsLiked] = useState(quiz.likes?.includes(currentUser?.id));
  const [isSaved, setIsSaved] = useState(quiz.savedBy?.includes(currentUser?.id));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quiz.questions[questionIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsLiked(!isLiked);
    onToggleOptions();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsSaved(!isSaved);
  };

  const handleAnswerSelect = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    onNext();
  };

  const isCorrect = selectedAnswer === question.answer_index;

  return (
    <div className="relative w-full mx-auto bg-black rounded-xl md:rounded-2xl overflow-hidden h-full max-h-[85vh] md:max-h-[80vh]" style={{ maxWidth: '440px' }}>
      {/* Main content area */}
      <div className="h-full flex flex-col justify-between p-4 sm:p-5 md:p-6">

        {/* Top - Course info */}
        <div className="space-y-1 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-white truncate pr-16">
            {quiz.courseTitle}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">@{quiz.creator}</p>
        </div>

        {/* Center - Question */}
        <div className="flex-1 flex items-center pr-14 sm:pr-16 overflow-y-auto">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-4 sm:mb-6">
              {question.question}
            </h1>

            {/* Options - slide in from bottom */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="space-y-2 sm:space-y-3"
                >
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === question.answer_index;
                    const showResult = selectedAnswer !== null;

                    let bgColor = 'bg-white/5 border-white/10';
                    let textColor = 'text-white';

                    if (showResult) {
                      if (isCorrectAnswer) {
                        bgColor = 'bg-green-500/20 border-green-500/50';
                        textColor = 'text-green-300';
                      } else if (isSelected) {
                        bgColor = 'bg-red-500/20 border-red-500/50';
                        textColor = 'text-red-300';
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border backdrop-blur-sm transition-all ${bgColor} ${
                          selectedAnswer === null ? 'hover:border-white/30 active:scale-95' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`text-base sm:text-lg font-bold ${textColor} flex-shrink-0`}>
                            {optionLabels[index]})
                          </span>
                          <span className={`text-xs sm:text-sm font-medium ${textColor} flex-1 text-left`}>
                            {option}
                          </span>
                          {showResult && isCorrectAnswer && (
                            <div className="bg-green-500 rounded-full p-0.5 flex-shrink-0">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                          {showResult && isSelected && !isCorrectAnswer && (
                            <div className="bg-red-500 rounded-full p-0.5 flex-shrink-0">
                              <X size={12} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 sm:mt-4"
                >
                  <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <>
                          <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-green-400">Correct!</h3>
                        </>
                      ) : (
                        <>
                          <div className="bg-red-500 rounded-full p-1 flex-shrink-0">
                            <X size={10} className="text-white" strokeWidth={3} />
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-red-400">Incorrect</h3>
                        </>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{question.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom - Question counter & Next button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div className="text-white/50 text-xs sm:text-sm font-medium">
            {questionIndex + 1}/{quiz.questions.length}
          </div>

          {showExplanation && showOptions && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleNext}
              className="px-5 sm:px-6 py-2 bg-white text-black rounded-full font-bold text-xs sm:text-sm hover:bg-gray-200 active:scale-95 transition-all"
            >
              Next
            </motion.button>
          )}
        </div>
      </div>

      {/* Right action bar - TikTok style */}
      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 sm:gap-4">
        {/* Like button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
            isLiked ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
          }`}>
            <Heart
              size={20}
              className={isLiked ? 'text-white fill-white' : 'text-white'}
              strokeWidth={2}
            />
          </div>
          <span className="text-white text-[10px] sm:text-xs font-semibold">
            {quiz.likeCount + (isLiked ? 1 : 0)}
          </span>
        </motion.button>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors ${
            isSaved ? 'bg-yellow-500' : 'bg-white/10 hover:bg-white/20'
          }`}>
            <Bookmark
              size={20}
              className={isSaved ? 'text-white fill-white' : 'text-white'}
              strokeWidth={2}
            />
          </div>
          <span className="text-white text-[10px] sm:text-xs font-semibold">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default QuizCard;
