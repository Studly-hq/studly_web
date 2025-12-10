import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  LogOut,
  Bookmark,
  Upload,
  Edit3,
  Flame,
  Trophy
} from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, setShowAuthModal } = useStudyGram();

  const shortcuts = [
    { icon: Bookmark, label: 'Saved Posts', id: 'saved', path: '/saved' },
    { icon: Upload, label: 'Upload Notes', id: 'upload', path: '/upload' },
    { icon: Edit3, label: 'Edit Profile', id: 'edit', path: '/profile/edit' }
  ];

  if (!isAuthenticated) {
    return (
      <motion.aside
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="hidden xl:flex flex-col w-72 bg-reddit-bg border-l border-reddit-border h-screen sticky top-0 pt-16 p-3"
      >
        <div className="bg-reddit-card rounded-md p-5 border border-reddit-border mt-4">
          <h3 className="text-base font-bold text-reddit-text mb-1">
            New to Studly?
          </h3>
          <p className="text-reddit-textMuted text-xs mb-4">
            Sign up to get your personalized learning feed
          </p>
          <motion.button
            onClick={() => setShowAuthModal(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white py-2 rounded text-sm font-bold transition-colors"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="hidden xl:flex flex-col w-72 bg-reddit-bg border-l border-reddit-border h-screen sticky top-0 pt-16"
    >
      {/* User Profile Section */}
      <div className="p-3 pt-4">
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
          className="bg-reddit-card rounded-md p-3 border border-reddit-border"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-10 h-10 rounded-full border border-reddit-border"
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-reddit-orange rounded-full p-0.5">
                <Trophy size={10} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-reddit-text font-bold text-sm truncate">
                {currentUser?.displayName}
              </h3>
              <p className="text-reddit-textMuted text-xs truncate">@{currentUser?.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around pt-2.5 border-t border-reddit-border">
            <div className="flex items-center gap-1.5">
              <div className="bg-reddit-orange/20 p-1.5 rounded">
                <Flame size={12} className="text-reddit-orange" />
              </div>
              <div>
                <p className="text-[10px] text-reddit-textMuted">Streak</p>
                <p className="text-reddit-text font-bold text-xs">{currentUser?.streak}d</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-reddit-blue/20 p-1.5 rounded">
                <Trophy size={12} className="text-reddit-blue" />
              </div>
              <div>
                <p className="text-[10px] text-reddit-textMuted">Aura</p>
                <p className="text-reddit-text font-bold text-xs">{currentUser?.auraPoints}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shortcuts */}
      <div className="flex-1 p-3">
        <h4 className="text-reddit-textMuted text-[10px] uppercase tracking-wide font-bold mb-2 px-1">
          Quick Actions
        </h4>
        <div className="flex flex-col gap-1">
          {shortcuts.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              whileHover={{ backgroundColor: '#272729' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-reddit-textMuted hover:text-reddit-text transition-all text-sm font-medium"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="p-3 border-t border-reddit-border">
        <motion.button
          onClick={() => navigate('/settings')}
          whileHover={{ backgroundColor: '#272729' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-reddit-textMuted hover:text-reddit-text transition-all w-full mb-1 text-sm font-medium"
        >
          <Settings size={16} />
          <span>Settings</span>
        </motion.button>
        <motion.button
          onClick={logout}
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-red-400 hover:text-red-300 transition-all w-full text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;