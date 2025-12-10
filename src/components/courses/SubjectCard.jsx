import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCoursePlayer } from '../../context/CoursePlayerContext';
import * as Icons from 'lucide-react';

const SubjectCard = ({ topic, index = 0 }) => {
  const navigate = useNavigate();
  const { getTopicProgress } = useCoursePlayer();

  const progress = getTopicProgress(topic.id);
  const progressPercentage = progress ? calculateProgress(topic, progress) : 0;
  const hasStarted = progressPercentage > 0;

  // Get icon component
  const IconComponent = Icons[topic.icon] || Icons.BookOpen;

  // Calculate total topics
  const totalTopics = topic.sections.length;

  // Difficulty badge colors
  const difficultyColors = {
    'Beginner': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleClick = () => {
    navigate(`/courses/${topic.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="bg-reddit-card border border-reddit-border rounded-lg overflow-hidden hover:bg-reddit-cardHover transition-all cursor-pointer group"
    >
      {/* Progress bar */}
  

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-reddit-orange/10 flex items-center justify-center group-hover:bg-reddit-orange/20 transition-colors">
              <IconComponent className="w-6 h-6 text-reddit-orange" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-reddit-orange transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm text-reddit-placeholder">
                {topic.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topic.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-full bg-reddit-cardHover text-reddit-placeholder border border-reddit-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-reddit-placeholder">
          <div className="flex items-center gap-1">
            <Icons.BookOpen className="w-4 h-4" />
            <span>{totalTopics} sections</span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Clock className="w-4 h-4" />
            <span>{topic.estimatedMinutes} min</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColors[topic.difficulty]}`}>
            {topic.difficulty}
          </div>
        </div>

        {/* Progress or CTA */}
        {hasStarted ? (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-reddit-placeholder">Progress</span>
              <span className="text-white font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-reddit-cardHover rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-reddit-orange rounded-full"
              />
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-reddit-orange hover:bg-reddit-orange/90 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2">
              <Icons.Play className="w-4 h-4" />
              Continue Learning
            </button>
          </div>
        ) : (
          <button className="w-full px-4 py-2 bg-reddit-cardHover hover:bg-reddit-orange/10 text-white border border-reddit-border hover:border-reddit-orange rounded-full font-medium transition-colors flex items-center justify-center gap-2 group/btn">
            <Icons.PlayCircle className="w-4 h-4 group-hover/btn:text-reddit-orange" />
            <span className="group-hover/btn:text-reddit-orange">Start Course</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Helper function to calculate progress
const calculateProgress = (topic, progressData) => {
  if (!progressData || !progressData.scenes) return 0;

  const totalScenes = topic.sections.reduce((sum, section) => sum + section.scenes.length, 0);
  const completedScenes = Object.keys(progressData.scenes).length;

  return Math.round((completedScenes / totalScenes) * 100);
};

export default SubjectCard;
