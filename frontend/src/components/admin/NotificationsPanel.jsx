import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertCircle, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AdminSidebar } from './AdminSidebar';
import { motion } from 'motion/react';

// Notifications will be fetched from API - no mock data
const mockNotifications = [];

export const NotificationsPanel = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [callbackRequests, setCallbackRequests] = useState([]);
    const [callbackTotal, setCallbackTotal] = useState(0);
    const [loadingCallback, setLoadingCallback] = useState(false);
    const [callbackError, setCallbackError] = useState("");
    const [contactMessages, setContactMessages] = useState([]);
    const [contactTotal, setContactTotal] = useState(0);
    const [loadingContact, setLoadingContact] = useState(false);
    const [contactError, setContactError] = useState("");
    const [contactStatus, setContactStatus] = useState('all');
    const [contactQuery, setContactQuery] = useState('');
    const [contactPage, setContactPage] = useState(0);
    const contactSize = 12;
    const [callbackStatus, setCallbackStatus] = useState('all');
    const [callbackQuery, setCallbackQuery] = useState('');
    const [callbackPage, setCallbackPage] = useState(0);
    const callbackSize = 12;
    const wsRef = useRef(null);

    const loadCallbacks = () => {
      setLoadingCallback(true);
      const url = `/api/cta-records?status=${callbackStatus}&q=${encodeURIComponent(callbackQuery)}&page=${callbackPage}&size=${callbackSize}`;
      fetch(url)
        .then(res => res.json())
        .then(data => { setCallbackRequests(data.items || []); setCallbackTotal(data.total || 0); })
        .catch(() => setCallbackError("Failed to load callback requests."))
        .finally(() => setLoadingCallback(false));
    };
    const loadContacts = () => {
      setLoadingContact(true);
      const url = `/api/contact-messages?status=${contactStatus}&q=${encodeURIComponent(contactQuery)}&page=${contactPage}&size=${contactSize}`;
      fetch(url)
        .then(res => res.json())
        .then(data => { setContactMessages(data.items || []); setContactTotal(data.total || 0); })
        .catch(() => setContactError("Failed to load contact messages."))
        .finally(() => setLoadingContact(false));
    };
    useEffect(() => { if (filter === 'callback') loadCallbacks(); }, [filter, callbackStatus, callbackQuery, callbackPage]);
    useEffect(() => { if (filter === 'contact') loadContacts(); }, [filter, contactStatus, contactQuery, contactPage]);

    useEffect(() => {
      const origin = window.location.origin.replace(/^http/, 'ws');
      wsRef.current = new WebSocket('ws://localhost:5000/ws/notifications');
      wsRef.current.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'contact' && filter === 'contact') loadContacts();
          if (msg.type === 'callback' && filter === 'callback') loadCallbacks();
          if (msg.type === 'cta' && filter === 'callback') loadCallbacks();
        } catch {}
      };
      return () => { try { wsRef.current && wsRef.current.close(); } catch {} };
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
            <div className="text-2xl text-red-500">{callbackTotal}</div>
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
              <div className="flex gap-2 mb-3">
                <input value={callbackQuery} onChange={e=>setCallbackQuery(e.target.value)} placeholder="Search name/email/phone/location" className="border px-2 py-1 rounded w-full" />
                <select value={callbackStatus} onChange={e=>setCallbackStatus(e.target.value)} className="border px-2 py-1 rounded">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="handled">Handled</option>
                </select>
              </div>
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
                        <div className="text-xs text-gray-500 mt-1">Status: {req.status || 'new'}</div>
                        {req.status !== 'handled' && (
                          <Button size="sm" className="mt-2" onClick={() => {
                            fetch(`/api/cta-records/${req.id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status:'handled'})})
                              .then(()=>loadCallbacks());
                          }}>Mark Handled</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (!loadingCallback && <div className="text-gray-500 mt-8">No callback requests yet.</div>)}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">Page {callbackPage+1} • Showing {callbackRequests.length} of {callbackTotal}</div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={callbackPage<=0} onClick={()=>setCallbackPage(p=>Math.max(p-1,0))}>Prev</Button>
                  <Button variant="outline" disabled={(callbackPage+1)*callbackSize >= callbackTotal} onClick={()=>setCallbackPage(p=>p+1)}>Next</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                <input value={contactQuery} onChange={e=>setContactQuery(e.target.value)} placeholder="Search name/email/phone/subject" className="border px-2 py-1 rounded w-full" />
                <select value={contactStatus} onChange={e=>setContactStatus(e.target.value)} className="border px-2 py-1 rounded">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="handled">Handled</option>
                </select>
              </div>
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
                        <div className="text-xs text-gray-500 mt-1">Status: {msg.status || 'new'}</div>
                        {msg.status !== 'handled' && (
                          <Button size="sm" className="mt-2" onClick={() => {
                            fetch(`/api/contact-messages/${msg.id}/status`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status:'handled'})})
                              .then(()=>loadContacts());
                          }}>Mark Handled</Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (!loadingContact && <div className="text-gray-500 mt-8">No contact messages yet.</div>)}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">Page {contactPage+1} • Showing {contactMessages.length} of {contactTotal}</div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={contactPage<=0} onClick={()=>setContactPage(p=>Math.max(p-1,0))}>Prev</Button>
                  <Button variant="outline" disabled={(contactPage+1)*contactSize >= contactTotal} onClick={()=>setContactPage(p=>p+1)}>Next</Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>);
};
