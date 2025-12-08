// Mock data for StudyGram feature

// Mock Users
export const mockUsers = {
  currentUser: {
    id: 'user-1',
    username: 'alex_smith',
    displayName: 'Alex Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'CS student | Love algorithms & coffee ☕',
    auraPoints: 2450,
    streak: 7,
    joinedDate: '2024-01-15',
    following: 156,
    followers: 342,
    savedPosts: []
  },
  users: [
    {
      id: 'user-2',
      username: 'sarah_codes',
      displayName: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Full-stack developer | React enthusiast',
      auraPoints: 3200,
      streak: 12,
      joinedDate: '2023-11-20',
      following: 203,
      followers: 521
    },
    {
      id: 'user-3',
      username: 'mike_learns',
      displayName: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'Learning something new every day',
      auraPoints: 1850,
      streak: 5,
      joinedDate: '2024-03-10',
      following: 89,
      followers: 167
    },
    {
      id: 'user-4',
      username: 'emma_studies',
      displayName: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Math major | Calculus lover 📐',
      auraPoints: 4100,
      streak: 23,
      joinedDate: '2023-09-05',
      following: 312,
      followers: 892
    },
    {
      id: 'user-5',
      username: 'james_designs',
      displayName: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=14',
      bio: 'UI/UX Designer | Making learning beautiful',
      auraPoints: 2900,
      streak: 8,
      joinedDate: '2024-02-28',
      following: 178,
      followers: 445
    }
  ]
};

// Mock Posts (text-only, single image, carousel)
export const mockPosts = [
  {
    id: 'post-1',
    type: 'text',
    userId: 'user-2',
    content: 'Just discovered this amazing algorithm for finding the shortest path in a graph! Dijkstra\'s algorithm is mind-blowing. The way it systematically explores nodes while keeping track of the shortest distance is pure genius. 🤯\n\nAnyone else working on graph theory?',
    timestamp: new Date('2024-11-15T10:30:00').toISOString(),
    likes: ['user-1', 'user-3', 'user-4', 'user-5'],
    likeCount: 4,
    commentCount: 3,
    bookmarkedBy: ['user-1'],
    tags: ['algorithms', 'graphs', 'computer-science']
  },
  {
    id: 'post-2',
    type: 'single-image',
    userId: 'user-4',
    content: 'My calculus notes are getting prettier every day! 📚✨ Organized my derivatives cheat sheet - hope this helps someone studying for finals!',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
        alt: 'Calculus notes on derivatives'
      }
    ],
    timestamp: new Date('2024-11-15T09:15:00').toISOString(),
    likes: ['user-1', 'user-2', 'user-5'],
    likeCount: 3,
    commentCount: 5,
    bookmarkedBy: ['user-1', 'user-3'],
    tags: ['calculus', 'math', 'study-notes']
  },
  {
    id: 'post-3',
    type: 'carousel',
    userId: 'user-5',
    content: 'UI Design principles I wish I knew earlier! Swipe through for tips on color theory, typography, and layout. 🎨\n\n#DesignTips #UIUXDesign',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        alt: 'Color theory principles'
      },
      {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        alt: 'Typography guide'
      },
      {
        url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=600&fit=crop',
        alt: 'Layout principles'
      }
    ],
    timestamp: new Date('2024-11-15T08:45:00').toISOString(),
    likes: ['user-1', 'user-2', 'user-3', 'user-4'],
    likeCount: 4,
    commentCount: 2,
    bookmarkedBy: ['user-1', 'user-2', 'user-4'],
    tags: ['design', 'ui-ux', 'visual-design']
  },
  {
    id: 'post-4',
    type: 'text',
    userId: 'user-3',
    content: 'Hot take: Writing code without comments is like writing a book without punctuation. Sure, technically possible, but why make life harder?\n\nWhat\'s your stance on code comments? 💭',
    timestamp: new Date('2024-11-14T16:20:00').toISOString(),
    likes: ['user-2', 'user-5'],
    likeCount: 2,
    commentCount: 8,
    bookmarkedBy: [],
    tags: ['programming', 'best-practices', 'discussion']
  },
  {
    id: 'post-5',
    type: 'single-image',
    userId: 'user-1',
    content: 'Finally understood recursion! This diagram made everything click. The base case is like the foundation of a building - without it, everything collapses. 🏗️',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800&h=600&fit=crop',
        alt: 'Recursion diagram'
      }
    ],
    timestamp: new Date('2024-11-14T14:10:00').toISOString(),
    likes: ['user-2', 'user-3', 'user-4'],
    likeCount: 3,
    commentCount: 4,
    bookmarkedBy: ['user-3', 'user-5'],
    tags: ['recursion', 'algorithms', 'programming']
  },
  {
    id: 'post-6',
    type: 'carousel',
    userId: 'user-2',
    content: 'My React study journey - Week 3! 🚀 From hooks to context API. These visual notes really help me remember the concepts better.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
        alt: 'React hooks notes'
      },
      {
        url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop',
        alt: 'Context API diagram'
      }
    ],
    timestamp: new Date('2024-11-14T11:30:00').toISOString(),
    likes: ['user-1', 'user-3', 'user-5'],
    likeCount: 3,
    commentCount: 6,
    bookmarkedBy: ['user-1', 'user-4'],
    tags: ['react', 'javascript', 'web-development']
  },
  {
    id: 'post-7',
    type: 'text',
    userId: 'user-4',
    content: 'Study tip: The Feynman Technique is a game-changer! 🧠\n\n1. Learn the concept\n2. Teach it to a 12-year-old (explain simply)\n3. Identify gaps in your understanding\n4. Review and simplify\n\nI\'ve used this for every exam this semester and my grades have never been better!',
    timestamp: new Date('2024-11-13T19:45:00').toISOString(),
    likes: ['user-1', 'user-2', 'user-3', 'user-5'],
    likeCount: 4,
    commentCount: 7,
    bookmarkedBy: ['user-1', 'user-2', 'user-3'],
    tags: ['study-tips', 'learning', 'productivity']
  },
  {
    id: 'post-8',
    type: 'single-image',
    userId: 'user-3',
    content: 'My workspace setup for deep study sessions! Minimal distractions, maximum focus. What does your study space look like? 🖥️📚',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
        alt: 'Clean minimal study desk setup'
      }
    ],
    timestamp: new Date('2024-11-13T15:20:00').toISOString(),
    likes: ['user-1', 'user-5'],
    likeCount: 2,
    commentCount: 3,
    bookmarkedBy: ['user-5'],
    tags: ['study-space', 'productivity', 'workspace']
  }
];

