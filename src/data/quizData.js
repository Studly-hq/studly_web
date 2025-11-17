// Mock quiz data
export const mockQuizzes = [
  {
    id: "quiz-1",
    courseTitle: "Linear Algebra Basics",
    creator: "alex_smith",
    creatorId: "user-1",
    questions: [
      {
        id: "q1",
        question: "What is the determinant of a 2x2 identity matrix?",
        options: ["0", "1", "2", "-1"],
        answer_index: 1,
        explanation: "The determinant of an identity matrix is always 1, regardless of its size. For a 2x2 identity matrix [[1,0],[0,1]], det = (1×1) - (0×0) = 1."
      },
      {
        id: "q2",
        question: "Which of the following represents a linear transformation?",
        options: ["f(x) = x²", "f(x) = 2x + 3", "f(x) = 3x", "f(x) = |x|"],
        answer_index: 2,
        explanation: "A linear transformation must satisfy f(x+y) = f(x) + f(y) and f(cx) = cf(x). Only f(x) = 3x satisfies both properties."
      },
      {
        id: "q3",
        question: "What is the rank of a matrix?",
        options: [
          "The number of rows",
          "The number of columns",
          "The number of linearly independent rows or columns",
          "The determinant value"
        ],
        answer_index: 2,
        explanation: "The rank of a matrix is the dimension of the vector space spanned by its rows or columns, which equals the number of linearly independent rows or columns."
      }
    ],
    likes: [],
    likeCount: 0,
    savedBy: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "quiz-2",
    courseTitle: "React Hooks Fundamentals",
    creator: "sarah_codes",
    creatorId: "user-2",
    questions: [
      {
        id: "q4",
        question: "When does useEffect run by default?",
        options: [
          "Only on mount",
          "Only on unmount",
          "After every render",
          "Before every render"
        ],
        answer_index: 2,
        explanation: "By default, useEffect runs after every render (both mount and updates). You can control this behavior with the dependency array."
      },
      {
        id: "q5",
        question: "What does useState return?",
        options: [
          "A single value",
          "An array with state and setter",
          "An object with state and setter",
          "A callback function"
        ],
        answer_index: 1,
        explanation: "useState returns an array with exactly two elements: the current state value and a function to update it. We typically destructure this array."
      },
      {
        id: "q6",
        question: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        answer_index: 1,
        explanation: "useEffect is specifically designed for handling side effects like data fetching, subscriptions, or manually changing the DOM."
      }
    ],
    likes: ["user-1"],
    likeCount: 1,
    savedBy: ["user-1"],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "quiz-3",
    courseTitle: "World History 1900-1950",
    creator: "emma_studies",
    creatorId: "user-4",
    questions: [
      {
        id: "q7",
        question: "In which year did World War I begin?",
        options: ["1912", "1914", "1916", "1918"],
        answer_index: 1,
        explanation: "World War I began in 1914, triggered by the assassination of Archduke Franz Ferdinand of Austria in June 1914."
      },
      {
        id: "q8",
        question: "What was the Great Depression?",
        options: [
          "A war",
          "An economic crisis",
          "A political movement",
          "A scientific discovery"
        ],
        answer_index: 1,
        explanation: "The Great Depression was a severe worldwide economic crisis that lasted from 1929 to the late 1930s, characterized by widespread unemployment and poverty."
      },
      {
        id: "q9",
        question: "Which treaty ended World War I?",
        options: [
          "Treaty of Paris",
          "Treaty of Versailles",
          "Treaty of Vienna",
          "Treaty of Rome"
        ],
        answer_index: 1,
        explanation: "The Treaty of Versailles, signed in 1919, officially ended World War I and imposed harsh penalties on Germany."
      }
    ],
    likes: ["user-1", "user-2", "user-3"],
    likeCount: 3,
    savedBy: ["user-2"],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// Helper function to get quiz by ID
export const getQuizById = (quizId) => {
  return mockQuizzes.find(quiz => quiz.id === quizId);
};

// Helper function to get all quizzes
export const getAllQuizzes = () => {
  return mockQuizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Helper function to get user's quizzes
export const getQuizzesByUser = (userId) => {
  return mockQuizzes.filter(quiz => quiz.creatorId === userId);
};
