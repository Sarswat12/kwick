import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, User, Battery, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { AdminSidebar } from './AdminSidebar';
import { motion } from 'motion/react';

export const UserManagementPanel = ({ onNavigate }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('kwick_token');
            
            if (!token) {
                console.warn('No authentication token found');
                return;
            }
            
            const response = await fetch(`${apiBase}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const userList = data.items || data || [];
                setUsers(userList);
                if (userList.length > 0 && !selectedUser) {
                    setSelectedUser(userList[0]);
                }
            } else if (response.status === 403) {
                console.error('Access denied - admin privileges required');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = (format) => {
        const dataStr = JSON.stringify(users, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total Users', value: users.length.toString(), color: 'text-blue-500' },
        { label: 'Active', value: users.filter(u => u.status === 'active').length.toString(), color: 'text-green-500' },
        { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length.toString(), color: 'text-gray-500' },
        { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length.toString(), color: 'text-red-500' },
        { label: 'With Vehicles', value: '0', color: 'text-purple-500' },
        { label: 'Total Revenue', value: '₹0', color: 'text-green-500' },
        { label: 'Avg Rating', value: '0.0', color: 'text-yellow-500' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }
    return (<div className="min-h-screen bg-gray-50">
      <AdminSidebar currentPage="admin-users" onNavigate={onNavigate}/>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 p-6 space-y-6 min-h-screen" style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', transition: 'margin-left 0.3s' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">User Management</h2>
          <p className="text-gray-500">Manage users, vehicle assignments, and payment history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => exportData('pdf')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2"/>
            Export
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="bg-red-500 text-white hover:bg-red-600">
            <RefreshCw className="w-4 h-4 mr-2"/>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {stats.map((stat, index) => (<Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </CardContent>
          </Card>))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - User List */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Cards */}
          <div className="space-y-2">
            {filteredUsers.map((user) => (<Card key={user?.id || user?.email} className={`cursor-pointer transition-all hover:shadow-md ${selectedUser?.id === user?.id ? 'ring-2 ring-red-500 bg-red-50' : ''}`} onClick={() => setSelectedUser(user)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-red-500"/>
                      </div>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-500' : ''}>
                        {user.status}
                      </Badge>
                      <Badge variant="outline" className={`${user.tier === 'gold' ? 'border-yellow-500 text-yellow-500' : user.tier === 'platinum' ? 'border-purple-500 text-purple-500' : 'border-gray-500 text-gray-500'}`}>
                        {user.tier}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Joined: {user.joined} • Total: ₹{user.totalSpent}
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>

        {/* Right Side - User Details */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent className="p-6">
              {selectedUser ? (
              <>
              {/* User Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-red-500"/>
                  </div>
                  <div>
                    <h3 className="text-xl">{selectedUser?.name || 'N/A'}</h3>
                    <p className="text-gray-500">User ID: {selectedUser?.id || 'N/A'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={selectedUser?.status === 'active' ? 'default' : 'secondary'} className={selectedUser?.status === 'active' ? 'bg-green-500' : ''}>
                        {selectedUser?.status || 'unknown'}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        {selectedUser?.kycStatus || 'pending'}
                      </Badge>
                      <Badge variant="outline" className={`${selectedUser?.tier === 'gold' ? 'border-yellow-500 text-yellow-500' : selectedUser?.tier === 'platinum' ? 'border-purple-500 text-purple-500' : 'border-gray-500 text-gray-500'}`}>
                        {selectedUser?.tier || 'standard'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2"/>
                    Edit User
                  </Button>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedUser?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedUser?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p>{selectedUser?.joined || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p>{selectedUser?.lastActive || 'N/A'}</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl text-red-500">₹{selectedUser.totalSpent}</div>
                    <div className="text-sm text-gray-500 mt-1">Total Spent</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl text-blue-500">{selectedUser.totalRides}</div>
                    <div className="text-sm text-gray-500 mt-1">Total Rides</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl text-green-500">₹{selectedUser.earnings}</div>
                    <div className="text-sm text-gray-500 mt-1">Delivery Earnings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl text-yellow-500">{selectedUser.rating}/5</div>
                    <div className="text-sm text-gray-500 mt-1">Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="vehicle" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>

                <TabsContent value="vehicle" className="mt-4">
                  {selectedUser.vehicle ? (<div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4>Vehicle Assignment</h4>
                        <Button variant="destructive" size="sm">
                          Unassign
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Vehicle Number</p>
                          <p>{selectedUser.vehicle.number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Model</p>
                          <p>{selectedUser.vehicle.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Controller ID</p>
                          <p>{selectedUser.vehicle.controller}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge className="bg-green-500">{selectedUser.vehicle.status}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Battery Level</p>
                          <div className="flex items-center gap-2">
                            <Battery className="w-4 h-4 text-green-500"/>
                            <p>{selectedUser.vehicle.batteryLevel}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Distance</p>
                          <p>{selectedUser.vehicle.totalDistance}</p>
                        </div>
                      </div>
                    </div>) : (<div className="text-center py-8 text-gray-500">
                      <p>No vehicle assigned</p>
                      <Button className="mt-4 bg-red-500 hover:bg-red-600">Assign Vehicle</Button>
                    </div>)}
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  {selectedUser?.payments && selectedUser.payments.length > 0 ? (<div className="space-y-3">
                      {selectedUser.payments.map((payment, index) => (<Card key={`${selectedUser.id}-payment-${index}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p>{payment.plan} Plan</p>
                                <p className="text-sm text-gray-500">{payment.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-green-500">₹{payment.amount}</p>
                                <p className="text-xs text-gray-500">{payment.method}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>))}
                    </div>) : (<div className="text-center py-8 text-gray-500">No payment history</div>)}
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="text-sm">Last active on {selectedUser.lastActive}</p>
                        <p className="text-xs text-gray-500">Logged in from mobile app</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-sm">Completed {selectedUser.totalRides} rides</p>
                        <p className="text-xs text-gray-500">Total earnings: ₹{selectedUser.earnings}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a user to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </motion.div>
    </div>);
};
