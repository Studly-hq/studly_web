import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';

const SectionNavigator = ({ topic, currentSectionIndex, currentSceneIndex, onSceneClick, isOpen, onToggle }) => {
  const { progress } = useCoursePlayer();
  const [expandedSections, setExpandedSections] = React.useState([0]); // First section expanded by default

  const topicProgress = progress[topic.id] || { scenes: {} };

  const isSceneCompleted = (sceneId) => {
    return topicProgress.scenes[sceneId]?.completed || false;
  };

  const getSectionProgress = (section) => {
    const totalScenes = section.scenes.length;
    const completedScenes = section.scenes.filter(scene => isSceneCompleted(scene.id)).length;
    return Math.round((completedScenes / totalScenes) * 100);
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections(prev =>
      prev.includes(sectionIndex)
        ? prev.filter(i => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-20 left-4 z-50 w-10 h-10 bg-reddit-card border border-reddit-border rounded-full flex items-center justify-center hover:bg-reddit-cardHover transition-colors"
        aria-label="Toggle navigation"
      >
        <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onToggle}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Navigator */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-80 bg-reddit-dark border-r border-reddit-border
          overflow-y-auto z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-1">Course Progress</h2>
            <p className="text-sm text-reddit-placeholder">
              Section {currentSectionIndex + 1} of {topic.sections.length}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {topic.sections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.includes(sectionIndex);
              const isCurrent = sectionIndex === currentSectionIndex;
              const sectionProgress = getSectionProgress(section);

              return (
                <div key={section.id} className="space-y-2">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-lg transition-colors
                      ${isCurrent
                        ? 'bg-reddit-orange/10 border border-reddit-orange/30'
                        : 'bg-reddit-card hover:bg-reddit-cardHover border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? '' : '-rotate-90'} ${isCurrent ? 'text-reddit-orange' : 'text-reddit-placeholder'}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate mb-1 ${isCurrent ? 'text-reddit-orange' : 'text-white'}`}>
                          {section.title}
                        </p>
                        <p className="text-xs text-reddit-placeholder">
                          {sectionProgress}% complete
                        </p>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center flex-shrink-0">
                      {sectionProgress === 100 ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <span className="text-xs text-reddit-placeholder font-medium">{sectionProgress}%</span>
                      )}
                    </div>
                  </button>

                  {/* Scenes */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 space-y-2 py-2">
                          {section.scenes.map((scene, sceneIndex) => {
                            const isSceneCurrent = isCurrent && sceneIndex === currentSceneIndex;
                            const isCompleted = isSceneCompleted(scene.id);

                            return (
                              <button
                                key={scene.id}
                                onClick={() => onSceneClick(sectionIndex, sceneIndex)}
                                className={`
                                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
                                  ${isSceneCurrent
                                    ? 'bg-reddit-orange/20 text-reddit-orange'
                                    : isCompleted
                                      ? 'text-white hover:bg-reddit-cardHover'
                                      : 'text-reddit-placeholder hover:bg-reddit-cardHover'
                                  }
                                `}
                                aria-current={isSceneCurrent ? 'step' : undefined}
                                aria-label={`${scene.type} scene ${sceneIndex + 1}`}
                              >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  ) : isSceneCurrent ? (
                                    <div className="w-5 h-5 rounded-full bg-reddit-orange flex items-center justify-center">
                                      <Circle className="w-3 h-3 text-white fill-white" />
                                    </div>
                                  ) : (
                                    <Circle className="w-5 h-5 text-reddit-border" />
                                  )}
                                </div>

                                {/* Label */}
                                <span className="text-sm truncate flex-1">
                                  {scene.type === 'quiz' ? 'Quiz' : scene.type === 'text' ? 'Lesson' : 'Media'} {sceneIndex + 1}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SectionNavigator;
