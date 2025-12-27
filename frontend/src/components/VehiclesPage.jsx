import { motion } from "motion/react";
import { Battery, Gauge, Clock, Filter } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import vehicleImg from '../assets/vehicle.png';
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PublicNavbar } from "./PublicNavbar";
export function VehiclesPage({ onNavigate }) {
    const vehicles = [
        {
            name: "Kiwck Pro 1",
            model: "KW-P1-2024",
            range: "80-100 km",
            topSpeed: "60 km/h",
            chargeTime: "4-5 hours",
            price: "₹199/day",
            image: vehicleImg,
            available: true
        },
        {
            name: "Kiwck Pro 2",
            model: "KW-P2-2024",
            range: "90-110 km",
            topSpeed: "65 km/h",
            chargeTime: "4 hours",
            price: "₹249/day",
            image: vehicleImg,
            available: true
        },
        {
            name: "Kiwck Sport",
            model: "KW-S1-2024",
            range: "70-85 km",
            topSpeed: "75 km/h",
            chargeTime: "3.5 hours",
            price: "₹299/day",
            image: vehicleImg,
            available: true
        },
        {
            name: "Kiwck Max",
            model: "KW-M1-2024",
            range: "100-120 km",
            topSpeed: "70 km/h",
            chargeTime: "5 hours",
            price: "₹349/day",
            image: vehicleImg,
            available: false
        },
        {
            name: "Kiwck Eco",
            model: "KW-E1-2024",
            range: "60-75 km",
            topSpeed: "50 km/h",
            chargeTime: "4 hours",
            price: "₹149/day",
            image: vehicleImg,
            available: true
        },
        {
            name: "Kiwck Premium",
            model: "KW-PM-2024",
            range: "110-130 km",
            topSpeed: "80 km/h",
            chargeTime: "4.5 hours",
            price: "₹399/day",
            image: vehicleImg,
            available: true
        }
    ];
    return (<div className="min-h-screen bg-background">
      <PublicNavbar onNavigate={onNavigate}/>
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-foreground mb-4">Our EV Fleet</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our diverse range of electric vehicles designed for every need
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Input placeholder="Search vehicles..."/>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Range"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="60-80">60-80 km</SelectItem>
                    <SelectItem value="80-100">80-100 km</SelectItem>
                    <SelectItem value="100+">100+ km</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Price"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">₹149-₹199</SelectItem>
                    <SelectItem value="mid">₹200-₹299</SelectItem>
                    <SelectItem value="high">₹300+</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2"/>
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (<motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }}>
              <Card className={`overflow-hidden h-full flex flex-col ${vehicle.available ? 'hover:border-primary' : 'opacity-75'} transition-all duration-300`}>
                <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 relative overflow-hidden">
                  <ImageWithFallback src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover"/>
                  <div className="absolute top-4 right-4">
                    {vehicle.available ? (<Badge className="bg-green-500 text-white">Available</Badge>) : (<Badge className="bg-gray-500 text-white">Not Available</Badge>)}
                  </div>
                </div>
                
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-foreground mb-1">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary">{vehicle.price}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm">
                      <Battery className="w-4 h-4 text-muted-foreground"/>
                      <span className="text-muted-foreground">Range:</span>
                      <span className="text-foreground ml-auto">{vehicle.range}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Gauge className="w-4 h-4 text-muted-foreground"/>
                      <span className="text-muted-foreground">Top Speed:</span>
                      <span className="text-foreground ml-auto">{vehicle.topSpeed}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground"/>
                      <span className="text-muted-foreground">Charge Time:</span>
                      <span className="text-foreground ml-auto">{vehicle.chargeTime}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" size="sm" disabled={!vehicle.available} onClick={() => onNavigate("dashboard")}>
                      {vehicle.available ? "Rent Now" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>))}
        </div>
      </div>
    </div>);
}
