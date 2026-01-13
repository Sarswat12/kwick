import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

export function AdminLogin({ onNavigate }) {
    const { adminLogin, user } = useAuth();
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // When user state changes and shouldRedirect is true, navigate to admin
    useEffect(() => {
        if (shouldRedirect && user?.role === 'admin') {
            console.log('[AdminLogin] User state updated to admin, navigating now');
            navigate('/admin', { replace: true });
        }
    }, [shouldRedirect, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const now = new Date().toLocaleTimeString();

        // Simple validation
        if (!adminId || !password) {
            setError('Please enter both Admin ID and password');
            setLoading(false);
            return;
        }

        console.log(`[AdminLogin] ${now} Attempting login with ID: ${adminId}`);
        const ok = await adminLogin(adminId, password);
        console.log(`[AdminLogin] ${now} Login result:`, ok);
        setLoading(false);

        if (ok) {
            console.log(`[AdminLogin] ${now} Login successful! Setting shouldRedirect flag`);
            setShouldRedirect(true);
        }
        else {
            console.log(`[AdminLogin] ${now} Login failed - showing error`);
            setError('Invalid Admin ID or Password. Access denied.');
            setPassword(''); // Clear password on failed attempt
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">KWICK TEAM</h1>
          <p className="text-gray-600 mt-2">Admin Dashboard Access</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId" className="flex items-center gap-2">
                  <User className="w-4 h-4"/>
                  Admin ID
                </Label>
                <Input id="adminId" value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="Enter your admin ID" autoComplete="username" disabled={loading} className="h-11"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4"/>
                  Password
                </Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" disabled={loading} className="h-11"/>
              </div>
              {error && (<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0"/>
                  <p className="text-sm text-red-600">{error}</p>
                </div>)}
              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold" disabled={loading}>
                  {loading ? (<>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
                      Signing in...
                    </>) : 'Sign in to Dashboard'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => onNavigate('home')} className="w-full" disabled={loading}>
                  Back to Website
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Authorized personnel only. All access is monitored.
        </p>
      </div>
    </div>);
}
