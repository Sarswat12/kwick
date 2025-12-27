import { motion } from "motion/react";
import { Search, Filter, Download, UserPlus, MoreVertical, CheckCircle, XCircle, Clock, Car, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./ui/dropdown-menu";
export function AdminUsersPage() {
    const users = [
        {
            id: "USR001",
            name: "Rahul Sharma",
            email: "rahul@example.com",
            phone: "+91 98765 43210",
            plan: "Monthly Pro",
            kycStatus: "approved",
            vehicle: "DL 8C AB 1234",
            joinDate: "Oct 11, 2025",
            status: "active"
        },
        {
            id: "USR002",
            name: "Priya Patel",
            email: "priya@example.com",
            phone: "+91 98765 43211",
            plan: "Weekly",
            kycStatus: "pending",
            vehicle: "Not Assigned",
            joinDate: "Oct 10, 2025",
            status: "pending"
        },
        {
            id: "USR003",
            name: "Amit Kumar",
            email: "amit@example.com",
            phone: "+91 98765 43212",
            plan: "Monthly Pro",
            kycStatus: "approved",
            vehicle: "DL 8C AB 1235",
            joinDate: "Oct 9, 2025",
            status: "active"
        },
        {
            id: "USR004",
            name: "Neha Singh",
            email: "neha@example.com",
            phone: "+91 98765 43213",
            plan: "Daily",
            kycStatus: "rejected",
            vehicle: "Not Assigned",
            joinDate: "Oct 8, 2025",
            status: "inactive"
        }
    ];
    const getKYCBadge = (status) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1"/>Approved</Badge>;
            case "pending":
                return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="w-3 h-3 mr-1"/>Pending</Badge>;
            case "rejected":
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1"/>Rejected</Badge>;
            default:
                return null;
        }
    };
    return (<div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-foreground mb-2">Users Management</h2>
          <p className="text-muted-foreground">Manage all registered users</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2"/>
            Export
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2"/>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Total Users</p>
              <h3 className="text-foreground">2,847</h3>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Active Users</p>
              <h3 className="text-foreground">1,234</h3>
              <p className="text-sm text-muted-foreground mt-1">Currently renting</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">KYC Pending</p>
              <h3 className="text-foreground">47</h3>
              <p className="text-sm text-yellow-600 mt-1">Awaiting verification</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">New Today</p>
              <h3 className="text-foreground">23</h3>
              <p className="text-sm text-green-600 mt-1">Registrations</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input placeholder="Search users by name, email, or phone..." className="pl-10"/>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2"/>
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (<TableRow key={user.id}>
                      <TableCell className="font-mono text-sm">{user.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-foreground">{user.email}</p>
                          <p className="text-muted-foreground">{user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.plan}</TableCell>
                      <TableCell>{getKYCBadge(user.kycStatus)}</TableCell>
                      <TableCell>
                        {user.vehicle !== "Not Assigned" ? (<span className="font-mono text-sm">{user.vehicle}</span>) : (<span className="text-muted-foreground">{user.vehicle}</span>)}
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge className={user.status === "active"
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : user.status === "pending"
                    ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                    : "bg-gray-500/10 text-gray-600 border-gray-500/20"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Assign Vehicle</DropdownMenuItem>
                            <DropdownMenuItem>View KYC</DropdownMenuItem>
                            <DropdownMenuItem>Suspend User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>);
}
export function AdminKYCPage() {
    const kycSubmissions = [
        {
            id: "KYC001",
            userId: "USR002",
            name: "Priya Patel",
            submittedDate: "Oct 10, 2025",
            status: "pending",
            documents: ["Aadhar", "PAN", "License", "Photo"]
        },
        {
            id: "KYC002",
            userId: "USR005",
            name: "Karan Mehta",
            submittedDate: "Oct 9, 2025",
            status: "pending",
            documents: ["Aadhar", "PAN", "License", "Photo"]
        }
    ];
    return (<div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-foreground mb-2">KYC Verification Panel</h2>
          <p className="text-muted-foreground">Review and approve user documents</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Pending Review</p>
            <h3 className="text-foreground">47</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Approved Today</p>
            <h3 className="text-foreground">12</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Rejected</p>
            <h3 className="text-foreground">3</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Duplicates Found</p>
            <h3 className="text-foreground">2</h3>
          </CardContent>
        </Card>
      </div>

      {/* KYC Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycSubmissions.map((kyc) => (<Card key={kyc.id} className="border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-foreground">{kyc.name}</h3>
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <Clock className="w-3 h-3 mr-1"/>
                          Pending
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">KYC ID: <span className="text-foreground font-mono">{kyc.id}</span></p>
                        <p className="text-muted-foreground">User ID: <span className="text-foreground font-mono">{kyc.userId}</span></p>
                        <p className="text-muted-foreground">Submitted: <span className="text-foreground">{kyc.submittedDate}</span></p>
                        <p className="text-muted-foreground">Documents: <span className="text-foreground">{kyc.documents.join(", ")}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        <FileText className="w-4 h-4 mr-2"/>
                        Review Documents
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle className="w-4 h-4 mr-1"/>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1"/>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </CardContent>
      </Card>
    </div>);
}
export function AdminFleetPage() {
    const vehicles = [
        { id: "VEH001", number: "DL 8C AB 1234", model: "Kiwck Pro 2", status: "assigned", battery: 78, assignedTo: "Rahul Sharma" },
        { id: "VEH002", number: "DL 8C AB 1235", model: "Kiwck Pro 2", status: "assigned", battery: 92, assignedTo: "Amit Kumar" },
        { id: "VEH003", number: "DL 8C AB 1236", model: "Kiwck Sport", status: "available", battery: 100, assignedTo: "-" },
        { id: "VEH004", number: "DL 8C AB 1237", model: "Kiwck Max", status: "maintenance", battery: 45, assignedTo: "-" }
    ];
    return (<div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-foreground mb-2">Fleet Management</h2>
          <p className="text-muted-foreground">Manage all vehicles and assignments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 mt-4 md:mt-0">
          <Car className="w-4 h-4 mr-2"/>
          Add Vehicle
        </Button>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Total Fleet</p>
            <h3 className="text-foreground">1,420</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Assigned</p>
            <h3 className="text-foreground">1,234</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Available</p>
            <h3 className="text-green-600">163</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Maintenance</p>
            <h3 className="text-yellow-600">23</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-1">Utilization</p>
            <h3 className="text-foreground">87%</h3>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle ID</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (<TableRow key={vehicle.id}>
                    <TableCell className="font-mono text-sm">{vehicle.id}</TableCell>
                    <TableCell className="font-mono">{vehicle.number}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${vehicle.battery > 50 ? 'bg-green-500' : vehicle.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${vehicle.battery}%` }}/>
                          </div>
                        </div>
                        <span className="text-sm">{vehicle.battery}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={vehicle.status === "assigned" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                vehicle.status === "available" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}>
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vehicle.assignedTo}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4"/>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign to User</DropdownMenuItem>
                          <DropdownMenuItem>Mark for Maintenance</DropdownMenuItem>
                          <DropdownMenuItem>Remove from Fleet</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>);
}
