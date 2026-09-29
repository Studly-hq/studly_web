import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StudyGramProvider } from "./context/StudyGramContext";
import { CoursePlayerProvider } from "./context/CoursePlayerContext";
import { CelebrationProvider } from "./context/CelebrationContext";
import TopLoadingBar from "./components/common/TopLoadingBar";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UIProvider, useUI } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FeedProvider } from "./context/FeedContext";
import { NotificationProvider } from "./context/NotificationContext";
import ComingSoon from "./components/common/ComingSoon";

import AuthModal from "./components/modals/AuthModal";
import CreatePostModal from "./components/modals/CreatePostModal";
import CelebrationModal from "./components/modals/CelebrationModal";
import UpgradeModal from "./components/modals/UpgradeModal";
import ManagePlanModal from "./components/modals/ManagePlanModal";
import CommentSection from "./components/comments/CommentSection";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Toaster } from "./components/ui/toast";
import { Analytics } from '@vercel/analytics/react';
import "./App.css";

// Pages (Lazy loaded for better performance)
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
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Home = lazy(() => import("./pages/Home"));
const CUHUB = lazy(() => import("./pages/CUHUB"));
const VerifyPayment = lazy(() => import("./pages/VerifyPayment"));
const ReleaseNotes = lazy(() => import("./pages/ReleaseNotes"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));

// Legal Pages (Lazy loaded)
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Accessibility = lazy(() => import("./pages/legal/Accessibility"));

function AppContent() {
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      setViewportHeight(`${window.visualViewport.height}px`);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    handleResize();
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  // Pre-warm Next.js server to prevent 30-second cold starts when opening Study mode
  useEffect(() => {
    const lucidUrl = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = lucidUrl;
    document.head.appendChild(link);

    // Also do a silent fetch to truly wake up the serverless functions
    fetch(lucidUrl, { mode: 'no-cors' }).catch(() => {});
  }, []);

  return (
    <>
      <div className="flex flex-col w-full overflow-hidden" style={{ height: viewportHeight }}>
        <div className="flex-1 min-h-0 w-full overflow-hidden relative">
          <Suspense fallback={null}>
            <Routes>
              {/* Landing page (full screen, no sidebars) */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth pages (full screen) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Course Bank routes (full screen, no header/sidebars) */}
              <Route path="/courses" element={<CourseBank />} />
              <Route path="/courses/:topicId" element={<TopicPlayer />} />
              <Route path="/courses/admin" element={<CourseAdmin />} />

              {/* Admin Dashboard (full screen) */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* v3 Dashboard shell (sidebar + rounded canvas) */}
              <Route element={<DashboardLayout />}>
                {/* Home = Lucid iframe, first thing after login/signup */}
                <Route path="/home" element={<Home />} />
                <Route path="/study" element={<Navigate to="/home" replace />} />

                {/* Community routes — feed untouched, renders in canvas */}
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/posts" element={<Navigate to="/feed" replace />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/saved" element={<SavedPosts />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/quiz-feed" element={<QuizFeed />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/upload" element={<UploadNotes />} />

                {/* Profile & account */}
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/:username" element={<UserProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cuhub" element={<CUHUB />} />
                <Route path="/verify-payment" element={<VerifyPayment />} />
                <Route path="/releases" element={<ReleaseNotes />} />
                <Route path="/ads/*" element={<ComingSoon title="Ads Dashboard" description="Our advertising platform is currently under construction. Check back soon for updates!" />} />

                {/* Legal Routes */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/accessibility" element={<Accessibility />} />
              </Route>
            </Routes>
          </Suspense>
        </div>

        {/* Global Modals & Components (Shared across all routes including /courses) */}
        <AuthModal />
        <CreatePostModal />
        <UpgradeModal />
        <ManagePlanModal />
        <CelebrationModal />
        <CommentSection />
        <Toaster position="top-right" richColors />
      </div>
    </>
  );
}


function App() {
  return (
    <ThemeProvider>
      <WebSocketProvider>
        <UIProvider>
          <AuthProvider>
            <FeedProvider>
              <NotificationProvider>
                <StudyGramProvider>
                  <CoursePlayerProvider>
                    <CelebrationProvider>
                      <Router>
                        <TopLoadingBar />
                        <AppContent />
                        <Analytics />
                      </Router>
                    </CelebrationProvider>
                  </CoursePlayerProvider>
                </StudyGramProvider>
              </NotificationProvider>
            </FeedProvider>
          </AuthProvider>
        </UIProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
}

export default App;
