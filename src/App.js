import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StudyGramProvider } from "./context/StudyGramContext";
import { CoursePlayerProvider } from "./context/CoursePlayerContext";
import { WebSocketProvider } from "./context/WebSocketContext";

import LeftSidebar from "./components/layout/LeftSidebar";
import RightSidebar from "./components/layout/RightSidebar";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import AuthModal from "./components/modals/AuthModal";
import CreatePostModal from "./components/modals/CreatePostModal";
import CommentSection from "./components/comments/CommentSection";
import { Toaster } from "sonner";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import SavedPosts from "./pages/SavedPosts";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import UploadNotes from "./pages/UploadNotes";
import QuizFeed from "./pages/QuizFeed";
import CourseBank from "./pages/CourseBank";
import TopicPlayer from "./pages/TopicPlayer";
import PostDetail from "./pages/PostDetail";
import CreateAd from "./pages/CreateAd";
import AdsDashboard from "./pages/AdsDashboard";
import CourseAdmin from "./pages/CourseAdmin";
import { useStudyGram } from "./context/StudyGramContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "./utils/supabase";
import "./App.css";

// Legal Pages
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy";
import Accessibility from "./pages/legal/Accessibility";

function AppContent() {
  const { syncWithBackend } = useStudyGram();

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
        <Route path="/courses" element={<CourseBank />} />
        <Route path="/courses/:topicId" element={<TopicPlayer />} />
        <Route path="/courses/admin" element={<CourseAdmin />} />

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
                    <Route path="/ads/create" element={<CreateAd />} />
                    <Route path="/ads/dashboard" element={<AdsDashboard />} />


                    <Route path="/settings" element={<Settings />} />

                    {/* Legal Routes */}
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                  </Routes>
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
      <StudyGramProvider>
        <CoursePlayerProvider>
          <AppContent />
        </CoursePlayerProvider>
      </StudyGramProvider>
    </WebSocketProvider>
  );
}

export default App;
