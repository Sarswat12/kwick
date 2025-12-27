import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Clock, DollarSign, Users, Briefcase, TrendingUp, Heart, Zap, Leaf, ArrowRight } from "lucide-react";
const jobOpenings = [
    {
        id: 1,
        title: "Fleet Manager",
        department: "Operations",
        location: "Noida Sector 112",
        type: "Full-time",
        salary: "₹40,000 - ₹60,000/month",
        description: "Manage our fleet of 500+ electric scooters across Delhi NCR. Ensure optimal vehicle availability and maintenance.",
        requirements: ["3+ years fleet management", "Valid driving license", "Excel proficiency"],
        featured: true
    },
    {
        id: 2,
        title: "Customer Support Executive",
        department: "Support",
        location: "Noida (Remote)",
        type: "Full-time",
        salary: "₹25,000 - ₹35,000/month",
        description: "Provide world-class support to our delivery partners via phone, chat, and email.",
        requirements: ["Excellent communication", "Hindi & English fluency", "Customer-first mindset"],
        featured: false
    },
    {
        id: 3,
        title: "Battery Technician",
        department: "Technical",
        location: "Multiple Locations",
        type: "Full-time",
        salary: "₹30,000 - ₹45,000/month",
        description: "Maintain and service battery swap stations. Ensure 99.9% uptime for our riders.",
        requirements: ["Electrical background", "Basic troubleshooting", "Willingness to travel"],
        featured: false
    },
    {
        id: 4,
        title: "Marketing Manager",
        department: "Marketing",
        location: "Noida Sector 112",
        type: "Full-time",
        salary: "₹50,000 - ₹80,000/month",
        description: "Lead marketing campaigns to attract new riders and grow KWICK's brand presence.",
        requirements: ["5+ years marketing", "Digital marketing expertise", "Data-driven approach"],
        featured: true
    },
    {
        id: 5,
        title: "Software Developer (Full Stack)",
        department: "Technology",
        location: "Noida (Hybrid)",
        type: "Full-time",
        salary: "₹60,000 - ₹1,00,000/month",
        description: "Build and scale KWICK's platform. Work with React, Node.js, and cloud technologies.",
        requirements: ["3+ years development", "React & Node.js", "Startup experience preferred"],
        featured: false
    },
    {
        id: 6,
        title: "Operations Executive",
        department: "Operations",
        location: "Delhi NCR",
        type: "Full-time",
        salary: "₹35,000 - ₹50,000/month",
        description: "Coordinate daily operations, manage battery logistics, and support field teams.",
        requirements: ["2+ years operations", "Problem-solving skills", "Field work experience"],
        featured: false
    }
];
const benefits = [
    {
        icon: TrendingUp,
        title: "Growth Opportunities",
        description: "Fast-track your career in India's fastest-growing EV sector"
    },
    {
        icon: Heart,
        title: "Health Insurance",
        description: "Comprehensive medical coverage for you and your family"
    },
    {
        icon: DollarSign,
        title: "Competitive Salary",
        description: "Above-market compensation with performance bonuses"
    },
    {
        icon: Users,
        title: "Amazing Team",
        description: "Work with passionate people building the future of mobility"
    },
    {
        icon: Zap,
        title: "Free EV Access",
        description: "Complimentary KWICK EV for personal use"
    },
    {
        icon: Leaf,
        title: "Green Mission",
        description: "Be part of India's sustainable transportation revolution"
    }
];
export function CareersPage({ onNavigate }) {
    return (<div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
            💼 Join KWICK
          </Badge>
          <h1 className="text-5xl md:text-6xl text-black mb-6">
            Build the Future of <span className="text-red-500">Mobility</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join India's leading EV rental platform and help 1000+ delivery partners earn lakhs monthly
          </p>
        </motion.div>

        {/* Why KWICK Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <h2 className="text-3xl text-black text-center mb-12">Why Work at KWICK?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-lg transition-all border hover:border-red-500">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-red-500"/>
                    </div>
                    <h3 className="text-lg text-black mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </motion.div>

        {/* Open Positions */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-3xl text-black text-center mb-4">Open Positions</h2>
          <p className="text-center text-gray-600 mb-12">Join our team of innovators and changemakers</p>

          <div className="space-y-6">
            {jobOpenings.map((job, index) => (<motion.div key={job.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className={`hover:shadow-xl transition-all ${job.featured ? 'border-2 border-red-500' : 'border hover:border-red-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-red-500"/>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl text-black">{job.title}</h3>
                              {job.featured && (<Badge className="bg-red-500 text-white">Featured</Badge>)}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4"/>
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4"/>
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4"/>
                                {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4"/>
                                {job.salary}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{job.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, i) => (<Badge key={i} variant="outline" className="text-xs">
                                  {req}
                                </Badge>))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-red-500 hover:bg-red-600 lg:ml-4">
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <Zap className="w-16 h-16 mx-auto mb-6"/>
              <h2 className="text-3xl md:text-4xl mb-4">Don't See the Perfect Role?</h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                We're always looking for talented individuals to join our mission. Send us your resume and tell us how you can contribute to KWICK's growth.
              </p>
              <Button size="lg" className="bg-white text-red-500 hover:bg-gray-100">
                Send Your Resume
                <ArrowRight className="ml-2 w-5 h-5"/>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
            { value: "50+", label: "Team Members" },
            { value: "10+", label: "Cities" },
            { value: "500+", label: "Riders Supported" },
            { value: "100%", label: "Eco-Friendly" }
        ].map((stat, index) => (<Card key={index} className="text-center border-2">
                <CardContent className="p-6">
                  <div className="text-4xl text-red-500 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>))}
          </div>
        </motion.div>
      </div>
    </div>);
}
