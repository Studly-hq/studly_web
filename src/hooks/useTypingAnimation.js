import { useState, useEffect } from 'react';

export const useTypingAnimation = (text, speed = 30, enabled = true) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    setCurrentIndex(0);
  }, [text, enabled]);

  useEffect(() => {
    if (!enabled || isComplete) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, enabled, isComplete]);

  const reset = () => {
    setDisplayedText('');
    setIsComplete(false);
    setCurrentIndex(0);
  };

  const skipAnimation = () => {
    setDisplayedText(text);
    setIsComplete(true);
    setCurrentIndex(text.length);
  };

  return { displayedText, isComplete, reset, skipAnimation };
};