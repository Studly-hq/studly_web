import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BarChart3, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setShowAuthModal } = useUI();

  const navItems = [
    { icon: BookOpen, label: 'COURSES', path: '/courses', id: 'courses' },
    { icon: BarChart3, label: 'PROGRESS', path: '/profile', id: 'progress', requiresAuth: true },
    { icon: HelpCircle, label: 'SUPPORT', path: '/support', id: 'support' }
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
      className="xl:hidden fixed bottom-4 left-4 right-4 z-40"
    >
      <div className="bg-[#1a1a1c] rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-around px-4 py-3">
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
                className="flex flex-col items-center gap-1.5 px-6 py-1"
              >
                {/* Icon */}
                <div className={`transition-colors duration-200 ${isActive ? 'text-reddit-orange' : 'text-white/50'
                  }`}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>

                {/* Label */}
                <span className={`text-[10px] font-semibold tracking-wider transition-colors duration-200 ${isActive ? 'text-reddit-orange' : 'text-white/50'
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
