import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import CourseBank from './pages/CourseBank';
import TopicExplorer from './pages/TopicExplorer';
import LearningInterface from './pages/LearningInterface';
import './App.css';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="app">
      {currentView === 'course-bank' && <CourseBank />}
      {currentView === 'topic-explorer' && <TopicExplorer />}
      {currentView === 'learning' && <LearningInterface />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;