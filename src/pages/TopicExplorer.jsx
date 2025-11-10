import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronRight, 
  FiLock, 
  FiClock, 
  FiAward, 
  FiBook, 
  FiPlay,
  FiCheck,
  FiBarChart2,
  FiArrowLeft,
  FiStar
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';

const TopicExplorer = () => {
  const { selectedSubject, returnToCourseBank, startLesson } = useApp();

  if (!selectedSubject) {
    return null;
  }

  const handleStartLesson = (topicId, lessonId) => {
    startLesson(selectedSubject.id, topicId, lessonId);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-gradient-to-r from-green-500 to-emerald-600',
      intermediate: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      advanced: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      expert: 'bg-gradient-to-r from-orange-500 to-red-600'
    };
    return colors[difficulty] || colors.beginner;
  };

  const getStatusIcon = (status, progress) => {
    if (status === 'locked') return <FiLock className="w-4 h-4" />;
    if (progress === 100) return <FiCheck className="w-4 h-4 text-green-600" />;
    if (progress > 0) return <FiPlay className="w-4 h-4 text-blue-600" />;
    return <FiStar className="w-4 h-4 text-slate-400" />;
  };

  const getTopicBorderColor = (status) => {
    return status === 'locked' ? 'border-slate-200' : 'border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header 
        title={selectedSubject.title}
        icon={<FiBook className="w-6 h-6" />}
        showSearch={false}
        showFilters={false}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <motion.div
          className="flex items-center gap-2 text-sm mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button
            onClick={returnToCourseBank}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Course Bank
          </button>
          <FiChevronRight className="text-slate-400" />
          <span className="text-slate-600 font-medium">{selectedSubject.title}</span>
        </motion.div>

        {/* Enhanced Hero Section */}
        <motion.div
          className="bg-white rounded-3xl p-8 mb-12 border-2 border-blue-200 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-start gap-6 flex-1">
              {/* Enhanced Subject Icon */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center border-2 border-blue-500/30">
                  <FiBook className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <FiCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-4xl font-bold text-slate-900">
                    {selectedSubject.title}
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {selectedSubject.category}
                  </span>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {selectedSubject.tagline}
                </p>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiBarChart2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedSubject.topicCount || selectedSubject.topics?.length} Topics</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiAward className="w-4 h-4" />
                    <span className="text-sm font-medium">{selectedSubject.totalXP || 0} Total XP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${selectedSubject.progress * 2.64} 264`}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-slate-900">
                    {selectedSubject.progress}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Topics List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-slate-900">Course Topics</h3>
            <span className="text-sm text-slate-500 font-medium">
              {selectedSubject.topics?.filter(t => t.status !== 'locked').length || 0} of {selectedSubject.topics?.length || 0} unlocked
            </span>
          </div>
          
          <AnimatePresence>
            {selectedSubject.topics && selectedSubject.topics.length > 0 ? (
              <div className="space-y-4">
                {selectedSubject.topics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    className={`group relative rounded-2xl p-6 transition-all duration-500 border-2 bg-white ${
                      topic.status === 'locked'
                        ? `${getTopicBorderColor('locked')} bg-slate-50`
                        : `${getTopicBorderColor()} hover:border-blue-300`
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -2 }}
                  >
                    {/* Connection Line */}
                    {index < selectedSubject.topics.length - 1 && (
                      <div className="absolute left-8 top-full w-0.5 h-4 bg-slate-300 -translate-y-2" />
                    )}
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Status Indicator */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
                          topic.status === 'locked' 
                            ? 'bg-slate-100 border-slate-300 text-slate-500' 
                            : topic.progress === 100
                            ? 'bg-green-50 border-green-300 text-green-600'
                            : topic.progress > 0
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'bg-slate-50 border-slate-300 text-slate-500'
                        }`}>
                          {getStatusIcon(topic.status, topic.progress)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className={`text-xl font-semibold ${
                              topic.status === 'locked' ? 'text-slate-500' : 'text-slate-900'
                            }`}>
                              {topic.title}
                            </h4>
                            {topic.difficulty && (
                              <span className={`px-3 py-1 text-xs font-medium ${getDifficultyColor(topic.difficulty)} text-white rounded-full capitalize`}>
                                {topic.difficulty}
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-3 ${
                            topic.status === 'locked' ? 'text-slate-500' : 'text-slate-600'
                          }`}>
                            {topic.description || 'Master this topic through interactive lessons and exercises.'}
                          </p>

                          {/* Enhanced Metadata */}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className={`flex items-center gap-2 ${
                              topic.status === 'locked' ? 'text-slate-500' : 'text-slate-600'
                            }`}>
                              <FiClock className="w-4 h-4" />
                              <span>{topic.duration}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${
                              topic.status === 'locked' ? 'text-slate-500' : 'text-slate-600'
                            }`}>
                              <FiAward className="w-4 h-4" />
                              <span className="font-medium">{topic.xp} XP</span>
                            </div>
                            {topic.lessons && (
                              <div className={`flex items-center gap-2 ${
                                topic.status === 'locked' ? 'text-slate-500' : 'text-slate-600'
                              }`}>
                                <FiBook className="w-4 h-4" />
                                <span>{topic.lessons.length} lessons</span>
                              </div>
                            )}
                          </div>

                          {/* Progress for unlocked topics */}
                          {topic.status !== 'locked' && topic.progress > 0 && (
                            <div className="mt-4 max-w-md">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-medium text-slate-900">{topic.progress}%</span>
                              </div>
                              <ProgressBar 
                                progress={topic.progress} 
                                height="h-2"
                                className="bg-slate-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {topic.status === 'locked' ? (
                          <Button variant="outline" disabled className="justify-center border-slate-300 text-slate-500">
                            <FiLock className="w-4 h-4 mr-2" />
                            Complete previous topics
                          </Button>
                        ) : topic.lessons && topic.lessons.length > 0 ? (
                          <>
                            {topic.lessons.slice(0, 2).map((lesson, lessonIndex) => (
                              <Button
                                key={lesson.id}
                                variant={lessonIndex === 0 && topic.progress === 0 ? "primary" : "secondary"}
                                onClick={() => handleStartLesson(topic.id, lesson.id)}
                                className="justify-center group/btn"
                                icon={
                                  topic.progress === 0 && lessonIndex === 0 ? 
                                  <FiPlay className="w-4 h-4" /> : undefined
                                }
                              >
                                {topic.progress === 0 && lessonIndex === 0 ? 'Start' : 'Continue'} {lesson.title}
                              </Button>
                            ))}
                            {topic.lessons.length > 2 && (
                              <Button variant="ghost" size="sm" className="text-slate-500">
                                +{topic.lessons.length - 2} more lessons
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button variant="outline" disabled className="justify-center border-slate-300 text-slate-500">
                            Content coming soon
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-20 bg-white rounded-3xl border-2 border-blue-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-300">
                  <FiBook className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No topics available yet</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  We're working hard to create amazing content for this course. Check back soon!
                </p>
                <Button 
                  onClick={returnToCourseBank}
                  variant="secondary"
                  icon={<FiArrowLeft className="w-4 h-4" />}
                >
                  Back to Course Bank
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default TopicExplorer;