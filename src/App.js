import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StudyGramProvider } from './context/StudyGramContext';
import { CoursePlayerProvider } from './context/CoursePlayerContext';
import Header from './components/layout/Header';
import LeftSidebar from './components/layout/LeftSidebar';
import RightSidebar from './components/layout/RightSidebar';
import MobileBottomNav from './components/layout/MobileBottomNav';
import AuthModal from './components/modals/AuthModal';
import CreatePostModal from './components/modals/CreatePostModal';
import CommentSection from './components/comments/CommentSection';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import SavedPosts from './pages/SavedPosts';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import UploadNotes from './pages/UploadNotes';
import QuizFeed from './pages/QuizFeed';
import CourseBank from './pages/CourseBank';
import TopicPlayer from './pages/TopicPlayer';

import './App.css';

function App() {
  return (
    <StudyGramProvider>
      <CoursePlayerProvider>
        <Router>
          <Routes>
            {/* Course Bank routes (full screen, no header/sidebars) */}
            <Route path="/courses" element={<CourseBank />} />
            <Route path="/courses/:topicId" element={<TopicPlayer />} />

            {/* Main app routes (with header and sidebars) */}
            <Route path="/*" element={
              <div className="min-h-screen bg-reddit-bg text-reddit-text">
                {/* Header */}
                <Header />

                {/* Main Layout - Three Column */}
                <div className="flex">
                  {/* Left Sidebar */}
                  <LeftSidebar />

                  {/* Center Content - Routes */}
                  <main className="flex-1 pt-16 pb-20 lg:pb-0">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/saved" element={<SavedPosts />} />
                      <Route path="/upload" element={<UploadNotes />} />
                      <Route path="/quiz-feed" element={<QuizFeed />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/profile/edit" element={<EditProfile />} />
                      <Route path="/profile/:userId" element={<UserProfile />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>

                  {/* Right Sidebar */}
                  <RightSidebar />
                </div>

                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />

                {/* Modals */}
                <AuthModal />
                <CreatePostModal />
                <CommentSection />
              </div>
            } />
          </Routes>
        </Router>
      </CoursePlayerProvider>
    </StudyGramProvider>
  );
}

export default App;