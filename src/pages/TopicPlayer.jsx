import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useCoursePlayer } from '../context/CoursePlayerContext';
import { getTopicById } from '../data/courseBankData';
import SectionNavigator from '../components/courses/player/SectionNavigator';
import ContentPlayer from '../components/courses/player/ContentPlayer';
import NotesPanel from '../components/courses/player/NotesPanel';
import AIChatbot from '../components/courses/player/AIChatbot';
import { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TopicPlayer = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const {
    loadTopic,
    currentTopic,
    currentSectionIndex,
    currentSceneIndex,
    goToScene,
    nextScene,
    previousScene,
    playerState,
    getTopicProgress
  } = useCoursePlayer();

  const [isNavOpen, setIsNavOpen] = useState(true); // Default open on desktop
  const [topic, setTopic] = useState(null);

  // Load topic
  useEffect(() => {
    const foundTopic = getTopicById(topicId);

    if (!foundTopic) {
      navigate('/courses');
      return;
    }

    setTopic(foundTopic);
    loadTopic(foundTopic);
  }, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic || !currentTopic) {
    return (
      <div className="min-h-screen bg-reddit-dark flex items-center justify-center">
        <LoadingSpinner size={50} color="#FF4500" />
      </div>
    );
  }

  const currentSection = topic.sections[currentSectionIndex];
  const progress = getTopicProgress(topicId);
  const totalScenes = topic.sections.reduce((sum, section) => sum + section.scenes.length, 0);
  const completedScenes = progress ? Object.keys(progress.scenes || {}).length : 0;
  const progressPercentage = Math.round((completedScenes / totalScenes) * 100);

  const canGoPrevious = currentSectionIndex > 0 || currentSceneIndex > 0;
  const canGoNext = currentSectionIndex < topic.sections.length - 1 ||
    currentSceneIndex < currentSection.scenes.length - 1;

  return (
    <div className="min-h-screen bg-reddit-dark text-white overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1B',
            color: '#fff',
            border: '1px solid #343536'
          }
        }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-reddit-cardHover z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-reddit-orange"
        />
      </div>

      {/* Header */}
      <div className="fixed top-1 left-0 right-0 z-40 bg-reddit-dark/95 backdrop-blur-md border-b border-reddit-border">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate('/courses')}
              className="w-8 h-8 rounded-full hover:bg-reddit-cardHover flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Back to courses"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold truncate">{topic.title}</h1>
              <p className="text-xs text-reddit-placeholder truncate">
                {currentSection?.title} • Scene {currentSceneIndex + 1} of {currentSection?.scenes.length}
              </p>
            </div>
          </div>

          {/* Right: Progress and score */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-reddit-placeholder">Progress</p>
                <p className="text-sm font-semibold text-reddit-orange">{progressPercentage}%</p>
              </div>
            </div>

            {progress && progress.score > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-400">{progress.score}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex pt-16 w-full">
        {/* Left: Section Navigator */}
        <SectionNavigator
          topic={topic}
          currentSectionIndex={currentSectionIndex}
          currentSceneIndex={currentSceneIndex}
          onSceneClick={goToScene}
          isOpen={isNavOpen}
          onToggle={() => setIsNavOpen(!isNavOpen)}
        />

        {/* Center: Content Player */}
        <main className="flex-1 min-h-screen md:ml-50 flex justify-center overflow-hidden">
          <div className="h-[calc(100vh-4rem)] relative w-full max-w-5xl px-4">
            <ContentPlayer topic={topic} />

            {/* Navigation arrows */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <button
                onClick={previousScene}
                disabled={!canGoPrevious}
                className={`
                  pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${canGoPrevious
                    ? 'bg-reddit-card border border-reddit-border hover:bg-reddit-cardHover text-white'
                    : 'bg-reddit-cardHover text-reddit-placeholder cursor-not-allowed opacity-50'
                  }
                `}
                aria-label="Previous scene"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextScene}
                disabled={!canGoNext || playerState === 'completed'}
                className={`
                  pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center transition-all
                  ${canGoNext && playerState !== 'completed'
                    ? 'bg-reddit-card border border-reddit-border hover:bg-reddit-cardHover text-white'
                    : 'bg-reddit-cardHover text-reddit-placeholder cursor-not-allowed opacity-50'
                  }
                `}
                aria-label="Next scene"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>

        {/* Right: Notes + AI Chatbot */}
        <aside className="hidden xl:flex xl:flex-col w-96 h-[calc(100vh-4rem)] sticky top-16 border-l border-reddit-border bg-reddit-dark overflow-hidden flex-shrink-0">
          <NotesPanel topicId={topic.id} topicTitle={topic.title} />
          <AIChatbot
            topicTitle={topic.title}
            currentSectionTitle={currentSection?.title}
          />
        </aside>
      </div>

      {/* Topic completion screen */}
      {playerState === 'completed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-reddit-card border border-reddit-border rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-reddit-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-reddit-orange" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Course Completed!</h2>
            <p className="text-reddit-placeholder mb-6">
              Congratulations on completing "{topic.title}"
            </p>

            <div className="bg-reddit-cardHover rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-reddit-placeholder">Total Score:</span>
                <span className="text-white font-semibold">{progress?.score || 0} points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-reddit-placeholder">Completion:</span>
                <span className="text-green-400 font-semibold">100%</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="w-full py-3 bg-reddit-orange hover:bg-reddit-orange/90 rounded-full font-medium transition-colors"
            >
              Back to Course Bank
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TopicPlayer;
