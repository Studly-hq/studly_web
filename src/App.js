import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StudyGramProvider } from "./context/StudyGramContext";
import { CoursePlayerProvider } from "./context/CoursePlayerContext";
import { CelebrationProvider } from "./context/CelebrationContext";
import { StreakProvider } from "./context/StreakContext";
import TopLoadingBar from "./components/common/TopLoadingBar";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FeedProvider } from "./context/FeedContext";
import { NotificationProvider } from "./context/NotificationContext";
import ComingSoon from "./components/common/ComingSoon";
import { PublicOnly, PrivateOnly } from "./components/auth/AuthGate";

import AuthModal from "./components/modals/AuthModal";
import CreatePostModal from "./components/modals/CreatePostModal";
import CelebrationModal from "./components/modals/CelebrationModal";
import DailyStreakModal from "./components/modals/DailyStreakModal";
import StreakLostModal from "./components/modals/StreakLostModal";
import PaywallModal from "./components/modals/PaywallModal";
import GiveawayWinModal from "./components/modals/GiveawayWinModal";
import CommentSection from "./components/comments/CommentSection";
import DashboardLayout from "./components/layout/DashboardLayout";
import { Toaster } from "./components/ui/toast";
import { Analytics } from '@vercel/analytics/react';
import "./App.css";

// Pages (Lazy loaded for better performance)
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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
const Billing = lazy(() => import("./pages/Billing"));
const VerifyPayment = lazy(() => import("./pages/VerifyPayment"));
const ReleaseNotes = lazy(() => import("./pages/ReleaseNotes"));
const StreakPage = lazy(() => import("./pages/StreakPage"));
const Giveaway = lazy(() => import("./pages/Giveaway"));

// Legal Pages (Lazy loaded)
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Accessibility = lazy(() => import("./pages/legal/Accessibility"));

function AppContent() {
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const { pathname } = useLocation();

  // The landing page is a long, scroll-driven marketing page: it needs the
  // document itself to scroll (sticky sections, scroll-linked animations,
  // `#features` anchor links). The app shell normally clamps every route to a
  // viewport-height frame with overflow-hidden so dashboard layouts can own
  // their own scroll regions, which would clip the landing page to one screen.
  // So for `/` only, the frame grows with its content instead of clipping.
  const isLanding = pathname === "/";

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
      <div
        className={`flex flex-col w-full ${isLanding ? "" : "overflow-hidden"}`}
        style={isLanding ? undefined : { height: viewportHeight }}
      >
        <div
          className={`flex-1 min-h-0 w-full relative ${isLanding ? "" : "overflow-hidden"}`}
        >
          <Suspense fallback={null}>
            <Routes>
              {/* Landing page (full screen, no sidebars) - redirect authenticated users to /home */}
              <Route
                path="/"
                element={
                  <PublicOnly redirectTo="/home">
                    <LandingPage />
                  </PublicOnly>
                }
              />

              {/* Auth pages (full screen) - redirect authenticated users to /home */}
              <Route
                path="/login"
                element={
                  <PublicOnly redirectTo="/home">
                    <LoginPage />
                  </PublicOnly>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicOnly redirectTo="/home">
                    <SignupPage />
                  </PublicOnly>
                }
              />

              {/* Course Bank routes (full screen, no header/sidebars) */}
              <Route path="/courses" element={<CourseBank />} />
              <Route path="/courses/:topicId" element={<TopicPlayer />} />
              <Route path="/courses/admin" element={<CourseAdmin />} />

              {/* Admin Dashboard (full screen) */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Paystack callback (full screen, never inside the shell) */}
              <Route path="/verify-payment" element={<VerifyPayment />} />

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
                <Route path="/billing" element={<Billing />} />
                <Route path="/cuhub" element={<CUHUB />} />
                <Route path="/releases" element={<ReleaseNotes />} />
                <Route path="/streak" element={<StreakPage />} />
                <Route path="/giveaway" element={<Giveaway />} />
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
        <PaywallModal />
        <GiveawayWinModal />
        <CelebrationModal />
        <DailyStreakModal />
        <StreakLostModal />
        <CommentSection />
        <Toaster />
      </div>
    </>
  );
}


function App() {
  // NOTE: <Router> must wrap every provider. AuthProvider calls useNavigate()
  // for SPA logout navigation, and React Router hooks throw outside a router.
  return (
    <Router>
      <ThemeProvider>
        <WebSocketProvider>
          <UIProvider>
            <AuthProvider>
              <FeedProvider>
                <NotificationProvider>
                  <StudyGramProvider>
                    <CoursePlayerProvider>
                      <CelebrationProvider>
                        <StreakProvider>
                          <TopLoadingBar />
                          <AppContent />
                          <Analytics />
                        </StreakProvider>
                      </CelebrationProvider>
                    </CoursePlayerProvider>
                  </StudyGramProvider>
                </NotificationProvider>
              </FeedProvider>
            </AuthProvider>
          </UIProvider>
        </WebSocketProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
