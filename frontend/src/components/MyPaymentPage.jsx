import { motion } from "motion/react";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserDashboardSidebar } from "./UserDashboardSidebar";
import { IndianRupee, Download, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft, Calendar, CreditCard, TrendingUp, Wallet } from "lucide-react";
export function MyPaymentPage({ onNavigate }) {
    const [selectedPeriod, setSelectedPeriod] = React.useState('month');
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetch('/api/user/transactions')
            .then(res => {
            if (!res.ok)
                throw new Error('Failed to fetch transactions');
            return res.json();
        })
            .then((data) => {
            if (mounted)
                setTransactions(Array.isArray(data) ? data : []);
        })
            .catch(() => { if (mounted)
            setTransactions([]); })
            .finally(() => { if (mounted)
            setLoading(false); });
        return () => { mounted = false; };
    }, []);
    const totalEarnings = (loading ? 0 : transactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0));
    const totalExpenses = (loading ? 0 : Math.abs(transactions
        .filter(t => (t.type === 'rental' || t.type === 'penalty') && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)));
    const pendingAmount = (loading ? 0 : transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0));
    const netProfit = totalEarnings - totalExpenses;
    const getTransactionIcon = (type) => {
        switch (type) {
            case 'earning': return <ArrowDownLeft className="w-5 h-5 text-green-500"/>;
            case 'rental': return <ArrowUpRight className="w-5 h-5 text-red-500"/>;
            case 'penalty': return <XCircle className="w-5 h-5 text-orange-500"/>;
            case 'refund': return <ArrowDownLeft className="w-5 h-5 text-blue-500"/>;
            default: return <IndianRupee className="w-5 h-5"/>;
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
            case 'pending': return <Badge className="bg-yellow-500">Pending</Badge>;
            case 'failed': return <Badge className="bg-red-500">Failed</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };
    const downloadStatement = () => {
        const statement = `
KWICK EV RENTAL - PAYMENT STATEMENT
====================================

Period: ${selectedPeriod.toUpperCase()}
Generated: ${new Date().toLocaleDateString('en-IN')}

SUMMARY:
--------
Total Earnings: ₹${totalEarnings.toLocaleString('en-IN')}
Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
Net Profit: ₹${netProfit.toLocaleString('en-IN')}
Pending Amount: ₹${pendingAmount.toLocaleString('en-IN')}

TRANSACTIONS:
-------------
${transactions.map(t => `
${t.date} | ${t.id}
${t.description}
Amount: ${t.amount > 0 ? '+' : ''}₹${t.amount.toLocaleString('en-IN')}
Status: ${t.status.toUpperCase()}
${t.vehicleId ? `Vehicle: ${t.vehicleId}` : ''}
---`).join('\n')}

====================================
KWICK - India's #1 EV Rental Platform
Contact: hello@kwick.in
    `;
        const blob = new Blob([statement], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KWICK_Payment_Statement_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (<div className="min-h-screen bg-gray-50">
      <UserDashboardSidebar currentPage="payments" onNavigate={onNavigate}/>
      
      <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl mb-2">My Payments</h1>
              <p className="text-muted-foreground">Track your earnings and expenses</p>
            </div>
            <Button onClick={downloadStatement} variant="outline">
              <Download className="w-4 h-4 mr-2"/>
              Download Statement
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-3xl mt-1 text-green-600">₹{totalEarnings.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500"/>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-3xl mt-1 text-red-600">₹{totalExpenses.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </div>
                  <CreditCard className="w-10 h-10 text-red-500"/>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-3xl mt-1 text-blue-600">₹{netProfit.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </div>
                  <Wallet className="w-10 h-10 text-blue-500"/>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl mt-1 text-yellow-600">₹{pendingAmount.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Processing</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-500"/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant={selectedPeriod === 'week' ? 'default' : 'outline'} onClick={() => setSelectedPeriod('week')}>
                    Week
                  </Button>
                  <Button size="sm" variant={selectedPeriod === 'month' ? 'default' : 'outline'} onClick={() => setSelectedPeriod('month')}>
                    Month
                  </Button>
                  <Button size="sm" variant={selectedPeriod === 'year' ? 'default' : 'outline'} onClick={() => setSelectedPeriod('year')}>
                    Year
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (<motion.div key={transaction.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3"/>
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
                          {transaction.vehicleId && (<p className="text-sm text-muted-foreground">Vehicle: {transaction.vehicleId}</p>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xl font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </motion.div>))}
              </div>

              {transactions.length === 0 && (<div className="text-center py-12">
                  <IndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-xl mb-2">No Transactions Yet</h3>
                  <p className="text-muted-foreground mb-6">Start earning by renting a vehicle</p>
                  <Button onClick={() => onNavigate('rent')} className="bg-primary">
                    Rent a Vehicle
                  </Button>
                </div>)}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-1"/>
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <p className="text-sm text-muted-foreground">
                    • Earnings are processed weekly and credited to your bank account<br />
                    • Rental payments are auto-debited on the 1st of each month<br />
                    • All transactions are secured with bank-level encryption<br />
                    • Contact support for any payment disputes within 7 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>);
}
