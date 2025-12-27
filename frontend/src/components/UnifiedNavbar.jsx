import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, LayoutDashboard, Menu, X, ChevronDown, Battery, FileText } from 'lucide-react';
// Use bundled logo asset so the navbar doesn't depend on a public file
import logo from '../assets/logo.png';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { AdvancedAuthModal } from './AdvancedAuthModal';
export const UnifiedNavbar = ({ currentPage, onNavigate }) => {
    const { user, isAuthenticated, isAdmin, viewMode, logout, switchToUserView, switchToAdminView } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
    };
    const handleLogout = () => {
        logout();
        onNavigate('home');
    };
    const navLinks = [
        { label: 'About', page: 'about' },
        { label: 'Vehicles', page: 'vehicles' },
        { label: 'Pricing', page: 'pricing' },
        { label: 'Battery Stations', page: 'battery-stations' },
        { label: 'Blog', page: 'blog' },
        { label: 'Careers', page: 'careers' },
        { label: 'Contact', page: 'contact' },
    ];
    return (<>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo (bundled image) */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
              <motion.img whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} src={logo} alt="KWICK - EV on Rent" className="h-10 object-contain"/>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (<button key={link.page} onClick={() => onNavigate(link.page)} className={`transition-colors ${currentPage === link.page ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}>
                  {link.label}
                </button>))}
            </div>

            {/* Right Side - Auth/Account */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (<DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-red-500"/>
                      </div>
                      <span className="hidden md:inline">{user.name}</span>
                      <ChevronDown className="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                switchToUserView();
                onNavigate('user-dashboard');
            }}>
                      <LayoutDashboard className="w-4 h-4 mr-2"/>
                      User Dashboard
                    </DropdownMenuItem>
                    {/* Admin Dashboard link removed from user account dropdown */}
                    <DropdownMenuItem onClick={() => onNavigate('battery-stations')}>
                      <Battery className="w-4 h-4 mr-2"/>
                      Battery Stations
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('rent')}>
                      <FileText className="w-4 h-4 mr-2"/>
                      Rent Vehicle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="w-4 h-4 mr-2"/>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>) : (<div className="hidden lg:flex items-center gap-3">
                  <Button variant="outline" onClick={() => handleAuthClick('login')}>
                    Login
                  </Button>
                  <Button onClick={() => handleAuthClick('signup')} className="bg-red-500 hover:bg-red-600">
                    Sign Up
                  </Button>
                </div>)}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden pt-4 pb-2 border-t border-gray-200 mt-4">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (<button key={link.page} onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                }} className={`text-left px-4 py-2 rounded-lg transition-colors ${currentPage === link.page
                    ? 'bg-red-50 text-red-500'
                    : 'hover:bg-gray-100'}`}>
                      {link.label}
                    </button>))}

                  {!isAuthenticated && (<div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-200">
                      <Button variant="outline" onClick={() => {
                    handleAuthClick('login');
                    setMobileMenuOpen(false);
                }} className="w-full">
                        Login
                      </Button>
                      <Button onClick={() => {
                    handleAuthClick('signup');
                    setMobileMenuOpen(false);
                }} className="w-full bg-red-500 hover:bg-red-600">
                        Sign Up
                      </Button>
                    </div>)}
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AdvancedAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode}/>
    </>);
};
