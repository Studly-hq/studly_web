import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home04Icon, UsersIcon, TrophyIcon, UserIcon } from '@hugeicons/core-free-icons';

const navItems = [
  { icon: Home04Icon, label: 'Home', path: '/home', match: ['/home', '/study'] },
  { icon: UsersIcon, label: 'Community', path: '/feed', match: ['/feed', '/explore', '/saved', '/post'] },
  { icon: TrophyIcon, label: 'Ranking', path: '/leaderboard', match: ['/leaderboard'] },
  { icon: UserIcon, label: 'Profile', path: '/profile', match: ['/profile'] }
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Portal to body: no ancestor overflow/transform can clip or offset the nav
  return createPortal(
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] flex justify-center px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pointer-events-none"
    >
      <div className="pointer-events-auto flex w-full max-w-[260px] items-center justify-between gap-0.5 rounded-xl border border-border bg-popover p-1 ring-1 ring-foreground/5">
        {navItems.map((item) => {
          const active = item.match.some((route) => location.pathname.startsWith(route));

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 outline-none transition-colors duration-200 ${
                active
                  ? 'text-reddit-text'
                  : 'text-reddit-textMuted hover:text-reddit-text'
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-xl bg-accent" />
              )}
              <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} className="relative z-10" />
              <span className="relative z-10 text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>,
    document.body
  );
};

export default MobileBottomNav;
