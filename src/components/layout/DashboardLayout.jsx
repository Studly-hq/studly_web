import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { useUI } from '../../context/UIContext';
import DashboardSidebar from './DashboardSidebar';
import MobileBottomNav from './MobileBottomNav';

/**
 * v3 dashboard shell — sidebar + rounded inset canvas.
 * Structure borrowed from the reference mockups: content floats in a
 * rounded card inside SidebarInset, never edge-to-edge.
 *
 * - /home (Lucid) gets the full canvas, no bottom nav, no scroll chrome.
 * - Every other page keeps the exact mobile spacing/scroll the feed
 *   already had (pb-20 + MobileBottomNav), so the feed stays untouched.
 */
const DashboardLayout = () => {
  const { pathname } = useLocation();
  const { isLucidDetailedMode } = useUI();
  const isLucidSurface = pathname === '/home' || pathname === '/study';

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="overflow-hidden bg-background md:m-2 md:ml-0 md:rounded-2xl md:border md:border-border md:shadow-sm">
        <div
          className={`flex min-h-0 w-full flex-1 ${
            isLucidSurface
              ? 'flex-col overflow-hidden'
              : isLucidDetailedMode
                ? 'flex-col overflow-y-hidden pb-0'
                : 'flex-col overflow-y-auto pb-20 lg:pb-0'
          }`}
        >
          <Outlet />
        </div>
        {!isLucidSurface && <MobileBottomNav />}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
