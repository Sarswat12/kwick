import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, FileText, Car, CreditCard, Battery, MapPin, Gauge, AlertCircle, CheckCircle, Check, QrCode, Upload, TrendingUp, Activity, Bell, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { UserDashboardSidebar } from './UserDashboardSidebar';
export const EnhancedUserDashboard = ({ onNavigate }) => {
    const { user, logout, isAdmin, switchToAdminView } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const [utrNumber, setUtrNumber] = useState('');
    const handleLogout = () => {
        logout();
        onNavigate('home');
    };
    const handleSwitchToAdmin = () => {
        switchToAdminView();
        onNavigate('admin-dashboard');
    };
    const handleFileUpload = (e) => {
        if (e?.target?.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };
    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'kyc', label: 'KYC Verification', icon: FileText, action: () => onNavigate('kyc') },
        { id: 'rent', label: 'Rent a Vehicle', icon: Car, action: () => onNavigate('rent') },
        { id: 'payments', label: 'My Payments', icon: CreditCard },
        { id: 'fleet', label: 'My Fleet', icon: Car },
        { id: 'battery', label: 'Battery Swap', icon: Battery },
        { id: 'tracking', label: 'IoT Tracking', icon: MapPin },
        { id: 'support', label: 'Support', icon: User },
    ];
    // Plans and lists are now empty by default; real data should come from backend APIs.
    const plans = [];
    const fleetVehicles = [];
    const batteryStations = [];
    const renderDashboard = () => (<>
      {/* Welcome Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl text-black mb-1">
          Welcome back, <span className="text-red-500">{user?.name || 'User'}!</span>
        </h2>
        <p className="text-sm text-gray-600">Here's your rental overview</p>
      </motion.div>

      {/* Alert Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"/>
          <div className="flex-1">
            <p className="text-sm text-red-800 mb-1">Your monthly plan expires in</p>
            <p className="text-2xl text-red-600">0 days</p>
            <p className="text-sm text-red-700 mt-1">Renew now to continue riding!</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Plan */}
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <p className="text-xl text-black"></p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-red-500"/>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">Inactive</Badge>
            <p className="text-xs text-green-600 mt-2">Not Subscribed</p>
          </CardContent>
        </Card>

        {/* Vehicle No */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehicle No.</p>
                <p className="text-xl text-black"></p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-500"/>
              </div>
            </div>
            <p className="text-xs text-gray-600">—</p>
          </CardContent>
        </Card>

        {/* Battery Level */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Battery Level</p>
                <p className="text-xl text-black"></p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Battery className="w-5 h-5 text-green-500"/>
              </div>
            </div>
            <p className="text-xs text-green-600">~0 km range</p>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">KYC Status</p>
                <p className="text-xl text-black">Pending</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500"/>
              </div>
            </div>
            <Badge className="bg-gray-100 text-gray-700 border-gray-200">Unknown</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h3 className="text-xl text-black mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button onClick={() => onNavigate('kyc')} variant="outline" className="h-24 flex-col gap-2 hover:border-red-500 hover:text-red-500">
          <FileText className="w-6 h-6"/>
          <span className="text-sm">KYC Details</span>
        </Button>
        <Button onClick={() => onNavigate('rent')} variant="outline" className="h-24 flex-col gap-2 hover:border-red-500 hover:text-red-500">
          <Car className="w-6 h-6"/>
          <span className="text-sm">Rent Vehicle</span>
        </Button>
        <Button onClick={() => setActiveSection('payments')} variant="outline" className="h-24 flex-col gap-2 hover:border-red-500 hover:text-red-500">
          <CreditCard className="w-6 h-6"/>
          <span className="text-sm">Make Payment</span>
        </Button>
        <Button onClick={() => setActiveSection('battery')} variant="outline" className="h-24 flex-col gap-2 hover:border-red-500 hover:text-red-500">
          <Battery className="w-6 h-6"/>
          <span className="text-sm">Battery Swap</span>
        </Button>
      </div>
    </>);
    const renderPayments = () => (<>
      <h2 className="text-2xl text-black mb-6">My Payments</h2>

      <Tabs defaultValue="choose-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="choose-plan">Choose Plan</TabsTrigger>
          <TabsTrigger value="payment">Make Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        {/* Choose Plan Tab */}
        <TabsContent value="choose-plan">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (<Card key={plan.id} className={`cursor-pointer transition-all hover:shadow-lg ${selectedPlan === plan.id ? 'border-red-500 border-2 shadow-lg' : ''}`} onClick={() => setSelectedPlan(plan.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    {selectedPlan === plan.id && (<Check className="w-6 h-6 text-red-500"/>)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-3xl text-black mb-1">{plan.price}</p>
                    <p className="text-sm text-gray-600">{plan.duration}</p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (<li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/>
                        <span>{feature}</span>
                      </li>))}
                  </ul>
                  <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan(plan.id);
            }}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>))}
          </div>

          {selectedPlan && (<div className="mt-6">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-lg py-6" onClick={() => {
                const tabsTrigger = document.querySelector('[value="payment"]');
                tabsTrigger?.click();
            }}>
                Proceed to Payment
              </Button>
            </div>)}
        </TabsContent>

        {/* Make Payment Tab */}
        <TabsContent value="payment">
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5"/>
                  Scan QR to Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <QrCode className="w-48 h-48 text-gray-400"/>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Scan with any UPI app</p>
                  <p className="text-lg text-black mb-1">kwick@upi</p>
                  {selectedPlan && (<p className="text-2xl text-red-500">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </p>)}
                </div>
              </CardContent>
            </Card>

            {/* Payment Proof Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5"/>
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="utr">UTR Number</Label>
                    <Input id="utr" placeholder="Enter 12-digit UTR number" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} maxLength={12} className="mt-1"/>
                  </div>

                  <div>
                    <Label htmlFor="payment-proof">Payment Screenshot</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Input id="payment-proof" type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="flex-1"/>
                    </div>
                    {paymentProof && (<p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4"/>
                        {paymentProof.name}
                      </p>)}
                  </div>

                  <div className="pt-4">
                    <Button className="w-full bg-red-500 hover:bg-red-600" disabled={!utrNumber || !paymentProof}>
                      Submit Payment Proof
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Your payment will be verified within 24 hours. 
                      You'll receive a confirmation once approved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
            { date: '01 Oct 2025', plan: 'Pro Plan', amount: '₹5,999', status: 'Paid', utr: 'UTR2345678901' },
            { date: '01 Sep 2025', plan: 'Pro Plan', amount: '₹5,999', status: 'Paid', utr: 'UTR1234567890' },
            { date: '01 Aug 2025', plan: 'Basic Plan', amount: '₹3,999', status: 'Paid', utr: 'UTR9876543210' },
        ].map((payment, idx) => (<div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-black mb-1">{payment.plan}</p>
                      <p className="text-sm text-gray-600">{payment.date}</p>
                      <p className="text-xs text-gray-500 mt-1">UTR: {payment.utr}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl text-black mb-1">{payment.amount}</p>
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>);
    const renderFleet = () => (<>
      <h2 className="text-2xl text-black mb-6">My Fleet</h2>

      <div className="grid gap-6">
        {fleetVehicles.map((vehicle) => (<Card key={vehicle.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-red-500"/>
                    </div>
                    <div>
                      <p className="text-xl text-black">{vehicle.number}</p>
                      <p className="text-sm text-gray-600">{vehicle.model}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Battery Level</p>
                      <div className="flex items-center gap-2">
                        <Progress value={vehicle.battery} className="flex-1 h-2"/>
                        <span className="text-sm text-black">{vehicle.battery}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Location</p>
                      <p className="text-sm text-black flex items-center gap-1">
                        <MapPin className="w-4 h-4"/>
                        {vehicle.location}
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setActiveSection('tracking')} className="ml-4">
                  Track Live
                </Button>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Fleet Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500"/>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
              <p className="text-2xl text-black">₹42,000</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-500"/>
                <p className="text-sm text-gray-600">Total Trips</p>
              </div>
              <p className="text-2xl text-black">284</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-5 h-5 text-orange-500"/>
                <p className="text-sm text-gray-600">Distance</p>
              </div>
              <p className="text-2xl text-black">1,240 km</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Battery className="w-5 h-5 text-green-500"/>
                <p className="text-sm text-gray-600">Avg Battery</p>
              </div>
              <p className="text-2xl text-black">62%</p>
              <p className="text-xs text-gray-500 mt-1">Fleet average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>);
    const renderBatterySwap = () => (<>
      <h2 className="text-2xl text-black mb-6">Battery Swap Stations</h2>

      <div className="grid gap-4">
        {batteryStations.map((station) => (<Card key={station.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Battery className="w-5 h-5 text-green-500"/>
                    </div>
                    <div>
                      <p className="text-lg text-black">{station.name}</p>
                      <p className="text-sm text-gray-600">{station.distance} away</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Batteries</p>
                      <p className="text-xl text-black">{station.available}/{station.total}</p>
                    </div>
                    <Badge className={station.status === 'Online'
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-yellow-100 text-yellow-700 border-yellow-300'}>
                      {station.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="bg-red-500 hover:bg-red-600" onClick={() => onNavigate('battery-stations')}>
                    Navigate
                  </Button>
                  <Button variant="outline">
                    Call Station
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Battery Swap History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
            { date: '14 Oct 2025, 10:30 AM', station: 'KWICK Hub - Sector 112', battery: '78%' },
            { date: '13 Oct 2025, 3:15 PM', station: 'KWICK Hub - Sector 18', battery: '85%' },
            { date: '12 Oct 2025, 9:45 AM', station: 'KWICK Hub - Sector 62', battery: '92%' },
        ].map((swap, idx) => (<div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-black">{swap.station}</p>
                  <p className="text-sm text-gray-600">{swap.date}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  {swap.battery}
                </Badge>
              </div>))}
          </div>
        </CardContent>
      </Card>
    </>);
    const renderTracking = () => (<>
      <h2 className="text-2xl text-black mb-6">IoT Vehicle Tracking</h2>
      <Card>
        <CardContent className="p-6">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
              <p className="text-gray-600">Real-time tracking map will appear here</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Speed</p>
              <p className="text-2xl text-black">35 km/h</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Distance Today</p>
              <p className="text-2xl text-black">48 km</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Battery Left</p>
              <p className="text-2xl text-black">78%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* User Dashboard Sidebar */}
        <UserDashboardSidebar currentPage="user-dashboard" onNavigate={onNavigate}/>

        {/* Main Content */}
        <div className="ml-0 lg:ml-[var(--user-sidebar-width,280px)] transition-all pt-20">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl text-black">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'payments' && 'My Payments'}
              {activeSection === 'fleet' && 'My Fleet'}
              {activeSection === 'battery' && 'Battery Swap'}
              {activeSection === 'tracking' && 'IoT Tracking'}
              {activeSection === 'support' && 'Support'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* removed switch-to-admin button for users */}
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600"/>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                2
              </span>
            </button>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <User className="w-5 h-5 text-red-500"/>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-auto">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'payments' && renderPayments()}
          {activeSection === 'fleet' && renderFleet()}
          {activeSection === 'battery' && renderBatterySwap()}
          {activeSection === 'tracking' && renderTracking()}
          {activeSection === 'support' && (<div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
              <h3 className="text-xl text-black mb-2">Support Center</h3>
              <p className="text-gray-600">Contact us at support@kwick.in or call 1800-XXX-XXXX</p>
            </div>)}
        </div>
      </div>
    </div>);
};
