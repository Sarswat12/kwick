import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ArrowLeft, CheckCircle, Upload, QrCode, CreditCard, Zap } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";
import { UserDashboardSidebar } from "./UserDashboardSidebar";
const PLANS = [
  {
    id: "daily",
    name: "Daily",
    basePrice: 99,
    description: "Old Vehicle + without battery",
    features: [
      "Daily km limit: 150 km",
      "Helmet: Yes",
      "T-shirt: Yes",
      "Insurance: Basic",
      "Priority support: No",
      "Maintenance: Included",
      "Roadside assistance: No"
    ]
  },
  {
    id: "dailyplus",
    name: "Daily Plus",
    basePrice: 180,
    description: "Old Vehicle + with battery",
    features: [
      "Daily km limit: 200 km",
      "Helmet: Yes",
      "T-shirt: Yes",
      "Insurance: Standard",
      "Priority support: No",
      "Maintenance: Included",
      "Roadside assistance: Yes"
    ]
  },
  {
    id: "dailypro",
    name: "Daily Pro",
    basePrice: 250,
    description: "New Vehicle + with battery",
    features: [
      "Daily km limit: Unlimited",
      "Helmet: Yes",
      "T-shirt: Yes",
      "Insurance: Comprehensive",
      "Priority support: Yes",
      "Maintenance: Included",
      "Roadside assistance: Yes"
    ]
  }
];
export function EnhancedRentVehiclePage({ onNavigate }) {
    const { user, updateUser } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDays, setSelectedDays] = useState({ daily: 1, dailyplus: 1, dailypro: 1 });
    const [paymentProof, setPaymentProof] = useState(null);
    const [utrNumber, setUtrNumber] = useState("");
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
        else {
            onNavigate("dashboard");
        }
    };
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        updateUser({ selectedPlan: plan.id });
        toast.success(`${plan.name} selected!`);
        setStep(2);
    };
    const handlePayment = () => {
        if (!paymentProof && !utrNumber) {
            toast.error("Please upload payment proof or enter UTR number");
            return;
        }
        updateUser({ hasPaid: true });
        toast.success("Payment verified! Your vehicle is being prepared.");
        setTimeout(() => {
            toast.success("Vehicle assigned! Check your dashboard.");
            onNavigate("dashboard");
        }, 2000);
    };
    // Check if KYC is completed
    if (!user?.kycStatus || user.kycStatus !== "approved") {
        return (<div className="min-h-screen bg-gray-50">
        <UserDashboardSidebar currentPage="rent" onNavigate={onNavigate}/>
        <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 max-w-4xl mx-auto min-h-screen">
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-yellow-600"/>
              </div>
              <h2 className="text-3xl mb-4">KYC Verification Required</h2>
              <p className="text-muted-foreground mb-8">
                Please complete your KYC verification before renting a vehicle.
              </p>
              <Button onClick={() => onNavigate("kyc")} className="bg-primary">
                Complete KYC Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <UserDashboardSidebar currentPage="rent" onNavigate={onNavigate}/>
      <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 max-w-7xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Button variant="ghost" onClick={handleBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back
            </Button>
          
          <h1 className="text-4xl mb-2">Rent KWICK EV Scooter</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Choose your rental plan" : "Complete payment to confirm booking"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 max-w-md mx-auto">
          {[1, 2].map((stepNum) => (<div key={stepNum} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= stepNum
                ? "bg-primary border-primary text-white"
                : "border-border text-muted-foreground"}`}>
                  {step > stepNum ? <CheckCircle className="w-5 h-5"/> : stepNum}
                </div>
                <span className="text-xs mt-2 text-center">
                  {stepNum === 1 && "Choose Plan"}
                  {stepNum === 2 && "Payment"}
                </span>
              </div>
              {stepNum < 2 && (<div className={`h-0.5 flex-1 transition-colors ${step > stepNum ? "bg-primary" : "bg-border"}`}/>)}
            </div>))}
        </div>

        {step === 1 ? (
        /* Step 1: Choose Plan */
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan, index) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                  <Card className="h-full border-2 transition-all border-border hover:border-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle>{plan.name}</CardTitle>
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">{plan.description}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-primary">₹{plan.basePrice * selectedDays[plan.id]}</span>
                        <span className="text-muted-foreground">per {selectedDays[plan.id]} day{selectedDays[plan.id] > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor={`days-${plan.id}`}>Days:</Label>
                        <select
                          id={`days-${plan.id}`}
                          className="border rounded px-2 py-1"
                          value={selectedDays[plan.id]}
                          onChange={e => setSelectedDays(sd => ({ ...sd, [plan.id]: Number(e.target.value) }))}
                        >
                          {[1, 5, 7].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5"/>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => handleSelectPlan(plan)} className="w-full" variant="outline">
                        Choose {plan.name} ({selectedDays[plan.id]} day{selectedDays[plan.id] > 1 ? 's' : ''})
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Info Card */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-1"/>
                  <div>
                    <h4 className="font-semibold mb-2">What's Included?</h4>
                    <p className="text-sm text-muted-foreground">
                      All plans include KWICK premium electric scooter, unlimited battery swaps at 50+ stations, full insurance, 24/7 support, and free delivery to your doorstep within 2 hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>) : (
        /* Step 2: Payment */
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPlan && (<div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{selectedPlan.name}</h4>
                            <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                            <p className="text-xs text-muted-foreground">Days: {selectedPlan.days}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{selectedPlan.totalPrice}</p>
                            <p className="text-xs text-muted-foreground">₹{selectedPlan.basePrice} × {selectedPlan.days} day(s)</p>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{selectedPlan.price}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="text-green-600">-₹{selectedPlan.originalPrice - selectedPlan.price}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Security Deposit</span>
                            <span>₹2000</span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">
                              ₹{selectedPlan.price + 2000}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            *Security deposit is refundable at end of rental
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-green-900">Earning Potential</p>
                          <p className="text-lg text-green-600">{selectedPlan.earning}</p>
                        </div>
                      </div>)}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Payment Methods */}
              <div className="space-y-6">
                {/* QR Code Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5"/>
                      UPI Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-6 rounded-lg flex justify-center">
                        <ImageWithFallback src="https://images.unsplash.com/photo-1607609972246-a14762f20d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxRUiUyMGNvZGUlMjBwYXltZW50JTIwc2Nhbm5lcnxlbnwxfHx8fDE3NjAzNDkyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="UPI QR Code" className="w-64 h-64 object-contain"/>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Scan QR code to pay via any UPI app</p>
                        <p className="text-sm font-semibold mt-2">UPI ID: kwick@paytm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* UTR Number */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5"/>
                      Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="utr">UTR/Transaction Number</Label>
                      <Input id="utr" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} placeholder="Enter UTR/Transaction ID"/>
                    </div>

                    <div className="text-center text-muted-foreground">OR</div>

                    <div>
                      <Label>Upload Payment Screenshot</Label>
                      <div className="mt-2">
                        <input type="file" accept="image/*" onChange={(e) => setPaymentProof(e.target.files?.[0] || null)} className="hidden" id="payment-proof"/>
                        <label htmlFor="payment-proof" className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground"/>
                          <span className="text-sm text-muted-foreground">
                            {paymentProof ? paymentProof.name : "Click to upload screenshot"}
                          </span>
                        </label>
                      </div>
                    </div>

                    <Button onClick={handlePayment} className="w-full bg-primary" size="lg">
                      <CheckCircle className="w-5 h-5 mr-2"/>
                      Confirm Payment
                    </Button>
                  </CardContent>
                </Card>

                {/* Info */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Note:</span> After payment verification (usually within 30 minutes), your KWICK scooter will be delivered to your doorstep within 2 hours.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>)}
        </motion.div>
      </div>
    </div>);
}
