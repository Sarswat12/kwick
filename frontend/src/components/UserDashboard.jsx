import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Car, Battery, AlertCircle, CheckCircle, Bell, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

import { fetchUserProfile, fetchUserRentals, fetchUserVehicles, fetchKycStatus, fetchUserPayments } from "../utils/userDashboard";
import { uploadAadhaarFront, uploadAadhaarBack, uploadLicenseFront, uploadLicenseBack, uploadSelfie } from "../utils/kyc";
// Allowed file types for KYC
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // KYC upload state
  const [kycFiles, setKycFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    licenseFront: null,
    licenseBack: null,
    selfie: null
  });
  const [kycPreviews, setKycPreviews] = useState({});
  const [kycProgress, setKycProgress] = useState({});
  const [kycUploadError, setKycUploadError] = useState("");
  const [kycUploadSuccess, setKycUploadSuccess] = useState("");
  const [kycUploading, setKycUploading] = useState(false);
  // KYC file input change handler
  function handleKycFileChange(type, file) {
    setKycUploadError("");
    setKycUploadSuccess("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setKycUploadError("Invalid file type. Only JPEG, PNG, or PDF allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setKycUploadError("File too large. Max 5MB allowed.");
      return;
    }
    setKycFiles(prev => ({ ...prev, [type]: file }));
    // Preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => setKycPreviews(prev => ({ ...prev, [type]: e.target.result }));
      reader.readAsDataURL(file);
    } else {
      setKycPreviews(prev => ({ ...prev, [type]: null }));
    }
  }

  // KYC upload handler
  async function handleKycUpload(type, uploadFn) {
    setKycUploadError("");
    setKycUploadSuccess("");
    setKycUploading(true);
    setKycProgress(prev => ({ ...prev, [type]: 0 }));
    const file = kycFiles[type];
    if (!file) {
      setKycUploadError("No file selected for " + type);
      setKycUploading(false);
      return;
    }
    try {
      // Use XMLHttpRequest for progress
      const form = new FormData();
      form.append('file', file);
      const token = localStorage.getItem('token');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/kyc/upload/${type.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setKycProgress(prev => ({ ...prev, [type]: Math.round((e.loaded / e.total) * 100) }));
        }
      };
      xhr.onload = () => {
        setKycUploading(false);
        if (xhr.status === 200) {
          setKycUploadSuccess(type + " uploaded successfully.");
          setKycProgress(prev => ({ ...prev, [type]: 100 }));
        } else {
          setKycUploadError("Upload failed: " + (xhr.responseText || xhr.statusText));
        }
      };
      xhr.onerror = () => {
        setKycUploading(false);
        setKycUploadError("Upload failed: Network error");
      };
      xhr.send(form);
    } catch (err) {
      setKycUploading(false);
      setKycUploadError("Upload failed: " + (err?.message || err));
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchUserProfile(),
      fetchUserRentals(),
      fetchUserVehicles(),
      fetchKycStatus(),
      fetchUserPayments(0, 5)
    ]).then(([profile, rentals, vehicles, kyc, payments]) => {
      setProfile(profile);
      setRentals(rentals.content || rentals || []);
      setVehicles(vehicles.content || vehicles || []);
      setKyc(kyc);
      setPayments(payments.content || payments || []);
    }).catch(() => {
      setError("Failed to load dashboard data.");
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Example: get current plan, vehicle, battery, etc. from fetched data
  const userName = profile?.name || profile?.fullName || "User";
  const currentPlan = rentals[0]?.plan || "-";
  const planStatus = rentals[0]?.status || "-";
  const planExpires = rentals[0]?.expiresAt ? new Date(rentals[0].expiresAt).toLocaleDateString() : "-";
  const planStarted = rentals[0]?.startedAt ? new Date(rentals[0].startedAt).toLocaleDateString() : "-";
  const daysRemaining = rentals[0]?.daysRemaining || "-";
  const vehicle = vehicles[0] || {};
  const batteryLevel = vehicle.batteryLevel || 0;
  const batteryRange = vehicle.estimatedRange || "-";
  const batteryHealth = vehicle.batteryHealth || "-";
  const swapStation = vehicle.nearestSwapStation || "-";
  const kycStatus = kyc?.status || "-";
  const kycBadge = kyc?.status === "approved" ? "Approved" : kyc?.status === "pending" ? "Pending" : "-";

  // Compose recent activity from payments, rentals, kyc
  const activity = [];
  if (payments.length > 0) activity.push({ action: `Payment received ₹${payments[0].amount}`, time: payments[0].date ? new Date(payments[0].date).toLocaleDateString() : "-", status: payments[0].status });
  if (rentals.length > 0) activity.push({ action: "Vehicle rental started", time: rentals[0].startedAt ? new Date(rentals[0].startedAt).toLocaleDateString() : "-", status: rentals[0].status });
  if (kycStatus) activity.push({ action: `KYC status: ${kycStatus}`, time: "-", status: kycStatus });

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6 max-w-full overflow-x-auto">
      {/* KYC Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>KYC Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Aadhaar Front", type: "aadhaarFront", uploadFn: uploadAadhaarFront },
              { label: "Aadhaar Back", type: "aadhaarBack", uploadFn: uploadAadhaarBack },
              { label: "License Front", type: "licenseFront", uploadFn: uploadLicenseFront },
              { label: "License Back", type: "licenseBack", uploadFn: uploadLicenseBack },
              { label: "Selfie", type: "selfie", uploadFn: uploadSelfie }
            ].map(({ label, type, uploadFn }) => (
              <div key={type} className="flex flex-col gap-2 border p-3 rounded-md">
                <label className="font-medium mb-1">{label}</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  disabled={kycUploading}
                  onChange={e => handleKycFileChange(type, e.target.files[0])}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-gray-300"
                />
                {kycPreviews[type] && (
                  <img src={kycPreviews[type]} alt={label + " preview"} className="max-h-32 mt-2 rounded border" />
                )}
                {kycFiles[type] && kycFiles[type].type === "application/pdf" && (
                  <span className="text-xs text-muted-foreground mt-2">PDF selected: {kycFiles[type].name}</span>
                )}
                <button
                  className="mt-2 px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                  disabled={!kycFiles[type] || kycUploading}
                  onClick={() => handleKycUpload(type, uploadFn)}
                  type="button"
                >
                  Upload {label}
                </button>
                {kycProgress[type] > 0 && (
                  <Progress value={kycProgress[type]} className="h-2 mt-2" />
                )}
              </div>
            ))}
          </div>
          {kycUploadError && <div className="text-red-500 mt-3">{kycUploadError}</div>}
          {kycUploadSuccess && <div className="text-green-600 mt-3">{kycUploadSuccess}</div>}
        </CardContent>
      </Card>
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">Welcome back, {userName}!</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Here's your rental overview</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Bell className="w-5 h-5 text-foreground"/>
            </button>
            <button className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <User className="w-5 h-5 text-foreground"/>
            </button>
          </div>
        </div>

        {/* Alert - Plan Expiring */}
        <Alert className="border-primary/50 bg-primary/5 mb-6">
          <AlertCircle className="h-4 w-4 text-primary"/>
          <AlertDescription className="text-foreground">
            Your plan expires on <span className="font-semibold">{planExpires}</span>. Renew now to continue riding!
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Current Plan</p>
                  <h3 className="text-foreground">{currentPlan}</h3>
                  <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">{planStatus}</Badge>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Vehicle No.</p>
                  <h3 className="text-foreground">{vehicle.vehicleNumber || '-'}</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Battery Level</p>
                  <h3 className="text-foreground">{batteryLevel}%</h3>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">KYC Status</p>
                  <h3 className="text-foreground">{kycStatus}</h3>
                  <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">{kycBadge}</Badge>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Vehicle Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Current Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-muted-foreground"/>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Vehicle Number</span>
                  <span className="text-foreground">{vehicle.vehicleNumber || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Chassis Number</span>
                  <span className="text-foreground">{vehicle.chassisNumber || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Battery ID</span>
                  <span className="text-foreground">{vehicle.batteryId || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Motor Number</span>
                  <span className="text-foreground">{vehicle.motorNumber || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Controller</span>
                  <span className="text-foreground">{vehicle.controller || '-'}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Insurance</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{vehicle.insuranceStatus || '-'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Battery & Subscription */}
        <div className="space-y-6">
          {/* Battery Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Battery Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1">
                      <span className="text-muted-foreground">Current Charge</span>
                      <span className="text-foreground">{batteryLevel}%</span>
                    </div>
                    <Progress value={batteryLevel} className="h-3"/>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Estimated Range</p>
                      <p className="text-foreground">{batteryRange}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Health</p>
                      <p className="text-green-600">{batteryHealth}</p>
                    </div>
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Battery className="h-4 w-4 text-blue-600"/>
                    <AlertDescription className="text-blue-900">
                      Nearest swap station: {swapStation}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Active Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground">{currentPlan}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Started</span>
                  <span className="text-foreground">{planStarted}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="text-primary">{planExpires}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-1">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className="text-foreground">{daysRemaining}</span>
                  </div>
                  <Progress value={daysRemaining !== '-' ? Math.max(0, Math.min(100, (Number(daysRemaining) / 30) * 100)) : 0} className="h-2"/>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-4">
              {activity.length === 0 ? (
                <div className="text-muted-foreground">No recent activity.</div>
              ) : activity.map((activity, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center justify-between py-3 border-b last:border-0 gap-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"/>
                    <div>
                      <p className="text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500"/>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
              
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Battery Level</p>
                  
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Battery className="w-6 h-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">KYC Status</p>
                  <h3 className="text-foreground">Pending</h3>
                  <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Vehicle Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Current Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-muted-foreground"/>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Vehicle Number</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Chassis Number</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Battery ID</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Motor Number</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-1">
                  <span className="text-muted-foreground">Controller</span>
                  <span className="text-foreground"></span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Insurance</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20"></Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Battery & Subscription */}
        <div className="space-y-6">
          {/* Battery Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>Battery Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between mb-2 gap-1">
                      <span className="text-muted-foreground">Current Charge</span>
                      <span className="text-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-3"/>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Estimated Range</p>
                      <p className="text-foreground">62 km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Health</p>
                      <p className="text-green-600">Excellent</p>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Battery className="h-4 w-4 text-blue-600"/>
                    <AlertDescription className="text-blue-900">
                      Nearest swap station: 2.3 km away
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Active Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="text-foreground">Monthly Pro</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Started</span>
                  <span className="text-foreground">Oct 11, 2025</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="text-primary">Oct 13, 2025</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-2 gap-1">
                    <span className="text-muted-foreground">Days Remaining</span>
                    <span className="text-foreground">2 days</span>
                  </div>
                  <Progress value={93} className="h-2"/>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-4">
              {[
            { action: "Battery swapped", time: "2 hours ago", status: "success" },
            { action: "Payment received ₹2,999", time: "1 day ago", status: "success" },
            { action: "Vehicle inspection completed", time: "3 days ago", status: "success" },
            { action: "KYC documents verified", time: "5 days ago", status: "success" }
        ].map((activity, index) => (<div key={index} className="flex flex-col sm:flex-row items-center justify-between py-3 border-b last:border-0 gap-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"/>
                    <div>
                      <p className="text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500"/>
                </div>))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>);
}
