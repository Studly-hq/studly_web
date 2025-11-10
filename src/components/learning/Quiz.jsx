import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { InlineMath } from 'react-katex';

const Quiz = ({ question, quizType, options, correctAnswer, explanation, onComplete, questionId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userInput, setUserInput] = useState('');

  const handleMultipleChoice = (optionId) => {
    const option = options.find(opt => opt.id === optionId);
    setSelectedAnswer(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (onComplete) {
        onComplete(option.correct, questionId);
      }
    }, 2500);
  };

  const handleTrueFalse = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    const isCorrect = answer === correctAnswer;
    
    setTimeout(() => {
      if (onComplete) {
        onComplete(isCorrect, questionId);
      }
    }, 2500);
  };

  const handleFillBlank = () => {
    if (!userInput.trim()) return;
    
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    setSelectedAnswer(userInput);
    setShowFeedback(true);
    
    setTimeout(() => {
      if (onComplete) {
        onComplete(isCorrect, questionId);
      }
    }, 2500);
  };

  const renderQuestion = () => {
    if (question.includes('$')) {
      const parts = question.split(/(\$[^$]+\$)/g);
      return parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        }
        return <span key={index}>{part}</span>;
      });
    }
    return question;
  };

  return (
    <motion.div
      className="my-8 p-8 bg-white border border-slate-200 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {/* Quiz Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-semibold text-lg">?</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Quiz Question</h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {renderQuestion()}
          </p>
        </div>
      </div>

      {/* Multiple Choice */}
      {quizType === 'multiple-choice' && !showFeedback && (
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => handleMultipleChoice(option.id)}
              className="w-full p-4 text-left bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="text-slate-800 font-medium flex-1">{option.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* True/False */}
      {quizType === 'true-false' && !showFeedback && (
        <div className="flex gap-4">
          <Button
            variant="gradient"
            onClick={() => handleTrueFalse(true)}
            className="flex-1 py-4 rounded-xl"
          >
            ✓ True
          </Button>
          <Button
            variant="outline"
            onClick={() => handleTrueFalse(false)}
            className="flex-1 py-4 rounded-xl border-2"
          >
            ✗ False
          </Button>
        </div>
      )}

      {/* Fill in the Blank */}
      {quizType === 'fill-blank' && !showFeedback && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFillBlank()}
              placeholder="Type your answer here..."
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 placeholder-slate-500"
            />
          </div>
          <Button
            variant="gradient"
            onClick={handleFillBlank}
            disabled={!userInput.trim()}
            className="w-full py-4 rounded-xl"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          {(() => {
            let isCorrect = false;
            if (quizType === 'multiple-choice') {
              const option = options.find(opt => opt.id === selectedAnswer);
              isCorrect = option?.correct;
            } else if (quizType === 'true-false') {
              isCorrect = selectedAnswer === correctAnswer;
            } else if (quizType === 'fill-blank') {
              isCorrect = selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();
            }

            return (
              <div className={`p-6 rounded-2xl border-2 ${
                isCorrect 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <span className="text-white font-bold text-lg">✓</span>
                    ) : (
                      <span className="text-white font-bold text-lg">✗</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? "That's correct! Great job." : "Not quite right."}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      {isCorrect ? "You've mastered this concept." : "Let's review the explanation."}
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">{explanation}</p>
              </div>
            );
          })()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quiz;