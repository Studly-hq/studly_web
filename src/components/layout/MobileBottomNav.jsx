import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, GraduationCap, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();
  const [isStudyLoading] = useState(false);

  const navItems = [
    { icon: Home, label: 'Home', path: '/feed', id: 'home' },
    { icon: Trophy, label: 'Ranking', path: '/leaderboard', id: 'leaderboard' },
    { icon: GraduationCap, label: 'Study', id: 'study', isStudy: true },
    { icon: User, label: 'Profile', path: '/profile', id: 'profile', requiresAuth: true }
  ];

  const handleStudyClick = async () => {
    navigate('/study');
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
      className="lg:hidden fixed bottom-2 sm:bottom-4 left-0 right-0 px-2 sm:px-0 flex justify-center z-40 pointer-events-none"
    >
      <div className="bg-reddit-card rounded-xl sm:rounded-full border border-reddit-border shadow-xl w-full sm:w-[400px] pointer-events-auto">
        <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-2.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.isStudy && location.pathname === '/study') ||
              (item.id === 'courses' && location.pathname.startsWith('/courses')) ||
              (item.id === 'progress' && location.pathname === '/profile');
            const Icon = item.icon;
            const isLoading = item.isStudy && isStudyLoading;

            return (
              <motion.button
                key={item.id}
                id={item.isStudy ? 'tour-study-mobile' : undefined}
                onClick={() => handleNavClick(item)}
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
