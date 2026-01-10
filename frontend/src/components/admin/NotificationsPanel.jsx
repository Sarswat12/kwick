import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AdminSidebar } from './AdminSidebar';
import { motion } from 'motion/react';
const mockNotifications = [
    {
        id: 'NOT001',
        type: 'payment',
        title: 'Payment Expiring Soon',
        message: 'Weekly plan payment expires in 2 days',
        userId: 'USR001',
        userName: 'Raj Kumar',
        priority: 'high',
        daysRemaining: 2,
        amount: 2000,
        timestamp: '2024-01-18 10:30',
        read: false,
    },
    {
        id: 'NOT002',
        type: 'kyc',
        title: 'KYC Pending Approval',
        message: 'New KYC application awaiting review',
        userId: 'USR002',
        userName: 'Priya Sharma',
        priority: 'medium',
        timestamp: '2024-01-18 09:15',
        read: false,
    },
    {
        id: 'NOT003',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Weekly plan payment is overdue by 5 days',
        userId: 'USR004',
        userName: 'Suresh Patel',
        priority: 'high',
        daysRemaining: -5,
        amount: 2000,
        timestamp: '2024-01-10 14:20',
        read: false,
    },
];
export const NotificationsPanel = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState('all');
    const [callbackRequests, setCallbackRequests] = useState([]);
    const [loadingCallback, setLoadingCallback] = useState(false);
    const [callbackError, setCallbackError] = useState("");
    const [contactMessages, setContactMessages] = useState([]);
    const [loadingContact, setLoadingContact] = useState(false);
    const [contactError, setContactError] = useState("");

    useEffect(() => {
        if (filter === 'callback') {
          setLoadingCallback(true);
          fetch('/api/cta-records')
            .then(res => res.json())
            .then(setCallbackRequests)
            .catch(() => setCallbackError("Failed to load callback requests."))
            .finally(() => setLoadingCallback(false));
        } else if (filter === 'contact') {
          setLoadingContact(true);
          fetch('/api/contact-messages')
            .then(res => res.json())
            .then(setContactMessages)
            .catch(() => setContactError("Failed to load contact messages."))
            .finally(() => setLoadingContact(false));
        }
    }, [filter]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all')
            return true;
        if (filter === 'unread')
            return !n.read;
        return n.type === filter;
    });
    const getPriorityColor = (priority, daysRemaining) => {
        if (daysRemaining !== undefined && daysRemaining < 0)
            return 'bg-red-500';
        if (daysRemaining !== undefined && daysRemaining <= 2)
            return 'bg-red-500';
        if (priority === 'high')
            return 'bg-red-500';
        if (priority === 'medium')
            return 'bg-yellow-500';
        return 'bg-blue-500';
    };
    const getIcon = (type) => {
        switch (type) {
            case 'payment': return <DollarSign className="w-5 h-5"/>;
            case 'kyc': return <FileText className="w-5 h-5"/>;
            case 'vehicle': return <AlertCircle className="w-5 h-5"/>;
            default: return <Bell className="w-5 h-5"/>;
        }
    };
    const unreadCount = notifications.filter(n => !n.read).length;
    const urgentCount = notifications.filter(n => (n.priority === 'high' || (n.daysRemaining !== undefined && n.daysRemaining <= 2)) && !n.read).length;
    return (<div className="min-h-screen bg-gray-50">
      <AdminSidebar currentPage="admin-notifications" onNavigate={onNavigate}/>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 p-6 space-y-6 min-h-screen" style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (<Badge className="bg-red-500">{unreadCount} New</Badge>)}
          </h2>
          <p className="text-gray-500">Stay updated with important alerts and pending actions</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline" size="sm">
          <CheckCircle className="w-4 h-4 mr-2"/>
          Mark All Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-red-500">{urgentCount}</div>
            <div className="text-sm text-gray-500 mt-1">Urgent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-yellow-500">{notifications.filter(n => n.type === 'payment').length}</div>
            <div className="text-sm text-gray-500 mt-1">Payment Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-blue-500">{notifications.filter(n => n.type === 'kyc').length}</div>
            <div className="text-sm text-gray-500 mt-1">KYC Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-gray-500">{unreadCount}</div>
            <div className="text-sm text-gray-500 mt-1">Unread</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-red-500">{callbackRequests.length}</div>
            <div className="text-sm text-gray-500 mt-1">Callback Requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="callback">Callback Requests</TabsTrigger>
          <TabsTrigger value="contact">Contact Messages</TabsTrigger>
        </TabsList>

        {/* Existing notification tabs */}
        <TabsContent value={filter} className="mt-6" forceMount>
          {filter !== 'callback' && filter !== 'contact' ? (
            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (filteredNotifications.map(notification => (<Card key={notification.id} className={`${!notification.read ? 'border-l-4' : ''} ${!notification.read ? `border-l-${getPriorityColor(notification.priority, notification.daysRemaining).replace('bg-', '')}` : ''} ${!notification.read ? 'bg-red-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full ${getPriorityColor(notification.priority, notification.daysRemaining)} flex items-center justify-center text-white flex-shrink-0`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4>{notification.title}</h4>
                                {!notification.read && (<Badge className="bg-blue-500">New</Badge>)}
                                {notification.daysRemaining !== undefined && notification.daysRemaining <= 2 && (<Badge className={notification.daysRemaining < 0 ? 'bg-red-500' : 'bg-yellow-500'}>
                                    {notification.daysRemaining < 0 ? 'Overdue' : 'Urgent'}
                                  </Badge>)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>User: {notification.userName} ({notification.userId})</span>
                                <span>•</span>
                                <span>{notification.timestamp}</span>
                                {notification.amount && (<>
                                    <span>•</span>
                                    <span className="text-red-500">₹{notification.amount}</span>
                                  </>)}
                                {notification.daysRemaining !== undefined && (<>
                                    <span>•</span>
                                    <span className={notification.daysRemaining < 0 ? 'text-red-500' : 'text-yellow-500'}>
                                      {notification.daysRemaining < 0
                      ? `${Math.abs(notification.daysRemaining)} days overdue`
                      : `${notification.daysRemaining} days remaining`}
                                    </span>
                                  </>)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (<Button onClick={() => markAsRead(notification.id)} variant="outline" size="sm">
                                  Mark Read
                                </Button>)}
                              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                                Take Action
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>))) : (<div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                  <p>No notifications found</p>
                </div>)}
            </div>
          ) : filter === 'callback' ? (
            <div className="space-y-3">
              {loadingCallback && <div>Loading callback requests...</div>}
              {callbackError && <div className="text-red-500 mb-4">{callbackError}</div>}
              {callbackRequests.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {callbackRequests.map(req => (
                    <Card key={req.id} className="border hover:border-red-500 transition-all">
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className="bg-red-500 text-white">{req.location}</Badge>
                          <span className="text-gray-500 text-xs ml-auto">{new Date(req.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="font-bold text-lg mb-1">{req.name}</div>
                        <div className="text-gray-700 mb-1">{req.email}</div>
                        <div className="text-gray-700 mb-1">{req.phone}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (!loadingCallback && <div className="text-gray-500 mt-8">No callback requests yet.</div>)}
            </div>
          ) : (
            <div className="space-y-3">
              {loadingContact && <div>Loading contact messages...</div>}
              {contactError && <div className="text-red-500 mb-4">{contactError}</div>}
              {contactMessages.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {contactMessages.map(msg => (
                    <Card key={msg.id} className="border hover:border-blue-500 transition-all">
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-2">
                          {msg.inquiryType && <Badge className="bg-blue-500 text-white">{msg.inquiryType}</Badge>}
                          <span className="text-gray-500 text-xs ml-auto">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="font-bold text-lg mb-1">{msg.name}</div>
                        <div className="text-gray-700 mb-1">{msg.email}</div>
                        <div className="text-gray-700 mb-1">{msg.phone}</div>
                        <div className="text-gray-700 mt-2">Subject: {msg.subject}</div>
                        <div className="text-gray-600 mt-1 text-sm">{msg.message}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (!loadingContact && <div className="text-gray-500 mt-8">No contact messages yet.</div>)}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>);
};
