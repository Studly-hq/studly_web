import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { slideUp } from '../../utils/animations';

export const ComprehensionCheck = ({ question, onAnswer }) => {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-8 text-center space-y-6">
        {/* Question */}
        <h3 className="text-2xl font-semibold text-white">
          {question}
        </h3>
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => onAnswer(true)}
            className="flex items-center gap-2 px-8"
          >
            <ThumbsUp className="w-5 h-5" />
            Yes, move on
          </Button>
          
          <Button
            onClick={() => onAnswer(false)}
            variant="secondary"
            className="flex items-center gap-2 px-8"
          >
            <ThumbsDown className="w-5 h-5" />
            Not really
          </Button>
        </div>
        
        <p className="text-sm text-gray-400">
          If you're not clear, we'll go over it again!
        </p>
      </Card>
    </motion.div>
  );
};