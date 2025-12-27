import { motion } from "motion/react";
// react hooks imported below
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserDashboardSidebar } from "./UserDashboardSidebar";
import { Bike, MapPin, Calendar, Battery, IndianRupee, Eye, Download, CheckCircle } from "lucide-react";
import React from 'react';
export function MyFleetPage({ onNavigate }) {
    const [selectedVehicle, setSelectedVehicle] = React.useState(null);
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    // Fetch user's vehicles from backend; fall back to empty array
    React.useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch('/api/user/vehicles')
            .then((res) => {
            if (!res.ok)
                throw new Error('Failed to fetch vehicles');
            return res.json();
        })
            .then((data) => {
            if (mounted)
                setVehicles(Array.isArray(data) ? data : []);
        })
            .catch(() => {
            if (mounted)
                setVehicles([]);
        })
            .finally(() => {
            if (mounted)
                setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'completed': return 'bg-gray-500';
            case 'pending': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };
    const getBatteryColor = (level) => {
        if (level > 60)
            return 'text-green-500';
        if (level > 30)
            return 'text-yellow-500';
        return 'text-red-500';
    };
    const downloadReport = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle)
            return;
        const report = `
KWICK EV RENTAL - FLEET REPORT
================================

Vehicle Details:
----------------
Vehicle ID: ${vehicle.id}
Model: ${vehicle.name} ${vehicle.model}
Registration: ${vehicle.registrationNumber}
Status: ${vehicle.status.toUpperCase()}

Rental Period:
--------------
Start Date: ${vehicle.rentStartDate}
End Date: ${vehicle.rentEndDate}

Performance Metrics:
--------------------
Total Kilometers: ${vehicle.totalKm} km
Total Deliveries: ${vehicle.totalDeliveries}
Monthly Earnings: ₹${vehicle.monthlyEarnings.toLocaleString('en-IN')}
Current Battery: ${vehicle.batteryLevel}%
Last Location: ${vehicle.lastLocation}

Generated on: ${new Date().toLocaleDateString('en-IN')}

================================
KWICK - India's #1 EV Rental Platform
    `;
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KWICK_Fleet_Report_${vehicleId}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (<div className="min-h-screen bg-gray-50">
      <UserDashboardSidebar currentPage="fleet" onNavigate={onNavigate}/>
      
      <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2">My Fleet</h1>
            <p className="text-muted-foreground">Manage your rented vehicles and track performance</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Vehicles</p>
                    <p className="text-3xl mt-1">{loading ? '—' : vehicles.filter(v => v.status === 'active').length}</p>
                  </div>
                  <Bike className="w-10 h-10 text-primary"/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-3xl mt-1">₹{(loading ? 0 : vehicles.reduce((sum, v) => sum + (v.monthlyEarnings || 0), 0)).toLocaleString('en-IN')}</p>
                  </div>
                  <IndianRupee className="w-10 h-10 text-green-500"/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deliveries</p>
                    <p className="text-3xl mt-1">{loading ? '—' : vehicles.reduce((sum, v) => sum + (v.totalDeliveries || 0), 0)}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-blue-500"/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-3xl mt-1">{loading ? '—' : vehicles.reduce((sum, v) => sum + (v.totalKm || 0), 0)} km</p>
                  </div>
                  <MapPin className="w-10 h-10 text-purple-500"/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (<div className="col-span-full text-center py-12">Loading vehicles...</div>) : vehicles.length === 0 ? (<div className="col-span-full">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bike className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                    <h3 className="text-xl mb-2">No Vehicles Yet</h3>
                    <p className="text-muted-foreground mb-6">You don't have any rented vehicles right now.</p>
                    <Button onClick={() => onNavigate('rent')} className="bg-primary">
                      Rent a Vehicle
                    </Button>
                  </CardContent>
                </Card>
              </div>) : (vehicles.map((vehicle) => (<motion.div key={vehicle.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden border-2 hover:border-primary transition-colors">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bike className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{vehicle.registrationNumber}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Battery Level */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Battery className={`w-5 h-5 ${getBatteryColor(vehicle.batteryLevel)}`}/>
                          <span className="text-sm">Battery Level</span>
                        </div>
                        <span className={`font-medium ${getBatteryColor(vehicle.batteryLevel)}`}>
                          {vehicle.batteryLevel}%
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground"/>
                        <span className="text-muted-foreground">Last Location:</span>
                        <span className="font-medium">{vehicle.lastLocation}</span>
                      </div>

                      {/* Rental Period */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground"/>
                        <span className="text-muted-foreground">Rental Period:</span>
                        <span className="font-medium">
                          {new Date(vehicle.rentStartDate).toLocaleDateString('en-IN')} - {new Date(vehicle.rentEndDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      {/* Performance Stats */}
                      {vehicle.status === 'active' && (<div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-2xl text-primary">₹{vehicle.monthlyEarnings.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-muted-foreground">Earnings</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl text-blue-500">{vehicle.totalDeliveries}</p>
                            <p className="text-xs text-muted-foreground">Deliveries</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl text-green-500">{vehicle.totalKm}</p>
                            <p className="text-xs text-muted-foreground">Kilometers</p>
                          </div>
                        </div>)}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => onNavigate('iot-tracking')} className="flex-1 bg-primary hover:bg-primary/90">
                          <Eye className="w-4 h-4 mr-2"/>
                          Track Live
                        </Button>
                        <Button onClick={() => downloadReport(vehicle.id)} variant="outline">
                          <Download className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)))}
          </div>

          {/* Note: empty state handled inline above when loading is false */}
        </motion.div>
      </div>
    </div>);
}
