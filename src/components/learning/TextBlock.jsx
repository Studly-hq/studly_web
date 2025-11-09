import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TextBlock = ({ content, onComplete, shouldAnimate = true, speed = 40 }) => { // Default speed: 40ms
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(content);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    setCurrentIndex(0);
  }, [content, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate || isComplete) return;

    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, content, speed, shouldAnimate, isComplete, onComplete]);

  const paragraphs = displayedText.split('\n').filter(p => p.trim() !== '');

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {paragraphs.map((paragraph, index) => {
        const isHeading = paragraph.length < 60 && 
                         !paragraph.endsWith('.') && 
                         !paragraph.includes(',') &&
                         paragraph === paragraph.toUpperCase();
        
        return (
          <motion.p
            key={index}
            className={isHeading ? 
              'text-xl font-semibold text-blue-600' : 
              'text-base leading-relaxed text-slate-800'
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {paragraph}
            {!isComplete && index === paragraphs.length - 1 && (
              <span className="typing-cursor ml-1">|</span>
            )}
          </motion.p>
        );
      })}
    </motion.div>
  );
};

export default TextBlock;