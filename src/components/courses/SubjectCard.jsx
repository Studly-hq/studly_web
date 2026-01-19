import React, { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCoursePlayer } from "../../context/CoursePlayerContext";
// import { useStudyGram } from "../../context/StudyGramContext";
import * as Icons from "lucide-react";

const SubjectCard = ({
  topic,
  index = 0,
  isEnrolled = false,
  onEnrollmentChange,
}) => {
  const navigate = useNavigate();
  const { getTopicProgress } = useCoursePlayer();
  // const { isAuthenticated, setShowAuthModal } = useStudyGram(); // Unused for now as handleEnroll is unused

  const progress = getTopicProgress(topic.id);
  const progressPercentage = progress ? calculateProgress(topic, progress) : 0;
  const hasStarted = progressPercentage > 0;

  // Get icon component
  const IconComponent = Icons[topic.icon] || Icons.BookOpen;

  // Calculate total topics
  const totalTopics = topic.sections.length;

  const handleClick = () => {
    // Only navigate if enrolled or it's a mock course (no isApiCourse flag)
    if (isEnrolled || !topic.isApiCourse) {
      navigate(`/courses/${topic.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="group relative bg-white/5 hover:bg-white/[0.07] rounded-2xl p-4 md:p-6 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm border border-white/5 hover:border-white/10"
    >
      {/* Sleek hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-reddit-orange/0 via-reddit-orange/0 to-reddit-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
              ${hasStarted ? 'bg-reddit-orange text-white shadow-none' : 'bg-white/10 text-white group-hover:bg-reddit-orange group-hover:text-white'}
            `}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-reddit-orange transition-colors duration-300">
                {topic.title}
              </h3>
              <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                {topic.subtitle}
              </p>
            </div>
          </div>


        </div>

        {/* Info Row - Minimal */}
        <div className="flex items-center gap-6 text-sm text-white/40 mb-6 group-hover:text-white/60 transition-colors">
          <div className="flex items-center gap-1.5">
            <Icons.Layers className="w-4 h-4" />
            <span>{totalTopics} sections</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icons.Clock className="w-4 h-4" />
            <span>{topic.estimatedMinutes} min</span>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-auto">
          {hasStarted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50 font-medium">Progress</span>
                <span className="text-white font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-reddit-orange rounded-full"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2 border-t border-white/5 group-hover:border-white/10 transition-colors">
              <span className="text-xs font-medium text-white/30 group-hover:text-white/50 transition-colors">
                {topic.isApiCourse && !isEnrolled ? 'Tap to Enroll' : 'Start Learning'}
              </span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-reddit-orange group-hover:text-white transition-all duration-300 transform group-hover:translate-x-1">
                {topic.isApiCourse && !isEnrolled ? <Icons.Plus className="w-4 h-4" /> : <Icons.ArrowRight className="w-4 h-4" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to calculate progress
const calculateProgress = (topic, progressData) => {
  if (!progressData || !progressData.scenes) return 0;

  const totalScenes = topic.sections.reduce(
    (sum, section) => sum + section.scenes.length,
    0
  );
  const completedScenes = Object.keys(progressData.scenes).length;

  return Math.round((completedScenes / totalScenes) * 100);
};

export default memo(SubjectCard);
