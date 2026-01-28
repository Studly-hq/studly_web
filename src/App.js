import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StudyGramProvider } from "./context/StudyGramContext";
import { CoursePlayerProvider } from "./context/CoursePlayerContext";
import { CelebrationProvider } from "./context/CelebrationContext";
import TopLoadingBar from "./components/common/TopLoadingBar";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UIProvider } from "./context/UIContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FeedProvider } from "./context/FeedContext";
import ComingSoon from "./components/common/ComingSoon";
import LoadingGate from "./components/common/LoadingGate";

import LeftSidebar from "./components/layout/LeftSidebar";
import RightSidebar from "./components/layout/RightSidebar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import AuthModal from "./components/modals/AuthModal";
import CreatePostModal from "./components/modals/CreatePostModal";
import CelebrationModal from "./components/modals/CelebrationModal";
import CommentSection from "./components/comments/CommentSection";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import "./App.css";

// Pages (Lazy loaded for better performance)
const Home = lazy(() => import("./pages/Home"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
// PostsPage removed - /posts now redirects to /feed
const Explore = lazy(() => import("./pages/Explore"));
const SavedPosts = lazy(() => import("./pages/SavedPosts"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Settings = lazy(() => import("./pages/Settings"));
const UploadNotes = lazy(() => import("./pages/UploadNotes"));
const QuizFeed = lazy(() => import("./pages/QuizFeed"));
const CourseBank = lazy(() => import("./pages/CourseBank"));
const TopicPlayer = lazy(() => import("./pages/TopicPlayer"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const CourseAdmin = lazy(() => import("./pages/CourseAdmin"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));


// Legal Pages (Lazy loaded)
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Accessibility = lazy(() => import("./pages/legal/Accessibility"));

function AppContent() {
  const { isAuthLoading } = useAuth();

  return (
    <LoadingGate isLoading={isAuthLoading}>
      <Router>
        <Routes>
          {/* Course Bank routes (full screen, no header/sidebars) */}
          <Route path="/courses" element={<Suspense fallback={null}><CourseBank /></Suspense>} />
          <Route path="/courses/:topicId" element={<Suspense fallback={null}><TopicPlayer /></Suspense>} />
          <Route path="/courses/admin" element={<Suspense fallback={null}><CourseAdmin /></Suspense>} />

          {/* Main app routes (with sidebars) */}
          <Route
            path="/*"
            element={
              <div className="flex bg-reddit-bg h-screen overflow-hidden">
                <div className="flex w-full max-w-[1440px] mx-auto relative relative-sidebar-container h-full">
                  {/* Left Sidebar */}
                  <div className="flex-shrink-0">
                    <LeftSidebar />
                  </div>

                  {/* Center Content - Routes */}
                  <main className="flex-1 min-w-0 border-x border-reddit-border pb-20 xl:pb-0 overflow-y-auto min-h-0 h-full">
                    <Suspense fallback={
                      <div className="max-w-[640px] mx-auto px-4 py-5">
                        <div className="bg-reddit-card rounded border border-reddit-border p-4 animate-pulse mb-3">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-reddit-cardHover rounded-full" />
                            <div className="flex-1">
                              <div className="w-24 h-3 bg-reddit-cardHover rounded mb-2" />
                              <div className="w-16 h-2 bg-reddit-cardHover rounded" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-reddit-cardHover rounded" />
                            <div className="h-3 bg-reddit-cardHover rounded w-[90%]" />
                          </div>
                        </div>
                      </div>
                    }>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/feed" element={<FeedPage />} />
                        <Route path="/posts" element={<Navigate to="/feed" replace />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/saved" element={<SavedPosts />} />
                        <Route path="/upload" element={<UploadNotes />} />
                        <Route path="/quiz-feed" element={<QuizFeed />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/profile/:username" element={<UserProfile />} />
                        <Route path="/post/:postId" element={<PostDetail />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/ads/*" element={<ComingSoon title="Ads Dashboard" description="Our advertising platform is currently under construction. Check back soon for updates!" />} />


                        <Route path="/settings" element={<Settings />} />

                        {/* Legal Routes */}
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/accessibility" element={<Accessibility />} />
                      </Routes>
                    </Suspense>
                  </main>

                  {/* Right Sidebar */}
                  <div className="hidden xl:block w-[350px]">
                    <RightSidebar />
                  </div>
                </div>

                {/* Mobile Bottom Nav */}
                <MobileBottomNav />

                {/* Modals */}
                <AuthModal />
                <CreatePostModal />
                <CelebrationModal />
                <CommentSection />

                <Toaster position="top-right" richColors />
              </div>
            }
          />
        </Routes>
      </Router>
    </LoadingGate>
  );
}



function App() {
  return (
    <WebSocketProvider>
      <UIProvider>
        <AuthProvider>
          <FeedProvider>
            <StudyGramProvider>
              <CoursePlayerProvider>
                <CelebrationProvider>
                  <TopLoadingBar />
                  <AppContent />
                  <Analytics />
                </CelebrationProvider>
              </CoursePlayerProvider>
            </StudyGramProvider>
          </FeedProvider>
        </AuthProvider>
      </UIProvider>
    </WebSocketProvider>
  );
}

export default App;
