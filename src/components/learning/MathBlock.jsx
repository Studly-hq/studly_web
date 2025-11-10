import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const MathBlock = ({ content, inline = false, onComplete, shouldAnimate = true, speed = 50 }) => {
  const [displayedMath, setDisplayedMath] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedMath(content);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedMath('');
    setIsComplete(false);
    setCurrentIndex(0);
}, [content, shouldAnimate, onComplete]); 

  useEffect(() => {
    if (!shouldAnimate || isComplete) return;

    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedMath(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, content, speed, shouldAnimate, isComplete, onComplete]);

  if (inline) {
    return (
      <motion.span
        className="inline-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <InlineMath math={displayedMath} />
        {!isComplete && <span className="typing-cursor ml-1">|</span>}
      </motion.span>
    );
  }

  return (
    <motion.div
      className="my-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BlockMath math={displayedMath} />
      {!isComplete && (
        <div className="text-center mt-2">
          <span className="typing-cursor text-blue-600">▊</span>
        </div>
      )}
    </motion.div>
  );
};

export default MathBlock;