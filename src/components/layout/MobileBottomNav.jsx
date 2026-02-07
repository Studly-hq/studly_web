import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, GraduationCap, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { getStudyToken } from '../../api/profile';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();
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

  const navItems = [
    { icon: Home, label: 'Home', path: isAuthenticated ? '/feed' : '/posts', id: 'home' },
    { icon: Trophy, label: 'Ranking', path: '/leaderboard', id: 'leaderboard' },
    { icon: GraduationCap, label: 'Study', id: 'study', isStudy: true },
    { icon: User, label: 'Profile', path: '/profile', id: 'profile', requiresAuth: true }
  ];

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

      window.location.href = `${LUCID_URL}?token=${token}`;
    } catch (error) {
      console.error('Failed to get study token:', error);
      // Fallback
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

  const handleNavClick = (item) => {
    if (item.isStudy) {
      handleStudyClick();
      return;
    }
    if (item.requiresAuth && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate(item.path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="lg:hidden fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-40"
    >
      <div className="bg-[#0D1117] rounded-xl sm:rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-2.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.id === 'courses' && location.pathname.startsWith('/courses')) ||
              (item.id === 'progress' && location.pathname === '/profile');
            const Icon = item.icon;
            const isLoading = item.isStudy && isStudyLoading;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                onTouchStart={item.isStudy ? prefetchStudyToken : undefined}
                disabled={isLoading}
                whileTap={isLoading ? {} : { scale: 0.95 }}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-5 py-0.5 ${isLoading ? 'opacity-50' : ''
                  }`}
              >
                {/* Icon */}
                <div className={`transition-colors duration-200 ${isActive ? 'text-reddit-orange' : 'text-white/50'
                  }`}>
                  {isLoading ? (
                    <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Icon size={18} className="sm:w-5 sm:h-5" strokeWidth={1.5} />
                  )}
                </div>

                {/* Label */}
                <span className={`text-[9px] sm:text-[10px] font-semibold tracking-wider transition-colors duration-200 ${isActive ? 'text-reddit-orange' : 'text-white/50'
                  }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
