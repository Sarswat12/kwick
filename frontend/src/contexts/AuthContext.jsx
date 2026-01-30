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
        if (resp.ok && resp.body && resp.body.token && resp.body.user) {
            const userData = resp.body;
            const u = {
                id: String(userData.user?.userId || userData.user?.user_id || userData.user?.id || ''),
                name: userData.user?.name || '',
                email: userData.user?.email || email,
                phone: userData.user?.phone || '',
                role: userData.user?.role || 'user',
                kycStatus: userData.user?.kycStatus || userData.user?.kyc_status || 'incomplete',
            };
            setUser(u);
            localStorage.setItem('kwick_user', JSON.stringify(u));
            localStorage.setItem('kwick_token', userData.token);
            if (userData.refreshToken) localStorage.setItem('refreshToken', userData.refreshToken);
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
        const now = new Date().toLocaleTimeString();
        console.log(`[AuthContext] ${now} adminLogin called with ID:`, adminId);

        // Only allow admin login if backend returns a valid token and user with admin role
        try {
            const resp = await apiAuth.login({ email: adminId, password });
            let token, user;
            if (resp.ok && resp.body) {
                if (resp.body.token && resp.body.user) {
                    token = resp.body.token;
                    user = resp.body.user;
                } else if (resp.body.body && resp.body.body.token && resp.body.body.user) {
                    token = resp.body.body.token;
                    user = resp.body.body.user;
                }
            }
            if (token && user) {
                const u = {
                    id: String(user.userId || user.id || '15'),
                    name: user.name || 'Admin',
                    email: user.email || adminId,
                    phone: user.phone || '+91 9000000000',
                    role: user.role || 'admin',
                    kycStatus: user.kycStatus || 'approved',
                };
                localStorage.setItem('kwick_token', token);
                if (resp.body.refreshToken) localStorage.setItem('refreshToken', resp.body.refreshToken);
                setUser(u);
                setViewMode('admin');
                localStorage.setItem('kwick_user', JSON.stringify(u));
                localStorage.setItem('kwick_view_mode', 'admin');
                return true;
            } else {
                console.warn(`[AuthContext] ${now} Admin login failed, no token or user received.`);
                return false;
            }
        } catch (err) {
            console.error(`[AuthContext] ${now} Backend admin login error:`, err);
            return false;
        }
    };
    const logout = () => {
        console.log('[AuthContext] Logging out, clearing all auth data');
        setUser(null);
        setViewMode('user');
        localStorage.removeItem('kwick_user');
        localStorage.removeItem('kwick_view_mode');
        localStorage.removeItem('kwick_token');
        localStorage.removeItem('refreshToken');
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
                        isAuthenticated: !!user && !!localStorage.getItem('kwick_token'),
                        isAdmin: user?.role === 'admin' && !!localStorage.getItem('kwick_token'),
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
