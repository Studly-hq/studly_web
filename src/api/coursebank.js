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
    console.log("Get Courses Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Courses Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a single course by ID
 * @param {number} courseId - The course ID
 * @returns {Promise<Object>} Course details with sections
 */
export const getCourse = async (courseId) => {
  try {
    const response = await client.get(`/coursebank/course/${courseId}`);
    console.log("Get Course Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Course Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Enroll the current user in a course
 * @param {number} courseId - The course ID to enroll in
 * @returns {Promise<Object>} Enrollment result
 */
export const enrollInCourse = async (courseId) => {
  try {
    const response = await client.post("/coursebank/enroll", {
      course_id: courseId,
    });
    console.log("Enroll in Course Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Enroll in Course Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get courses the current user is enrolled in
 * @returns {Promise<Array>} List of enrolled courses
 */
export const getEnrolledCourses = async () => {
  try {
    const response = await client.get("/coursebank/enrolled");
    console.log("Get Enrolled Courses Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get Enrolled Courses Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get enrollment status for a specific course
 * @param {number} courseId - The course ID
 * @returns {Promise<Object>} Enrollment status
 */
export const getEnrollmentStatus = async (courseId) => {
  try {
    const response = await client.get(`/coursebank/enrollment/${courseId}`);
    console.log("Get Enrollment Status Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Get Enrollment Status Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
