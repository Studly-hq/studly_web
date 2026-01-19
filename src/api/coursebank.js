import client from "./client";

/**
 * CourseBank API functions
 * Note: GET endpoints are not yet implemented on backend.
 * These functions are ready for when they are available.
 */

/**
 * Get all available courses
 * @returns {Promise<Array>} List of courses
 */
export const getCourses = async () => {
  try {
    const response = await client.get("/coursebank/courses");
    return response.data;
  } catch (error) {
    console.error("Get Courses Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a single course by ID with sections and lessons
 * @param {string|number} courseId - The course ID
 * @returns {Promise<Object>} Course details
 */
export const getCourse = async (courseId) => {
  try {
    const response = await client.get(`/coursebank/course/${courseId}/details`);
    return response.data;
  } catch (error) {
    console.error("Get Course Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Enroll the current user in a course
 */
export const enrollInCourse = async (courseId) => {
  try {
    const response = await client.post("/coursebank/enroll", {
      course_id: courseId,
    });
    return response.data;
  } catch (error) {
    console.error("Enroll in Course Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark a lesson as completed
 */
export const completeLesson = async (lessonId) => {
  try {
    const response = await client.post("/coursebank/lesson/complete", {
      lesson_id: lessonId,
    });
    return response.data;
  } catch (error) {
    console.error("Complete Lesson Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark a section as completed
 */
export const completeSection = async (sectionId) => {
  try {
    const response = await client.post("/coursebank/section/complete", {
      section_id: sectionId,
    });
    return response.data;
  } catch (error) {
    console.error("Complete Section Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Submit a quiz
 */
export const submitQuiz = async (quizId, answers) => {
  try {
    const response = await client.post("/coursebank/quiz/submit", {
      quiz_id: quizId,
      answers, // Expected format: [{question_id, answer_id}]
    });
    return response.data;
  } catch (error) {
    console.error("Submit Quiz Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get quiz details
 */
export const getQuizDetails = async (quizId) => {
  try {
    const response = await client.get(`/coursebank/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Get Quiz Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get enrolled courses
 */
export const getEnrolledCourses = async () => {
  try {
    const response = await client.get("/coursebank/enrolled");
    return response.data;
  } catch (error) {
    console.error("Get Enrolled Courses Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new course
 * @param {Object} courseData - The course data
 * @returns {Promise<Object>} Created course
 */
export const createCourse = async (courseData) => {
  try {
    const response = await client.post("/coursebank/course", courseData);
    return response.data;
  } catch (error) {
    console.error("Create Course Error:", error.response?.data || error.message);
    throw error;
  }
};
