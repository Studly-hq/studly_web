import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, User } from 'lucide-react';

const LeftSidebar = () => {
  const location = useLocation();

  const navItems = [

    {
      icon: BookOpen,
      label: 'Course Bank',
      path: '/courses',
      id: 'course-bank',
      disabled: true
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
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="hidden lg:flex flex-col w-64 bg-black border-r border-gray-900 h-screen sticky top-0 pt-20"
    >
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Component = item.disabled ? 'div' : Link;
          const props = item.disabled ? {} : { to: item.path };

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Component {...props}>
                <motion.div
                  whileHover={!item.disabled ? { x: 4 } : {}}
                  whileTap={!item.disabled ? { scale: 0.98 } : {}}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive && !item.disabled
                        ? 'bg-blue-600 text-white'
                        : item.disabled
                        ? 'bg-gray-900/50 text-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs text-gray-600">Soon</span>
                  )}
                </motion.div>
              </Component>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative bottom element */}
      <div className="mt-auto p-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;