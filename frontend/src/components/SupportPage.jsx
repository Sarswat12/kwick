import { motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { UserDashboardSidebar } from "./UserDashboardSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MessageCircle, Phone, Mail, MapPin, Clock, Send, CheckCircle, HelpCircle, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
export function SupportPage({ onNavigate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleId: '',
        category: '',
        priority: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.category || !formData.message) {
            toast.error('Please fill all required fields');
            return;
        }
        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
            toast.success('Support ticket submitted successfully!');
        }, 1000);
    };
    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    const faqs = [
        {
            question: 'How do I start earning with KWICK?',
            answer: 'Complete your KYC verification, rent a vehicle, and start delivering with partner platforms like Zomato, Swiggy, or Blinkit.'
        },
        {
            question: 'What is the rental cost per month?',
            answer: 'Monthly rental starts at ₹5,000 for standard models. Check our pricing page for detailed plans.'
        },
        {
            question: 'How long does battery swap take?',
            answer: 'Battery swap takes approximately 2-4 minutes at any KWICK swap station.'
        },
        {
            question: 'What if the vehicle breaks down?',
            answer: 'Contact our 24/7 support team immediately. We provide free roadside assistance and replacement vehicles.'
        },
        {
            question: 'Can I return the vehicle anytime?',
            answer: 'Yes, with 7 days notice. Early termination charges may apply based on your rental agreement.'
        }
    ];
    if (submitted) {
        return (<div className="min-h-screen bg-gray-50">
        <UserDashboardSidebar currentPage="support" onNavigate={onNavigate}/>
        
        <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 min-h-screen">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600"/>
                </div>
                <h2 className="text-3xl mb-4">Ticket Submitted Successfully!</h2>
                <p className="text-muted-foreground mb-2">
                  Your support ticket has been received and assigned ID: <strong>TKT{Date.now()}</strong>
                </p>
                <p className="text-muted-foreground mb-8">
                  Our team will respond within 24 hours. You'll receive updates via email and SMS.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another Ticket
                  </Button>
                  <Button onClick={() => onNavigate('user-dashboard')} className="bg-primary">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      <UserDashboardSidebar currentPage="support" onNavigate={onNavigate}/>
      
      <div className="ml-[var(--user-sidebar-width,280px)] transition-all pt-24 p-6 min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2">Support & Help</h1>
            <p className="text-muted-foreground">We're here to help you 24/7</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary"/>
                    Submit a Support Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Your full name" required/>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your.email@example.com" required/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+91 98765 43210"/>
                      </div>

                      <div>
                        <Label htmlFor="vehicleId">Vehicle ID (if applicable)</Label>
                        <Input id="vehicleId" value={formData.vehicleId} onChange={(e) => handleInputChange('vehicleId', e.target.value)} placeholder="VH001"/>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Issue Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vehicle">Vehicle Issue</SelectItem>
                            <SelectItem value="payment">Payment Issue</SelectItem>
                            <SelectItem value="kyc">KYC Verification</SelectItem>
                            <SelectItem value="battery">Battery Swap</SelectItem>
                            <SelectItem value="accident">Accident/Emergency</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" value={formData.subject} onChange={(e) => handleInputChange('subject', e.target.value)} placeholder="Brief description of your issue" required/>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} placeholder="Describe your issue in detail..." rows={6} required/>
                    </div>

                    <Button type="submit" className="w-full bg-primary">
                      <Send className="w-4 h-4 mr-2"/>
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary"/>
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (<div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="border-2 border-red-500">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5"/>
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    For accidents or vehicle breakdown, call immediately:
                  </p>
                  <a href="tel:1800-123-KWICK" className="block">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Phone className="w-4 h-4 mr-2"/>
                      1800-123-KWICK
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Available 24/7
                  </p>
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a href="tel:+919876543210" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone className="w-5 h-5 text-primary"/>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </a>

                  <a href="mailto:hello@kwick.in" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Mail className="w-5 h-5 text-primary"/>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">hello@kwick.in</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary"/>
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">Sector 112, Noida, UP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary"/>
                    <div>
                      <p className="font-medium">Support Hours</p>
                      <p className="text-sm text-muted-foreground">24/7 Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-1"/>
                    <div>
                      <h4 className="font-medium mb-2">Response Time</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Emergency: Immediate</li>
                        <li>• High Priority: 1-2 hours</li>
                        <li>• Medium: 4-8 hours</li>
                        <li>• Low: 24 hours</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2"/>
                    User Manual
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2"/>
                    Help Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('battery-stations')}>
                    <MapPin className="w-4 h-4 mr-2"/>
                    Find Service Centers
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);
}
