import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  BookOpen,
  Film,
  HelpCircle,
  LayoutList
} from 'lucide-react';
import { useCoursePlayer } from '../../../context/CoursePlayerContext';

const SectionNavigator = ({ topic, currentSectionIndex, currentSceneIndex, onSceneClick, isOpen, onToggle }) => {
  const { progress } = useCoursePlayer();
  const [expandedSections, setExpandedSections] = React.useState([0]);

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

  const getSceneIcon = (type, isCompleted, isCurrent) => {
    if (isCompleted) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (isCurrent) return <PlayCircle className="w-4 h-4 text-reddit-orange fill-reddit-orange/10" />;

    switch (type) {
      case 'quiz': return <HelpCircle className="w-4 h-4 text-reddit-textMuted" />;
      case 'media': return <Film className="w-4 h-4 text-reddit-textMuted" />;
      default: return <BookOpen className="w-4 h-4 text-reddit-textMuted" />;
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-20 left-4 z-50 w-10 h-10 bg-reddit-card border border-reddit-border rounded-full flex items-center justify-center hover:bg-reddit-cardHover transition-colors shadow-lg"
        aria-label="Toggle navigation"
      >
        <LayoutList className="w-5 h-5 text-white" />
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Navigator */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-80 bg-reddit-card border-r border-white/5
          overflow-y-auto custom-scrollbar z-50 transition-all duration-300 ease-in-out flex-shrink-0
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8 pl-2">
            <h2 className="text-xs font-bold text-reddit-textMuted uppercase tracking-wider mb-2">Course Module</h2>
            <p className="text-sm font-medium text-white/90">
              {currentSectionIndex + 1} of {topic.sections.length} Sections
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-6 flex-1">
            {topic.sections.map((section, sectionIndex) => {
              const isExpanded = expandedSections.includes(sectionIndex);
              const isCurrent = sectionIndex === currentSectionIndex;
              const sectionProgress = getSectionProgress(section);
              const isSectionCompleted = sectionProgress === 100;

              return (
                <div key={section.id} className="group relative">
                  {/* Vertical line connector */}
                  {sectionIndex !== topic.sections.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-0 w-[2px] bg-white/5 -z-10 group-last:hidden h-[calc(100%+24px)]" />
                  )}

                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-start gap-4 text-left group/btn"
                  >
                    <div className={`
                       w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border
                       ${isCurrent
                        ? 'bg-reddit-orange text-white border-reddit-orange shadow-[0_0_15px_rgba(255,69,0,0.3)]'
                        : isSectionCompleted
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-white/5 text-reddit-textMuted border-white/10 group-hover/btn:border-white/20'
                      }
                    `}>
                      {isSectionCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{sectionIndex + 1}</span>}
                    </div>

                    <div className="flex-1 pt-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-medium truncate transition-colors ${isCurrent ? 'text-white' : 'text-reddit-textMuted group-hover/btn:text-white'}`}>
                          {section.title}
                        </h3>
                        <ChevronDown className={`w-3 h-3 text-reddit-textMuted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isSectionCompleted ? 'bg-green-500' : 'bg-reddit-orange'}`}
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                      </div>
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
                        <div className="pl-[52px] pt-4 space-y-1">
                          {(() => {
                            let lessonCount = 0;
                            let quizCount = 0;
                            return section.scenes.map((scene, sceneIndex) => {
                              const isQuiz = scene.type === 'quiz';
                              if (isQuiz) {
                                quizCount++;
                              } else {
                                lessonCount++;
                              }

                              const displayLabel = isQuiz ? `Quiz ${quizCount}` : `Lesson ${lessonCount}`;

                              const isSceneCurrent = isCurrent && sceneIndex === currentSceneIndex;
                              const isCompleted = isSceneCompleted(scene.id);

                              return (
                                <button
                                  key={scene.id}
                                  onClick={() => onSceneClick(sectionIndex, sceneIndex)}
                                  className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 text-left border border-transparent
                                    ${isSceneCurrent
                                      ? 'bg-reddit-orange/10 text-white border-reddit-orange/20 font-medium'
                                      : 'text-reddit-textMuted hover:text-white hover:bg-white/5'
                                    }
                                  `}
                                >
                                  {getSceneIcon(scene.type, isCompleted, isSceneCurrent)}
                                  <span className="truncate">
                                    {displayLabel}
                                  </span>
                                </button>
                              );
                            });
                          })()}
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
