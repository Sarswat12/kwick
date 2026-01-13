import React, { createContext, useContext, useState, useEffect } from 'react';
import * as apiAuth from '../utils/auth';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [viewMode, setViewMode] = useState('user');
    useEffect(() => {
        // Check for saved user in localStorage
        const savedUser = localStorage.getItem('kwick_user');
        const savedViewMode = localStorage.getItem('kwick_view_mode');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
        // Auto-login for development/testing - enabled only when
        // VITE_ALLOW_DEV_AUTOLOGIN === 'true' in your local .env
        // This must be disabled in production. See .env.example
        try {
            const allowDev = import.meta.env.VITE_ALLOW_DEV_AUTOLOGIN === 'true';
            if (allowDev && !savedUser) {
                const defaultAdmin = {
                    id: 'ADM001',
                    name: 'Default Admin',
                    email: 'admin@kwick.in',
                    phone: '+91 9000000000',
                    role: 'admin',
                    kycStatus: 'approved',
                };
                setUser(defaultAdmin);
                setViewMode('admin');
                localStorage.setItem('kwick_user', JSON.stringify(defaultAdmin));
                localStorage.setItem('kwick_view_mode', 'admin');
                // dev token only
                localStorage.setItem('kwick_token', 'dev-token');
            }
        }
        catch (e) {
            // import.meta may not be available in some test runners — ignore
        }
    }, []);
    const login = async (email, password) => {
        // Special-case mock admin login for local development only.
        // This will succeed only if VITE_ALLOW_DEV_AUTOLOGIN === 'true'.
        try {
            const allowDev = import.meta.env.VITE_ALLOW_DEV_AUTOLOGIN === 'true';
            if (allowDev && (email === 'admin@kwick.in' || email === 'admin') && password === 'admin123') {
                const adminUser = {
                    id: 'ADM001',
                    name: 'Default Admin',
                    email: 'admin@kwick.in',
                    phone: '+91 9000000000',
                    role: 'admin',
                    kycStatus: 'approved',
                };
                setUser(adminUser);
                setViewMode('admin');
                localStorage.setItem('kwick_user', JSON.stringify(adminUser));
                localStorage.setItem('kwick_view_mode', 'admin');
                localStorage.setItem('kwick_token', 'dev-token');
                return;
            }
        }
        catch (e) { }
        // Regular login flow
        const resp = await apiAuth.login({ email, password });
        if (resp.ok && resp.body) {
            const userData = resp.body;
            const u = {
                id: String(userData.user?.userId || userData.user?.user_id || userData.user?.id || ''),
                name: userData.user?.name || userData.user?.name || '',
                email: userData.user?.email || userData.user?.email || email,
                phone: userData.user?.phone || userData.user?.phone || '',
                role: 'user',
                kycStatus: userData.user?.kycStatus || userData.user?.kyc_status || 'incomplete',
            };
            setUser(u);
            localStorage.setItem('kwick_user', JSON.stringify(u));
        }
        else {
            throw new Error(resp.error || 'Login failed');
        }
    };
    const signup = async (name, email, password, phone) => {
        const resp = await apiAuth.signup({ name, email, phone, password });
        if (resp.ok && resp.body) {
            const userData = resp.body;
            const u = {
                id: String(userData.user?.userId || userData.user?.user_id || userData.user?.id || ''),
                name: userData.user?.name || userData.user?.name || name,
                email: userData.user?.email || userData.user?.email || email,
                phone: userData.user?.phone || userData.user?.phone || phone || '',
                role: 'user',
                kycStatus: userData.user?.kycStatus || userData.user?.kyc_status || 'incomplete',
            };
            setUser(u);
            localStorage.setItem('kwick_user', JSON.stringify(u));
        }
        else {
            throw new Error(resp.error || 'Signup failed');
        }
    };
    const adminLogin = async (adminId, password) => {
        // Simple hardcoded admin authentication
        const now = new Date().toLocaleTimeString();
        console.log(`[AuthContext] ${now} adminLogin called with ID:`, adminId);
        if (adminId === 'Shankra@25' && password === 'Shankra@18') {
            const adminUser = {
                id: 'ADM001',
                name: 'Admin',
                email: 'admin@kwick.in',
                phone: '+91 9000000000',
                role: 'admin',
                kycStatus: 'approved',
            };
            // Use a hardcoded dev token for testing
            // This token is valid and will work with backend for testing purposes
            const devToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNiIsImlhdCI6MTc2ODI5MTg1NywiZXhwIjoxNzY4Mjk1NDU3fQ.aMwFpk5SlNXY3ebGhE-X47RHJKvzWFjl_07CGNwSzc8';
            
            console.log(`[AuthContext] ${now} Credentials match! Setting admin user:`, adminUser);
            setUser(adminUser);
            setViewMode('admin');
            localStorage.setItem('kwick_user', JSON.stringify(adminUser));
            localStorage.setItem('kwick_view_mode', 'admin');
            localStorage.setItem('kwick_token', devToken);  // ← SET TOKEN FOR API CALLS!
            console.log(`[AuthContext] ${now} Admin login successful, user and viewMode set in state and localStorage, token stored`);
            return true;
        }
        console.log(`[AuthContext] ${now} Admin login failed - invalid credentials (expected: Shankra@25 / Shankra@18)`);
        return false;
    };
    const logout = () => {
        setUser(null);
        setViewMode('user');
        localStorage.removeItem('kwick_user');
        localStorage.removeItem('kwick_view_mode');
    };
    const switchToUserView = () => {
        setViewMode('user');
        localStorage.setItem('kwick_view_mode', 'user');
    };
    const switchToAdminView = () => {
        if (user?.role === 'admin') {
            setViewMode('admin');
            localStorage.setItem('kwick_view_mode', 'admin');
        }
    };
    const updateUser = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('kwick_user', JSON.stringify(updatedUser));
        }
    };
    return (<AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin',
            viewMode,
            login,
            adminLogin,
            signup,
            logout,
            switchToUserView,
            switchToAdminView,
            updateUser,
        }}>
      {children}
    </AuthContext.Provider>);
};
