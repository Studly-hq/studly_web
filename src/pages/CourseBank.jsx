import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import CategoryCard from '../components/common/CategoryCard';
import { FiBook } from 'react-icons/fi';

const CourseBank = () => {
  const { subjects, categoryFilter, searchQuery, openTopicExplorer } = useApp();

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const matchesCategory = categoryFilter === 'All' || subject.category === categoryFilter;
      const matchesSearch = searchQuery === '' || 
        subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [subjects, categoryFilter, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header 
        title="Course Bank" 
        icon={<FiBook className="w-6 h-6" />}
        showSearch={true}
        showFilters={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredSubjects.length}</span> courses
          </p>
        </div>

        {filteredSubjects.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FiBook className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms or browse different categories
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredSubjects.map((subject) => (
              <CategoryCard
                key={subject.id}
                subject={subject}
                onViewTopics={openTopicExplorer}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CourseBank;