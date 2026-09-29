import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home04Icon,
  UsersIcon,
  UserIcon,
  Megaphone01Icon,
  Logout03Icon,
  MoonIcon,
  Sun03Icon,
  Settings02Icon,
  ChevronDownIcon,
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
  SidebarRail,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const NAV_ITEMS = [
  { label: 'Home', icon: Home04Icon, path: '/home', match: ['/home', '/study'] },
  { label: 'Community', icon: UsersIcon, path: '/feed', match: ['/feed', '/explore', '/saved', '/post', '/leaderboard'] },
  { label: 'Profile', icon: UserIcon, path: '/profile', match: ['/profile'] },
  { label: "What's New!", icon: Megaphone01Icon, path: '/releases', match: ['/releases'] },
];

const getInitials = (name) =>
  (name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
            <div className="flex items-center justify-between px-2 py-1.5">
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-md p-1.5 hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:hidden"
              >
                <img src={logo} alt="Studly" className="h-8 w-8 object-contain" />
              </Link>
              <span className="hidden group-data-[collapsible=icon]:flex h-8 w-8 items-center justify-center">
                <img src={logo} alt="Studly" className="h-7 w-7 object-contain" />
              </span>
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
                  {item.label === "What's New!" && (
                    <SidebarMenuBadge className="p-0">
                      <span className="size-2 rounded-full bg-reddit-orange" />
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'} onClick={toggleTheme}>
              <HugeiconsIcon icon={theme === 'dark' ? Sun03Icon : MoonIcon} size={20} strokeWidth={1.8} />
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" tooltip={displayName} />
                }
              >
                <Avatar className="size-8">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                  <AvatarFallback className="text-xs font-semibold">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-left font-medium">{displayName}</span>
                <HugeiconsIcon icon={ChevronDownIcon} size={16} strokeWidth={2} className="opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="truncate">{displayName}</span>
                  {currentUser?.email ? (
                    <span className="truncate text-xs font-normal text-muted-foreground">{currentUser.email}</span>
                  ) : null}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.8} />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <HugeiconsIcon icon={Settings02Icon} size={16} strokeWidth={1.8} />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <HugeiconsIcon icon={Logout03Icon} size={16} strokeWidth={1.8} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
