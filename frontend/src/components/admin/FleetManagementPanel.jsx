import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Car } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AdminSidebar } from './AdminSidebar';
import { motion} from 'motion/react';

import { fetchAllUsers } from '../../utils/adminDashboard';

// Fleet data will be fetched from API
// const mockFleetData = [];

export const FleetManagementPanel = ({ onNavigate }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
        useEffect(() => {
          fetchAllUsers(0, 100).then(data => setUsers(data || [])).catch(() => setUsers([]));
        }, []);
    const [addVehicleOpen, setAddVehicleOpen] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        userId: '',
        vehicleNumber: '',
        chassisNumber: '',
        modelNumber: '',
        controllerNumber: '',
        hub: '',
        assignedBy: '',
    });
    const exportData = (format) => {
        alert(`Exporting fleet data as ${format.toUpperCase()}...`);
    };
    const handleAddVehicle = () => {
        alert('Vehicle assigned successfully!');
        setAddVehicleOpen(false);
        setNewVehicle({
            userId: '',
            vehicleNumber: '',
            chassisNumber: '',
            modelNumber: '',
            controllerNumber: '',
            hub: '',
            assignedBy: '',
        });
    };
    const unassignVehicle = (userId) => {
        if (confirm('Are you sure you want to unassign this vehicle?')) {
            alert(`Vehicle unassigned from user ${userId}`);
        }
    };
    const stats = [
        { label: 'Total Vehicles', value: '0', color: 'text-blue-500' },
        { label: 'Assigned', value: '0', color: 'text-green-500' },
        { label: 'Available', value: '0', color: 'text-gray-500' },
        { label: 'In Maintenance', value: '0', color: 'text-yellow-500' },
    ];
    return (<div className="min-h-screen bg-gray-50">
      <AdminSidebar currentPage="admin-fleet" onNavigate={onNavigate}/>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 p-6 space-y-6 min-h-screen" style={{ marginLeft: 'var(--admin-sidebar-width, 280px)', transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Fleet Management</h2>
          <p className="text-gray-500">Manage vehicle assignments and tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setAddVehicleOpen(true)} size="sm" className="bg-red-500 hover:bg-red-600">
            <Plus className="w-4 h-4 mr-2"/>
            Add Vehicle
          </Button>
          <Button onClick={() => exportData('pdf')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2"/>
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - User List */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
              </div>
            </CardContent>
          </Card>

          {/* User Cards */}
          <div className="space-y-2">
            {users.filter(user => {
                const q = searchQuery.toLowerCase();
                return (
                  user.name?.toLowerCase().includes(q) ||
                  user.email?.toLowerCase().includes(q) ||
                  user.phone?.toLowerCase().includes(q)
                );
              }).map((user) => (
                <Card key={user.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedUser?.id === user.id ? 'ring-2 ring-red-500 bg-red-50' : ''}`} onClick={() => setSelectedUser(user)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.phone}</p>
                        {/* Optionally show vehicle info if available */}
                        {/* <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <Car className="w-3 h-3"/>
                          {user.vehicle?.vehicleNumber}
                        </p> */}
                      </div>
                      {/* <Badge className="bg-green-500">{user.vehicle?.status}</Badge> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Right Side - Vehicle Details */}
        <div className="lg:col-span-8">
          <Card>
            <CardContent className="p-6">
              {selectedUser ? (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl">{selectedUser?.name || 'N/A'}</h3>
                      <p className="text-gray-500">User ID: {selectedUser?.id || 'N/A'}</p>
                      <Badge className="bg-green-500 mt-2">{selectedUser?.vehicle?.status || 'unassigned'}</Badge>
                    </div>
                    <Button onClick={() => unassignVehicle(selectedUser.id)} variant="destructive" size="sm">
                      Unassign Vehicle
                    </Button>
                  </div>

                  {/* Vehicle Image */}
                  <div className="mb-6">
                    {selectedUser.vehicle && selectedUser.vehicle.vehicleImage ? (
                      <img src={selectedUser.vehicle.vehicleImage} alt="Vehicle" className="w-full h-64 object-cover rounded-lg"/>
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400">No Image</div>
                    )}
                  </div>

                  {/* Vehicle Details */}
                  {selectedUser.vehicle ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Number</p>
                        <p className="text-lg">{selectedUser.vehicle.vehicleNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chassis Number</p>
                        <p className="text-lg">{selectedUser.vehicle.chassisNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Model Number</p>
                        <p className="text-lg">{selectedUser.vehicle.modelNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Controller Number</p>
                        <p className="text-lg">{selectedUser.vehicle.controllerNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hub</p>
                        <p className="text-lg">{selectedUser.vehicle.hub || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned By</p>
                        <p className="text-lg">{selectedUser.vehicle.assignedBy || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 text-gray-400">No vehicle assigned</div>
                  )}

                  {/* Assignment Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="mb-3">Assignment Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Assigned Date</p>
                        <p>{selectedUser?.vehicle?.assignedDate || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Person Name</p>
                        <p>{selectedUser?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p>{selectedUser?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{selectedUser?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a user to view vehicle details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign New Vehicle</DialogTitle>
            <DialogDescription>
              Assign a vehicle to a user from the fleet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" placeholder="Enter User ID (e.g., USR001)" value={newVehicle.userId} onChange={(e) => setNewVehicle({ ...newVehicle, userId: e.target.value })}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input id="vehicleNumber" placeholder="UP16 EV 1234" value={newVehicle.vehicleNumber} onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}/>
              </div>
              <div>
                <Label htmlFor="chassisNumber">Chassis Number</Label>
                <Input id="chassisNumber" placeholder="CH1234567890" value={newVehicle.chassisNumber} onChange={(e) => setNewVehicle({ ...newVehicle, chassisNumber: e.target.value })}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input id="modelNumber" placeholder="KWICK-ELITE-2024" value={newVehicle.modelNumber} onChange={(e) => setNewVehicle({ ...newVehicle, modelNumber: e.target.value })}/>
              </div>
              <div>
                <Label htmlFor="controllerNumber">Controller Number</Label>
                <Input id="controllerNumber" placeholder="CTRL001" value={newVehicle.controllerNumber} onChange={(e) => setNewVehicle({ ...newVehicle, controllerNumber: e.target.value })}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hub">Hub Location</Label>
                <Select value={newVehicle.hub} onValueChange={(value) => setNewVehicle({ ...newVehicle, hub: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hub"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noida">Noida Hub</SelectItem>
                    <SelectItem value="delhi">Delhi Hub</SelectItem>
                    <SelectItem value="gurugram">Gurugram Hub</SelectItem>
                    <SelectItem value="bangalore">Bangalore Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="assignedBy">Assigned By</Label>
                <Input id="assignedBy" placeholder="Admin Name" value={newVehicle.assignedBy} onChange={(e) => setNewVehicle({ ...newVehicle, assignedBy: e.target.value })}/>
              </div>
            </div>
            <div>
              <Label htmlFor="vehicleImage">Vehicle Image</Label>
              <Input id="vehicleImage" type="file" accept="image/*"/>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddVehicle} className="flex-1 bg-red-500 hover:bg-red-600">
                Assign Vehicle
              </Button>
              <Button onClick={() => setAddVehicleOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </motion.div>
    </div>
  );
};
