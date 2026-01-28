import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, GraduationCap, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();

  const navItems = [
    { icon: Home, label: 'Home', path: isAuthenticated ? '/posts' : '/posts', id: 'home' },
    { icon: Trophy, label: 'Ranking', path: '/leaderboard', id: 'leaderboard' },
    { icon: GraduationCap, label: 'Study', path: '/courses', id: 'courses' },
    { icon: User, label: 'Profile', path: '/profile', id: 'profile', requiresAuth: true }
  ];

  const handleNavClick = (item) => {
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
      className="xl:hidden fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-40"
    >
      <div className="bg-[#0D1117] rounded-xl sm:rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-around px-2 sm:px-4 py-2 sm:py-2.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.id === 'courses' && location.pathname.startsWith('/courses')) ||
              (item.id === 'progress' && location.pathname === '/profile');
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-5 py-0.5"
              >
                {/* Icon */}
                <div className={`transition-colors duration-200 ${isActive ? 'text-reddit-orange' : 'text-white/50'
                  }`}>
                  <Icon size={18} className="sm:w-5 sm:h-5" strokeWidth={1.5} />
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
