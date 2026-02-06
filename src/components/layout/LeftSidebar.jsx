import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, User, PlayCircle, Trophy, MoreHorizontal, LogIn, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useNotifications } from '../../context/NotificationContext';
import { getStudyToken } from '../../api/profile';
import logo from '../../assets/logo.png';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';


const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser } = useAuth();
  const { setShowAuthModal, setShowCreatePostModal } = useUI();
  const { unreadCount } = useNotifications();
  const [isStudyLoading, setIsStudyLoading] = useState(false);
  const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });

  // Prefetch study token to speed up transition
  const prefetchStudyToken = useCallback(async () => {
    if (!isAuthenticated || (cachedStudyToken.token && Date.now() - cachedStudyToken.timestamp < 45000)) return;

    try {
      const token = await getStudyToken();
      setCachedStudyToken({ token, timestamp: Date.now() });
    } catch (error) {
      console.error('Study token prefetch failed:', error);
    }
  }, [isAuthenticated, cachedStudyToken.token, cachedStudyToken.timestamp]);

  // Prefetch on mount
  useEffect(() => {
    if (isAuthenticated) {
      prefetchStudyToken();
    }
  }, [isAuthenticated, prefetchStudyToken]);

  // Handle Study button click - get token and navigate to Lucid
  const handleStudyClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Check if we have a fresh cached token (less than 55 seconds old)
    const isTokenFresh = cachedStudyToken.token && (Date.now() - cachedStudyToken.timestamp < 55000);

    try {
      setIsStudyLoading(true);

      let token = cachedStudyToken.token;

      if (!isTokenFresh) {
        token = await getStudyToken();
      }

      // Navigate in the same tab to avoid popup blockers and user context loss
      window.location.href = `${LUCID_URL}?token=${token}`;
    } catch (error) {
      console.error('Failed to get study token:', error);
      // Fallback: try to fetch one last time if cached one failed
      try {
        const freshToken = await getStudyToken();
        window.location.href = `${LUCID_URL}?token=${freshToken}`;
      } catch (innerError) {
        console.error('Final attempt failed:', innerError);
      }
    } finally {
      setIsStudyLoading(false);
    }
  };

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: isAuthenticated ? '/feed' : '/posts',
      id: 'home'
    },
    {
      icon: Compass,
      label: 'Explore',
      path: '/explore',
      id: 'explore'
    },
    {
      icon: Trophy,
      label: 'Leaderboard',
      path: '/leaderboard',
      id: 'leaderboard'
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
      id: 'notifications'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      id: 'profile'
    }
  ];


  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden xl:flex flex-col w-[280px] h-screen sticky top-0 px-2 justify-between"
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className="p-3 my-1">
          <Link to={isAuthenticated ? "/feed" : "/posts"} className="inline-flex items-center justify-center p-2 rounded-full hover:bg-reddit-cardHover/50 transition-colors w-12 h-12">
            <img src={logo} alt="Studly Logo" className="w-10 h-10 object-contain" />
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Component = item.disabled ? 'div' : Link;
            const props = item.disabled ? {} : { to: item.path };

            return (
              <Component key={item.id} {...props} className="block group">
                <div className={`
                  inline-flex items-center gap-4 px-5 py-3 rounded-full text-xl
                  transition-colors duration-200
                  ${isActive ? 'font-bold' : 'font-normal'}
                  text-white group-hover:bg-reddit-cardHover/50
                `}>
                  <div className="relative">
                    <item.icon size={26} strokeWidth={isActive ? 3 : 2} />
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-reddit-orange text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0D1117] transform translate-x-1 -translate-y-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </div>
              </Component>
            );
          })}

          {/* Study Button - Opens Lucid in new tab */}
          <button
            onClick={handleStudyClick}
            onMouseEnter={prefetchStudyToken}
            disabled={isStudyLoading}
            className="block group mt-2 w-full text-left"
          >
            <div className={`
                inline-flex items-center gap-4 px-5 py-3 rounded-full text-xl
                transition-colors duration-200 font-normal
                text-white group-hover:bg-reddit-cardHover/50
                ${isStudyLoading ? 'opacity-70' : ''}
              `}>
              {isStudyLoading ? (
                <Loader2 size={26} className="animate-spin" />
              ) : (
                <PlayCircle size={26} strokeWidth={2} />
              )}
              <span>{isStudyLoading ? 'Loading...' : 'Start Studying'}</span>
            </div>
          </button>


          {/* Post Button */}
          <div className="mt-2 px-2">
            <button
              onClick={() => isAuthenticated ? setShowCreatePostModal(true) : setShowAuthModal(true)}
              className="w-[90%] bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-2.5 rounded-full shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] text-lg"
            >
              Post
            </button>
          </div>
        </nav>

        {/* User Profile / Auth Area (Bottom) */}
        <div className="p-3 mb-2">
          {isAuthenticated ? (
            <button
              className="w-full flex items-center justify-between p-3 rounded-full hover:bg-reddit-cardHover/50 transition-colors group text-left"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-3 min-w-0">
                {(currentUser?.avatar || currentUser?.profile_picture) ? (
                  <img
                    src={currentUser.profile_picture || currentUser.avatar}
                    alt={currentUser?.displayName}
                    className="w-10 h-10 rounded-full bg-gray-700 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-reddit-cardHover flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-reddit-textMuted" />
                  </div>
                )}
                <div className="flex flex-col leading-snug hidden xl:flex min-w-0 overflow-hidden">
                  <span className="font-bold text-sm truncate" title={currentUser?.displayName}>{currentUser?.displayName}</span>
                  <span className="text-reddit-textMuted text-sm truncate" title={`@${currentUser?.username}`}>@{currentUser?.username}</span>
                </div>
              </div>
              <MoreHorizontal className="hidden xl:block" size={18} />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full border border-reddit-border hover:bg-reddit-cardHover/10 text-reddit-text font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              <span className="hidden xl:inline">Log In</span>
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;