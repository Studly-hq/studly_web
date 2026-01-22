import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StudyGramProvider } from "./context/StudyGramContext";
import { CoursePlayerProvider } from "./context/CoursePlayerContext";
import { CelebrationProvider } from "./context/CelebrationContext";
import TopLoadingBar from "./components/common/TopLoadingBar";
import { WebSocketProvider } from "./context/WebSocketContext";
import { UIProvider } from "./context/UIContext";
import { AuthProvider } from "./context/AuthContext";
import { FeedProvider } from "./context/FeedContext";
import { useAuth } from "./context/AuthContext";
import ComingSoon from "./components/common/ComingSoon";

import LeftSidebar from "./components/layout/LeftSidebar";
import RightSidebar from "./components/layout/RightSidebar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import AuthModal from "./components/modals/AuthModal";
import CreatePostModal from "./components/modals/CreatePostModal";
import CelebrationModal from "./components/modals/CelebrationModal";
import CommentSection from "./components/comments/CommentSection";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { supabase } from "./utils/supabase";
import "./App.css";

// Pages (Lazy loaded for better performance)
const Home = lazy(() => import("./pages/Home"));
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

// Legal Pages (Lazy loaded)
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const Accessibility = lazy(() => import("./pages/legal/Accessibility"));

function AppContent() {
  const { syncWithBackend } = useAuth();

  // Handle URL hash for Supabase auth redirects (e.g., email verification)
  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (hash && (hash.includes("access_token") || hash.includes("token_type=signup"))) {
        // Parse hash parameters
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          toast.loading("Verifying your account...", { id: "auth-sync" });
          const success = await syncWithBackend(accessToken, refreshToken);
          if (success) {
            toast.success("Account verified! Welcome to Studly.", { id: "auth-sync" });
            // Clean up the URL
            window.history.replaceState(null, null, window.location.pathname);
          } else {
            toast.error("Failed to sync account. Please try logging in manually.", { id: "auth-sync" });
          }
        }
      }
    };

    handleHash();

    // Also listen for supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Only sync if we don't already have the token in localStorage to avoid redundant calls
        const currentToken = localStorage.getItem("studly_token");
        if (currentToken !== session.access_token) {
          await syncWithBackend(session.access_token, session.refresh_token);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [syncWithBackend]);

  return (
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
            <div className="min-h-screen bg-reddit-bg text-reddit-text flex justify-center">
              <div className="flex w-full max-w-[1280px]">
                {/* Left Sidebar */}
                <LeftSidebar />

                {/* Center Content - Routes */}
                <main className="flex-1 min-w-0 border-x border-reddit-border pb-20 xl:pb-0">
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
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/saved" element={<SavedPosts />} />
                      <Route path="/upload" element={<UploadNotes />} />
                      <Route path="/quiz-feed" element={<QuizFeed />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/profile/edit" element={<EditProfile />} />
                      <Route path="/profile/:username" element={<UserProfile />} />
                      <Route path="/post/:postId" element={<PostDetail />} />
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
                <div className="hidden xl:block w-[350px] p-4">
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
