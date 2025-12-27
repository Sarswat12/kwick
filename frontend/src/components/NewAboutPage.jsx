import { motion } from "motion/react";
import { TrendingUp, Battery, Leaf, MapPin, ChevronRight, Star, Zap, Target, Sparkles, TreePine, Sun, Recycle, Wind, Award, Users, Heart, Lightbulb, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import ctoImg from "../assets/cto.png";
import ceoImg from "../assets/ceo.png";
export function NewAboutPage({ onNavigate }) {
    const floatingAnimation = {
        y: [0, -20, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };
    return (<div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <motion.div animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
        }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-3xl"/>
        <motion.div animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
        }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-40 -left-20 w-96 h-96 bg-gradient-to-br from-green-500 to-blue-500 rounded-full blur-3xl"/>
        <motion.div animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05]
        }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"/>
      </div>

      {/* Hero Section with Particles Effect */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative">
        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => (<motion.div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }} animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
            }} transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
            }}/>))}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center mb-12">
            <motion.div animate={floatingAnimation} className="inline-block">
              <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 text-lg px-6 py-2 shadow-xl">
                🌱 Building a Sustainable Future
              </Badge>
            </motion.div>
            
            <motion.h1 className="text-6xl md:text-8xl text-black mb-6" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              About{" "}
              <motion.span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-orange-500" animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: "200% 200%" }}>
                KWICK
              </motion.span>
            </motion.h1>
            
            <motion.p className="text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              India's <span className="text-red-500 font-semibold">leading EV rental platform</span> empowering delivery partners to earn while protecting our planet
            </motion.p>

            {/* Animated Stats */}
            <motion.div className="flex flex-wrap justify-center gap-8 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {[
            { value: "1000+", label: "Happy Partners", icon: Users },
            { value: "10+", label: "Cities", icon: MapPin },
            { value: "50+", label: "Battery Stations", icon: Battery }
        ].map((stat, index) => (<motion.div key={index} className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <stat.icon className="w-6 h-6 text-red-500"/>
                  <div className="text-left">
                    <div className="text-2xl text-black">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      
      {/* Environmental Impact Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-green-500/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1728881652468-49f4d6771752?w=1920)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.4)',
            opacity: 0.3
        }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 className="text-5xl md:text-6xl text-white mb-4 drop-shadow-2xl" animate={{
            textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
            ]
        }} transition={{ duration: 2, repeat: Infinity }}>
              Earn Money, <span className="text-green-300">Save Planet</span>
            </motion.h2>
            <p className="text-2xl text-white/90 drop-shadow-lg">
              Every KWICK ride contributes to a cleaner India
            </p>
          </motion.div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
            {
                icon: Leaf,
                title: "Zero Emissions",
                subtitle: "100% electric, 0% pollution",
                metric: "500+ Trees Saved",
                description: "Every km saves the environment.",
                color: "from-green-500 to-emerald-600",
                bgImage: "https://images.unsplash.com/photo-1728881652468-49f4d6771752?w=400"
            },
            {
                icon: Sun,
                title: "Solar Powered",
                subtitle: "60% renewable energy",
                metric: "5000kg CO2 Prevented",
                description: "Battery stations run on solar energy.",
                color: "from-yellow-500 to-orange-600",
                bgImage: "https://images.unsplash.com/photo-1655300256486-4ec7251bf84e?w=400"
            },
            {
                icon: Recycle,
                title: "100% Recycled",
                subtitle: "Certified processes",
                metric: "100% Renewable",
                description: "All batteries responsibly recycled.",
                color: "from-blue-500 to-cyan-600",
                bgImage: "https://images.unsplash.com/photo-1749531431228-db0aa0fb122f?w=400"
            },
            {
                icon: Wind,
                title: "Clean Air",
                subtitle: "Breathing easier",
                metric: "10,000+ Rides Daily",
                description: "Zero carbon footprint daily.",
                color: "from-purple-500 to-pink-600",
                bgImage: "https://images.unsplash.com/photo-1728881652468-49f4d6771752?w=400"
            }
        ].map((item, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05, rotateY: 5 }} className="relative group">
                <div className="relative h-full overflow-hidden rounded-2xl shadow-2xl">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${item.bgImage})`, filter: 'blur(2px) brightness(0.4)' }}></div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80`}></div>
                  
                  {/* Content */}
                  <div className="relative p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <motion.div animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
            }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }} className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                        <item.icon className="w-8 h-8"/>
                      </motion.div>
                      <h3 className="text-2xl mb-2">{item.title}</h3>
                      <p className="text-white/90 text-sm mb-4">{item.subtitle}</p>
                      <p className="text-sm text-white/80 mb-4">{item.description}</p>
                    </div>
                    <div>
                      <div className="text-3xl mb-1">{item.metric}</div>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </div>

          {/* Your Impact Section */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700"></div>
            <div className="relative p-12 text-center text-white">
              <motion.div animate={floatingAnimation}>
                <TreePine className="w-16 h-16 mx-auto mb-6"/>
              </motion.div>
              <h3 className="text-4xl md:text-5xl mb-4">🌱 Your Impact Matters</h3>
              <p className="text-xl mb-6 max-w-3xl mx-auto text-white/90">
                Every 1000 km with KWICK saves <span className="font-bold text-2xl">50kg CO2 emissions</span> and plants <span className="font-bold text-2xl">5 trees</span>.
              </p>
              <p className="text-2xl mb-8">
                Earn money while building a sustainable future for your children.
              </p>
              <Button size="lg" onClick={() => onNavigate("pricing")} className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Your Green Journey
                <ChevronRight className="ml-2 w-5 h-5"/>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 relative">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-lg px-6 py-2">
              <Heart className="w-4 h-4 inline mr-2"/>
              Our Core Values
            </Badge>
            <h2 className="text-5xl md:text-6xl text-black mb-4">
              Mission & <span className="text-red-500">Vision</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden border-2 border-red-100 shadow-2xl hover:shadow-red-200 transition-all duration-500 w-full max-w-2xl mx-auto min-h-0" style={{ minHeight: '320px', maxWidth: '520px' }}>
                <CardContent className="p-8 md:p-10" style={{ minHeight: '260px' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-white"/>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-base px-4 py-1">Our Mission</Badge>
                  </div>
                  
                  <h2 className="text-4xl text-black mb-4">
                    Empowering India's Delivery Heroes
                  </h2>
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                    We believe every delivery partner deserves access to affordable, reliable electric vehicles without the burden of ownership. KWICK provides premium EV scooters on flexible rental plans, enabling partners to maximize earnings while minimizing costs.
                  </p>
                  <ul className="space-y-4">
                    {[
            "Zero upfront investment required",
            "Unlimited battery swaps included",
            "24/7 roadside assistance",
            "Comprehensive insurance coverage"
        ].map((item, index) => (<motion.li key={index} className="flex items-start gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-white"/>
                        </div>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </motion.li>))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <Card className="relative overflow-hidden border-2 border-blue-100 shadow-2xl hover:shadow-blue-200 transition-all duration-500 w-full max-w-2xl mx-auto min-h-0" style={{ minHeight: '320px', maxWidth: '520px' }}>
                <CardContent className="p-8 md:p-10" style={{ minHeight: '260px' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Lightbulb className="w-7 h-7 text-white"/>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-base px-4 py-1">Our Vision</Badge>
                  </div>
                  
                  <h2 className="text-4xl text-black mb-4">
                    India's Largest EV Fleet by 2030
                  </h2>
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                    We're building India's most extensive electric vehicle rental network, making sustainable transportation accessible to every delivery partner across the nation. Join us in revolutionizing last-mile delivery.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
            { label: "Cities", value: "10+", icon: MapPin, color: "from-red-500 to-orange-500" },
            { label: "Partners", value: "1000+", icon: Target, color: "from-blue-500 to-cyan-500" },
            { label: "Stations", value: "50+", icon: Battery, color: "from-green-500 to-emerald-500" },
            { label: "Daily Rides", value: "10K+", icon: Zap, color: "from-purple-500 to-pink-500" }
        ].map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05, rotate: 5 }}>
                        <Card className="text-center border-2 hover:shadow-xl transition-all">
                          <CardContent className="p-6">
                            <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                              <stat.icon className="w-6 h-6 text-white"/>
                            </div>
                            <div className="text-3xl text-black mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                          </CardContent>
                        </Card>
                      </motion.div>))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR FOUNDERS SECTION - NEW! */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
        {/* Animated Blackish Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 animate-pulse" style={{
            background: 'radial-gradient(circle at 30% 40%, rgba(0,0,0,0.7) 60%, transparent 100%)',
            backgroundColor: '#18181b',
            filter: 'blur(0px) brightness(0.7)'
        }}></div>
          <div className="absolute inset-0 opacity-20 animate-pulse" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
        }}></div>
        </div>

        {/* Glowing Orbs */}
        <motion.div animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
        }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-3xl"/>
        <motion.div animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
        }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"/>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div animate={floatingAnimation} className="inline-block">
              <Badge className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-lg px-6 py-2 shadow-2xl">
                <Award className="w-5 h-5 inline mr-2"/>
                Leadership Team
              </Badge>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl text-white mb-6">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Founders</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visionaries driving India's electric mobility revolution
            </p>
          </motion.div>

          {/* Founders Grid - centered two cards */}
          <div className="flex flex-wrap justify-center gap-24 max-w-6xl mx-auto relative z-10">
            {/* Founder 1 */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} whileHover={{ scale: 1.04 }} className="group">
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-red-500 transition-all duration-500 shadow-2xl w-80 md:w-96 mx-auto">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
                    
                    {/* Founder Image */}
                    <motion.div className="w-full h-full flex items-center justify-center p-4" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                      <ImageWithFallback src={ctoImg} alt="Rahul Kumar - Co-Founder & CTO & COO" className="max-h-44 w-auto object-contain rounded-md"/>
                    </motion.div>

                    {/* Founder Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <Badge className="mb-3 bg-red-500 text-white border-0">Co-Founder & CTO & COO</Badge>
                      <h3 className="text-3xl text-red-500 mb-2 font-semibold">Rahul Kumar</h3>
                      
                    </div>
                  </div>

                  {/* Quote Section */}
                  <div className="p-6 bg-gray-800/60 backdrop-blur-sm relative rounded-b-xl">
                    <p className="text-white text-sm italic leading-relaxed mb-2 pt-2">
                      Technology should empower people. With KWICK, we're leveraging IoT and AI to give delivery partners the tools they need to earn more while creating a cleaner India.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400"/>))}
                      </div>
                      <span className="text-xs text-white">10+ Years in EV + Tech Industry</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Founder 2 */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} whileHover={{ scale: 1.04 }} className="group">
              <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-blue-500 transition-all duration-500 shadow-2xl w-80 md:w-96 mx-auto">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
                    
                    {/* Founder Image */}
                    <motion.div className="w-full h-full flex items-center justify-center p-4" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                      <ImageWithFallback src={ceoImg} alt="Bimlesh Tiwari - Co-Founder & CEO" className="max-h-44 w-auto object-contain rounded-md"/>
                    </motion.div>

                    {/* Founder Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                      <Badge className="mb-3 bg-blue-500 text-white border-0">Co-Founder & CEO</Badge>
                      <h3 className="text-3xl text-red-500 mb-2 font-semibold">Bimlesh Tiwari</h3>
                    </div>
                  </div>

                  {/* Quote Section */}
                  <div className="p-6 bg-gray-800/60 backdrop-blur-sm relative rounded-b-xl">
                    <p className="text-white text-sm italic leading-relaxed mb-2 pt-2">
                      Our mission is simple: Make electric mobility accessible to every delivery partner in India. Together, we're not just building a business—we're building a sustainable future.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400"/>))}
                      </div>
                      <span className="text-xs text-white">15+ Years in Automobiles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Founders Achievement Stats removed per request */}
        </div>
      </section>

      {/* Why Choose KWICK - Enhanced */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl text-black mb-4">
              Why Choose <span className="text-red-500">KWICK</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of delivery partners earning lakhs monthly with India's most trusted EV platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
            

            {[
            {
                icon: TrendingUp,
                title: "Maximum Earnings",
                description: "Earn ₹15,000-₹50,000 monthly with zero fuel costs. Our top partners make over ₹50K!",
                color: "from-green-500 to-emerald-600"
            },
            {
                icon: Battery,
                title: "Unlimited Battery Swaps",
                description: "Never worry about charging. Swap batteries in under 2 minutes at 50+ stations.",
                color: "from-blue-500 to-cyan-600"
            },
            {
                icon: Leaf,
                title: "100% Eco-Friendly",
                description: "Contribute to a cleaner India. Every ride with KWICK helps save the environment.",
                color: "from-green-600 to-green-700"
            }
        ].map((feature, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10, scale: 1.03 }}>
                <Card className="h-full hover:shadow-2xl transition-all border-2 hover:border-red-200 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${feature.color}`}></div>
                  <CardContent className="p-8 text-center">
                    <motion.div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                      <feature.icon className="w-10 h-10 text-white"/>
                    </motion.div>
                    <h3 className="text-2xl text-black mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-red-500 via-red-600 to-orange-500 relative overflow-hidden">
        {/* Animated Shapes */}
        <motion.div animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
        }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
        <motion.div animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1]
        }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <motion.h2 className="text-5xl md:text-6xl text-white mb-6" animate={{
            textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
            ]
        }} transition={{ duration: 2, repeat: Infinity }}>
              Ready to Start Earning?
            </motion.h2>
            <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join 1000+ delivery partners already earning lakhs with KWICK
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={() => onNavigate("pricing")} className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-6">
                  View Pricing Plans
                  <ChevronRight className="ml-2 w-5 h-5"/>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" onClick={() => onNavigate("contact")} className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Contact Us
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>);
}
