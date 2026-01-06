import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, ChevronRight } from 'lucide-react';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';

const QuizScene = ({ scene, typedQuestion, isQuestionTyped, onComplete }) => {
  const { submitQuizAnswer } = useCoursePlayer();
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const isMultiSelect = scene.multiSelect || false;

  // Reset state when scene changes
  useEffect(() => {
    setSelectedChoices([]);
    setSubmitted(false);
    setResult(null);
    setShowFeedback(false);
  }, [scene.id]);

  const handleChoiceClick = (choiceId) => {
    if (submitted) return;

    if (isMultiSelect) {
      setSelectedChoices(prev =>
        prev.includes(choiceId)
          ? prev.filter(id => id !== choiceId)
          : [...prev, choiceId]
      );
    } else {
      setSelectedChoices([choiceId]);
    }
  };

  const handleSubmit = () => {
    if (selectedChoices.length === 0 || submitted) return;

    const correctChoiceIds = scene.choices
      .filter(choice => choice.correct)
      .map(choice => choice.id);

    const { isCorrect, points } = submitQuizAnswer(scene.id, selectedChoices, correctChoiceIds);

    setResult({ isCorrect, points });
    setSubmitted(true);
    setShowFeedback(true);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (onComplete) {
        onComplete(isCorrect);
      }
    }, 3000);
  };

  const isChoiceCorrect = (choiceId) => {
    if (!submitted) return null;
    return scene.choices.find(c => c.id === choiceId)?.correct;
  };

  const isChoiceSelected = (choiceId) => {
    return selectedChoices.includes(choiceId);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-4">
      {/* Question */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-full bg-reddit-orange/10 border border-reddit-orange/20">
            <span className="text-xs font-bold text-reddit-orange uppercase tracking-wider">Quiz</span>
          </div>
          {isMultiSelect && (
            <span className="text-xs text-reddit-textMuted uppercase tracking-wider font-medium">Multi-Select</span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white leading-relaxed tracking-tight">
          {typedQuestion}
          {!isQuestionTyped && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-6 bg-reddit-orange ml-1 align-middle"
            />
          )}
        </h3>
      </div>

      {/* Choices */}
      <AnimatePresence>
        {isQuestionTyped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-3"
          >
            {scene.choices.map((choice, index) => {
              const isSelected = isChoiceSelected(choice.id);
              const isCorrect = isChoiceCorrect(choice.id);
              const showCorrectness = submitted && isSelected;

              return (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => handleChoiceClick(choice.id)}
                  disabled={submitted}
                  className={`
                    w-full p-5 rounded-xl transition-all duration-300 text-left relative overflow-hidden group border
                    ${submitted
                      ? isSelected
                        ? isCorrect
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-red-500/10 border-red-500/50'
                        : isCorrect
                          ? 'bg-green-500/5 border-green-500/30'
                          : 'bg-white/5 border-transparent opacity-50'
                      : isSelected
                        ? 'bg-white/10 border-reddit-orange'
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`
                          w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                          ${submitted
                          ? showCorrectness
                            ? isCorrect ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'
                            : isSelected ? 'border-reddit-orange' : 'border-white/20'
                          : isSelected ? 'bg-reddit-orange border-reddit-orange' : 'border-white/20 group-hover:border-white/40'
                        }
                       `}>
                        {submitted && showCorrectness && (
                          isCorrect ? <Check className="w-3.5 h-3.5 text-white" /> : <X className="w-3.5 h-3.5 text-white" />
                        )}
                        {!submitted && isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={`text-base font-medium transition-colors ${isSelected ? 'text-white' : 'text-reddit-textMuted group-hover:text-white'}`}>
                        {choice.text}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      {isQuestionTyped && !submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: scene.choices.length * 0.1 + 0.2 }}
          className="pt-4"
        >
          <button
            onClick={handleSubmit}
            disabled={selectedChoices.length === 0}
            className={`
               w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2
               ${selectedChoices.length > 0
                ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white translate-y-0'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
             `}
          >
            Submit Answer
          </button>
        </motion.div>
      )}

      {/* Feedback panel */}
      <AnimatePresence>
        {showFeedback && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`
               mt-6 p-6 rounded-xl border backdrop-blur-sm
               ${result.isCorrect
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
              }
             `}>
              <div className="flex gap-4">
                <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                      ${result.isCorrect ? 'bg-green-500' : 'bg-red-500'}
                   `}>
                  {result.isCorrect ? <Check className="w-6 h-6 text-white" /> : <X className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-1 ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-white/80 leading-relaxed text-sm">
                    {scene.explanation}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizScene;
