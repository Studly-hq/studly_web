import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Library, Rocket, Settings, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { springConfig } from '../../utils/animations';

const menuItems = [
  { id: 'dashboard', label: 'Home', path: '/dashboard', icon: Home },
  { id: 'courses', label: 'My Courses', path: '/courses', icon: BookOpen },
  { id: 'bank', label: 'Course Bank', path: '/courses', icon: Library },
  { id: 'space', label: 'Course Space', path: '/space', icon: Rocket, comingSoon: true },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active page based on current path
  const getActivePage = () => {
    if (location.pathname.includes('/learn')) return 'learning';
    if (location.pathname.includes('/settings')) return 'settings';
    if (location.pathname.includes('/courses')) return 'bank';
    return 'dashboard';
  };
  
  const activePage = getActivePage();
  
  // Reorder items so active is first
  const sortedItems = [
    ...menuItems.filter(item => item.id === activePage),
    ...menuItems.filter(item => item.id !== activePage)
  ];
  
  const handleNavigation = (item) => {
    if (item.comingSoon) return;
    navigate(item.path);
  };
  
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
    navigate('/');
  };
  
  return (
    <div className="w-64 h-screen bg-dark-gray border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Logo />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sortedItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;
          
          return (
            <motion.button
              key={item.id}
              layout
              transition={springConfig}
              onClick={() => handleNavigation(item)}
              disabled={item.comingSoon}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-smooth text-left
                ${isActive 
                  ? 'bg-primary text-white' 
                  : item.comingSoon
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.comingSoon && (
                <span className="ml-auto text-xs text-gray-500">Soon</span>
              )}
            </motion.button>
          );
        })}
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                     text-gray-400 hover:bg-red-500/10 hover:text-red-400
                     transition-smooth"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};