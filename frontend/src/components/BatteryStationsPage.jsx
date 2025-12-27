import * as React from "react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Navigation, Battery, Star, Search, ExternalLink, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
const BATTERY_STATIONS = [
    {
        id: "1",
        name: "KWICK Hub - Sector 112",
        address: "Sector 112, Noida, Uttar Pradesh 201301",
        distance: 0.5,
        available: 8,
        total: 12,
        rating: 4.8,
        status: "online",
        lat: 28.5355,
        lng: 77.3910,
        estimatedTime: 2
    },
    {
        id: "2",
        name: "KWICK Express - Metro Station",
        address: "Sector 101 Metro Station, Noida",
        distance: 2.1,
        available: 5,
        total: 10,
        rating: 4.6,
        status: "online",
        lat: 28.5650,
        lng: 77.3560,
        estimatedTime: 8
    },
    {
        id: "3",
        name: "KWICK Point - Shopping Mall",
        address: "DLF Mall of India, Sector 18, Noida",
        distance: 3.2,
        available: 12,
        total: 15,
        rating: 4.9,
        status: "online",
        lat: 28.5677,
        lng: 77.3247,
        estimatedTime: 12
    },
    {
        id: "4",
        name: "KWICK Stop - Business District",
        address: "Sector 62, Noida Corporate Hub",
        distance: 4.8,
        available: 0,
        total: 8,
        rating: 4.5,
        status: "offline",
        lat: 28.6271,
        lng: 77.3641,
        estimatedTime: 18
    },
    {
        id: "5",
        name: "KWICK Station - Hospital",
        address: "Fortis Hospital, Sector 62, Noida",
        distance: 5.1,
        available: 6,
        total: 10,
        rating: 4.7,
        status: "online",
        lat: 28.6205,
        lng: 77.3650,
        estimatedTime: 20
    }
];
export function BatteryStationsPage(props) {
    const { onNavigate, isLoggedIn = false, userData = null, onLogout = () => { }, isAdminMode = false, onToggleAdminMode = () => { } } = props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedStation, setSelectedStation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [sortedStations, setSortedStations] = useState(BATTERY_STATIONS);
    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, (error) => {
                console.log("Location access denied", error);
                // Default to Noida Sector 112
                setUserLocation({ lat: 28.5355, lng: 77.3910 });
            });
        }
        else {
            setUserLocation({ lat: 28.5355, lng: 77.3910 });
        }
    }, []);
    // Calculate distance and sort
    useEffect(() => {
        if (userLocation) {
            const stationsWithDistance = BATTERY_STATIONS.map(station => {
                const distance = calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
                return { ...station, distance };
            });
            const sorted = stationsWithDistance.sort((a, b) => a.distance - b.distance);
            setSortedStations(sorted);
        }
    }, [userLocation]);
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10; // Round to 1 decimal
    };
    const openInGoogleMaps = (station) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
        window.open(url, '_blank');
    };
    const filteredStations = sortedStations.filter(station => {
        const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || station.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case "online": return "bg-green-100 text-green-700 border-green-300";
            case "limited": return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "offline": return "bg-red-100 text-red-700 border-red-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };
    return (<div className="min-h-screen bg-background">
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back to Home
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl mb-2">Battery Swap Stations</h1>
                <p className="text-muted-foreground text-lg">Find and navigate to nearby KWICK battery swap locations</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm w-fit">
                <Battery className="w-4 h-4 mr-2"/>
                Free Unlimited Swaps
              </Badge>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by location or area..." className="pl-10"/>
              </div>
              <div className="flex gap-2">
                <Button variant={filterStatus === "all" ? "default" : "outline"} onClick={() => setFilterStatus("all")} size="sm">
                  All
                </Button>
                <Button variant={filterStatus === "online" ? "default" : "outline"} onClick={() => setFilterStatus("online")} size="sm" className="bg-green-600 hover:bg-green-700">
                  Online
                </Button>
                <Button variant={filterStatus === "limited" ? "default" : "outline"} onClick={() => setFilterStatus("limited")} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Limited
                </Button>
              </div>
              {userLocation && (<Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2"/>
                  Use Current Location
                </Button>)}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Station List */}
            <div className="lg:col-span-1 space-y-4 h-fit lg:max-h-[calc(100vh-300px)] lg:overflow-y-auto lg:pr-2">
              {filteredStations.map((station, index) => (<motion.div key={station.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
                  <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedStation?.id === station.id ? "border-2 border-primary" : ""}`} onClick={() => setSelectedStation(station)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{station.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{station.address}</p>
                        </div>
                        <Badge className={getStatusColor(station.status)}>
                          {station.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Available</p>
                          <p className={`font-semibold ${station.available === 0 ? "text-destructive" : "text-green-600"}`}>
                            {station.available}/{station.total}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="font-semibold">{station.distance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-semibold">{station.estimatedTime} min</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary"/>
                          <span className="text-sm font-semibold">{station.rating}</span>
                        </div>
                        <Button size="sm" onClick={(e) => {
                try {
                    e.stopPropagation();
                }
                catch { }
                openInGoogleMaps(station);
            }} className="bg-primary hover:bg-primary/90">
                          <Navigation className="w-4 h-4 mr-2"/>
                          Navigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>))}

              {filteredStations.length === 0 && (<Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No stations found matching your search</p>
                  </CardContent>
                </Card>)}
            </div>

            {/* Right: Map */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2">
              <Card className="h-full min-h-[600px] lg:sticky lg:top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Interactive Map</span>
                    <Button variant="outline" size="sm" onClick={() => {
            const allLocations = sortedStations.map(s => `${s.lat},${s.lng}`).join('|');
            window.open(`https://www.google.com/maps/search/?api=1&query=battery+swap+station+noida`, '_blank');
        }}>
                      <ExternalLink className="w-4 h-4 mr-2"/>
                      Open in Google Maps
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    {/* Map Placeholder */}
                    <ImageWithFallback src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMHBpbnN8ZW58MXx8fHwxNzYwMzQ5MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Battery Station Map" className="w-full h-full object-cover"/>
                    
                    {/* Map Overlay with Station Markers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex flex-wrap gap-3">
                          <Badge className="bg-green-600 text-white">
                            <div className="w-2 h-2 rounded-full bg-white mr-2"/>
                            Available ({filteredStations.filter(s => s.status === "online").length})
                          </Badge>
                          <Badge className="bg-yellow-600 text-white">
                            <div className="w-2 h-2 rounded-full bg-white mr-2"/>
                            Limited (0)
                          </Badge>
                          <Badge className="bg-red-600 text-white">
                            <div className="w-2 h-2 rounded-full bg-white mr-2"/>
                            Unavailable ({filteredStations.filter(s => s.status === "offline").length})
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Selected Station Info */}
                    {selectedStation && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-4 left-4 right-4 md:right-auto md:w-96">
                        <Card className="border-2 border-primary">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2">{selectedStation.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{selectedStation.address}</p>
                            <div className="flex items-center gap-4 mb-3">
                              <div>
                                <span className="text-xs text-muted-foreground">Batteries</span>
                                <p className="font-semibold">{selectedStation.available}/{selectedStation.total}</p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Distance</span>
                                <p className="font-semibold">{selectedStation.distance} km</p>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">ETA</span>
                                <p className="font-semibold">{selectedStation.estimatedTime} min</p>
                              </div>
                            </div>
                            <Button className="w-full bg-primary" onClick={() => selectedStation && openInGoogleMaps(selectedStation)}>
                              <Navigation className="w-4 h-4 mr-2"/>
                              Get Directions
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl mb-4">Quick Tips</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
            "Battery swaps take under 30 seconds at any station",
            "All batteries are 100% charged and quality tested",
            "24/7 customer support for any assistance needed",
            "Mobile app alerts for nearby stations and battery levels"
        ].map((tip, index) => (<div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-primary font-semibold">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-8 border-t border-sidebar-border mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 KWICK. All rights reserved. | Made with ❤️ for sustainable India</p>
        </div>
      </footer>
    </div>);
}
