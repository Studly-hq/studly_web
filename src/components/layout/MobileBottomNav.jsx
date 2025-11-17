import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Brain, User } from 'lucide-react';
import { useStudyGram } from '../../context/StudyGramContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, setShowAuthModal } = useStudyGram();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', id: 'home' },
    { icon: Compass, label: 'Explore', path: '/explore', id: 'explore' },
    { icon: Brain, label: 'Quizzes', path: '/quiz-feed', id: 'quiz-feed' },
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
      transition={{ duration: 0.3 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-gray-900"
    >
      <div className="flex items-center justify-around px-2 py-3 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-1 px-4 py-2 relative"
            >
    

              {/* Icon */}
              <div className={`transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Label */}
              <span className={`text-xs font-medium transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-gray-500'
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
