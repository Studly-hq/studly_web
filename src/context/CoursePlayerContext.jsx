import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLumelyReport } from "lumely-react";

const CoursePlayerContext = createContext();

export const useCoursePlayer = () => {
  const context = useContext(CoursePlayerContext);
  if (!context) {
    throw new Error('useCoursePlayer must be used within CoursePlayerProvider');
  }
  return context;
};

export const CoursePlayerProvider = ({ children }) => {
  const { reportError } = useLumelyReport();
  // Player state machine
  const [playerState, setPlayerState] = useState('idle'); // idle, typing, paused, awaiting_input, validating, showing_feedback, transitioning, completed

  // Current position
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Typing engine settings
  const [typingSpeed, setTypingSpeed] = useState(1); // 0.5x, 1x, 1.5x, 2x
  const [isTyping, setIsTyping] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Progress tracking - stored in localStorage
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('courseProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Aura points
  const [auraPoints, setAuraPoints] = useState(() => {
    const saved = localStorage.getItem('auraPoints');
    return saved ? parseInt(saved) : 0;
  });

  // Event queue for offline sync
  const [eventQueue, setEventQueue] = useState([]);

  // Notes per topic
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('courseNotes');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist progress to localStorage
  useEffect(() => {
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [progress]);

  // Persist aura points
  useEffect(() => {
    localStorage.setItem('auraPoints', auraPoints.toString());
  }, [auraPoints]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('courseNotes', JSON.stringify(notes));
  }, [notes]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load topic
  const loadTopic = useCallback((topic) => {
    setCurrentTopic(topic);
    setCurrentSectionIndex(0);
    setCurrentSceneIndex(0);
    setPlayerState('idle');

    // Initialize progress for this topic if doesn't exist
    if (!progress[topic.id]) {
      setProgress(prev => ({
        ...prev,
        [topic.id]: {
          sections: {},
          scenes: {},
          score: 0,
          startedAt: Date.now(),
          lastAccessedAt: Date.now()
        }
      }));
    } else {
      // Update last accessed
      setProgress(prev => ({
        ...prev,
        [topic.id]: {
          ...prev[topic.id],
          lastAccessedAt: Date.now()
        }
      }));
    }
  }, [progress]);

  // Navigation
  const goToScene = useCallback((sectionIndex, sceneIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentSceneIndex(sceneIndex);
    setPlayerState('idle');
  }, []);

  const nextScene = useCallback(() => {
    if (!currentTopic) return;

    const currentSection = currentTopic.sections[currentSectionIndex];

    // Check if there are more scenes in current section
    if (currentSceneIndex < currentSection.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setPlayerState('idle');
    }
    // Check if there are more sections
    else if (currentSectionIndex < currentTopic.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentSceneIndex(0);
      setPlayerState('transitioning');
      setTimeout(() => setPlayerState('idle'), 300);
    }
    // Topic completed
    else {
      setPlayerState('completed');
      emitEvent('topic_completed', {
        topicId: currentTopic.id,
        score: progress[currentTopic.id]?.score || 0
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic, currentSectionIndex, currentSceneIndex, progress]);

  const previousScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setPlayerState('idle');
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      const prevSection = currentTopic.sections[currentSectionIndex - 1];
      setCurrentSceneIndex(prevSection.scenes.length - 1);
      setPlayerState('idle');
    }
  }, [currentTopic, currentSectionIndex, currentSceneIndex]);

  // Mark scene as completed
  const completeScene = useCallback((sceneId) => {
    if (!currentTopic) return;

    setProgress(prev => ({
      ...prev,
      [currentTopic.id]: {
        ...prev[currentTopic.id],
        scenes: {
          ...prev[currentTopic.id].scenes,
          [sceneId]: {
            completed: true,
            completedAt: Date.now()
          }
        }
      }
    }));

    emitEvent('scene_completed', { sceneId, topicId: currentTopic.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic]);

  // Handle quiz submission
  const submitQuizAnswer = useCallback((quizId, selectedChoices, correctChoiceIds) => {
    if (!currentTopic) return;

    const isCorrect = JSON.stringify(selectedChoices.sort()) === JSON.stringify(correctChoiceIds.sort());
    const currentScene = currentTopic.sections[currentSectionIndex].scenes[currentSceneIndex];
    const points = isCorrect ? (currentScene.points || 10) : 0;

    // Update score
    setProgress(prev => ({
      ...prev,
      [currentTopic.id]: {
        ...prev[currentTopic.id],
        score: (prev[currentTopic.id].score || 0) + points,
        scenes: {
          ...prev[currentTopic.id].scenes,
          [quizId]: {
            completed: true,
            correct: isCorrect,
            selectedChoices,
            completedAt: Date.now()
          }
        }
      }
    }));

    // Award aura points
    if (isCorrect) {
      setAuraPoints(prev => prev + points);
    }

    emitEvent('quiz_attempt', {
      quizId,
      topicId: currentTopic.id,
      correct: isCorrect,
      points,
      selectedChoices
    });

    return { isCorrect, points };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic, currentSectionIndex, currentSceneIndex]);

  // Sync events (placeholder - implement API call)
  const syncEvents = useCallback(async () => {
    if (eventQueue.length === 0) return;

    try {
      // TODO: Implement API call to sync events
      // await fetch('/api/player/event', { method: 'POST', body: JSON.stringify(eventQueue) });

      // Clear queue on success
      setEventQueue([]);
    } catch (error) {
      console.error('Failed to sync events:', error);
      reportError(error);
    }
  }, [eventQueue]);

  // Event emission
  const emitEvent = useCallback((eventType, data) => {
    const event = {
      type: eventType,
      timestamp: Date.now(),
      data
    };

    // Add to queue for sync
    setEventQueue(prev => [...prev, event]);

    // Try to sync if online
    if (navigator.onLine) {
      syncEvents();
    }
  }, [syncEvents]);

  // Notes management
  const saveNotes = useCallback((topicId, noteContent) => {
    setNotes(prev => ({
      ...prev,
      [topicId]: noteContent
    }));
  }, []);

  const getNotes = useCallback((topicId) => {
    return notes[topicId] || '';
  }, [notes]);

  // Get progress for a topic
  const getTopicProgress = useCallback((topicId) => {
    return progress[topicId] || null;
  }, [progress]);

  // Check if user has any course progress
  const hasAnyProgress = useCallback(() => {
    return Object.keys(progress).length > 0;
  }, [progress]);

  // Get current scene
  const getCurrentScene = useCallback(() => {
    if (!currentTopic) return null;
    const section = currentTopic.sections[currentSectionIndex];
    return section?.scenes[currentSceneIndex] || null;
  }, [currentTopic, currentSectionIndex, currentSceneIndex]);

  // Calculate topic completion percentage
  const getTopicCompletionPercentage = useCallback((topicId) => {
    const topicProgress = progress[topicId];
    if (!topicProgress) return 0;

    const topic = currentTopic?.id === topicId ? currentTopic : null;
    if (!topic) return 0;

    const totalScenes = topic.sections.reduce((sum, section) => sum + section.scenes.length, 0);
    const completedScenes = Object.keys(topicProgress.scenes || {}).length;

    return Math.round((completedScenes / totalScenes) * 100);
  }, [progress, currentTopic]);

  const value = {
    // State
    playerState,
    setPlayerState,
    currentTopic,
    currentSectionIndex,
    currentSceneIndex,
    typingSpeed,
    setTypingSpeed,
    isTyping,
    setIsTyping,
    autoAdvance,
    setAutoAdvance,
    reducedMotion,
    progress,
    auraPoints,

    // Methods
    loadTopic,
    goToScene,
    nextScene,
    previousScene,
    completeScene,
    submitQuizAnswer,
    emitEvent,
    saveNotes,
    getNotes,
    getTopicProgress,
    hasAnyProgress,
    getCurrentScene,
    getTopicCompletionPercentage,
    syncEvents
  };

  return (
    <CoursePlayerContext.Provider value={value}>
      {children}
    </CoursePlayerContext.Provider>
  );
};
