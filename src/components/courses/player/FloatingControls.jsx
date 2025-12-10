import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Settings } from 'lucide-react';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';

const FloatingControls = ({ onPlayPause, onSkip, isPlaying, canPlay, playerState }) => {
  const { typingSpeed, setTypingSpeed, autoAdvance, setAutoAdvance } = useCoursePlayer();
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' }
  ];

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);

      // Clear existing timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      // Set new timeout to hide controls
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setIsVisible(false);
        }
      }, 3000);

      setHideTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isPlaying, hideTimeout]);

  // Show controls when typing stops
  useEffect(() => {
    if (!isPlaying) {
      setIsVisible(true);
    }
  }, [isPlaying]);

  if (!canPlay) return null;

  return (
    <>
      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 bg-reddit-card border border-reddit-border rounded-lg p-4 shadow-xl z-50 min-w-[200px]"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Playback Settings</h3>

            {/* Speed control */}
            <div className="mb-4">
              <label className="text-xs text-reddit-placeholder mb-2 block">
                Typing Speed
              </label>
              <div className="grid grid-cols-4 gap-2">
                {speedOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypingSpeed(option.value)}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${typingSpeed === option.value
                        ? 'bg-reddit-orange text-white'
                        : 'bg-reddit-cardHover text-reddit-placeholder hover:bg-reddit-border'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-advance toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-reddit-placeholder">
                Auto-advance
              </label>
              <button
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`
                  relative w-11 h-6 rounded-full transition-colors
                  ${autoAdvance ? 'bg-reddit-orange' : 'bg-reddit-cardHover'}
                `}
              >
                <motion.div
                  animate={{ x: autoAdvance ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>

      {/* Floating control buttons */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 z-50"
          >
            {/* Settings button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center
                transition-colors shadow-lg
                ${showSettings
                  ? 'bg-reddit-orange text-white'
                  : 'bg-reddit-card border border-reddit-border text-white hover:bg-reddit-cardHover'
                }
              `}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Skip button */}
            {isPlaying && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSkip}
                className="w-12 h-12 bg-reddit-card border border-reddit-border rounded-full flex items-center justify-center hover:bg-reddit-cardHover transition-colors shadow-lg"
                aria-label="Skip typing"
              >
                <SkipForward className="w-5 h-5" />
              </motion.button>
            )}

            {/* Play/Pause button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayPause}
              className="w-14 h-14 bg-reddit-orange rounded-full flex items-center justify-center hover:bg-reddit-orange/90 transition-colors shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingControls;
