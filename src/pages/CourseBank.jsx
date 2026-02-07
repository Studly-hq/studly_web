import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowLeft,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubjectCard from "../components/courses/SubjectCard";
import CourseFilter from "../components/courses/CourseFilter";
import ProgressStats from "../components/courses/ProgressStats";
import { getCourses, getEnrolledCourses } from "../api/coursebank";
import { mapApiCourseToTopic } from "../utils/courseMapper";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { CourseCardSkeleton } from "../components/common/Skeleton";

const CourseBank = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // API state
  const [apiCourses, setApiCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth check - redirect to home and show auth modal if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, setShowAuthModal]);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const courses = await getCourses();
      const mappedCourses = (courses || []).map(mapApiCourseToTopic);
      setApiCourses(mappedCourses);
    } catch (err) {
      setError("Failed to fetch available courses. Please try again later.");
      console.error("Fetch Courses Error:", err);
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
      console.error("Fetch Enrolled Error:", err);
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

  // Filter topics
  const filteredTopics = useMemo(() => {
    let topics = apiCourses;

    // Filter by category
    if (activeCategory !== "All") {
      topics = topics.filter((t) => t.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      topics = topics.filter(
        (t) =>
          t.title?.toLowerCase().includes(query) ||
          t.subtitle?.toLowerCase().includes(query) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return topics;
  }, [activeCategory, searchQuery, apiCourses]);

  return (
    <div className="min-h-screen bg-reddit-bg text-white overflow-x-hidden">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-reddit-dark/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8 transition-all duration-300">
          <div className="py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all duration-300 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white/50 group-hover:text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">Course Bank</h1>
                <p className="text-base text-white/40 font-medium">Explore and enroll in interactive learning modules</p>
              </div>
            </div>

            <div className="relative mb-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search for a course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-white/10 transition-all duration-300 shadow-none text-lg"
              />
            </div>

            <CourseFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <ProgressStats courses={apiCourses} />

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Courses</h3>
              <p className="text-reddit-placeholder mb-6">{error}</p>
              <button
                onClick={fetchCourses}
                className="px-6 py-2 bg-reddit-orange hover:bg-reddit-orange/90 rounded-full font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

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

          {!isLoading && !error && filteredTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-reddit-cardHover flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-reddit-placeholder" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
              <p className="text-reddit-placeholder mb-6 max-w-md">
                {searchQuery
                  ? `We couldn't find any courses matching "${searchQuery}".`
                  : activeCategory !== "All"
                    ? `There are no courses currently available in the ${activeCategory} category.`
                    : "Check back soon for new courses and learning content!"}
              </p>
              {(searchQuery || activeCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="px-6 py-2 bg-reddit-orange hover:bg-reddit-orange/90 rounded-full font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseBank;
