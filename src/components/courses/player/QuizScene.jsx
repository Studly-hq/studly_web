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
    <div className="space-y-6">
      {/* Question */}
      <div className="bg-reddit-cardHover border border-reddit-border rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-reddit-orange/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-reddit-orange" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-reddit-orange mb-2">Quiz Question</h3>
            <p className="text-lg text-white leading-relaxed">
              {typedQuestion}
              {!isQuestionTyped && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-reddit-orange ml-1 align-middle"
                />
              )}
            </p>
          </div>
        </div>

        {isMultiSelect && !submitted && isQuestionTyped && (
          <p className="text-sm text-reddit-placeholder italic">
            Select all that apply
          </p>
        )}
      </div>

      {/* Choices */}
      <AnimatePresence>
        {isQuestionTyped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {scene.choices.map((choice, index) => {
              const isSelected = isChoiceSelected(choice.id);
              const isCorrect = isChoiceCorrect(choice.id);
              const showCorrectness = submitted && isSelected;

              return (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => handleChoiceClick(choice.id)}
                  disabled={submitted}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all text-left
                    ${submitted
                      ? isSelected
                        ? isCorrect
                          ? 'bg-green-500/10 border-green-500 cursor-default'
                          : 'bg-red-500/10 border-red-500 cursor-default'
                        : isCorrect
                          ? 'bg-green-500/5 border-green-500/30 cursor-default'
                          : 'bg-reddit-card border-reddit-border cursor-default opacity-50'
                      : isSelected
                        ? 'bg-reddit-orange/10 border-reddit-orange hover:bg-reddit-orange/20'
                        : 'bg-reddit-card border-reddit-border hover:border-reddit-orange/50 hover:bg-reddit-cardHover'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white flex-1">{choice.text}</span>

                    {/* Selection indicator */}
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0
                      ${submitted
                        ? showCorrectness
                          ? isCorrect
                            ? 'bg-green-500 border-green-500'
                            : 'bg-red-500 border-red-500'
                          : isCorrect
                            ? 'bg-green-500 border-green-500'
                            : 'border-reddit-border'
                        : isSelected
                          ? 'bg-reddit-orange border-reddit-orange'
                          : 'border-reddit-border'
                      }
                    `}>
                      {submitted ? (
                        showCorrectness ? (
                          isCorrect ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />
                        ) : (
                          isCorrect && <Check className="w-4 h-4 text-white" />
                        )
                      ) : (
                        isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-white"
                          />
                        )
                      )}
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
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: scene.choices.length * 0.1 + 0.2 }}
          onClick={handleSubmit}
          disabled={selectedChoices.length === 0}
          className={`
            w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
            ${selectedChoices.length > 0
              ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white'
              : 'bg-reddit-cardHover text-reddit-placeholder cursor-not-allowed'
            }
          `}
        >
          Submit Answer
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Feedback panel */}
      <AnimatePresence>
        {showFeedback && result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              p-6 rounded-lg border-2
              ${result.isCorrect
                ? 'bg-green-500/10 border-green-500'
                : 'bg-red-500/10 border-red-500'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${result.isCorrect ? 'bg-green-500' : 'bg-red-500'}
              `}>
                {result.isCorrect
                  ? <Check className="w-6 h-6 text-white" />
                  : <X className="w-6 h-6 text-white" />
                }
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-semibold mb-2 ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {result.isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-white mb-3">{scene.explanation}</p>
                {result.isCorrect && (
                  <p className="text-sm text-green-400 font-medium">
                    +{result.points} Aura Points
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizScene;
