import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, GraduationCap, User } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useStudyGram();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', id: 'home' },
    { icon: Compass, label: 'Explore', path: '/explore', id: 'explore' },
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
      className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5"
    >
      <div className="flex items-center justify-around px-2 py-1 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 relative"
            >
              {/* Icon */}
              <div className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/40'
                }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-wide transition-all duration-200 ${isActive ? 'text-white font-bold' : 'text-white/40 font-medium'
                }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
