import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, ArrowLeft, Building, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";
export function EnhancedContactPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        inquiryType: "",
        subject: "",
        message: ""
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent successfully! We'll get back to you within 24 hours.");
        setFormData({ name: "", phone: "", email: "", inquiryType: "", subject: "", message: "" });
    };
    const offices = [
        {
            city: "Noida (HQ)",
            address: "Sector 112, Noida, Uttar Pradesh 201301",
            phone: "+91 98765 43210",
            email: "noida@kwick.in",
            hours: "Mon-Sat: 9:00 AM - 7:00 PM"
        }
    ];
    return (<div className="min-h-screen bg-background">

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => onNavigate("home")} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back to Home
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl mb-4">🤝 We're Here to Help</h1>
              <h2 className="text-3xl md:text-4xl mb-4">Get in Touch With <span className="text-primary">KWICK</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions about our EV rental service? Need support with your booking? Our team is here to help you 24/7.
              </p>
            </div>
          </motion.div>

          {/* Multiple Ways to Reach Us */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h3 className="text-2xl mb-8 text-center">Multiple Ways to Reach Us</h3>
            <p className="text-center text-muted-foreground mb-8">Choose the communication method that works best for you</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
            { icon: Phone, title: "Phone Support", value: "+91 9289484832", description: "24/7 customer support for urgent matters", theme: { bg: 'bg-blue-100', text: 'text-blue-600' } },
            { icon: Mail, title: "Email Support", value: "support@kwick.in", description: "Get detailed help via email", theme: { bg: 'bg-green-100', text: 'text-green-600' } },
            { icon: MessageCircle, title: "Live Chat", value: "Available on app", description: "Instant support through our mobile app", theme: { bg: 'bg-purple-100', text: 'text-purple-600' } },
            { icon: Building, title: "Office Location", value: "Noida", description: "Visit our office in Noida", theme: { bg: 'bg-orange-100', text: 'text-orange-600' } }
        ].map((method, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className={`${method.theme.bg} w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <method.icon className={`${method.theme.text} w-7 h-7`}/>
                      </div>
                      <h4 className="font-semibold mb-2">{method.title}</h4>
                      <p className="text-primary font-semibold mb-2">{method.value}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>))}
            </div>
          </motion.div>

          {/* Contact Form and Offices */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <p className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" required/>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9289484832" required/>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your.email@example.com" required/>
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">Inquiry Type</Label>
                      <Select value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="booking">Booking Support</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Brief description of your inquiry" required/>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Please provide detailed information about your inquiry..." rows={5} required/>
                    </div>

                    <Button type="submit" className="w-full bg-primary">
                      <Send className="w-4 h-4 mr-2"/>
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">📞</div>
                  <h3 className="text-2xl mb-2">24/7 Support Available</h3>
                  <p className="text-muted-foreground mb-6">Our customer support team is available round the clock for urgent matters</p>
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2"/>
                    Call Support
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">⏱️</div>
                  <h3 className="text-2xl mb-2 text-green-900">{"<"}2hrs Response Time</h3>
                  <p className="text-green-700 mb-2">We typically respond to inquiries within 2 hours during business hours</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Our Offices */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h3 className="text-2xl mb-8 text-center">Our Offices</h3>
            <p className="text-center text-muted-foreground mb-8">Visit us at any of our office locations across India.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {offices.map((office, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary"/>
                        {office.city}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-muted-foreground shrink-0 mt-1"/>
                        <p className="text-sm">{office.address}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground"/>
                        <p className="text-sm">{office.phone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground"/>
                        <p className="text-sm">{office.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground"/>
                        <p className="text-sm">{office.hours}</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl mb-8 text-center">Frequently Asked Questions</h3>
            <p className="text-center text-muted-foreground mb-8">Quick answers to common questions</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
            {
                question: "How quickly can I get a vehicle?",
                answer: "For standard delivery, vehicles are available within 2-4 hours. Express delivery (₹99) gets you a vehicle within 30 minutes."
            },
            {
                question: "What documents do I need?",
                answer: "You need a valid driving license, Aadhaar card, and one address proof. KYC verification is completed online."
            },
            {
                question: "Is insurance included?",
                answer: "Yes, comprehensive insurance is included in all rental plans. You're covered for accidents and theft."
            },
            {
                question: "Can I extend my rental?",
                answer: "Absolutely! You can extend your rental anytime through the app or by calling our support team."
            }
        ].map((faq, index) => (<Card key={index}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">Still Have Questions?</p>
              <p className="text-sm text-muted-foreground mb-6">Our customer support team is available 24/7 to help you with anything you need.</p>
              <div className="flex gap-4 justify-center">
                <Button>Call Support</Button>
                <Button variant="outline">Live Chat</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-12 border-t border-sidebar-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 KWICK. All rights reserved. | Made with ❤️ for sustainable India</p>
        </div>
      </footer>
    </div>);
}
