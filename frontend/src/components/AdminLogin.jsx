import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
export function AdminLogin({ onNavigate }) {
    const { adminLogin } = useAuth();
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await adminLogin(adminId, password);
        if (ok) {
            window.history.pushState({}, '', '/admin');
            onNavigate('admin-dashboard');
        }
        else {
            setError('Invalid admin ID or password');
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Admin ID</Label>
              <Input value={adminId} onChange={(e) => setAdminId(e.target.value)} placeholder="admin"/>
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex items-center justify-between">
              <Button type="submit" className="bg-red-600">Sign in</Button>
              <Button variant="ghost" onClick={() => onNavigate('home')}>Back to site</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
}
