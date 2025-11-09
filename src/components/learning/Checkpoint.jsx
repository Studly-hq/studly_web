import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const Checkpoint = ({ question, onAnswer, checkpointId }) => {
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (understood) => {
    setAnswered(true);
    setTimeout(() => {
      onAnswer(understood, checkpointId);
    }, 300);
  };

  return (
    <motion.div
      className="my-6 p-6 bg-white border-2 border-blue-600 rounded-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🤔</span>
        <p className="text-lg font-medium text-gray-900 flex-1">
          {question}
        </p>
      </div>

      {!answered && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={() => handleAnswer(true)}
            className="flex-1"
          >
            ✅ Yes, continue
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAnswer(false)}
            className="flex-1"
          >
            🔁 Not yet
          </Button>
        </div>
      )}

      {answered && (
        <motion.div
          className="text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Processing...
        </motion.div>
      )}
    </motion.div>
  );
};

export default Checkpoint;