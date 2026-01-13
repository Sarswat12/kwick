import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, FileText, CreditCard, Car, Bell, Newspaper, Briefcase, Menu, X, } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';
export const AdminSidebar = ({ currentPage, onNavigate }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [badgeCounts, setBadgeCounts] = useState({
        users: 0,
        kyc: 0,
        notifications: 0
    });
    const { logout } = useAuth();

    // Fetch real counts from backend
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('kwick_token');
                
                if (!token) {
                    console.warn('No authentication token found');
                    return;
                }
                
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                
                // Fetch user count
                const usersRes = await fetch(`${API_BASE}/admin/users?size=0`, { headers });
                if (usersRes.ok) {
                    const usersData = await usersRes.json();
                    setBadgeCounts(prev => ({ ...prev, users: usersData.total || 0 }));
                }

                // Fetch pending KYC count
                const kycRes = await fetch(`${API_BASE}/admin/kyc/all?status=pending&size=0`, { headers });
                if (kycRes.ok) {
                  const kycData = await kycRes.json();
                  const meta = kycData.body || kycData.data || kycData;
                  const kycTotal = meta?.total || 0;
                  setBadgeCounts(prev => ({ ...prev, kyc: kycTotal }));
                }

                // Fetch notification count (placeholder - implement actual endpoint)
                // For now, set to 0 until notification API is implemented
                setBadgeCounts(prev => ({ ...prev, notifications: 0 }));
            } catch (error) {
                console.error('Error fetching badge counts:', error);
            }
        };

        fetchCounts();
        // Refresh counts every 30 seconds
        const interval = setInterval(fetchCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    // Expose sidebar state to parent components via CSS variable
    React.useEffect(() => {
        document.documentElement.style.setProperty('--admin-sidebar-width', sidebarOpen ? '280px' : '80px');
    }, [sidebarOpen]);

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'admin-dashboard', badge: null },
        { label: 'User Management', icon: Users, page: 'admin-users', badge: badgeCounts.users > 0 ? badgeCounts.users.toString() : null },
        { label: 'KYC Management', icon: FileText, page: 'admin-kyc', badge: badgeCounts.kyc > 0 ? badgeCounts.kyc.toString() : null },
        { label: 'Payments', icon: CreditCard, page: 'admin-payments', badge: null },
        { label: 'Fleet Management', icon: Car, page: 'admin-fleet', badge: null },
        { label: 'Notifications', icon: Bell, page: 'admin-notifications', badge: badgeCounts.notifications > 0 ? badgeCounts.notifications.toString() : null },
        { label: 'Blog CMS', icon: Newspaper, page: 'admin-blog', badge: null },
        { label: 'Career CMS', icon: Briefcase, page: 'admin-careers', badge: null },
    ];
    return (<motion.aside initial={false} animate={{ width: sidebarOpen ? 280 : 80 }} className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 overflow-y-auto z-40 shadow-lg">
      <div className="p-4">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full justify-start mb-4 hover:bg-gray-100">
          {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          {sidebarOpen && <span className="ml-2">Close Menu</span>}
        </Button>

        <nav className="space-y-2">
          {menuItems.map((item) => (<button key={item.page} onClick={() => onNavigate(item.page)} className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-all ${currentPage === item.page
                ? 'bg-red-500 text-white shadow-md'
                : 'hover:bg-red-50 group'} ${!sidebarOpen ? 'justify-center' : ''}`}>
              <item.icon className={`w-5 h-5 ${currentPage === item.page
                ? 'text-white'
                : 'text-gray-600 group-hover:text-red-500'}`}/>
              {sidebarOpen && (<>
                  <span className={`flex-1 text-left whitespace-nowrap ${currentPage === item.page ? 'text-white' : 'group-hover:text-red-500'}`}>
                    {item.label}
                  </span>
                  {item.badge && (<Badge className={currentPage === item.page ? 'bg-white text-red-500' : 'bg-red-500'}>
                      {item.badge}
                    </Badge>)}
                </>)}
            </button>))}
        </nav>
      </div>
      <div className="p-4 border-t">
        <button onClick={() => {
            logout();
            onNavigate('admin-login');
        }} className="w-full px-4 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-100 rounded-lg">
          Logout
        </button>
      </div>
    </motion.aside>);
};
