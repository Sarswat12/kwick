import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, Car, FileCheck, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { fetchAdminStats, fetchAdminKyc, fetchAllUsers, fetchAllRentals, fetchAdminPayments } from "../utils/adminDashboard";

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [kyc, setKyc] = useState([]);
  const [users, setUsers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchAdminStats(),
      fetchAdminKyc(0, 5),
      fetchAllUsers(0, 5),
      fetchAllRentals(0, 5),
      fetchAdminPayments(0, 5)
    ]).then(([stats, kyc, users, rentals, payments]) => {
      setStats(stats);
      setKyc(kyc.content || kyc || []);
      setUsers(users.content || users || []);
      setRentals(rentals.content || rentals || []);
      setPayments(payments.content || payments || []);
    }).catch(() => {
      setError("Failed to load admin dashboard data.");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading admin dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Compose alerts and activities from fetched data
  const alerts = [
    ...(rentals.length > 0 ? [{ user: users[0]?.name || '-', message: `Subscription expires in ${rentals[0]?.daysRemaining || '-'} days`, type: "warning" }] : []),
    ...(kyc.length > 0 ? [{ user: kyc[0]?.userName || '-', message: "KYC pending verification", type: "info" }] : []),
    ...(users.length > 0 ? [{ user: users[0]?.name || '-', message: "New registration", type: "info" }] : [])
  ];
  const recentActivities = [
    ...(users.length > 0 ? [{ user: users[0]?.name || '-', action: "New registration", time: users[0]?.createdAt ? new Date(users[0].createdAt).toLocaleString() : '-' }] : []),
    ...(payments.length > 0 ? [{ user: payments[0]?.userName || '-', action: `Payment received ₹${payments[0]?.amount}`, time: payments[0]?.date ? new Date(payments[0].date).toLocaleString() : '-' }] : []),
    ...(rentals.length > 0 ? [{ user: rentals[0]?.userName || '-', action: "Rental started", time: rentals[0]?.startedAt ? new Date(rentals[0].startedAt).toLocaleString() : '-' }] : [])
  ];
  const latestSubscriptions = rentals.slice(0, 3).map(r => ({
    user: r.userName || '-',
    plan: r.plan || '-',
    vehicle: r.vehicleNumber || '-',
    date: r.startedAt ? new Date(r.startedAt).toLocaleDateString() : '-',
    amount: r.amount ? `₹${r.amount}` : '-',
    status: r.status || '-'
  }));

  return (<div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-foreground mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of platform operations</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Users</p>
                  <h3 className="text-foreground">2,847</h3>
                  <p className="text-sm text-green-600 mt-1">+12% this month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Active Rentals</p>
                  <h3 className="text-foreground">1,234</h3>
                  <p className="text-sm text-green-600 mt-1">87% utilization</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Pending KYC</p>
                  <h3 className="text-foreground">47</h3>
                  <p className="text-sm text-yellow-600 mt-1">Needs review</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-yellow-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Revenue (MTD)</p>
                  <h3 className="text-foreground">₹8.4L</h3>
                  <p className="text-sm text-green-600 mt-1">+24% vs last month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary"/>
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert, index) => (<div key={index} className={`p-4 rounded-lg border-l-4 ${alert.type === 'danger' ? 'border-l-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-blue-500 bg-blue-50'}`}>
                    <p className="text-foreground mb-1">{alert.user}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (<div key={index} className="flex items-start justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="text-foreground">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {activity.time}
                    </span>
                  </div>))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fleet Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Fleet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-muted-foreground mb-2">Total Vehicles</p>
                <h3 className="text-foreground mb-3">1,420</h3>
                <Progress value={87} className="h-2"/>
                <p className="text-sm text-muted-foreground mt-2">87% deployed</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Available</p>
                <h3 className="text-green-600 mb-3">186</h3>
                <Progress value={13} className="h-2"/>
                <p className="text-sm text-muted-foreground mt-2">13% ready to rent</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">In Service</p>
                <h3 className="text-yellow-600 mb-3">23</h3>
                <Progress value={2} className="h-2"/>
                <p className="text-sm text-muted-foreground mt-2">Maintenance</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Battery Health</p>
                <h3 className="text-green-600 mb-3">94%</h3>
                <Progress value={94} className="h-2"/>
                <p className="text-sm text-muted-foreground mt-2">Average health</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Latest Subscriptions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle>Latest Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
            { user: "Rahul Sharma", plan: "Monthly Pro", vehicle: "DL 8C AB 1234", date: "Oct 11, 2025", amount: "₹2,999", status: "active" },
            { user: "Priya Patel", plan: "Weekly", vehicle: "DL 8C AB 1235", date: "Oct 10, 2025", amount: "₹1,199", status: "active" },
            { user: "Amit Kumar", plan: "Monthly Pro", vehicle: "DL 8C AB 1236", date: "Oct 09, 2025", amount: "₹2,999", status: "active" }
        ].map((sub, index) => (<TableRow key={index}>
                      <TableCell>{sub.user}</TableCell>
                      <TableCell>{sub.plan}</TableCell>
                      <TableCell className="font-mono text-sm">{sub.vehicle}</TableCell>
                      <TableCell>{sub.date}</TableCell>
                      <TableCell>{sub.amount}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          {sub.status}
                        </Badge>
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
