import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, User, Brain } from 'lucide-react';

const LeftSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      id: 'home'
    },
    {
      icon: Compass,
      label: 'Explore',
      path: '/explore',
      id: 'explore'
    },
    {
      icon: BookOpen,
      label: 'Course Bank',
      path: '/courses',
      id: 'course-bank'
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
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="hidden lg:flex flex-col w-60 bg-reddit-bg border-r border-reddit-border h-screen sticky top-0 pt-16"
    >
      <div className="flex flex-col gap-1 p-3 pt-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Component = item.disabled ? 'div' : Link;
          const props = item.disabled ? {} : { to: item.path };

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Component {...props}>
                <motion.div
                  whileHover={!item.disabled ? { backgroundColor: '#272729' } : {}}
                  whileTap={!item.disabled ? { scale: 0.98 } : {}}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium
                    transition-all duration-150
                    ${
                      isActive && !item.disabled
                        ? 'bg-reddit-card text-reddit-text border border-reddit-border'
                        : item.disabled
                        ? 'text-reddit-textMuted cursor-not-allowed opacity-40'
                        : 'text-reddit-textMuted hover:text-reddit-text cursor-pointer'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-[10px] text-reddit-textMuted">Soon</span>
                  )}
                </motion.div>
              </Component>
            </motion.div>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;