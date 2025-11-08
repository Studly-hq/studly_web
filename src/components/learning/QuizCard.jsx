import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { slideUp } from '../../utils/animations';

export const QuizCard = ({ question, options, explanation, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleOptionClick = (option) => {
    if (showFeedback) return; // Prevent changing answer after selection
    
    setSelectedOption(option);
    setShowFeedback(true);
    onAnswer(option.correct);
  };
  
  const isCorrect = selectedOption?.correct;
  
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-6 space-y-6">
        {/* Question */}
        <h3 className="text-xl font-semibold text-white">
          {question}
        </h3>
        
        {/* Options */}
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedOption?.id === option.id;
            const showCorrect = showFeedback && option.correct;
            const showWrong = showFeedback && isSelected && !option.correct;
            
            return (
              <motion.button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={`
                  w-full p-4 rounded-lg text-left flex items-center gap-3
                  transition-smooth border-2
                  ${!showFeedback 
                    ? 'border-white/10 hover:border-primary/50 hover:bg-white/5' 
                    : showCorrect
                      ? 'border-green-500 bg-green-500/10'
                      : showWrong
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/10 opacity-50'
                  }
                  ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                `}
                whileHover={!showFeedback ? { scale: 1.01 } : {}}
                whileTap={!showFeedback ? { scale: 0.99 } : {}}
              >
                {/* Option letter */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-bold text-sm
                  ${!showFeedback
                    ? 'bg-white/10 text-white'
                    : showCorrect
                      ? 'bg-green-500 text-white'
                      : showWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-gray-400'
                  }
                `}>
                  {option.id.toUpperCase()}
                </div>
                
                {/* Option text */}
                <span className={`
                  flex-1 font-medium
                  ${showFeedback && !showCorrect && !showWrong
                    ? 'text-gray-500'
                    : 'text-white'
                  }
                `}>
                  {option.text}
                </span>
                
                {/* Feedback icon */}
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                    {showWrong && <XCircle className="w-6 h-6 text-red-500" />}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-4 rounded-lg
              ${isCorrect 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
              }
            `}
          >
            <p className={`
              font-semibold mb-2
              ${isCorrect ? 'text-green-400' : 'text-red-400'}
            `}>
              {isCorrect ? '🎉 Yayy you\'re correct!' : '❌ Not quite!'}
            </p>
            {!isCorrect && explanation && (
              <p className="text-gray-300 text-sm">
                {explanation}
              </p>
            )}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};