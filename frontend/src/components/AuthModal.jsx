import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const { login, signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(formData.email, formData.password);
            }
            else {
                await signup(formData.name, formData.email, formData.password, formData.phone);
            }
            onClose();
        }
        catch (error) {
            console.error('Auth error:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{mode === 'login' ? 'Login to KWICK' : 'Sign Up for KWICK'}</span>
            <button onClick={onClose} className="hover:opacity-70">
              <X className="w-5 h-5"/>
            </button>
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
            ? 'Enter your credentials to access your KWICK account'
            : 'Create a new account to start earning with KWICK'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (<div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Enter your full name"/>
            </div>)}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="Enter your email"/>
          </div>
          {mode === 'signup' && (<div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="+91 98765 43210"/>
            </div>)}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="Enter your password"/>
          </div>
          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
          <div className="text-center">
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm text-red-500 hover:underline">
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>);
};
