import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Filter, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { fetchPayments, initiatePayment } from "../utils/payments";

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Payment form state
  const [form, setForm] = useState({ amount: '', method: '', rentalId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPayments(page, size)
      .then((data) => {
        setPayments(data.content || data.payments || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        setError("Failed to load payments");
      })
      .finally(() => setLoading(false));
  }, [page, size]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
    setFormSuccess(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      if (!form.amount || !form.method) {
        setFormError("Amount and method are required.");
        setFormLoading(false);
        return;
      }
      const payload = {
        amount: Number(form.amount),
        method: form.method,
        rentalId: form.rentalId || null,
      };
      await initiatePayment(payload);
      setFormSuccess("Payment initiated successfully.");
      setForm({ amount: '', method: '', rentalId: '' });
      // Refresh payments list
      setLoading(true);
      fetchPayments(page, size)
        .then((data) => {
          setPayments(data.content || data.payments || []);
          setTotalPages(data.totalPages || 1);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } catch (err) {
      setFormError("Failed to initiate payment.");
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
        switch (status) {
            case "success":
                return (<Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1"/>
            Success
          </Badge>);
            case "pending":
                return (<Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1"/>
            Pending
          </Badge>);
            case "failed":
                return (<Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1"/>
            Failed
          </Badge>);
            default:
                return null;
        }
    };
    return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-foreground mb-2">My Payments</h2>
          <p className="text-muted-foreground">View all your transaction history</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <Download className="w-4 h-4 mr-2"/>
          Export Report
        </Button>
      </div>

      {/* Payment Initiation Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Initiate Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleFormSubmit}>
              <div className="flex-1">
                <Input
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Amount (₹)"
                  value={form.amount}
                  onChange={handleFormChange}
                  disabled={formLoading}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  name="method"
                  placeholder="Payment Method (e.g. UPI, Card)"
                  value={form.method}
                  onChange={handleFormChange}
                  disabled={formLoading}
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  name="rentalId"
                  placeholder="Rental ID (optional)"
                  value={form.rentalId}
                  onChange={handleFormChange}
                  disabled={formLoading}
                />
              </div>
              <Button type="submit" disabled={formLoading} className="min-w-[120px]">
                {formLoading ? "Processing..." : "Initiate Payment"}
              </Button>
            </form>
            {formError && <div className="text-red-500 mt-2">{formError}</div>}
            {formSuccess && <div className="text-green-600 mt-2">{formSuccess}</div>}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards (dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Total Paid</p>
              <h3 className="text-foreground">
                {loading ? "--" :
                  `₹${payments.filter(p => p.status === "success").reduce((sum, p) => sum + (Number(p.amount) || 0), 0)}`}
              </h3>
              <p className="text-sm text-green-600 mt-1">
                {/* Optionally show last payment amount */}
                {loading ? "" : (() => {
                  const last = payments.find(p => p.status === "success");
                  return last ? `+₹${last.amount} recent` : "";
                })()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Successful</p>
              <h3 className="text-foreground">{loading ? "--" : payments.filter(p => p.status === "success").length}</h3>
              <p className="text-sm text-muted-foreground mt-1">Transactions</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Pending</p>
              <h3 className="text-foreground">{loading ? "--" : payments.filter(p => p.status === "pending").length}</h3>
              <p className="text-sm text-yellow-600 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-1">Next Payment</p>
              <h3 className="text-foreground">--</h3>
              <p className="text-sm text-primary mt-1">--</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input placeholder="Search by transaction ID or UTR..."/>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2"/>
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payments Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading payments...</div>
              ) : error ? (
                <div className="p-8 text-center text-red-500">{error}</div>
              ) : payments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No payments found.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>UTR</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id || payment.transactionId}>
                        <TableCell className="font-mono text-sm">{payment.transactionId || payment.id}</TableCell>
                        <TableCell>{payment.date ? new Date(payment.date).toLocaleDateString() : "--"}</TableCell>
                        <TableCell>{payment.plan || "--"}</TableCell>
                        <TableCell>{payment.method || "--"}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.utr || payment.utrNumber || "--"}</TableCell>
                        <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.type === "manual" ? (
                            <Badge variant="outline" className="text-xs">Manual Entry</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">Auto</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>);
