import { useState, useEffect, useRef } from 'react';
import { TYPING_SPEED, PAUSE_PUNCTUATION } from '../utils/constants';

export const useTypewriter = (text, speed = TYPING_SPEED) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    setDisplayedText('');
    setCurrentIndex(0);

    const typeNextChar = (index) => {
      if (index >= text.length) {
        setIsTyping(false);
        return;
      }

      setDisplayedText(text.slice(0, index + 1));
      setCurrentIndex(index + 1);

      // Get current character to check for punctuation
      const currentChar = text[index];
      const delay = PAUSE_PUNCTUATION[currentChar] || speed;

      timeoutRef.current = setTimeout(() => typeNextChar(index + 1), delay);
    };

    typeNextChar(0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed]);

  const skipTyping = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayedText(text);
    setIsTyping(false);
  };

  return { displayedText, isTyping, skipTyping };
};