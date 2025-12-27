import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, FileCheck, Car, CreditCard, Battery, MapPin, HelpCircle, Users, LogOut, FileText, Briefcase, Bell, Zap, X, Menu as MenuIcon } from "lucide-react";
import { cn } from "./ui/utils";
import { useAuth } from "../contexts/AuthContext";
// Export a single page id constant so other components can navigate to the admin dashboard
// Usage: import { ADMIN_DASHBOARD_PAGE } from './DashboardSidebar';
// Then call: onNavigate(ADMIN_DASHBOARD_PAGE); and optionally auth.setSidebarOpen(true);
export const ADMIN_DASHBOARD_PAGE = 'admin-dashboard';
// Simple URL you can open to load the admin dashboard with sidebar open (SPA depends on your router setup):
export const ADMIN_DASHBOARD_URL = '/?page=admin-dashboard&openSidebar=1';
export function DashboardSidebar({ isOpen, setIsOpen, isAdmin, activePage, onNavigate }) {
    const auth = (() => {
        try {
            return useAuth();
        }
        catch (e) {
            return null;
        }
    })();
    // prefer context state if props are not provided
    const ctxOpen = auth?.sidebarOpen;
    const ctxToggle = auth?.toggleSidebar;
    const ctxSet = auth?.setSidebarOpen;
    const open = typeof isOpen === 'boolean' ? isOpen : !!ctxOpen;
    const setOpen = typeof setIsOpen === 'function'
        ? setIsOpen
        : (v) => {
            if (typeof ctxSet === 'function')
                return ctxSet(v);
            if (typeof ctxToggle === 'function')
                return ctxToggle();
        };
    const userMenuItems = [
        { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
        { icon: FileCheck, label: "KYC Verification", page: "kyc" },
        { icon: Car, label: "Rent a Vehicle", page: "rent" },
        { icon: CreditCard, label: "My Payments", page: "payments" },
        { icon: Car, label: "My Fleet", page: "fleet" },
        { icon: Battery, label: "Battery Swap", page: "battery" },
        { icon: MapPin, label: "IoT Tracking", page: "tracking" },
        { icon: HelpCircle, label: "Support", page: "support" },
    ];
    const adminMenuItems = [
        { icon: LayoutDashboard, label: "Dashboard", page: "admin-dashboard" },
        { icon: Users, label: "Users Management", page: "admin-users", badge: '3' },
        { icon: FileCheck, label: "KYC Panel", page: "admin-kyc", badge: '1' },
        { icon: CreditCard, label: "Payment Panel", page: "admin-payments" },
        { icon: Car, label: "Fleet Management", page: "admin-fleet" },
        { icon: Battery, label: "Battery Management", page: "admin-battery" },
        { icon: Zap, label: "IoT Devices", page: "admin-iot" },
        { icon: FileText, label: "Blog CMS", page: "admin-blog" },
        { icon: Briefcase, label: "Career Applications", page: "admin-careers" },
        { icon: Bell, label: "Notifications", page: "admin-notifications", badge: '5' },
    ];
    const menuItems = isAdmin ? adminMenuItems : userMenuItems;
    return (<>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed left-0 right-0 top-0 bottom-0 bg-black/40 z-40 lg:hidden"/>)}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside initial={false} animate={{ width: open ? 320 : 0 }} transition={{ duration: 0.18, ease: "easeInOut" }} className={cn(
        // fixed full height sidebar
        "fixed left-0 top-0 h-screen bg-red-600 text-white z-50 overflow-hidden shadow-xl", "lg:translate-x-0")}>
        <div className="flex flex-col h-full">
          {/* Logo / Header area */}
          <div className="p-4 flex items-center justify-between border-b border-red-500 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white"/>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Kwick</h2>
                <p className="text-sm text-white/90">{isAdmin ? "Admin" : "User"} Portal</p>
              </div>
            </div>

            {/* Close (X) button */}
            <button aria-label="Close sidebar" onClick={() => setOpen(false)} className="absolute right-3 top-3 p-1 rounded-md hover:bg-white/10">
              <X className="w-4 h-4 text-white"/>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {menuItems.map((item) => (<div key={item.page} className="relative px-2">
                <button onClick={() => onNavigate(item.page)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", activePage === item.page
                ? "bg-red-700"
                : "hover:bg-white/5")}>
                  <item.icon className="w-5 h-5 shrink-0 text-white/90"/>
                  <motion.span initial={false} animate={{ opacity: open ? 1 : 0 }} className="truncate text-sm">
                    {item.label}
                  </motion.span>
                  {/* badge shown when expanded */}
                  {open && item.badge && (<span className="ml-auto inline-flex items-center justify-center px-2 py-1 rounded-md bg-white text-red-600 text-xs">{item.badge}</span>)}
                </button>
              </div>))}
          </nav>

          {/* Footer / Logout (pinned to bottom) */}
          <div className="border-t border-red-500 p-4 mt-auto">
            <button onClick={() => {
            if (auth && typeof auth.adminLogout === 'function' && auth.adminAuthenticated) {
                auth.adminLogout();
                onNavigate('home');
                return;
            }
            onNavigate('home');
        }} className="w-full flex items-center gap-3 px-2 py-3 hover:bg-white/5 rounded-md">
              <LogOut className="w-5 h-5"/>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Open tab when closed */}
      {!open && (<div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-60">
          <button onClick={() => setOpen(true)} className="w-8 h-24 bg-red-600 rounded-r-md flex items-center justify-center shadow-lg" aria-label="Open sidebar" title="Open sidebar">
            <MenuIcon className="w-5 h-5 text-white rotate-90"/>
          </button>
        </div>)}
    </>);
}
