import { motion } from "motion/react";
import { Battery, MapPin, Activity, Zap, Navigation, Phone, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";
export function FleetPage() {
    return (<div className="p-6 space-y-6">
      <div>
        <h2 className="text-foreground mb-2">My Fleet</h2>
        <p className="text-muted-foreground">Your assigned vehicle details</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg overflow-hidden">
                <ImageWithFallback src="https://images.unsplash.com/photo-1713254249770-7e9a688064d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5fGVufDF8fHx8MTc2MDA4OTc4OHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Vehicle" className="w-full h-full object-cover"/>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-foreground">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Model</span>
                      <span className="text-foreground">Kiwck Pro 2</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Vehicle Number</span>
                      <span className="text-foreground font-mono">DL 8C AB 1234</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Chassis Number</span>
                      <span className="text-foreground font-mono text-sm">CH123456789</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Color</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 border"/>
                        <span className="text-foreground">Red</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-foreground">Technical Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Battery ID</span>
                      <span className="text-foreground font-mono text-sm">BAT987654321</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Motor Number</span>
                      <span className="text-foreground font-mono text-sm">MOT456789123</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Controller</span>
                      <span className="text-foreground font-mono text-sm">CTRL789456</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground">Odometer</span>
                      <span className="text-foreground">3,452 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Accessories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Helmet</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Provided</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">T-shirt</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Provided</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone Mount</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Included</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Under-seat Storage</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Available</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-green-500/50 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Activity className="w-5 h-5"/>
                  Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy Number</span>
                  <span className="text-foreground font-mono text-sm">INS789456123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span className="text-foreground">Dec 31, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="text-foreground">Comprehensive</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
}
export function BatterySwapPage() {
    const swapHistory = [
        { date: "Oct 10, 2025", time: "2:30 PM", location: "Connaught Place Station", oldBattery: 15, newBattery: 100 },
        { date: "Oct 8, 2025", time: "10:15 AM", location: "Karol Bagh Station", oldBattery: 12, newBattery: 98 },
        { date: "Oct 5, 2025", time: "5:45 PM", location: "Lajpat Nagar Station", oldBattery: 8, newBattery: 100 }
    ];
    return (<div className="p-6 space-y-6">
      <div>
        <h2 className="text-foreground mb-2">Battery Swap</h2>
        <p className="text-muted-foreground">Current battery status and swap history</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Battery Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray={`${78 * 2.51} ${100 * 2.51}`} strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Battery className="w-12 h-12 text-green-600 mb-2"/>
                    <span className="text-4xl text-foreground">78%</span>
                    <span className="text-sm text-muted-foreground mt-1">~62 km range</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-muted">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Battery Health</p>
                    <p className="text-xl text-green-600">Excellent</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Last Swap</p>
                    <p className="text-xl text-foreground">1 day ago</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Swaps</p>
                    <p className="text-xl text-foreground">12</p>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-foreground mb-4">Swap History</h3>
                <div className="space-y-4">
                  {swapHistory.map((swap, index) => (<div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                          <p className="text-foreground">{swap.location}</p>
                          <p className="text-sm text-muted-foreground">{swap.date} at {swap.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{swap.oldBattery}% → {swap.newBattery}%</p>
                      </div>
                    </div>))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-blue-500/50 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <MapPin className="w-5 h-5"/>
                  Nearest Station
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground">Connaught Place Swap Station</p>
                <p className="text-sm text-muted-foreground">2.3 km away</p>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Available Batteries</p>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="flex-1 h-2"/>
                    <span className="text-sm text-foreground">34/40</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  <Navigation className="w-4 h-4 mr-2"/>
                  Navigate
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>All Swap Stations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
            { name: "Connaught Place", distance: "2.3 km", available: 34 },
            { name: "Karol Bagh", distance: "4.7 km", available: 28 },
            { name: "Lajpat Nagar", distance: "6.2 km", available: 31 }
        ].map((station, index) => (<div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-foreground text-sm">{station.name}</p>
                      <p className="text-xs text-muted-foreground">{station.distance}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {station.available} available
                    </Badge>
                  </div>))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
}
export function TrackingPage() {
    return (<div className="p-6 space-y-6">
      <div>
        <h2 className="text-foreground mb-2">IoT Tracking</h2>
        <p className="text-muted-foreground">Real-time vehicle monitoring and diagnostics</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4"/>
                  <p className="text-muted-foreground">Map showing live vehicle location</p>
                  <p className="text-sm text-muted-foreground mt-2">Connaught Place, New Delhi</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Current Speed</p>
                    <p className="text-2xl text-foreground">32 km/h</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Distance Today</p>
                    <p className="text-2xl text-foreground">18.7 km</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Avg Speed</p>
                    <p className="text-2xl text-foreground">28 km/h</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-green-500/50 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Activity className="w-5 h-5"/>
                  Device Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Connection</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">GPS Signal</span>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="text-foreground text-sm">2 mins ago</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Battery Health</span>
                    <span className="text-sm text-foreground">96%</span>
                  </div>
                  <Progress value={96} className="h-2"/>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Motor Efficiency</span>
                    <span className="text-sm text-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2"/>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Brake Condition</span>
                    <span className="text-sm text-foreground">88%</span>
                  </div>
                  <Progress value={88} className="h-2"/>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Tire Pressure</span>
                    <span className="text-sm text-foreground">Good</span>
                  </div>
                  <Progress value={85} className="h-2"/>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
}
export function SupportPage() {
    return (<div className="p-6 space-y-6">
      <div>
        <h2 className="text-foreground mb-2">Support</h2>
        <p className="text-muted-foreground">We're here to help you</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Raise a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief description of your issue"/>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                  <option>Vehicle Issue</option>
                  <option>Battery Problem</option>
                  <option>Payment Query</option>
                  <option>KYC Related</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Describe your issue in detail..." rows={6}/>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
            { id: "TKT-1234", subject: "Battery swap station not working", status: "resolved", date: "Oct 8, 2025" },
            { id: "TKT-1233", subject: "Payment confirmation delay", status: "in-progress", date: "Oct 5, 2025" }
        ].map((ticket, index) => (<div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-foreground">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.id} • {ticket.date}
                      </p>
                    </div>
                    <Badge className={ticket.status === "resolved"
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"}>
                      {ticket.status}
                    </Badge>
                  </div>))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <Button variant="secondary" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2"/>
                    Call Support
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2"/>
                    Email Us
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2"/>
                    Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="text-foreground">9AM - 7PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-foreground">10AM - 5PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">Closed</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-muted">
              <CardContent className="p-6">
                <h4 className="text-foreground mb-2">Emergency?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  For urgent issues, call our 24/7 emergency hotline
                </p>
                <Button variant="outline" className="w-full">
                  1800 123 4567
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>);
}
