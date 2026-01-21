import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useCoursePlayer } from '../context/CoursePlayerContext';
import { getCourse } from '../api/coursebank';
import { mapApiCourseToTopic } from '../utils/courseMapper';
import SectionNavigator from '../components/courses/player/SectionNavigator';
import ContentPlayer from '../components/courses/player/ContentPlayer';
import NotesPanel from '../components/courses/player/NotesPanel';
import AIChatbot from '../components/courses/player/AIChatbot';
import { Toaster } from 'react-hot-toast';
import { TopicPlayerSkeleton } from '../components/common/Skeleton';
import CompletionScreen from '../components/courses/player/CompletionScreen';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load topic from API
  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCourse(topicId);
        if (!data) {
          navigate('/courses');
          return;
        }

        const mappedTopic = mapApiCourseToTopic(data);
        setTopic(mappedTopic);
        loadTopic(mappedTopic);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        setError('Failed to load course details. Please try again later.');
        // Fallback to mock data if preferred, but for now we follow live source
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <TopicPlayerSkeleton />;
  }

  if (error || !topic || !currentTopic) {
    return (
      <div className="min-h-screen bg-reddit-bg flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold mb-4">{error || 'Topic not found'}</h2>
        <button
          onClick={() => navigate('/courses')}
          className="px-6 py-2 bg-reddit-orange rounded-full font-medium"
        >
          Back to Courses
        </button>
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
    <div className="min-h-screen bg-reddit-bg text-white overflow-x-hidden">
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

      {/* Progress bar - Extremely thin and precise */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-reddit-bg z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-reddit-orange shadow-[0_0_10px_rgba(255,69,0,0.5)]"
        />
      </div>

      {/* Header - Glassmorphic, minimal */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-reddit-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => navigate('/courses')}
              className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-all duration-300"
              aria-label="Back to courses"
            >
              <ArrowLeft className="w-5 h-5 text-reddit-textMuted group-hover:text-white transition-colors" />
            </button>
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-sm font-medium text-white/90 tracking-wide truncate">{topic.title}</h1>
              <div className="flex items-center gap-2 text-xs text-reddit-textMuted">
                <span className="truncate">{currentSection?.title}</span>
                <span className="w-1 h-1 rounded-full bg-reddit-textMuted/50" />
                <span>{currentSceneIndex + 1} / {currentSection?.scenes.length}</span>
              </div>
            </div>
          </div>

          {/* Right: Progress and score */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{progressPercentage}%</span>
                <span className="text-xs text-reddit-textMuted">Complete</span>
              </div>
            </div>

            {progress && progress.score > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-bold text-yellow-500">{progress.score}</span>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Main layout */}
      <div className="flex h-screen pt-[72px] overflow-hidden">
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
        <main className="flex-1 flex flex-col relative min-w-0 bg-gradient-to-b from-reddit-bg to-[#0f0f10]">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 lg:px-16 py-8">
            <div className="max-w-4xl mx-auto h-full">
              <ContentPlayer topic={topic} />
            </div>
          </div>

          {/* Minimal Floating Navigation Controls */}
          <div className="absolute bottom-8 right-8 flex items-center gap-3 z-30">
            <button
              onClick={previousScene}
              disabled={!canGoPrevious}
              className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${canGoPrevious
                  ? 'hover:bg-white/10 text-reddit-textMuted hover:text-white'
                  : 'opacity-0 pointer-events-none'
                }
                `}
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextScene}
              disabled={playerState === 'completed'}
              className={`
                  h-10 px-6 rounded-full flex items-center gap-2 transition-all duration-300
                  ${playerState !== 'completed'
                  ? 'bg-reddit-orange hover:bg-reddit-orange/90 text-white translate-y-0'
                  : 'bg-white/5 text-reddit-textMuted cursor-not-allowed'
                }
                `}
              aria-label={!canGoNext ? "Finish course" : "Next scene"}
            >
              <span className="text-sm font-medium">{!canGoNext ? 'Finish' : 'Next'}</span>
              {!canGoNext ? <Trophy className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </main>

        {/* Right: Notes + AI Chatbot */}
        <aside className="hidden xl:flex xl:flex-col w-96 h-[calc(100vh-4rem)] sticky top-16 border-l border-reddit-border bg-reddit-bg overflow-hidden flex-shrink-0">
          <NotesPanel topicId={topic.id} topicTitle={topic.title} />
          <AIChatbot
            topicTitle={topic.title}
            currentSectionTitle={currentSection?.title}
          />
        </aside>
      </div>

      {/* Topic completion screen */}
      {playerState === 'completed' && (
        <CompletionScreen topic={topic} progress={progress} />
      )}
    </div>
  );
};

export default TopicPlayer;
