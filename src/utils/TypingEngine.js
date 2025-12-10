// Character-by-character typing engine
import React from 'react';

export class TypingEngine {
  constructor(options = {}) {
    this.baseSpeed = options.baseSpeed || 50; // milliseconds per character
    this.speedMultiplier = options.speedMultiplier || 1; // 0.5x, 1x, 1.5x, 2x
    this.onCharacter = options.onCharacter || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onPause = options.onPause || (() => {});
    this.onResume = options.onResume || (() => {});

    this.text = '';
    this.currentIndex = 0;
    this.isTyping = false;
    this.isPaused = false;
    this.animationFrameId = null;
    this.lastTypedTime = 0;
  }

  // Set the text to type
  setText(text) {
    this.text = text;
    this.currentIndex = 0;
    this.isTyping = false;
    this.isPaused = false;
  }

  // Start typing
  start() {
    if (this.isTyping || this.currentIndex >= this.text.length) return;

    console.log('[TypingEngine.start] text length:', this.text.length, 'baseSpeed:', this.baseSpeed, 'multiplier:', this.speedMultiplier);
    this.isTyping = true;
    this.isPaused = false;
    this.lastTypedTime = performance.now();
    this.scheduleNextCharacter();
  }

  // Pause typing
  pause() {
    if (!this.isTyping || this.isPaused) return;

    this.isPaused = true;
    this.isTyping = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.onPause();
  }

  // Resume typing
  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.isTyping = true;
    this.lastTypedTime = performance.now();
    this.scheduleNextCharacter();
    this.onResume();
  }

  // Skip to end
  skip() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isTyping = false;
    this.isPaused = false;
    this.currentIndex = this.text.length;

    // Call onCharacter with full text
    this.onCharacter(this.text, this.currentIndex, true);
    this.onComplete(this.text);
  }

  // Reset to beginning
  reset() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.currentIndex = 0;
    this.isTyping = false;
    this.isPaused = false;
    this.onCharacter('', 0, false);
  }

  // Change speed
  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  // Schedule next character
  scheduleNextCharacter() {
    if (!this.isTyping || this.isPaused) return;

    this.animationFrameId = requestAnimationFrame((currentTime) => {
      const timeSinceLastChar = currentTime - this.lastTypedTime;
      const delayNeeded = this.getCharacterDelay(this.text[this.currentIndex]);

      if (timeSinceLastChar >= delayNeeded) {
        this.typeNextCharacter();
        this.lastTypedTime = currentTime;
      }

      if (this.currentIndex < this.text.length && this.isTyping) {
        this.scheduleNextCharacter();
      }
    });
  }

  // Type next character
  typeNextCharacter() {
    if (this.currentIndex >= this.text.length) {
      this.isTyping = false;
      console.log('[TypingEngine] Typing complete');
      this.onComplete(this.text);
      return;
    }

    this.currentIndex++;
    const typedText = this.text.substring(0, this.currentIndex);
    const isComplete = this.currentIndex >= this.text.length;

    // Log every 50 characters for debugging
    if (this.currentIndex % 50 === 0) {
      console.log('[TypingEngine] Progress:', this.currentIndex, '/', this.text.length);
    }

    this.onCharacter(typedText, this.currentIndex, isComplete);

    if (isComplete) {
      this.isTyping = false;
      console.log('[TypingEngine] Typing complete (in typeNextCharacter)');
      this.onComplete(this.text);
    }
  }

  // Get delay for specific character (add variation for natural feel)
  getCharacterDelay(char) {
    let baseDelay = this.baseSpeed / this.speedMultiplier;

    // Add pauses for punctuation
    if (char === '.' || char === '!' || char === '?') {
      baseDelay *= 3; // Longer pause after sentences
    } else if (char === ',' || char === ';' || char === ':') {
      baseDelay *= 2; // Medium pause after clauses
    } else if (char === '\n') {
      baseDelay *= 2.5; // Pause at line breaks
    } else if (char === ' ') {
      baseDelay *= 0.8; // Slightly faster for spaces
    }

    // Add small random variation for more natural feel (±20%)
    const variation = 0.2;
    const randomFactor = 1 + (Math.random() * variation * 2 - variation);
    baseDelay *= randomFactor;

    return baseDelay;
  }

  // Check if currently typing
  isCurrentlyTyping() {
    return this.isTyping && !this.isPaused;
  }

  // Get progress (0 to 1)
  getProgress() {
    if (this.text.length === 0) return 0;
    return this.currentIndex / this.text.length;
  }

  // Cleanup
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isTyping = false;
    this.isPaused = false;
  }
}

// React hook for using TypingEngine
export const useTypingEngine = (options = {}) => {
  const [typedText, setTypedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const engineRef = React.useRef(null);

  React.useEffect(() => {
    engineRef.current = new TypingEngine({
      ...options,
      onCharacter: (text, index, complete) => {
        setTypedText(text);
        setIsComplete(complete);
        if (options.onCharacter) {
          options.onCharacter(text, index, complete);
        }
      },
      onComplete: (text) => {
        setIsTyping(false);
        setIsComplete(true);
        if (options.onComplete) {
          options.onComplete(text);
        }
      },
      onPause: () => {
        setIsTyping(false);
        if (options.onPause) {
          options.onPause();
        }
      },
      onResume: () => {
        setIsTyping(true);
        if (options.onResume) {
          options.onResume();
        }
      }
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = (text) => {
    if (engineRef.current) {
      engineRef.current.setText(text);
      engineRef.current.start();
      setIsTyping(true);
      setIsComplete(false);
    }
  };

  const pause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  };

  const resume = () => {
    if (engineRef.current) {
      engineRef.current.resume();
      setIsTyping(true);
    }
  };

  const skip = () => {
    if (engineRef.current) {
      engineRef.current.skip();
    }
  };

  const reset = () => {
    if (engineRef.current) {
      engineRef.current.reset();
      setTypedText('');
      setIsTyping(false);
      setIsComplete(false);
    }
  };

  const setSpeed = (multiplier) => {
    if (engineRef.current) {
      engineRef.current.setSpeed(multiplier);
    }
  };

  return {
    typedText,
    isTyping,
    isComplete,
    start,
    pause,
    resume,
    skip,
    reset,
    setSpeed
  };
};
