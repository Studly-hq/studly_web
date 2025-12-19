import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubjectCard from "../components/courses/SubjectCard";
import CourseFilter from "../components/courses/CourseFilter";
import ProgressStats from "../components/courses/ProgressStats";
import {
  courseBankTopics,
  getTopicsByCategory,
  searchTopics,
} from "../data/courseBankData";
import { getCourses, getEnrolledCourses } from "../api/coursebank";
import { useStudyGram } from "../context/StudyGramContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const CourseBank = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStudyGram();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // API state
  const [apiCourses, setApiCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const courses = await getCourses();
      // Map API response to match our frontend structure
      const mappedCourses = courses.map((course) => ({
        id: course.course_id || course.id,
        title: course.name || course.title,
        subtitle: course.description || "",
        category: "Tech", // Default category, adjust based on API
        difficulty: course.level || "Beginner",
        estimatedMinutes: course.duration_minutes || 30,
        icon: "BookOpen",
        tags: course.tags || [],
        sections: course.sections || [],
        imageUrl: course.image_url,
        isApiCourse: true, // Flag to distinguish from mock data
      }));
      setApiCourses(mappedCourses);
      setUsingFallback(false);
    } catch (err) {
      console.log("API not available, falling back to mock data:", err.message);
      setUsingFallback(true);
      // Don't set error - just use fallback silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch enrolled courses
  const fetchEnrolled = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const enrolled = await getEnrolledCourses();
      const ids = new Set(enrolled.map((c) => c.course_id || c.id));
      setEnrolledCourseIds(ids);
    } catch (err) {
      console.log("Could not fetch enrolled courses:", err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrolled();
    }
  }, [isAuthenticated, fetchEnrolled]);

  // Handle enrollment update from child components
  const handleEnrollmentChange = useCallback((courseId, enrolled) => {
    setEnrolledCourseIds((prev) => {
      const newSet = new Set(prev);
      if (enrolled) {
        newSet.add(courseId);
      } else {
        newSet.delete(courseId);
      }
      return newSet;
    });
  }, []);

  // Combine API courses with mock courses (if using fallback)
  const allCourses = useMemo(() => {
    if (usingFallback || apiCourses.length === 0) {
      return courseBankTopics;
    }
    return apiCourses;
  }, [apiCourses, usingFallback]);

  // Filter topics
  const filteredTopics = useMemo(() => {
    let topics = allCourses;

    // Filter by category
    if (activeCategory !== "All") {
      if (usingFallback) {
        topics = getTopicsByCategory(activeCategory);
      } else {
        topics = topics.filter((t) => t.category === activeCategory);
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      if (usingFallback) {
        topics = searchTopics(searchQuery);
      } else {
        const query = searchQuery.toLowerCase();
        topics = topics.filter(
          (t) =>
            t.title?.toLowerCase().includes(query) ||
            t.subtitle?.toLowerCase().includes(query) ||
            t.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }
    }

    return topics;
  }, [activeCategory, searchQuery, allCourses, usingFallback]);

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
                onClick={() => navigate("/")}
                className="w-8 h-8 rounded-full hover:bg-reddit-cardHover flex items-center justify-center transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Course Bank</h1>
                <p className="text-sm text-reddit-placeholder">
                  Learn through interactive, typed lessons
                  {usingFallback && (
                    <span className="ml-2 text-yellow-500">(Demo Mode)</span>
                  )}
                </p>
              </div>
              {usingFallback && (
                <button
                  onClick={fetchCourses}
                  className="p-2 rounded-full hover:bg-reddit-cardHover transition-colors"
                  title="Retry loading from server"
                >
                  <RefreshCw className="w-5 h-5 text-reddit-placeholder" />
                </button>
              )}
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <LoadingSpinner size={50} color="#FF4500" />
              <p className="text-reddit-placeholder mt-4">Loading courses...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Failed to load courses
              </h3>
              <p className="text-reddit-placeholder mb-4">{error}</p>
              <button
                onClick={fetchCourses}
                className="px-6 py-2 bg-reddit-orange hover:bg-reddit-orange/90 rounded-full font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Topics Grid */}
          {!isLoading && !error && filteredTopics.length > 0 && (
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
                  isEnrolled={enrolledCourseIds.has(topic.id)}
                  onEnrollmentChange={handleEnrollmentChange}
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredTopics.length === 0 && (
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
                  : `No courses available in ${activeCategory}. Try another category.`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
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
