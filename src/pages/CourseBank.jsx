import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubjectCard from '../components/courses/SubjectCard';
import CourseFilter from '../components/courses/CourseFilter';
import ProgressStats from '../components/courses/ProgressStats';
import { courseBankTopics, getTopicsByCategory, searchTopics } from '../data/courseBankData';

const CourseBank = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter topics
  const filteredTopics = useMemo(() => {
    let topics = courseBankTopics;

    // Filter by category
    if (activeCategory !== 'All') {
      topics = getTopicsByCategory(activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      topics = searchTopics(searchQuery);
    }

    return topics;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-reddit-dark text-white overflow-x-hidden">
      {/* Full width, no sidebars */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-reddit-dark/95 backdrop-blur-md border-b border-reddit-border px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              {/* Back button and title */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-8 h-8 rounded-full hover:bg-reddit-cardHover flex items-center justify-center transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold">Course Bank</h1>
                  <p className="text-sm text-reddit-placeholder">
                    Learn through interactive, typed lessons
                  </p>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-reddit-placeholder" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-reddit-cardHover border border-reddit-border rounded-full text-white placeholder-reddit-placeholder focus:outline-none focus:border-reddit-orange transition-colors"
                />
              </div>

              {/* Category filter */}
              <CourseFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Progress Stats */}
            <ProgressStats />

            {/* Topics Grid */}
            {filteredTopics.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {filteredTopics.map((topic, index) => (
                  <SubjectCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              // Empty state
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-reddit-cardHover flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-reddit-placeholder" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-reddit-placeholder mb-6 max-w-md">
                  {searchQuery
                    ? `No courses match "${searchQuery}". Try a different search term.`
                    : `No courses available in ${activeCategory}. Try another category.`
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-6 py-2 bg-reddit-orange hover:bg-reddit-orange/90 rounded-full font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

           
          
          </div>

        </main>
    </div>
  );
};

export default CourseBank;
