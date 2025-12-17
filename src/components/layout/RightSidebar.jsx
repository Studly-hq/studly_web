import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings,
  LogOut,
  Bookmark,
  Upload,
  Edit3,
  Flame,
  Trophy,
  Search,
  X
} from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';
import AdPromotionWidget from '../ads/AdPromotionWidget';

const RightSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, logout, setShowAuthModal } = useStudyGram();
  const [searchQuery, setSearchQuery] = useState('');
  const [adWidgetDismissed, setAdWidgetDismissed] = useState(false);

  // Hide ad widget on ads-related pages
  const isOnAdsPage = location.pathname.startsWith('/ads/');

  const shortcuts = [
    { icon: Bookmark, label: 'Saved Posts', id: 'saved', path: '/saved' },
    { icon: Upload, label: 'Upload Notes', id: 'upload', path: '/upload' },
    { icon: Edit3, label: 'Edit Profile', id: 'edit', path: '/profile/edit' }
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
      // Optional: blur input
      e.target.blur();
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hidden lg:flex flex-col w-[320px] h-screen sticky top-0 px-4 pt-2 gap-4"
    >
      {/* Search Bar - Sticky */}
      <div className="sticky top-0 pt-2 pb-1 z-10">
        <div className="group relative flex items-center bg-[#202327] border border-[#2f3336] focus-within:border-reddit-orange focus-within:ring-1 focus-within:ring-reddit-orange rounded-full px-4 py-3 transition-all">
          <Search size={18} className="text-gray-500 group-focus-within:text-reddit-orange" />
          <input
            type="text"
            placeholder="Search Studly"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-[15px] ml-4"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="bg-reddit-orange rounded-full p-0.5"
            >
              <X size={12} className="text-black" />
            </button>
          )}
        </div>
      </div>

      {/* Auth Callout (if not logged in) */}
      {!isAuthenticated && (
        <div className="bg-[#16181c] rounded-2xl p-4 border border-transparent">
          <h2 className="font-bold text-xl mb-2">New to Studly?</h2>
          <p className="text-gray-500 text-sm mb-4">Sign up now to get your own personalized timeline!</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Create account
          </button>
          <p className="text-xs text-gray-500 mt-4">
            By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
          </p>
        </div>
      )}

      {/* Ad Promotion Widget - Show for all users unless dismissed or on ads page */}
      {!adWidgetDismissed && !isOnAdsPage && (
        <AdPromotionWidget onDismiss={() => setAdWidgetDismissed(true)} />
      )}

      {/* Stats Widget (if logged in) */}
      {isAuthenticated && (
        <div className="bg-[#16181c] rounded-2xl overflow-hidden border border-transparent">
          <h2 className="font-bold text-xl px-4 py-3">Your Progress</h2>

          <div className="px-4 py-2 hover:bg-[#1d1f23] transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Flame size={18} className="text-reddit-orange" />
                <span className="text-sm font-medium">Daily Streak</span>
              </div>
              <span className="text-white font-bold text-lg">{currentUser?.streak || 0}</span>
            </div>
          </div>

          <div className="px-4 py-2 hover:bg-[#1d1f23] transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Trophy size={18} className="text-blue-500" />
                <span className="text-sm font-medium">Aura Points</span>
              </div>
              <span className="text-white font-bold text-lg">{currentUser?.auraPoints || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions / Shortcuts - Only show when authenticated */}
      {isAuthenticated && (
        <div className="bg-[#16181c] rounded-2xl overflow-hidden border border-transparent">
          <h2 className="font-bold text-xl px-4 py-3">Quick Actions</h2>
          <div className="flex flex-col">
            {shortcuts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className="px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-gray-400" />
                  <span className="font-bold text-[15px]">{item.label}</span>
                </div>
              </div>
            ))}
            {/* Settings & Logout */}
            <div
              onClick={() => navigate('/settings')}
              className="px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer flex items-center gap-3"
            >
              <Settings size={18} className="text-gray-400" />
              <span className="font-bold text-[15px]">Settings</span>
            </div>

            <div
              onClick={logout}
              className="px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer flex items-center gap-3 text-red-500"
            >
              <LogOut size={18} />
              <span className="font-bold text-[15px]">Logout</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Cookie Policy</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span>© 2025 Studly, Inc.</span>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;