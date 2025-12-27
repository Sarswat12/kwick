import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Zap, Battery, Gauge, Shield, Leaf, TrendingUp, ArrowLeft, Clock, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import vehicleImg from "../assets/vehicle.png";
// Use multiple copies of the red vehicle image so the thumbnail strip shows the same vehicle repeatedly
const VEHICLE_IMAGES = new Array(5).fill(vehicleImg);
export function EnhancedVehiclesPage({ onNavigate }) {
    const [selectedImage, setSelectedImage] = useState(0);
    return (<div className="min-h-screen bg-background">
      {/* Back to Home Button on Top */}
      <div className="pt-8 pb-12">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-8 mt-2">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back to Home
            </Button>
          </motion.div>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Images */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
                  <ImageWithFallback src={VEHICLE_IMAGES[selectedImage]} alt="KWICK EV Scooter" className="w-full h-full object-cover"/>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary">Premium Model</Badge>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-2 items-center">
                  {VEHICLE_IMAGES.map((img, index) => (<motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedImage(index)} className={`relative rounded-lg overflow-hidden w-20 h-14 flex-shrink-0 ${selectedImage === index ? "ring-2 ring-primary" : ""}`}>
                      <ImageWithFallback src={img} alt={`KWICK view ${index + 1}`} className="w-full h-full object-contain"/>
                    </motion.button>))}
                </div>
                {/* Small full-vehicle preview with price */}
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden shadow-lg">
                    <ImageWithFallback src={vehicleImg} alt="KWICK EV full preview" className="w-full h-full object-cover"/>
                    <div className="absolute bottom-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">₹99/day</div>
                  </div>

                  <div className="relative w-20 h-12 rounded-lg overflow-hidden shadow-lg hidden sm:block">
                    <ImageWithFallback src={`${vehicleImg}?variant=small`} alt="KWICK EV small preview" className="w-full h-full object-cover"/>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Details */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-300">
                <Leaf className="w-3 h-3 mr-1"/>
                100% Electric • Zero Emissions
              </Badge>
              
              <h1 className="text-5xl mb-4">KWICK EV</h1>
              <p className="text-2xl text-primary mb-6">Premium Electric Scooter</p>
              
              <p className="text-lg text-muted-foreground mb-8">
                India's first earning-focused electric scooter designed specifically for delivery professionals. 
                Unlimited range with free battery swaps, zero maintenance, and maximum earning potential.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 text-primary mx-auto mb-2"/>
                    <p className="text-2xl font-bold mb-1">100 km</p>
                    <p className="text-sm text-muted-foreground">Per Battery</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Gauge className="w-8 h-8 text-primary mx-auto mb-2"/>
                    <p className="text-2xl font-bold mb-1">70 km/h</p>
                    <p className="text-sm text-muted-foreground">Top Speed</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Battery className="w-8 h-8 text-primary mx-auto mb-2"/>
                    <p className="text-2xl font-bold mb-1">30 sec</p>
                    <p className="text-sm text-muted-foreground">Battery Swap</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2"/>
                    <p className="text-2xl font-bold mb-1">100%</p>
                    <p className="text-sm text-muted-foreground">Insured</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 bg-primary" onClick={() => onNavigate("pricing")}>
                  Rent Now - Starting ₹99/day
                </Button>
                <Button size="lg" variant="outline" className="flex-1" onClick={() => onNavigate("contact")}>
                  Schedule Test Ride
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Specifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Technical Specifications</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
            { label: "Motor Power", value: "2000W BLDC", icon: Zap },
            { label: "Battery Capacity", value: "3.2 kWh Li-ion", icon: Battery },
            { label: "Charging Time", value: "Instant Swap", icon: Clock },
            { label: "Range per Battery", value: "100 km", icon: Gauge },
            { label: "Top Speed", value: "70 km/h", icon: Gauge },
            { label: "Load Capacity", value: "150 kg", icon: Shield },
            { label: "Brakes", value: "Disc (Front & Rear)", icon: Shield },
            { label: "Warranty", value: "2 Years", icon: Shield },
            { label: "Smart Features", value: "GPS, IoT, App Control", icon: Sparkles }
        ].map((spec, index) => (<motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <spec.icon className="w-6 h-6 text-primary mb-3"/>
                      <p className="text-sm text-muted-foreground mb-1">{spec.label}</p>
                      <p className="text-lg font-semibold">{spec.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>))}
            </div>
          </motion.div>

          {/* Free Battery Swaps */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-12 text-center">
                <Battery className="w-16 h-16 mx-auto mb-4"/>
                <h2 className="text-4xl mb-4">Free Unlimited Battery Swaps</h2>
                <p className="text-xl mb-6 text-white/90">
                  Never worry about charging again! Swap your battery at 50+ stations across NCR in under 30 seconds.
                </p>
                <Button size="lg" variant="secondary" onClick={() => onNavigate("battery-stations")}>
                  Find Swap Stations
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Choose KWICK Over Buying */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-3xl mb-4 text-center">Why Choose KWICK Over Buying?</h2>
            <p className="text-xl text-muted-foreground text-center mb-12">Smart riders choose rentals. Here's why.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
            {
                icon: TrendingUp,
                title: "Save ₹8,000+ Monthly",
                description: "No EMI, no fuel costs, no maintenance - just ₹99/day all-inclusive"
            },
            {
                icon: Zap,
                title: "Zero Down Payment",
                description: "No hefty upfront costs like buying. Start riding immediately"
            },
            {
                icon: Sparkles,
                title: "100% Maintenance Free",
                description: "We handle all repairs, servicing, and insurance"
            },
            {
                icon: Battery,
                title: "Unlimited Battery Swaps",
                description: "Never worry about charging. Swap batteries at 50+ stations"
            },
            {
                icon: Clock,
                title: "Flexible Duration",
                description: "Rent for days, weeks, or months. No long-term commitments"
            },
            {
                icon: Zap,
                title: "Instant Availability",
                description: "Vehicle delivered to your doorstep within 2 hours"
            }
        ].map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                  <Card className="h-full text-center hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-7 h-7 text-primary"/>
                      </div>
                      <h3 className="text-lg mb-3 font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>))}
            </div>
          </motion.div>

          {/* Complete Cost Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Complete Cost Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-4 font-semibold">Aspect</th>
                        <th className="text-left p-4 font-semibold">Buying Scooter</th>
                        <th className="text-left p-4 bg-primary/5 font-semibold">KWICK Rental</th>
                        <th className="text-left p-4 text-green-600 font-semibold">Your Savings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
            ["Initial Cost", "₹1,50,000 down payment + ₹8,000 EMI", "₹0 down payment + ₹99/day", "Save ₹1,50,000 upfront"],
            ["Monthly Expense", "₹8,000 EMI + ₹2,500 fuel + ₹1,500 maintenance", "₹2,970 (₹99 × 30 days)", "Save ₹9,030/month"],
            ["Maintenance & Repairs", "Your responsibility (₹15,000+/year)", "100% covered by KWICK", "Save ₹15,000+/year"],
            ["Insurance", "₹8,000/year premium", "Included in rental", "Save ₹8,000/year"],
            ["Battery Replacement", "₹40,000 after 2-3 years", "Free unlimited swaps", "Save ₹40,000"],
            ["Depreciation Loss", "50% value lost in 3 years", "No depreciation risk", "Save ₹75,000"]
        ].map((row, index) => (<motion.tr key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border-b hover:bg-muted/50 transition-colors">
                          {row.map((cell, cellIndex) => (<td key={cellIndex} className={`p-4 ${cellIndex === 2 ? 'bg-primary/5' : ''} ${cellIndex === 3 ? 'text-green-600 font-semibold' : ''}`}>
                              {cell}
                            </td>))}
                        </motion.tr>))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-3xl text-primary mb-2">Total 3-Year Savings: ₹3,00,000+</p>
                  <p className="text-lg text-muted-foreground mb-6">Plus earning potential of ₹5,00,000+ through delivery services!</p>
                  <Button size="lg" className="bg-primary" onClick={() => onNavigate("pricing")}>
                    View Rental Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl mb-4">Ready to Start Earning?</h2>
                <p className="text-xl mb-8 text-white/90">
                  Rent the KWICK EV scooter and start earning ₹15,000-₹50,000 monthly today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" onClick={() => onNavigate("pricing")}>
                    View Pricing Plans
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" onClick={() => onNavigate("contact")}>
                    Contact Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
}
