import { motion } from "motion/react";
import { Check, Upload, QrCode, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
export function RentVehiclePage() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const plans = [
        {
            id: "daily",
            name: "Daily",
            price: "₹250",
            period: "per day",
            features: [
                "100 km daily limit",
                "Helmet included",
                "Basic insurance",
                "Battery swap access"
            ]
        },
        {
            id: "weekly",
            name: "Weekly",
            price: "₹180",
            period: "per week",
            features: [
                "700 km weekly limit",
                "Helmet & t-shirt",
                "Standard insurance",
                "Priority battery swap"
            ],
            popular: true
        },
        {
            id: "monthly",
            name: "Monthly Pro",
            price: "₹",
            period: "per month",
            features: [
                "Unlimited kilometers",
                "Helmet & t-shirt",
                "Comprehensive insurance",
                "Priority support",
                "Free battery swaps"
            ]
        }
    ];
    return (<div className="p-6 space-y-6">
      <div>
        <h2 className="text-foreground mb-2">Rent a Vehicle</h2>
        <p className="text-muted-foreground">Choose your plan and get started</p>
      </div>

      {!showPayment ? (<div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (<motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`relative cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                    ? 'border-primary border-2 shadow-lg'
                    : 'hover:border-primary/50'} ${plan.popular ? 'border-primary' : ''}`} onClick={() => setSelectedPlan(plan.id)}>
                {plan.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>)}
                <CardHeader className="text-center pb-4">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground"> {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (<li key={i} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>))}
                  </ul>
                  <Button className={`w-full ${selectedPlan === plan.id ? 'bg-primary' : ''}`} variant={selectedPlan === plan.id ? 'default' : 'outline'} onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan.id);
                }}>
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>))}
        </div>) : (<div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Plan Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Selected Plan</span>
                    <span className="text-foreground">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-2xl text-foreground">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                </div>

                {/* QR Code Payment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary"/>
                    <h3 className="text-foreground">Scan to Pay</h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center">
                    <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="w-32 h-32 text-muted-foreground"/>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan this QR code with any UPI app to complete payment
                    </p>
                  </div>
                </div>

                {/* Upload Payment Proof */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary"/>
                    <h3 className="text-foreground">Payment Confirmation</h3>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction ID / UTR Number</Label>
                    <Input placeholder="Enter UTR or Transaction ID"/>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Payment Screenshot</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2"/>
                      <p className="text-sm text-muted-foreground mb-1">Click to upload payment proof</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG (max. 5MB)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                      Back
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      Confirm Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>)}

      {!showPayment && selectedPlan && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setShowPayment(true)}>
            Proceed to Payment
          </Button>
        </motion.div>)}
    </div>);
}
