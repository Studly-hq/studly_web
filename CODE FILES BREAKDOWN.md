Detailed File Breakdown


1. Components Structure

src/components/layout/

AppLayout.jsx - Wrapper with sidebar + top bar (persistent)

Sidebar.jsx - Left navigation with reordering animation

TopBar.jsx - Greeting + profile icon

src/components/ui/ (Reusable UI)

Button.jsx - Styled button with animations

Card.jsx - Glassmorphism card wrapper

Modal.jsx - Modal with backdrop blur

ProgressBar.jsx - Animated progress bar

SkeletonLoader.jsx - Loading skeleton with shimmer


src/components/dashboard/
MotivationalBanner.jsx - "You're on a roll, Zion!"

StatsCard.jsx - Streak + Aura Points cards

ContinueLearning.jsx - Course cards section

CourseCard.jsx - Individual course card


src/components/coursebank/
CategoryTabs.jsx - Coding | Maths | Science tabs

CourseGrid.jsx - Grid of course cards

CourseOverviewModal.jsx - Course details modal


src/components/learning/
CourseOutline.jsx - Left panel with sections

LessonContent.jsx - Main typing animation area

QuizCard.jsx - Interactive quiz with glassmorphism

ComprehensionCheck.jsx - "Do you understand?" prompt

BobChat.jsx - AI chat panel (right side)

CompletionModal.jsx - Celebration with confetti


2. Pages
src/pages/Dashboard.jsx
Main hub after login - combines all dashboard components

src/pages/CourseBank.jsx
Browse all courses with category filters

src/pages/LearningInterface.jsx
Immersive study mode with typing animation

src/pages/Settings.jsx
User settings (future)


3. Hooks
src/hooks/useTypewriter.js
Custom hook for typing animation with pauses

src/hooks/useAuth.js
auth wrapper

src/hooks/useProgress.js
Track course progress and auto-save
