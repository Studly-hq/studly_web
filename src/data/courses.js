export const courses = [
  {
    id: 'html-fundamentals',
    title: 'HTML Fundamentals',
    category: 'Coding',
    description: 'Learn the building blocks of the web. Master HTML tags, structure, and semantic markup.',
    illustration: 'html',
    duration: '5 sections',
    difficulty: 'Beginner',
    totalSections: 5,
    totalAuraPoints: 50,
    sections: [
      { id: 1, title: 'What is HTML?', auraPoints: 10 },
      { id: 2, title: 'HTML Tags', auraPoints: 10 },
      { id: 3, title: 'Semantic HTML', auraPoints: 10 },
      { id: 4, title: 'Forms and Inputs', auraPoints: 10 },
      { id: 5, title: 'Best Practices', auraPoints: 10 }
    ]
  },
  {
    id: 'css-basics',
    title: 'CSS Styling Basics',
    category: 'Coding',
    description: 'Style your websites with CSS. Learn selectors, properties, and responsive design fundamentals.',
    illustration: 'css',
    duration: '4 sections',
    difficulty: 'Beginner',
    totalSections: 4,
    totalAuraPoints: 40,
    sections: [
      { id: 1, title: 'Selectors & Properties', auraPoints: 10 },
      { id: 2, title: 'Box Model', auraPoints: 10 },
      { id: 3, title: 'Flexbox Layout', auraPoints: 10 },
      { id: 4, title: 'Responsive Design', auraPoints: 10 }
    ]
  },
  {
    id: 'javascript-essentials',
    title: 'JavaScript Essentials',
    category: 'Coding',
    description: 'Bring your websites to life with JavaScript. Master variables, functions, and DOM manipulation.',
    illustration: 'javascript',
    duration: '6 sections',
    difficulty: 'Intermediate',
    totalSections: 6,
    totalAuraPoints: 60,
    sections: [
      { id: 1, title: 'Variables & Data Types', auraPoints: 10 },
      { id: 2, title: 'Functions', auraPoints: 10 },
      { id: 3, title: 'Arrays & Objects', auraPoints: 10 },
      { id: 4, title: 'DOM Manipulation', auraPoints: 10 },
      { id: 5, title: 'Events', auraPoints: 10 },
      { id: 6, title: 'Async JavaScript', auraPoints: 10 }
    ]
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    category: 'Coding',
    description: 'Start your programming journey with Python. Learn syntax, data structures, and problem-solving.',
    illustration: 'python',
    duration: '7 sections',
    difficulty: 'Beginner',
    totalSections: 7,
    totalAuraPoints: 70,
    sections: [
      { id: 1, title: 'Python Basics', auraPoints: 10 },
      { id: 2, title: 'Control Flow', auraPoints: 10 },
      { id: 3, title: 'Functions', auraPoints: 10 },
      { id: 4, title: 'Lists & Tuples', auraPoints: 10 },
      { id: 5, title: 'Dictionaries', auraPoints: 10 },
      { id: 6, title: 'File Handling', auraPoints: 10 },
      { id: 7, title: 'OOP Basics', auraPoints: 10 }
    ]
  },
  {
    id: 'algebra-fundamentals',
    title: 'Algebra Fundamentals',
    category: 'Maths',
    description: 'Master algebraic concepts. Learn equations, functions, and problem-solving strategies.',
    illustration: 'math',
    duration: '5 sections',
    difficulty: 'Beginner',
    totalSections: 5,
    totalAuraPoints: 50,
    sections: [
      { id: 1, title: 'Linear Equations', auraPoints: 10 },
      { id: 2, title: 'Quadratic Equations', auraPoints: 10 },
      { id: 3, title: 'Functions', auraPoints: 10 },
      { id: 4, title: 'Graphing', auraPoints: 10 },
      { id: 5, title: 'Word Problems', auraPoints: 10 }
    ]
  },
  {
    id: 'calculus-intro',
    title: 'Introduction to Calculus',
    category: 'Maths',
    description: 'Explore the fundamentals of calculus. Learn limits, derivatives, and integrals.',
    illustration: 'math',
    duration: '6 sections',
    difficulty: 'Advanced',
    totalSections: 6,
    totalAuraPoints: 60,
    sections: [
      { id: 1, title: 'Limits', auraPoints: 10 },
      { id: 2, title: 'Derivatives', auraPoints: 10 },
      { id: 3, title: 'Applications of Derivatives', auraPoints: 10 },
      { id: 4, title: 'Integrals', auraPoints: 10 },
      { id: 5, title: 'Applications of Integrals', auraPoints: 10 },
      { id: 6, title: 'Techniques', auraPoints: 10 }
    ]
  }
];

// Helper function to get course by ID
export const getCourseById = (id) => {
  return courses.find(course => course.id === id);
};

// Helper function to get courses by category
export const getCoursesByCategory = (category) => {
  return courses.filter(course => course.category === category);
};