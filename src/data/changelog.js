export const changelogData = [
  {
    version: "v3.0.0",
    date: "15 November 2026",
    title: "Lucid v3 — Learning Paths, AI Tutor Chat & Session Sharing",
    description: "The biggest Lucid update yet. Completely rebuilt study experience with visual learning paths, conversational AI tutoring, session merging, and public sharing.",
    sections: [
      {
        title: "Learning Path System",
        items: [
          "Visual Learning Path Map: Interactive snake-pattern node layout showing sections and sub-sections with progress tracking.",
          "Node State Management: Five states — completed, current (with animated mascot), available, locked, and generating — with automatic reconciliation on load.",
          "Quiz Nodes: Special \"coin\" badges for section-level quiz assessments.",
          "Failed Generation Recovery: Inline retry buttons directly on failed nodes.",
          "Section Overview: Expandable outline view for each section."
        ]
      },
      {
        title: "Chat-Based AI Tutor Lessons",
        items: [
          "AI Tutor Chat Interface: Replaces step-by-step reader with conversational, streaming chat experience.",
          "Progressive Teaching Steps: Structured lesson flow — Orient → Explain → Example → Connect → Recap.",
          "Thinking Orbs Animation: Visual feedback during AI generation with smooth orb animations.",
          "Action Chips: Quick-response buttons for common learner actions (\"Continue\", \"Explain more\", \"Give example\").",
          "Inline Lesson Quizzes: Embedded checkpoint questions within the chat stream.",
          "End-of-Lesson Quiz: Summary assessment unlocking next sub-section."
        ]
      },
      {
        title: "Session Persistence & Sharing",
        items: [
          "Boss Session Merging: Automatic detection of similar past sessions with similarity scoring and one-click merge.",
          "Share Session Modal: Generate public, read-only links for any study session (path structure, content, and chat history).",
          "Continue Previous Session: Landing page surfaces most recent session for instant resume.",
          "Debounced Auto-save: Unified session state persisted across reloads without blocking UI."
        ]
      },
      {
        title: "Upload & Document Processing",
        items: [
          "Unified Upload Pipeline: Single continuous loader for extract → save note → generate path.",
          "Multi-format Support: PDF, DOC, DOCX, TXT, PPTX, images (JPG/PNG/WebP), and audio (MP3/WAV/M4A/OGG/WebM).",
          "Streaming Extraction: Real-time content preview as files process.",
          "Text & Voice Input: Direct topic entry or voice recording for audio notes.",
          "File Limits: Configurable per-session caps with Pro tier increases."
        ]
      }
    ]
  },
  {
    version: "v2.2.1",
    date: "3 July 2026",
    title: "Bug Fixes & AI Improvements",
    description: "This update addresses a few critical bugs in the subscription flow and introduces stability and feature improvements to the Lucid AI chat.",
    items: [
      "Fixed Manage Subscription modal to display your actual next billing date dynamically.",
      "Resolved an issue where your Pro subscription status wouldn't update instantly after payment.",
      "Fixed UI bugs and AI chat streaming issues in Lucid.",
      "Added an AI cancellation feature to Lucid, allowing you to stop the AI's response mid-generation.",
      "Resolved an AI message scope error in Lucid."
    ]
  },
  {
    version: "v2.2",
    date: "13 June 2026",
    title: "Study Modes Overhaul",
    description: "",
    sections: [
      {
        title: "Quick Study Mode",
        items: [
          "High-Yield Concept Extraction: Automatically generates flashcards with core concepts, practical examples, and specific insights (\"Memory Hooks\" and \"Exam Hints\").",
          "Adaptive Spaced Repetition: Queue system automatically adjusts based on self-reported difficulty (Easy, Hard, Blank).",
          "Smart Pacing: Built-in 45-second nudges to prevent getting stuck, and a mandatory 25-minute brain break to optimize memory consolidation.",
          "Session Review: Comprehensive completion statistics and a Weak Spots summary for targeted re-studying."
        ]
      },
      {
        title: "Detailed Study Mode",
        items: [
          "Progressive Document Analysis: Breaks documents into logical chunks and pages for focused reading.",
          "Background Prefetching: Seamless streaming for explanations and guidance.",
          "Interactive Elements: Features inline quizzes and dynamic action buttons directly within the chat stream.",
          "Adaptive Learning: Tracks learner profile, performance history, and adapts to study depth preferences."
        ]
      },
      {
        title: "Flashcard Mode",
        items: [
          "Customizable Decks: Select deck sizes of 10, 30, or 50 cards (50 cards reserved for Pro users).",
          "Study Styles: Choose between Sequential or Shuffled order.",
          "Self-Assessment Ratings: Users can rate their recall (\"Struggled\", \"Got it\", \"Easy\") to dynamic card repetition.",
          "Rich Explanations: Detailed markdown and LaTeX-rendered explanations on the back of each card.",
          "Progress Tracking: Session completion summary showing the ratio of mastered vs total cards."
        ]
      },
      {
        title: "Quiz Mode",
        items: [
          "Diverse Question Types: Includes Multiple Choice, True/False, Fill in the Blank, Subjective, Matching, and Mixed formats.",
          "Configurable Lengths: Choose quizzes of 10, 30, or 50 questions (50 questions reserved for Pro users).",
          "Pacing Settings: Standard untimed mode or a high-pressure Timed mode.",
          "Real-Time AI Grading: Intelligent evaluation for subjective and fill-in-the-blank responses, providing detailed, correct-answer feedback.",
          "Comprehensive Review: End-of-quiz score presentation and complete review session."
        ]
      }
    ]
  },
  {
    version: "v2.1",
    date: "23 March 2026",
    title: "Your entire study life, in one place",
    description:
      "No more tab-hopping. CUhub, Lucid, your social feed: everything now lives under one roof. Open Studly and everything you need is right there, exactly where you'd expect it.",
    items: [
      "Unified dashboard bringing together all your tools and content",
      "Lucid has been completely streamlined: cleaner interface, zero confusion",
      "Faster navigation between features with a redesigned sidebar",
      "Improved onboarding flow so new users feel at home instantly",
    ],
  },
  {
    version: "v2.0",
    date: "7 February 2026",
    title: "Meet the new Studly, redesigned from the ground up",
    description:
      "This is the biggest update we've ever shipped. Two major features that change how you study and connect with your classmates.",
    items: [
      "Studlygram is back: a social feed built exclusively for learners. Share notes, ask questions, and learn from your peers",
      "Share your post link anywhere and get interactions from outside Studly",
      "Introducing Lucid by Studly: select any part of your notes to get instant AI explanations",
      "Generate quizzes, flashcards, and find related YouTube videos from any section of your notes",
      "More features, more learning, more community",
    ],
  },
  {
    version: "v1.0",
    date: "18 September 2025",
    title: "Introducing Studly, your AI-powered study companion",
    description:
      "The first version of Studly is here. We built it for students who want to study smarter, stay consistent, and actually enjoy the process. Here's what you get from day one.",
    items: [
      "Practice Questions: Studly reads your notes and generates multiple-choice quizzes so you can test yourself on what matters",
      "Studygram: a social feed like Instagram, but exclusively for study content. Share your progress and learn together",
      "Note Summary: get clean, concise summaries of your notes so you can review key points without rereading everything",
      "Studly Streaks: log in daily and take a practice test to build consistency and keep your streak alive",
      "Leaderboard: see how you stack up against other students based on quiz scores and activity",
    ],
  },
];
