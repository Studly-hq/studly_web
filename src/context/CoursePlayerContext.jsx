import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { completeLesson, completeSection, submitQuiz } from '../api/coursebank';


const CoursePlayerContext = createContext();

export const useCoursePlayer = () => {
  const context = useContext(CoursePlayerContext);
  if (!context) {
    throw new Error('useCoursePlayer must be used within CoursePlayerProvider');
  }
  return context;
};

export const CoursePlayerProvider = ({ children }) => {

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
    setProgress(prev => {
      // Build initial scenes progress from topic data
      const initialScenes = {};
      if (topic.sections) {
        topic.sections.forEach(section => {
          if (section.scenes) {
            section.scenes.forEach(scene => {
              if (scene.completed) {
                initialScenes[scene.id] = {
                  completed: true,
                  correct: scene.type === 'quiz' ? true : undefined, // If it's from API as completed, it's passed
                  completedAt: Date.now()
                };
              }
            });
          }
        });
      }

      if (!prev[topic.id]) {
        return {
          ...prev,
          [topic.id]: {
            sections: {},
            scenes: initialScenes,
            score: 0,
            startedAt: Date.now(),
            lastAccessedAt: Date.now()
          }
        };
      }

      // Update last accessed and merge any new API completions
      return {
        ...prev,
        [topic.id]: {
          ...prev[topic.id],
          scenes: {
            ...initialScenes, // API data is the source of truth for persistence
            ...prev[topic.id].scenes
          },
          lastAccessedAt: Date.now()
        }
      };
    });
  }, []);

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
      // Sync section completion with backend
      if (currentTopic.isApiCourse) {
        completeSection(currentSection.id).catch(err => console.error('Section sync failed:', err));
      }

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

  const completeScene = useCallback(async (sceneId, lessonId) => {
    if (!currentTopic) return;

    // Update local state first for responsiveness
    setProgress(prev => {
      const topicProgress = prev[currentTopic.id] || { scenes: {} };

      // Avoid redundant updates if already completed
      if (topicProgress.scenes[sceneId]?.completed) {
        return prev;
      }

      return {
        ...prev,
        [currentTopic.id]: {
          ...topicProgress,
          scenes: {
            ...topicProgress.scenes,
            [sceneId]: {
              completed: true,
              completedAt: Date.now()
            }
          }
        }
      };
    });

    emitEvent('scene_completed', { sceneId, topicId: currentTopic.id });

    // Sync with backend if it's an API lesson and we have a lessonId
    if (currentTopic.isApiCourse && lessonId) {
      try {
        await completeLesson(lessonId);
      } catch (error) {
        console.error('Failed to sync lesson completion:', error);
      }
    }
  }, [currentTopic, emitEvent]);

  // Handle quiz submission
  const submitQuizAnswer = useCallback(async (quizId, selectedChoices, questionId) => {
    if (!currentTopic) return { isCorrect: false, points: 0 };

    const currentScene = currentTopic.sections[currentSectionIndex].scenes[currentSceneIndex];
    if (!currentScene || currentScene.type !== 'quiz') return { isCorrect: false, points: 0 };

    // Centralized validation using scene metadata
    const normalize = (arr) => [...(arr || [])].map(id => String(id).toLowerCase()).sort();
    const correctIds = currentScene.correctAnswerIds || [];

    const isCorrect = JSON.stringify(normalize(selectedChoices)) === JSON.stringify(normalize(correctIds));
    const points = isCorrect ? (currentScene.points || 10) : 0;

    // Update progress state
    setProgress(prev => {
      const topicId = currentTopic.id;
      const topicProgress = prev[topicId] || { score: 0, scenes: {} };

      // CRITICAL: Only mark as completed if correct (quizzes can be retaken if failed)
      // If it was already completed (passed), keep it completed
      const wasCompleted = topicProgress.scenes[currentScene.id]?.completed;
      const isCompletedNow = isCorrect || wasCompleted;

      const shouldAddPoints = isCorrect && !wasCompleted;

      return {
        ...prev,
        [topicId]: {
          ...topicProgress,
          score: (topicProgress.score || 0) + (shouldAddPoints ? points : 0),
          scenes: {
            ...topicProgress.scenes,
            [currentScene.id]: {
              completed: isCompletedNow,
              correct: isCorrect,
              selectedChoices: selectedChoices, // Persist for review/persistence
              completedAt: isCompletedNow ? (topicProgress.scenes[currentScene.id]?.completedAt || Date.now()) : undefined
            }
          }
        }
      };
    });

    // Award aura points locally
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

    // Sync with backend if it's an API course and we have a quizId
    if (currentTopic.isApiCourse && quizId && questionId) {
      try {
        // Map answers to backend format: { question_id, selected_answer_id }
        const answers = selectedChoices.map(id => ({
          question_id: questionId,
          selected_answer_id: id
        }));
        await submitQuiz(quizId, answers);
      } catch (error) {
        console.error('Failed to sync quiz submission:', error);
      }
    }

    return { isCorrect, points };
  }, [currentTopic, currentSectionIndex, currentSceneIndex, emitEvent]);


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
