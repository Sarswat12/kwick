import { motion, AnimatePresence } from "motion/react";
import { User, LogOut, LayoutDashboard, Settings, ChevronDown, Menu, X, ArrowLeft } from "lucide-react";
// Use the bundled logo asset so the app doesn't require a file placed in public/
import logo from "../assets/logo.png";
import { Button } from "./ui/button";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "./ui/dropdown-menu";
export function EnhancedPublicNavbar({ onNavigate, isLoggedIn, userData, onLogout, isAdminMode = false, onToggleAdminMode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button - goes to previous history or home as fallback */}
            <button onClick={() => {
            if (window.history.length > 1) {
                window.history.back();
            }
            else {
                onNavigate("home");
            }
        }} aria-label="Go back" className="p-2 rounded-md hover:bg-muted transition-colors hidden sm:inline-flex">
              <ArrowLeft className="w-5 h-5 text-foreground"/>
            </button>

            {/* Logo as home button (bundled asset) */}
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 group">
              <motion.img whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} src={logo} alt="KWICK" className="h-10 object-contain"/>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => onNavigate("about")} className="text-foreground hover:text-primary transition-colors">About</button>
            <button onClick={() => onNavigate("vehicles")} className="text-foreground hover:text-primary transition-colors">Vehicles</button>
            <button onClick={() => onNavigate("pricing")} className="text-foreground hover:text-primary transition-colors">Pricing</button>
            <button onClick={() => onNavigate("battery-stations")} className="text-foreground hover:text-primary transition-colors">Battery Stations</button>
            <button onClick={() => onNavigate("contact")} className="text-foreground hover:text-primary transition-colors">Contact</button>
          </div>

          {/* Right Side - Login/Account */}
          <div className="flex items-center gap-3">
            {isLoggedIn && userData ? (<>
                {/* Admin Toggle (only show if logged in) */}
                {onToggleAdminMode && (<Button variant="outline" size="sm" onClick={onToggleAdminMode} className="hidden md:flex">
                    {isAdminMode ? "User Mode" : "Admin Mode"}
                  </Button>)}
                
                {/* Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary"/>
                      </div>
                      <span className="hidden md:inline">{userData.name}</span>
                      <ChevronDown className="w-4 h-4"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-semibold">{userData.name}</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2"/>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                      <Settings className="w-4 h-4 mr-2"/>
                      Settings
                    </DropdownMenuItem>
                    {onToggleAdminMode && (<DropdownMenuItem onClick={onToggleAdminMode} className="md:hidden">
                        <LayoutDashboard className="w-4 h-4 mr-2"/>
                        {isAdminMode ? "User Mode" : "Admin Mode"}
                      </DropdownMenuItem>)}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2"/>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>) : (<div className="hidden lg:flex items-center gap-3">
                <Button variant="outline" onClick={() => onNavigate("dashboard")}>Login</Button>
                <Button onClick={() => onNavigate("dashboard")} className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </div>)}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden pt-4 pb-2 border-t border-border mt-4">
              <div className="flex flex-col gap-2">
                <button onClick={() => { onNavigate("about"); setMobileMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors">About</button>
                <button onClick={() => { onNavigate("vehicles"); setMobileMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors">Vehicles</button>
                <button onClick={() => { onNavigate("pricing"); setMobileMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors">Pricing</button>
                <button onClick={() => { onNavigate("battery-stations"); setMobileMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors">Battery Stations</button>
                <button onClick={() => { onNavigate("contact"); setMobileMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-muted rounded-lg transition-colors">Contact</button>
                
                {!isLoggedIn && (<div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                    <Button variant="outline" onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }} className="w-full">Login</Button>
                    <Button onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }} className="w-full bg-primary hover:bg-primary/90">Sign Up</Button>
                  </div>)}
              </div>
            </motion.div>)}
        </AnimatePresence>
      </div>
    </motion.nav>);
}
