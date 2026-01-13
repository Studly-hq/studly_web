import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';
import TextScene from './TextScene';
import QuizScene from './QuizScene';
import MediaScene from './MediaScene';
import VideoScene from './VideoScene';
import { toast } from 'react-hot-toast';

const ContentPlayer = ({ topic }) => {
  const {
    currentSectionIndex,
    currentSceneIndex,
    completeScene,
    emitEvent,
    getCurrentScene
  } = useCoursePlayer();

  const currentScene = getCurrentScene();

  // Handle scene changes
  useEffect(() => {
    if (!currentScene) return;

    // Emit scene started event
    emitEvent('scene_started', {
      sceneId: currentScene.id,
      sceneType: currentScene.type,
      sectionIndex: currentSectionIndex,
      sceneIndex: currentSceneIndex
    });

    // Auto-complete text and media scenes
    if (currentScene.type === 'text' || currentScene.type === 'media') {
      completeScene(currentScene.id);
    }
  }, [currentScene?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQuizComplete = (isCorrect) => {
    completeScene(currentScene.id);

    // Show toast with result
    if (isCorrect) {
      toast.success(`+${currentScene.points || 10} Aura Points!`, {
        icon: '🎉',
        duration: 3000
      });
    }
  };

  if (!currentScene) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-reddit-placeholder">Loading...</p>
      </div>
    );
  }

  const renderScene = () => {
    switch (currentScene.type) {
      case 'text':
        // Show full content immediately, no typing
        const content = currentScene.lines
          ? currentScene.lines.join('\n\n')
          : currentScene.content || '';
        return (
          <TextScene
            content={content}
            typedContent={content}
            showCursor={false}
            isTyping={false}
          />
        );

      case 'quiz':
        return (
          <QuizScene
            scene={currentScene}
            typedQuestion={currentScene.question}
            isQuestionTyped={true}
            onComplete={handleQuizComplete}
          />
        );

      case 'media':
        return <MediaScene scene={currentScene} />;

      case 'video':
        return <VideoScene scene={currentScene} />;

      default:
        return (
          <div className="text-reddit-placeholder">
            Unknown scene type: {currentScene.type}
          </div>
        );
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="py-8 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContentPlayer;
