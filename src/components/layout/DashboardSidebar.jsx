import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home04Icon,
  UsersIcon,
  UserIcon,
  TrophyIcon,
  Megaphone01Icon,
  Logout03Icon,
  Settings02Icon,
  ArrowUp01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';

const NAV_ITEMS = [
  { label: 'Home', icon: Home04Icon, path: '/home', match: ['/home', '/study'] },
  { label: 'Community', icon: UsersIcon, path: '/feed', match: ['/feed', '/explore', '/saved', '/post'] },
  { label: 'Leaderboard', icon: TrophyIcon, path: '/leaderboard', match: ['/leaderboard'] },
  { label: 'Profile', icon: UserIcon, path: '/profile', match: ['/profile'] },
];

const getInitials = (name) =>
  (name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const AccountMenu = ({ displayName, email, avatarUrl, onLogout, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const menuItems = [
    { label: 'Settings', icon: Settings02Icon, action: () => onNavigate('/settings') },
    { label: 'Log out', icon: Logout03Icon, action: onLogout, destructive: true },
  ];

  return (
    <div
      ref={rootRef}
      className="relative min-w-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full min-w-0 items-center gap-2 rounded-md p-2 text-left text-sm outline-none group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
      >
        <Avatar className="size-8 shrink-0 group-data-[collapsible=icon]:size-7">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback className="text-xs font-semibold">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <span className="flex-1 truncate text-left font-medium group-data-[collapsible=icon]:hidden">{displayName}</span>
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          size={16}
          strokeWidth={2}
          className={`shrink-0 opacity-60 transition-transform group-data-[collapsible=icon]:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-56 max-w-[calc(100vw-2rem)] origin-bottom-left rounded-lg border border-border bg-popover p-1 text-popover-foreground ring-1 ring-foreground/10 animate-scale-in group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:-translate-x-1/2"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium">{displayName}</p>
            {typeof email === 'string' && email ? (
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            ) : null}
          </div>
          <div className="my-1 h-px bg-border" />
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.action();
              }}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors ${
                item.destructive
                  ? 'text-destructive hover:bg-destructive/10'
                  : 'text-popover-foreground hover:bg-accent hover:text-accent-fg'
              }`}
            >
              <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.8} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const DashboardSidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const displayName = currentUser?.name || currentUser?.username || 'Account';
  const avatarUrl = currentUser?.avatar || null;

  const isActiveItem = useMemo(
    () => (item) => item.match.some((route) => location.pathname.startsWith(route)),
    [location.pathname]
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-md p-1.5 hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:hidden"
              >
                <img src={logo} alt="Studly" className="h-8 w-8 object-contain dark:invert" />
              </Link>
              <SidebarTrigger className="group-data-[collapsible=icon]:size-8" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    render={<Link to={item.path} />}
                    isActive={isActiveItem(item)}
                    tooltip={item.label}
                  >
                    <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link to="/releases" />}
              isActive={location.pathname.startsWith('/releases')}
              tooltip="What's New!"
            >
              <HugeiconsIcon icon={Megaphone01Icon} size={20} strokeWidth={1.8} />
              <span>What's New!</span>
            </SidebarMenuButton>
            <SidebarMenuBadge className="p-0">
              <span className="size-2 rounded-full bg-reddit-orange" />
            </SidebarMenuBadge>
          </SidebarMenuItem>

          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <div
              onClick={toggleTheme}
              className="flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground min-w-0"
            >
              <span className="flex-1 truncate">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                onClick={(event) => event.stopPropagation()}
                aria-label="Toggle dark mode"
              />
            </div>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <AccountMenu
              displayName={displayName}
              email={currentUser?.email}
              avatarUrl={avatarUrl}
              onLogout={handleLogout}
              onNavigate={navigate}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
