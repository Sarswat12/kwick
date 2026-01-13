import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, FileText, CreditCard, Car, Bell, Newspaper, Briefcase, Menu, X, LogOut, } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/apiClient';
export const EnhancedAdminDashboard = ({ onNavigate }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch users count using apiClient (includes Authorization header)
            const usersRes = await apiClient.get('/admin/users');
            const usersData = usersRes.data || { items: [] };
            const users = usersData.items || usersData || [];
            
            // Fetch KYC count using apiClient (includes Authorization header)
            const kycRes = await apiClient.get('/admin/kyc/all');
            const kycData = kycRes.data || { body: { items: [] } };
            const kycMeta = kycData.body || kycData.data || kycData;
            const kycList = Array.isArray(kycMeta.items) ? kycMeta.items : (Array.isArray(kycMeta) ? kycMeta : []);
            
            // Calculate stats
            const statsData = [
                { label: 'Total Users', value: users.length.toString(), color: 'text-blue-500', change: '+0%' },
                { label: 'Active Vehicles', value: '0', color: 'text-green-500', change: '+0%' },
                { label: 'Revenue', value: '₹0', color: 'text-purple-500', change: '+0%' },
                { label: 'KYC Pending', value: kycList.filter(k => k.status === 'pending').length.toString(), color: 'text-yellow-500', change: '+0%' },
                { label: 'Total Rides', value: '0', color: 'text-indigo-500', change: '+0%' },
                { label: 'Avg Rating', value: '0.0', color: 'text-red-500', change: '+0%' },
            ];
            
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('kwick_user');
        localStorage.removeItem('kwick_view_mode');
        window.location.href = '/admin-secret-login';
    };
    
    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'admin-dashboard', badge: null },
        { label: 'User Management', icon: Users, page: 'admin-users', badge: null },
        { label: 'KYC Management', icon: FileText, page: 'admin-kyc', badge: null },
        { label: 'Payments', icon: CreditCard, page: 'admin-payments', badge: null },
        { label: 'Fleet Management', icon: Car, page: 'admin-fleet', badge: null },
        { label: 'Notifications', icon: Bell, page: 'admin-notifications', badge: null },
        { label: 'Blog CMS', icon: Newspaper, page: 'admin-blog', badge: null },
        { label: 'Career CMS', icon: Briefcase, page: 'admin-careers', badge: null },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (<div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside initial={false} animate={{ width: sidebarOpen ? 280 : 80 }} className="fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 overflow-y-auto z-40">
          <div className="p-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full justify-start mb-4">
              {sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </Button>

            <nav className="space-y-2">
              {menuItems.map((item) => (<button key={item.page} onClick={() => onNavigate(item.page)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors group">
                  <item.icon className="w-5 h-5 text-gray-600 group-hover:text-red-500"/>
                  {sidebarOpen && (<>
                      <span className="flex-1 text-left group-hover:text-red-500">{item.label}</span>
                      {item.badge && (<Badge className="bg-red-500">{item.badge}</Badge>)}
                    </>)}
                </button>))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
          <div className="p-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl text-black mb-2">
                    Admin <span className="text-red-500">Dashboard</span>
                  </h1>
                  <p className="text-gray-600">Monitor and manage your EV rental platform</p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2"/>
                  Logout
                </Button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{stat.label}</span>
                        <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className={`text-2xl ${stat.color}`}>{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => onNavigate('admin-users')} className="h-24 flex-col gap-2 bg-blue-500 hover:bg-blue-600">
                        <Users className="w-6 h-6"/>
                        User Management
                      </Button>
                      <Button onClick={() => onNavigate('admin-kyc')} className="h-24 flex-col gap-2 bg-yellow-500 hover:bg-yellow-600">
                        <FileText className="w-6 h-6"/>
                        Review KYC
                      </Button>
                      <Button onClick={() => onNavigate('admin-payments')} className="h-24 flex-col gap-2 bg-green-500 hover:bg-green-600">
                        <CreditCard className="w-6 h-6"/>
                        Manage Payments
                      </Button>
                      <Button onClick={() => onNavigate('admin-fleet')} className="h-24 flex-col gap-2 bg-purple-500 hover:bg-purple-600">
                        <Car className="w-6 h-6"/>
                        Fleet Management
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (<div key={index} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* System Status */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl mb-4">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Platform</span>
                        <Badge className="bg-green-500">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Gateway</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-500">Healthy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
