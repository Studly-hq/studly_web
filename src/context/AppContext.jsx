import React, { createContext, useContext, useState } from 'react';
import { demoData } from '../data/demoData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(demoData.user);
  const [subjects, setSubjects] = useState(demoData.subjects);
  const [currentView, setCurrentView] = useState('course-bank'); // 'course-bank', 'topic-explorer', 'learning'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [checkpointStates, setCheckpointStates] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to topic explorer
  const openTopicExplorer = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    setSelectedSubject(subject);
    setCurrentView('topic-explorer');
  };

  // Navigate to learning interface
  const startLesson = (subjectId, topicId, lessonId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    const lesson = topic?.lessons.find(l => l.id === lessonId);
    
    if (lesson) {
      setSelectedSubject(subject);
      setSelectedTopic(topic);
      setSelectedLesson(lesson);
      setCurrentSectionIndex(0);
      setCurrentView('learning');
    }
  };

  // Navigate back to course bank
  const returnToCourseBank = () => {
    setCurrentView('course-bank');
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedLesson(null);
  };

  // Navigate back to topic explorer
  const returnToTopicExplorer = () => {
    setCurrentView('topic-explorer');
    setSelectedTopic(null);
    setSelectedLesson(null);
  };

  // Update lesson progress
  const updateLessonProgress = (sectionId, completed = true) => {
    setLessonProgress(prev => ({
      ...prev,
      [sectionId]: completed
    }));
  };

  // Save quiz answer
  const saveQuizAnswer = (questionId, answer, isCorrect) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: { answer, isCorrect, timestamp: Date.now() }
    }));
  };

  // Save checkpoint state
  const saveCheckpointState = (checkpointId, understood) => {
    setCheckpointStates(prev => ({
      ...prev,
      [checkpointId]: { understood, timestamp: Date.now() }
    }));
  };

  // Navigate to specific section
  const navigateToSection = (sectionIndex) => {
    if (selectedLesson && sectionIndex >= 0 && sectionIndex < selectedLesson.sections.length) {
      setCurrentSectionIndex(sectionIndex);
    }
  };

  // Get completed sections count
  const getCompletedSectionsCount = () => {
    if (!selectedLesson) return 0;
    return Object.keys(lessonProgress).filter(
      sectionId => lessonProgress[sectionId] === true
    ).length;
  };

  // Calculate topic progress
  const calculateTopicProgress = (subjectId, topicId) => {
    const subject = subjects.find(s => s.id === subjectId);
    const topic = subject?.topics.find(t => t.id === topicId);
    if (!topic || !topic.lessons || topic.lessons.length === 0) return 0;

    const totalSections = topic.lessons.reduce((sum, lesson) => sum + lesson.sections.length, 0);
    const completedSections = Object.values(lessonProgress).filter(Boolean).length;
    
    return Math.round((completedSections / totalSections) * 100) || 0;
  };

  const value = {
    user,
    subjects,
    currentView,
    selectedSubject,
    selectedTopic,
    selectedLesson,
    currentSectionIndex,
    lessonProgress,
    quizAnswers,
    checkpointStates,
    categoryFilter,
    searchQuery,
    setUser,
    setSubjects,
    setCategoryFilter,
    setSearchQuery,
    openTopicExplorer,
    startLesson,
    returnToCourseBank,
    returnToTopicExplorer,
    updateLessonProgress,
    saveQuizAnswer,
    saveCheckpointState,
    navigateToSection,
    getCompletedSectionsCount,
    calculateTopicProgress,
    setCurrentSectionIndex
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};