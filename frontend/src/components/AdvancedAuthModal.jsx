import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
export function AdvancedAuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Wait for user state to update before navigating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Welcome back to KWICK!');
        onClose();
        // Wait for user state to be set before navigating
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 100);
      } else {
        await signup(formData.name, formData.email, formData.password, formData.phone);
        toast.success('Account created successfully!');
        onClose();
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 100);
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
    const benefits = [
        { icon: TrendingUp, text: "Earn ₹15K-₹50K monthly" },
        { icon: Shield, text: "Full insurance coverage" },
        { icon: Zap, text: "Unlimited battery swaps" }
    ];
    if (!isOpen)
        return null;
    return (<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>

        {/* Modal */}
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Branding & Benefits */}
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-12 text-white hidden md:flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"/>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"/>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8"/>
                  </div>
                  <h1 className="text-3xl">KWICK</h1>
                </div>

                <h2 className="text-4xl mb-4">
                  Start Your<br />
                  <span className="text-5xl">Journey to Lakhs</span>
                </h2>

                <p className="text-white/90 text-lg mb-8">
                  Join 1000+ delivery partners earning with India's #1 EV rental platform
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (<motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5"/>
                      </div>
                      <span className="text-lg">{benefit.text}</span>
                    </motion.div>))}
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-white/70">Active Riders</p>
                    <p className="text-2xl">1000+</p>
                  </div>
                  <div>
                    <p className="text-white/70">Battery Stations</p>
                    <p className="text-2xl">50+</p>
                  </div>
                  <div>
                    <p className="text-white/70">Cities</p>
                    <p className="text-2xl">10+</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 md:p-12">
              <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-5 h-5"/>
              </button>

              <div className="mb-8">
                <h3 className="text-3xl text-black mb-2">
                  {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                </h3>
                <p className="text-gray-600">
                  {mode === 'login'
            ? 'Login to access your KWICK dashboard'
            : 'Start earning with KWICK today'}
                </p>
              </div>

              {/* Toggle Tabs */}
              <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setMode('login')} className={`flex-1 py-3 rounded-lg transition-all ${mode === 'login'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-600 hover:text-black'}`}>
                  Login
                </button>
                <button onClick={() => setMode('signup')} className={`flex-1 py-3 rounded-lg transition-all ${mode === 'signup'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-600 hover:text-black'}`}>
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (<div>
                    <Label htmlFor="name" className="text-gray-700 mb-2 block">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                      <Input id="name" type="text" required placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-12 h-12 border-gray-300"/>
                    </div>
                  </div>)}

                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-2 block">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <Input id="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-12 h-12 border-gray-300"/>
                  </div>
                  {mode === 'login' && (<p className="text-xs text-gray-500 mt-1">
                      Use "admin@kwick.com" to login as admin
                    </p>)}
                </div>

                {mode === 'signup' && (<div>
                    <Label htmlFor="phone" className="text-gray-700 mb-2 block">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                      <Input id="phone" type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-12 h-12 border-gray-300"/>
                    </div>
                  </div>)}

                <div>
                  <Label htmlFor="password" className="text-gray-700 mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                    <Input id="password" type={showPassword ? "text" : "password"} required placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-12 pr-12 h-12 border-gray-300"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (<div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded"/>
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <button type="button" className="text-red-500 hover:text-red-600">
                      Forgot password?
                    </button>
                  </div>)}

                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-red-500 hover:bg-red-600 text-lg">
                  {isLoading ? (<div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      Processing...
                    </div>) : (mode === 'login' ? 'Login to Dashboard' : 'Create Account')}
                </Button>

                {mode === 'signup' && (<p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our Terms & Conditions and Privacy Policy
                  </p>)}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>);
}
