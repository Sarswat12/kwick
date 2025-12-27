import { motion } from "motion/react";
import { UserPlus, FileCheck, Car, Battery, Leaf, Shield, Star, ChevronRight, Play, Download, Apple, Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "./ui/accordion";
export function LandingPage({ onNavigate }) {
    const steps = [
        {
            icon: UserPlus,
            title: "Sign Up",
            description: "Create your account in minutes and get started with Kiwck"
        },
        {
            icon: FileCheck,
            title: "Complete KYC",
            description: "Quick and secure verification process for your safety"
        },
        {
            icon: Car,
            title: "Rent & Ride",
            description: "Choose your vehicle and start your eco-friendly journey"
        }
    ];
    const features = [
        {
            icon: Battery,
            title: "Battery Swap",
            description: "Instant battery replacement at our swap stations"
        },
        {
            icon: Leaf,
            title: "Eco-Friendly",
            description: "Zero emissions, 100% sustainable transportation"
        },
        {
            icon: Shield,
            title: "Fully Insured",
            description: "Complete insurance coverage for peace of mind"
        }
    ];
    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "Daily Commuter",
            image: "https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMTc0MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 5,
            text: "Kiwck has transformed my daily commute. Affordable, eco-friendly, and reliable!"
        },
        {
            name: "Priya Patel",
            role: "Student",
            image: "https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMTc0MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 5,
            text: "Perfect for students! The monthly plans are super affordable and hassle-free."
        },
        {
            name: "Amit Kumar",
            role: "Business Owner",
            image: "https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYwMTc0MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080",
            rating: 5,
            text: "Great service and well-maintained vehicles. Highly recommended!"
        }
    ];
    const faqs = [
        {
            question: "How do I rent a vehicle?",
            answer: "Simply sign up, complete your KYC verification, choose a rental plan, and make payment. You'll receive your vehicle details immediately."
        },
        {
            question: "What documents do I need for KYC?",
            answer: "You'll need your Aadhar card, PAN card, driving license, and a passport-size photo. All documents can be uploaded digitally."
        },
        {
            question: "How does the battery swap work?",
            answer: "Visit any of our battery swap stations, exchange your depleted battery for a fully charged one in under 2 minutes."
        },
        {
            question: "What's included in the rental?",
            answer: "All rentals include the vehicle, helmet, insurance, and access to our battery swap network."
        },
        {
            question: "Can I cancel my subscription?",
            answer: "Yes, you can cancel anytime. For monthly plans, cancellation takes effect at the end of the billing cycle."
        }
    ];
    return (<div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Battery className="w-6 h-6 text-primary-foreground"/>
            </div>
            <h1 className="text-foreground">Kiwck</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate("about")} className="text-foreground hover:text-primary transition-colors">About</button>
            <button onClick={() => onNavigate("vehicles")} className="text-foreground hover:text-primary transition-colors">Vehicles</button>
            <button onClick={() => onNavigate("pricing")} className="text-foreground hover:text-primary transition-colors">Pricing</button>
            <button onClick={() => onNavigate("blog")} className="text-foreground hover:text-primary transition-colors">Blog</button>
            <button onClick={() => onNavigate("contact")} className="text-foreground hover:text-primary transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onNavigate("dashboard")}>Login</Button>
            <Button onClick={() => onNavigate("dashboard")} className="bg-primary hover:bg-primary/90">Sign Up</Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"/>
        
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-black via-primary/20 to-black flex items-center justify-center">
            <Play className="w-32 h-32 text-white/30"/>
          </div>
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-4 bg-primary/20 text-white border-primary">Go Electric, Go Green</Badge>
            <h1 className="text-5xl md:text-7xl text-white mb-6">
              Ride the Future with <span className="text-primary">Kiwck</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Premium electric vehicle rentals for modern India. Sustainable, affordable, and always ready to ride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => onNavigate("dashboard")} className="bg-primary hover:bg-primary/90">
                Rent Now <ChevronRight className="ml-2 w-5 h-5"/>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white/60">
            <ChevronRight className="w-8 h-8 rotate-90"/>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with Kiwck in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }}>
                <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary">{index + 1}</span>
                    </div>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-8 h-8 text-primary"/>
                    </div>
                    <h3 className="text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* EV Fleet Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-foreground mb-4">Our EV Fleet</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of premium electric vehicles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (<motion.div key={item} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/20 relative overflow-hidden">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1713254249770-7e9a688064d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNjb290ZXIlMjBjaXR5fGVufDF8fHx8MTc2MDA4OTc4OHww&ixlib=rb-4.1.0&q=80&w=1080" alt="Electric Vehicle" className="w-full h-full object-cover"/>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-foreground">Kiwck Pro {item}</h3>
                      <Badge className="bg-primary">Available</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex justify-between">
                        <span>Range</span>
                        <span className="text-foreground">80-100 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top Speed</span>
                        <span className="text-foreground">60 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charge Time</span>
                        <span className="text-foreground">4-5 hours</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => onNavigate("vehicles")}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (<motion.div key={index} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary"/>
                </div>
                <div>
                  <h3 className="text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-foreground mb-4">What Our Riders Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy riders across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-primary text-primary"/>))}
                    </div>
                    <p className="text-muted-foreground mb-6">{testimonial.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                        <ImageWithFallback src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <p className="text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Mobile App Download */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-white mb-4">Download the Kiwck App</h2>
              <p className="text-white/90 mb-8">
                Manage your rentals, track your vehicle, swap batteries, and more - all from your smartphone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-foreground">
                  <Apple className="mr-2 w-5 h-5"/>
                  App Store
                </Button>
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-foreground">
                  <Download className="mr-2 w-5 h-5"/>
                  Google Play
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-96 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                  <Smartphone className="w-32 h-32 text-white/50"/>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about Kiwck
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (<AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-12 border-t border-sidebar-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Battery className="w-6 h-6 text-primary-foreground"/>
                </div>
                <h3 className="text-white">Kiwck</h3>
              </div>
              <p className="text-muted-foreground">
                Sustainable mobility for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button onClick={() => onNavigate("about")} className="block text-muted-foreground hover:text-primary transition-colors">About Us</button>
                <button onClick={() => onNavigate("vehicles")} className="block text-muted-foreground hover:text-primary transition-colors">Vehicles</button>
                <button onClick={() => onNavigate("pricing")} className="block text-muted-foreground hover:text-primary transition-colors">Pricing</button>
                <button onClick={() => onNavigate("careers")} className="block text-muted-foreground hover:text-primary transition-colors">Careers</button>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4">Support</h4>
              <div className="space-y-2">
                <button onClick={() => onNavigate("contact")} className="block text-muted-foreground hover:text-primary transition-colors">Contact</button>
                <button className="block text-muted-foreground hover:text-primary transition-colors">Help Center</button>
                <button className="block text-muted-foreground hover:text-primary transition-colors">Terms</button>
                <button className="block text-muted-foreground hover:text-primary transition-colors">Privacy</button>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4">Newsletter</h4>
              <p className="text-muted-foreground mb-4">Stay updated with our latest offers</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-lg bg-sidebar-accent text-white border border-sidebar-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                <Button className="bg-primary hover:bg-primary/90">
                  <ChevronRight className="w-5 h-5"/>
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-sidebar-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Kiwck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>);
}
