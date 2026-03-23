import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  ExternalLink,
  Flame,
  Trophy,
  Search,
  X,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { getUserStreak, getUserAuraPoints } from '../../api/profile';


const RightSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { setShowAuthModal, isRightSidebarCollapsed, setIsRightSidebarCollapsed } = useUI();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ streak: 0, auraPoints: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (currentUser?.username) {
        try {
          const streak = await getUserStreak(currentUser.username);
          const points = await getUserAuraPoints(currentUser.username);
          setStats({ streak, auraPoints: points });

          // Check for milestone achievements - REMOVED (handled globally in CelebrationContext)
          // checkMilestones(points, streak);
        } catch (error) {
          console.error("Failed to fetch sidebar stats", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, currentUser]);



  const shortcuts = [
    { icon: ExternalLink, label: 'Access CUHUB', id: 'cuhub', path: '/cuhub', external: false }
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
      initial={false}
      animate={{ width: isRightSidebarCollapsed ? '80px' : '350px' }}
      className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 px-4 pt-2 gap-4 overflow-y-auto pb-20 scrollbar-hide border-l border-reddit-border transition-all duration-300"
    >

      {/* Toggle Button */}
      <div className={`flex ${isRightSidebarCollapsed ? 'justify-center' : 'justify-start'} pt-2`}>
        <button 
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          className="p-2 rounded-full hover:bg-reddit-cardHover/50 text-reddit-textMuted hover:text-white transition-colors"
          title={isRightSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isRightSidebarCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
        </button>
      </div>

      {/* Search Bar - Sticky */}
      {!isRightSidebarCollapsed && (
        <div className="sticky top-0 pt-2 pb-1 z-10">
          <div
            className="flex items-center bg-[#202327] rounded-full px-4 py-3 border border-[#2f3336] focus-within:border-reddit-orange transition-colors duration-200"
          >
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search Studly"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-[15px] ml-4 w-full"
              style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent'
              }}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-reddit-orange rounded-full p-0.5 hover:bg-white transition-colors"
              >
                <X size={12} className="text-black" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Callout (if not logged in) */}
      {!isAuthenticated && !isRightSidebarCollapsed && (
        <div className="bg-[#16181c] rounded-2xl p-4 border border-[#2f3336]">
          <h2 className="font-bold text-xl mb-2">New to Studly?</h2>
          <p className="text-gray-500 text-sm mb-4">Sign up now to get your own personalized timeline!</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Create account
          </button>
        </div>
      )}



      {/* Stats Widget (if logged in) */}
      {isAuthenticated && (
        <div className={`bg-[#16181c] rounded-2xl overflow-hidden border border-[#2f3336] ${isRightSidebarCollapsed ? 'flex flex-col items-center py-4 gap-6' : ''}`}>
          {!isRightSidebarCollapsed && <h2 className="font-bold text-xl px-4 py-3 border-b border-[#2f3336]">Your Progress</h2>}

          <div className={`${isRightSidebarCollapsed ? '' : 'px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer'}`} onClick={() => navigate('/profile')}>
            <div className={`flex items-center ${isRightSidebarCollapsed ? 'flex-col' : 'justify-between'}`}>
              <div className="flex items-center gap-3 text-gray-400">
                <Flame size={isRightSidebarCollapsed ? 24 : 18} className="text-reddit-orange" />
                {!isRightSidebarCollapsed && <span className="text-[15px]">Daily Streak</span>}
              </div>
              <span className={`text-white font-bold ${isRightSidebarCollapsed ? 'text-sm mt-1' : 'text-lg'}`}>{stats.streak || currentUser?.streak || 0}</span>
            </div>
          </div>

          <div className={`${isRightSidebarCollapsed ? '' : 'px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer'}`} onClick={() => navigate('/profile')}>
            <div className={`flex items-center ${isRightSidebarCollapsed ? 'flex-col' : 'justify-between'}`}>
              <div className="flex items-center gap-3 text-gray-400">
                <Trophy size={isRightSidebarCollapsed ? 24 : 18} className="text-blue-500" />
                {!isRightSidebarCollapsed && <span className="text-[15px]">Aura Points</span>}
              </div>
              <span className={`text-white font-bold ${isRightSidebarCollapsed ? 'text-sm mt-1' : 'text-lg'}`}>{stats.auraPoints || currentUser?.auraPoints || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions / Shortcuts - Only show when authenticated */}
      {isAuthenticated && !isRightSidebarCollapsed && (
        <div className="bg-[#16181c] rounded-2xl overflow-hidden border border-[#2f3336]">
          <h2 className="font-bold text-xl px-4 py-3 border-b border-[#2f3336]">Quick Actions</h2>
          <div className="flex flex-col">
            {shortcuts.map((item) => (
              <div
                key={item.id}
                id={item.id === 'cuhub' ? 'tour-cuhub-desktop' : undefined}
                onClick={() => {
                  if (item.external) {
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                  } else {
                    navigate(item.path);
                  }
                }}
                className="px-4 py-3 hover:bg-[#1d1f23] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-gray-400" />
                  <span className="text-[15px]">{item.label}</span>
                </div>
              </div>
            ))}
            {/* Logout */}
            <div
              onClick={logout}
              className="px-4 py-3 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center gap-3 text-red-500 border-t border-[#2f3336]"
            >
              <LogOut size={18} />
              <span className="text-[15px]">Logout</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!isRightSidebarCollapsed && (
        <div className="px-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span onClick={() => navigate('/terms')} className="hover:underline cursor-pointer">Terms of Service</span>
          <span onClick={() => navigate('/privacy')} className="hover:underline cursor-pointer">Privacy Policy</span>
          <span onClick={() => navigate('/cookie-policy')} className="hover:underline cursor-pointer">Cookie Policy</span>
          <span onClick={() => navigate('/accessibility')} className="hover:underline cursor-pointer">Accessibility</span>
          <span>© {new Date().getFullYear()} Studly, Inc.</span>
        </div>
      )}
    </motion.aside>
  );
};

export default RightSidebar;