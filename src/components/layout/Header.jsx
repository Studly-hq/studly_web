import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  X,
  Home,
  Compass,
  TrendingUp
} from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    currentUser,
    handleCreatePost,
    setShowAuthModal
  } = useStudyGram();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navTabs = [
    { icon: Home, label: 'For You', id: 'for-you', path: '/' },
    { icon: Compass, label: 'Explore', id: 'explore', path: '/explore' },
    { icon: TrendingUp, label: 'Trending', id: 'trending', path: '/trending', disabled: true }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-900"
    >
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="cursor-pointer"
        >
          <span className="text-white text-2xl" style={{ fontFamily: "'Pacifico', cursive" }}>
            Studly
          </span>
        </motion.div>

        {/* Center - Navigation Tabs (Desktop) */}
        <div className="hidden md:flex items-center gap-1 flex-1 max-w-md">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <motion.button
                key={tab.id}
                onClick={() => !tab.disabled && navigate(tab.path)}
                disabled={tab.disabled}
                whileHover={!tab.disabled ? { y: -1 } : {}}
                whileTap={!tab.disabled ? { scale: 0.98 } : {}}
                transition={{ duration: 0.2 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive && !tab.disabled
                      ? 'bg-gray-900 text-white'
                      : tab.disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }
                `}
              >
                <tab.icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
                {tab.disabled && <span className="text-xs text-gray-600">Soon</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-900 rounded-xl px-4 py-2.5 border border-gray-800">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search posts, users, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
                e.target.blur();
              }
            }}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Create Post Button */}
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                handleCreatePost();
              } else {
                setShowAuthModal(true);
              }
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <Plus size={18} />
            <span className="text-sm">Create</span>
          </motion.button>

          {/* Mobile Create Button */}
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                handleCreatePost();
              } else {
                setShowAuthModal(true);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full"
          >
            <Plus size={20} />
          </motion.button>

          {/* Notifications (Authenticated only) */}
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </motion.button>
          )}

          {/* User Avatar (Authenticated) or Sign In (Guest) */}
          {isAuthenticated ? (
            <motion.div
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;