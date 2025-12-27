import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, FileText, CreditCard, Car, Bell, Newspaper, Briefcase, Menu, X, User, } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
export const EnhancedAdminDashboard = ({ onNavigate }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { switchToUserView } = useAuth();
    const handleSwitchToUser = () => {
        switchToUserView();
        onNavigate('user-dashboard');
    };
    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'admin-dashboard', badge: null },
        { label: 'User Management', icon: Users, page: 'admin-users', badge: '3' },
        { label: 'KYC Management', icon: FileText, page: 'admin-kyc', badge: '1' },
        { label: 'Payments', icon: CreditCard, page: 'admin-payments', badge: null },
        { label: 'Fleet Management', icon: Car, page: 'admin-fleet', badge: null },
        { label: 'Notifications', icon: Bell, page: 'admin-notifications', badge: '5' },
        { label: 'Blog CMS', icon: Newspaper, page: 'admin-blog', badge: null },
        { label: 'Career CMS', icon: Briefcase, page: 'admin-careers', badge: null },
    ];
    const stats = [
        { label: 'Total Users', value: '3', change: '+12%', color: 'text-blue-500' },
        { label: 'Active Vehicles', value: '2', change: '+8%', color: 'text-green-500' },
        { label: 'Total Revenue', value: '₹10,356', change: '+25%', color: 'text-green-500' },
        { label: 'Pending KYC', value: '1', change: '-5%', color: 'text-yellow-500' },
        { label: 'Pending Payments', value: '₹2,000', change: '+2', color: 'text-red-500' },
        { label: 'Avg Rating', value: '4.8', change: '+0.2', color: 'text-yellow-500' },
    ];
    const recentActivity = [
        { time: '5 mins ago', description: 'New KYC application from Priya Sharma' },
        { time: '12 mins ago', description: 'Payment received from Raj Kumar (₹2,000)' },
        { time: '1 hour ago', description: 'Vehicle UP16 EV 1234 assigned to Amit Singh' },
        { time: '2 hours ago', description: 'New user registration: Suresh Patel' },
    ];
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
                <Button onClick={handleSwitchToUser} variant="outline" className="border-blue-200 text-blue-500 hover:bg-blue-50">
                  <User className="w-4 h-4 mr-2"/>
                  Switch to User Dashboard
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
                {/* Notifications */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl">Alerts</h3>
                      <Badge className="bg-red-500">5</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-sm">Payment overdue</p>
                        <p className="text-xs text-gray-500">2 users</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-sm">KYC pending approval</p>
                        <p className="text-xs text-gray-500">1 application</p>
                      </div>
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm">New user registrations</p>
                        <p className="text-xs text-gray-500">3 today</p>
                      </div>
                    </div>
                    <Button onClick={() => onNavigate('admin-notifications')} className="w-full mt-4 bg-red-500 hover:bg-red-600">
                      View All Notifications
                    </Button>
                  </CardContent>
                </Card>

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
