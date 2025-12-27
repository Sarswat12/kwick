import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, FileText, Car, CreditCard, Battery, LogOut, Menu, X, Zap, Bike, Radio, HeadphonesIcon, } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
export const UserDashboardSidebar = ({ currentPage, onNavigate }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout, isAdmin, switchToAdminView } = useAuth();
    // Expose sidebar state to parent components via CSS variable
    React.useEffect(() => {
        const isDesktop = window.innerWidth >= 1024;
        const width = isDesktop ? (sidebarOpen ? '280px' : '80px') : '0px';
        document.documentElement.style.setProperty('--user-sidebar-width', width);
    }, [sidebarOpen]);
    // Also update on resize
    useEffect(() => {
        const onResize = () => {
            const isDesktop = window.innerWidth >= 1024;
            const width = isDesktop ? (sidebarOpen ? '280px' : '80px') : '0px';
            document.documentElement.style.setProperty('--user-sidebar-width', width);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [sidebarOpen]);
    const handleLogout = () => {
        logout();
        onNavigate('home');
    };
    const handleSwitchToAdmin = () => {
        if (isAdmin) {
            switchToAdminView();
            window.history.pushState({}, '', '/admin-secret-login');
            onNavigate('admin-login');
        }
    };
    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'user-dashboard' },
        { label: 'KYC Verification', icon: FileText, page: 'kyc' },
        { label: 'Rent a Vehicle', icon: Car, page: 'rent' },
        { label: 'My Fleet', icon: Bike, page: 'fleet' },
        { label: 'My Payments', icon: CreditCard, page: 'payments' },
        { label: 'Battery Swap', icon: Battery, page: 'battery-swap' },
        { label: 'IoT Tracking', icon: Radio, page: 'iot-tracking' },
        { label: 'Support', icon: HeadphonesIcon, page: 'support' },
    ];
    return (<>
      {/* Toggle Button */}
      <Button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed left-4 top-24 z-50 bg-red-500 hover:bg-red-600 text-white shadow-lg" size="sm">
        {sidebarOpen ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
      </Button>

      {/* Sidebar */}
      <motion.aside initial={false} animate={{ width: sidebarOpen ? 280 : 80 }} className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-[#1a1a1a] text-white overflow-hidden z-40 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white"/>
              </div>
              <span className="text-xl whitespace-nowrap">KWICK</span>
            </div>
            <p className="text-xs text-gray-400 whitespace-nowrap">User Portal</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {menuItems.map((item) => (<button key={item.page} onClick={() => onNavigate(item.page)} className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${currentPage === item.page
                ? 'bg-red-500 text-white'
                : 'text-gray-300 hover:bg-gray-800'}`}>
                <item.icon className="w-5 h-5 flex-shrink-0"/>
                {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
              </button>))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 flex-shrink-0"/>
              {sidebarOpen && <span className="text-sm whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (<div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden"/>)}
    </>);
};
