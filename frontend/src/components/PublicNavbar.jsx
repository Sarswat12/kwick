import { motion } from "motion/react";
import { Battery } from "lucide-react";
import { Button } from "./ui/button";
export function PublicNavbar({ onNavigate }) {
    return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Battery className="w-6 h-6 text-primary-foreground"/>
          </div>
          <h1 className="text-foreground">Kiwck</h1>
        </button>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate("about")} className="text-foreground hover:text-primary transition-colors">About</button>
          <button onClick={() => onNavigate("vehicles")} className="text-foreground hover:text-primary transition-colors">Vehicles</button>
          <button onClick={() => onNavigate("pricing")} className="text-foreground hover:text-primary transition-colors">Pricing</button>
          <button onClick={() => onNavigate("blog")} className="text-foreground hover:text-primary transition-colors">Blog</button>
          <button onClick={() => onNavigate("contact")} className="text-foreground hover:text-primary transition-colors">Contact</button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate("dashboard")}>Login</Button>
          <Button onClick={() => onNavigate("dashboard")} className="bg-primary hover:bg-primary/90">Sign Up</Button>
        </div>
      </div>
    </motion.nav>);
}
