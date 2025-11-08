export const mockUser = {
  uid: 'user123',
  email: 'zion@studly.com',
  displayName: 'Zion',
  isPremium: false,
  streak: 3,
  auraPoints: 150,
  coursesStudiedThisWeek: 1,
  joinedDate: '2024-01-15',
  lastLogin: new Date().toISOString(),
  
  recentCourses: [
    {
      courseId: 'html-fundamentals',
      title: 'HTML Fundamentals',
      category: 'Coding',
      currentSection: 3,
      totalSections: 5,
      progress: 60,
      lastAccessed: new Date().toISOString(),
      illustration: 'html'
    },
    {
      courseId: 'css-basics',
      title: 'CSS Styling Basics',
      category: 'Coding',
      currentSection: 1,
      totalSections: 4,
      progress: 25,
      lastAccessed: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      illustration: 'css'
    },
    {
      courseId: 'javascript-essentials',
      title: 'JavaScript Essentials',
      category: 'Coding',
      currentSection: 5,
      totalSections: 6,
      progress: 83,
      lastAccessed: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      illustration: 'javascript'
    }
  ],
  
  completedCourses: ['intro-to-coding'],
  
  stats: {
    totalCoursesCompleted: 1,
    totalSectionsCompleted: 15,
    totalAuraPointsEarned: 150,
    longestStreak: 5,
    studyTimeMinutes: 240
  }
};