import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, User, PlayCircle, Trophy, MoreHorizontal, LogIn, Bell, Loader2, PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useNotifications } from '../../context/NotificationContext';
import logo from '../../assets/logo.png';

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser } = useAuth();
  const { setShowAuthModal, setShowCreatePostModal, setShowUpgradeModal, setUpgradeReason, setShowManagePlanModal, isLeftSidebarCollapsed, setIsLeftSidebarCollapsed } = useUI();
  const { unreadCount } = useNotifications();
  const [isStudyLoading] = useState(false);

  // Handle Study button click - navigate to Study page
  const handleStudyClick = async () => {
    navigate('/study');
  };

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/feed',
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
      initial={false}
      animate={{ width: isLeftSidebarCollapsed ? '60px' : '280px' }}
      className="hidden lg:flex flex-col h-screen sticky top-0 px-2 justify-between border-r border-reddit-border transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className={`p-3 my-1 flex items-center ${isLeftSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isLeftSidebarCollapsed && (
            <Link to="/feed" className="inline-flex items-center justify-center p-2 rounded-full hover:bg-reddit-cardHover/50 transition-colors w-12 h-12">
              <img src={logo} alt="Studly Logo" className="w-10 h-10 object-contain" />
            </Link>
          )}
          {!isLeftSidebarCollapsed ? (
            <button 
              onClick={() => setIsLeftSidebarCollapsed(true)}
              className="p-2 rounded-full hover:bg-reddit-cardHover/50 text-reddit-textMuted hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          ) : (
            <button 
              onClick={() => setIsLeftSidebarCollapsed(false)}
              className="p-2 rounded-full hover:bg-reddit-cardHover/50 text-reddit-textMuted hover:text-white transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
        </div>


        {/* Nav Items */}
        {!isLeftSidebarCollapsed && (
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

          <button
            id="tour-study-desktop"
            onClick={handleStudyClick}
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
              {!isLeftSidebarCollapsed && <span>{isStudyLoading ? 'Loading...' : 'Start Studying'}</span>}
            </div>
          </button>


            {/* Post Button */}
            <div className="mt-2 px-2">
              <button
                id="tour-post-desktop"
                onClick={() => isAuthenticated ? setShowCreatePostModal(true) : setShowAuthModal(true)}
                className="w-[90%] py-2.5 text-lg bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold rounded-full shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Post
              </button>
            </div>
          </nav>
        )}

        {/* Plan Upgrade/Status Card */}
        {isAuthenticated && !isLeftSidebarCollapsed && (
          <div className="px-4 mb-4">
            <div 
              onClick={() => {
                if (currentUser?.planType === 'pro') {
                  setShowManagePlanModal(true);
                } else {
                  setUpgradeReason('manual');
                  setShowUpgradeModal(true);
                }
              }}
              className={`
                relative overflow-hidden cursor-pointer p-4 rounded-2xl group transition-all duration-300
                ${currentUser?.planType === 'pro' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                  : 'bg-gradient-to-br from-reddit-orange to-orange-600 hover:shadow-[0_0_20px_rgba(255,69,0,0.4)]'}
              `}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Zap className={`w-6 h-6 fill-white text-white ${currentUser?.planType === 'pro' ? '' : 'animate-pulse'}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-bold text-sm">
                    {currentUser?.planType === 'pro' ? 'Pro Plan Active' : 'Upgrade to Pro'}
                  </span>
                  <span className="text-white/80 text-xs truncate">
                    {currentUser?.planType === 'pro' ? 'Manage your subscription' : 'Unlock all premium features'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile / Auth Area (Bottom) */}
        {!isLeftSidebarCollapsed && (
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
        )}
      </div>
    </motion.aside>
  );
};

export default LeftSidebar;