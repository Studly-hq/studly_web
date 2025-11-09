import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ content, language = 'javascript', onComplete, shouldAnimate = true, speed = 30 }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedCode(content);
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedCode('');
    setIsComplete(false);
    setCurrentIndex(0);
  }, [content, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate || isComplete) return;

    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, content, speed, shouldAnimate, isComplete, onComplete]);

  const customStyle = {
    ...tomorrow,
    'code[class*="language-"]': {
      ...tomorrow['code[class*="language-"]'],
      background: '#F5F5F5',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    'pre[class*="language-"]': {
      ...tomorrow['pre[class*="language-"]'],
      background: '#F5F5F5',
      border: '2px solid #E5E7EB',
      borderRadius: '12px',
      padding: '16px',
      margin: 0
    }
  };

  return (
    <motion.div
      className="my-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SyntaxHighlighter
        language={language}
        style={customStyle}
        customStyle={{
          background: '#F5F5F5',
          border: '2px solid #E5E7EB',
          borderRadius: '12px'
        }}
      >
        {displayedCode + (!isComplete ? '▊' : '')}
      </SyntaxHighlighter>
    </motion.div>
  );
};

export default CodeBlock;