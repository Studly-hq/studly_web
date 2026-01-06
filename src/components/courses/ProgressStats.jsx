import React from 'react';
import { motion } from 'framer-motion';
import { useCoursePlayer } from '../../context/CoursePlayerContext';
import { courseBankTopics } from '../../data/courseBankData';
import * as Icons from 'lucide-react';

const ProgressStats = () => {
  const { progress, auraPoints } = useCoursePlayer();

  // Calculate stats
  const totalTopics = courseBankTopics.length;
  const startedTopics = Object.keys(progress).length;
  const completedTopics = Object.values(progress).filter(p => {
    // A topic is considered completed if all scenes are done
    const topic = courseBankTopics.find(t => t.id === Object.keys(progress).find(id => progress[id] === p));
    if (!topic) return false;

    const totalScenes = topic.sections.reduce((sum, sec) => sum + sec.scenes.length, 0);
    const completedScenes = Object.keys(p.scenes || {}).length;
    return completedScenes >= totalScenes;
  }).length;

  // Calculate total learning time (mock - in real app, track actual time)
  const totalMinutes = Object.values(progress).reduce((sum, p) => {
    const topic = courseBankTopics.find(t => t.id === Object.keys(progress).find(id => progress[id] === p));
    if (!topic) return sum;

    const completedScenes = Object.keys(p.scenes || {}).length;
    const totalScenes = topic.sections.reduce((s, sec) => s + sec.scenes.length, 0);
    const percentage = completedScenes / totalScenes;

    return sum + (topic.estimatedMinutes * percentage);
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  // Calculate average quiz accuracy (mock)
  const quizAttempts = Object.values(progress).reduce((sum, p) => {
    return sum + Object.values(p.scenes || {}).filter(s => s.correct !== undefined).length;
  }, 0);

  const correctQuizzes = Object.values(progress).reduce((sum, p) => {
    return sum + Object.values(p.scenes || {}).filter(s => s.correct === true).length;
  }, 0);

  const accuracy = quizAttempts > 0 ? Math.round((correctQuizzes / quizAttempts) * 100) : 0;

  const stats = [
    {
      icon: Icons.Trophy,
      label: 'Aura Points',
      value: auraPoints.toLocaleString(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      icon: Icons.BookCheck,
      label: 'Topics Completed',
      value: `${completedTopics}/${totalTopics}`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: Icons.Clock,
      label: 'Time Spent',
      value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Icons.Target,
      label: 'Quiz Accuracy',
      value: quizAttempts > 0 ? `${accuracy}%` : 'N/A',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  // Don't show if no progress
  if (startedTopics === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">{stat.label}</p>
              <p className={`text-lg font-bold text-white`}>{stat.value}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProgressStats;
