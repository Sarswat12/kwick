import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PublicNavbar } from "./PublicNavbar";
export function AboutPage({ onNavigate }) {
    return (<div className="min-h-screen bg-background">
      <PublicNavbar onNavigate={onNavigate}/>
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-foreground mb-6 text-center">About Kiwck</h1>
          
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-12 overflow-hidden">
            <ImageWithFallback src="https://images.unsplash.com/photo-1676275773827-f6554c1ef62a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NjAxMTgwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Team" className="w-full h-full object-cover"/>
          </div>

          <div className="space-y-6 text-center">
            <h2 className="text-foreground">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              At Kiwck, we're revolutionizing urban mobility by making electric vehicles accessible, 
              affordable, and convenient for everyone. We believe in a sustainable future where clean 
              transportation is the norm, not the exception.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-foreground mb-2">Sustainability</h3>
                  <p className="text-muted-foreground">
                    100% electric fleet with zero emissions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h3 className="text-foreground mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    Cutting-edge IoT and battery swap technology
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">❤️</span>
                  </div>
                  <h3 className="text-foreground mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    Building a network of eco-conscious riders
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);
}
export function ContactPage({ onNavigate }) {
    return (<div className="min-h-screen bg-background">
      <PublicNavbar onNavigate={onNavigate}/>
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-foreground mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Your name"/>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com"/>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+91 98765 43210"/>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea placeholder="How can we help you?" rows={5}/>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 mr-2"/>
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">support@kiwck.com</p>
                      <p className="text-muted-foreground">info@kiwck.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">+91 1800 123 4567 (Toll Free)</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="text-foreground mb-1">Office</h3>
                      <p className="text-muted-foreground">
                        123 MG Road, Connaught Place<br />
                        New Delhi - 110001<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted">
                <CardContent className="p-6">
                  <h3 className="text-foreground mb-2">Business Hours</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p>Saturday: 10:00 AM - 5:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);
}
export function CareersPage({ onNavigate }) {
    const jobs = [
        {
            title: "Senior Backend Developer",
            location: "New Delhi",
            type: "Full-time",
            department: "Engineering"
        },
        {
            title: "Product Designer",
            location: "Bangalore",
            type: "Full-time",
            department: "Design"
        },
        {
            title: "Fleet Operations Manager",
            location: "Mumbai",
            type: "Full-time",
            department: "Operations"
        },
        {
            title: "Customer Support Executive",
            location: "Remote",
            type: "Part-time",
            department: "Support"
        }
    ];
    return (<div className="min-h-screen bg-background">
      <PublicNavbar onNavigate={onNavigate}/>
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-foreground mb-4">Join Our Team</h1>
            <p className="text-muted-foreground text-lg">
              Help us build the future of sustainable mobility
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {jobs.map((job, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:border-primary transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-foreground mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1"/>
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Briefcase className="w-3 h-3 mr-1"/>
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {job.department}
                          </Badge>
                        </div>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-foreground mb-2">Don't see the right role?</h3>
              <p className="text-muted-foreground mb-6">
                Send us your resume and we'll keep you in mind for future opportunities
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Send Resume
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>);
}
