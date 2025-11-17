import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  LogOut,
  Bookmark,
  BookOpen,
  Upload,
  Edit3,
  Flame,
  Trophy
} from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useStudyGram();

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
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="hidden xl:flex flex-col w-80 bg-black border-l border-gray-900 h-screen sticky top-0 pt-20 p-4"
      >
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-2">
            Join Studly Today
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Connect with learners, share your study notes, and level up together.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Sign Up / Login
          </motion.button>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="hidden xl:flex flex-col w-80 bg-black border-l border-gray-900 h-screen sticky top-0 pt-20"
    >
      {/* User Profile Section */}
      <div className="p-4">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                className="w-14 h-14 rounded-full border-2 border-blue-600"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                <Trophy size={12} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base">
                {currentUser?.displayName}
              </h3>
              <p className="text-gray-400 text-sm">@{currentUser?.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around pt-3 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Flame size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-white font-bold">{currentUser?.streak} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <Trophy size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Aura</p>
                <p className="text-white font-bold">{currentUser?.auraPoints}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shortcuts */}
      <div className="flex-1 p-4">
        <h4 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">
          Quick Actions
        </h4>
        <div className="flex flex-col gap-2">
          {shortcuts.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-gray-900">
        <motion.button
          onClick={() => navigate('/settings')}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 w-full mb-2"
        >
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </motion.button>
        <motion.button
          onClick={logout}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;