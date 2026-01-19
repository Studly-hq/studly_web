import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFeed } from '../../context/FeedContext';
import { useUI } from '../../context/UIContext';

const Header = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentUser,
  } = useAuth();

  const { handleCreatePost } = useFeed();
  const { setShowAuthModal } = useUI();

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-reddit-card/95 backdrop-blur-xl border-b border-reddit-border"
    >
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <motion.div
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="cursor-pointer flex-shrink-0"
        >
          <span className="text-reddit-text text-lg md:text-xl font-righteous tracking-wide">
            Studly
          </span>
        </motion.div>

        {/* Search Bar - Reddit Style */}
        <div className="flex-1 max-w-xl mx-1 sm:mx-2 md:mx-4">
          <div className="relative flex items-center gap-1.5 sm:gap-2 bg-reddit-input rounded px-2 sm:px-3 py-1.5 transition-colors">
            <Search size={16} className="text-reddit-textMuted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Studly"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
                  e.target.blur();
                }
              }}
              className="flex-1 bg-transparent text-reddit-text placeholder-reddit-textMuted outline-none text-sm min-w-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-reddit-textMuted hover:text-reddit-text transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Create Post Button */}
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                handleCreatePost();
              } else {
                setShowAuthModal(true);
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="hidden sm:flex items-center gap-1.5 bg-reddit-cardHover hover:bg-reddit-border text-reddit-text px-2.5 md:px-3 py-1.5 rounded text-sm font-medium border border-reddit-border transition-colors"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Create</span>
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
            transition={{ duration: 0.15 }}
            className="sm:hidden w-9 h-9 flex items-center justify-center bg-reddit-cardHover text-reddit-text rounded border border-reddit-border"
          >
            <Plus size={16} />
          </motion.button>

          {/* Notifications (Authenticated only) */}
          {isAuthenticated && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative w-9 h-9 flex items-center justify-center bg-reddit-cardHover rounded text-reddit-textMuted hover:text-reddit-text hover:bg-reddit-border border border-reddit-border transition-colors"
            >
              <Bell size={16} />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-reddit-orange rounded-full"></span>
            </motion.button>
          )}

          {/* User Avatar (Authenticated) or Log In (Guest) */}
          {isAuthenticated ? (
            <motion.div
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.15 }}
              className="cursor-pointer"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-9 h-9 rounded-full border border-reddit-border"
              />
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowAuthModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="hidden sm:block bg-reddit-orange hover:bg-reddit-orange/90 text-white px-3 md:px-4 py-1.5 rounded text-sm font-bold transition-colors"
            >
              Log In
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;