// Mock Comments with Threading (parent + replies)
export const mockComments = {
  'post-1': [
    {
      id: 'comment-1',
      postId: 'post-1',
      userId: 'user-1',
      content: 'This is so cool! I just learned about this in my algorithms class. The priority queue implementation is what really makes it efficient.',
      timestamp: new Date('2024-11-15T10:45:00').toISOString(),
      likes: ['user-2', 'user-4'],
      likeCount: 2,
      replies: [
        {
          id: 'comment-1-reply-1',
          postId: 'post-1',
          parentId: 'comment-1',
          userId: 'user-2',
          content: 'Exactly! Using a min-heap makes it O(E log V) instead of O(V²). Super elegant solution.',
          timestamp: new Date('2024-11-15T11:00:00').toISOString(),
          likes: ['user-1'],
          likeCount: 1
        }
      ]
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      userId: 'user-3',
      content: 'Can someone explain when to use Dijkstra vs Bellman-Ford? Still confused about the difference.',
      timestamp: new Date('2024-11-15T11:15:00').toISOString(),
      likes: [],
      likeCount: 0,
      replies: [
        {
          id: 'comment-2-reply-1',
          postId: 'post-1',
          parentId: 'comment-2',
          userId: 'user-4',
          content: 'Dijkstra works for non-negative weights only. Bellman-Ford can handle negative weights but is slower. Use Dijkstra when you can!',
          timestamp: new Date('2024-11-15T11:30:00').toISOString(),
          likes: ['user-3', 'user-1'],
          likeCount: 2
        }
      ]
    },
    {
      id: 'comment-3',
      postId: 'post-1',
      userId: 'user-5',
      content: 'Graph algorithms are beautiful when visualized! Have you tried using any graph visualization tools?',
      timestamp: new Date('2024-11-15T12:00:00').toISOString(),
      likes: ['user-2'],
      likeCount: 1,
      replies: []
    }
  ],
  'post-2': [
    {
      id: 'comment-4',
      postId: 'post-2',
      userId: 'user-1',
      content: 'These notes are gorgeous! What app do you use for handwriting?',
      timestamp: new Date('2024-11-15T09:30:00').toISOString(),
      likes: ['user-4', 'user-5'],
      likeCount: 2,
      replies: [
        {
          id: 'comment-4-reply-1',
          postId: 'post-2',
          parentId: 'comment-4',
          userId: 'user-4',
          content: 'I use GoodNotes on iPad! The handwriting recognition is amazing.',
          timestamp: new Date('2024-11-15T09:45:00').toISOString(),
          likes: ['user-1', 'user-2'],
          likeCount: 2
        }
      ]
    },
    {
      id: 'comment-5',
      postId: 'post-2',
      userId: 'user-2',
      content: 'The chain rule section is *chef\'s kiss* 👨‍🍳',
      timestamp: new Date('2024-11-15T10:00:00').toISOString(),
      likes: ['user-4'],
      likeCount: 1,
      replies: []
    },
    {
      id: 'comment-6',
      postId: 'post-2',
      userId: 'user-3',
      content: 'Could you share the full PDF? This would be super helpful for my midterm next week!',
      timestamp: new Date('2024-11-15T10:15:00').toISOString(),
      likes: ['user-5'],
      likeCount: 1,
      replies: []
    },
    {
      id: 'comment-7',
      postId: 'post-2',
      userId: 'user-5',
      content: 'I need to step up my note-taking game! This is inspiration 💯',
      timestamp: new Date('2024-11-15T10:30:00').toISOString(),
      likes: [],
      likeCount: 0,
      replies: []
    }
  ],
  'post-3': [
    {
      id: 'comment-8',
      postId: 'post-3',
      userId: 'user-1',
      content: 'Slide 2 about typography hierarchy is exactly what I needed! Thank you 🙏',
      timestamp: new Date('2024-11-15T09:00:00').toISOString(),
      likes: ['user-5', 'user-2'],
      likeCount: 2,
      replies: []
    },
    {
      id: 'comment-9',
      postId: 'post-3',
      userId: 'user-3',
      content: 'The 60-30-10 color rule changed my designs completely. Great tip!',
      timestamp: new Date('2024-11-15T09:30:00').toISOString(),
      likes: ['user-5'],
      likeCount: 1,
      replies: []
    }
  ],
  'post-4': [
    {
      id: 'comment-10',
      postId: 'post-4',
      userId: 'user-2',
      content: 'I think self-documenting code is better than comments. If your code needs comments to be understood, it\'s too complex.',
      timestamp: new Date('2024-11-14T16:35:00').toISOString(),
      likes: ['user-5'],
      likeCount: 1,
      replies: [
        {
          id: 'comment-10-reply-1',
          postId: 'post-4',
          parentId: 'comment-10',
          userId: 'user-1',
          content: 'Disagree! Sometimes WHY you did something is more important than WHAT you did. Comments explain intent.',
          timestamp: new Date('2024-11-14T16:50:00').toISOString(),
          likes: ['user-3', 'user-4'],
          likeCount: 2
        },
        {
          id: 'comment-10-reply-2',
          postId: 'post-4',
          parentId: 'comment-10',
          userId: 'user-4',
          content: 'Both approaches have merit! Self-documenting code + strategic comments = perfection',
          timestamp: new Date('2024-11-14T17:00:00').toISOString(),
          likes: ['user-1', 'user-2', 'user-3'],
          likeCount: 3
        }
      ]
    },
    {
      id: 'comment-11',
      postId: 'post-4',
      userId: 'user-5',
      content: 'Comments are essential for complex algorithms and business logic. Future you will thank present you!',
      timestamp: new Date('2024-11-14T17:15:00').toISOString(),
      likes: ['user-1', 'user-3'],
      likeCount: 2,
      replies: []
    }
  ],
  'post-5': [
    {
      id: 'comment-12',
      postId: 'post-5',
      userId: 'user-2',
      content: 'Recursion: "To understand recursion, you must first understand recursion" 😄',
      timestamp: new Date('2024-11-14T14:25:00').toISOString(),
      likes: ['user-1', 'user-3', 'user-4', 'user-5'],
      likeCount: 4,
      replies: [
        {
          id: 'comment-12-reply-1',
          postId: 'post-5',
          parentId: 'comment-12',
          userId: 'user-1',
          content: 'Haha classic! But seriously, once it clicks, it clicks HARD.',
          timestamp: new Date('2024-11-14T14:40:00').toISOString(),
          likes: ['user-2'],
          likeCount: 1
        }
      ]
    },
    {
      id: 'comment-13',
      postId: 'post-5',
      userId: 'user-4',
      content: 'The visual diagram helps SO much. I\'m a visual learner and this is perfect!',
      timestamp: new Date('2024-11-14T14:50:00').toISOString(),
      likes: ['user-1'],
      likeCount: 1,
      replies: []
    }
  ],
  'post-6': [
    {
      id: 'comment-14',
      postId: 'post-6',
      userId: 'user-1',
      content: 'useContext was confusing at first but your notes make it so clear!',
      timestamp: new Date('2024-11-14T11:45:00').toISOString(),
      likes: ['user-2', 'user-3'],
      likeCount: 2,
      replies: []
    },
    {
      id: 'comment-15',
      postId: 'post-6',
      userId: 'user-4',
      content: 'Are you planning to cover useReducer next? That one always trips me up.',
      timestamp: new Date('2024-11-14T12:00:00').toISOString(),
      likes: ['user-3'],
      likeCount: 1,
      replies: [
        {
          id: 'comment-15-reply-1',
          postId: 'post-6',
          parentId: 'comment-15',
          userId: 'user-2',
          content: 'Yes! useReducer is next week. It\'s basically useState on steroids 💪',
          timestamp: new Date('2024-11-14T12:15:00').toISOString(),
          likes: ['user-4', 'user-1'],
          likeCount: 2
        }
      ]
    },
    {
      id: 'comment-16',
      postId: 'post-6',
      userId: 'user-5',
      content: 'Following your React journey! This is motivating me to document mine too.',
      timestamp: new Date('2024-11-14T12:30:00').toISOString(),
      likes: ['user-2'],
      likeCount: 1,
      replies: []
    }
  ],
  'post-7': [
    {
      id: 'comment-17',
      postId: 'post-7',
      userId: 'user-1',
      content: 'The Feynman Technique is GOATED! Used it for linear algebra and finally understood eigenvectors.',
      timestamp: new Date('2024-11-13T20:00:00').toISOString(),
      likes: ['user-4', 'user-2'],
      likeCount: 2,
      replies: []
    },
    {
      id: 'comment-18',
      postId: 'post-7',
      userId: 'user-3',
      content: 'Step 2 is where the magic happens. If you can\'t explain it simply, you don\'t understand it well enough.',
      timestamp: new Date('2024-11-13T20:15:00').toISOString(),
      likes: ['user-4', 'user-5'],
      likeCount: 2,
      replies: []
    },
    {
      id: 'comment-19',
      postId: 'post-7',
      userId: 'user-2',
      content: 'I teach my concepts to my rubber duck 🦆 Works every time!',
      timestamp: new Date('2024-11-13T20:30:00').toISOString(),
      likes: ['user-1', 'user-3', 'user-5'],
      likeCount: 3,
      replies: [
        {
          id: 'comment-19-reply-1',
          postId: 'post-7',
          parentId: 'comment-19',
          userId: 'user-5',
          content: 'Rubber duck debugging for learning! I love it 😂',
          timestamp: new Date('2024-11-13T20:45:00').toISOString(),
          likes: ['user-2'],
          likeCount: 1
        }
      ]
    }
  ],
  'post-8': [
    {
      id: 'comment-20',
      postId: 'post-8',
      userId: 'user-4',
      content: 'So clean! My desk is chaos compared to this 😅',
      timestamp: new Date('2024-11-13T15:35:00').toISOString(),
      likes: ['user-3'],
      likeCount: 1,
      replies: []
    },
    {
      id: 'comment-21',
      postId: 'post-8',
      userId: 'user-1',
      content: 'The lighting is perfect! Good lighting = better focus in my experience.',
      timestamp: new Date('2024-11-13T15:50:00').toISOString(),
      likes: ['user-3', 'user-5'],
      likeCount: 2,
      replies: []
    }
  ]
};

// Helper function to get user by ID
export const getUserById = (userId) => {
  if (userId === mockUsers.currentUser.id) {
    return mockUsers.currentUser;
  }
  return mockUsers.users.find(user => user.id === userId);
};

// Helper function to get post with user data
export const getPostWithUserData = (postId) => {
  const post = mockPosts.find(p => p.id === postId);
  if (!post) return null;

  return {
    ...post,
    user: getUserById(post.userId)
  };
};

// Helper function to get comments for a post
export const getCommentsForPost = (postId) => {
  return mockComments[postId] || [];
};

// Helper function to get all posts with user data (for feed)
export const getFeedPosts = () => {
  return mockPosts
    .map(post => ({
      ...post,
      user: getUserById(post.userId)
    }))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};
