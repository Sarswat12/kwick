import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
export const Footer = ({ onNavigate }) => {
    const handleNavClick = (page) => (e) => {
        if (onNavigate) {
            e.preventDefault();
            onNavigate(page);
        }
    };
    return (<footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-red-500 mb-4">KWICK</h3>
            <p className="text-gray-400 mb-4">
              India's leading EV rental platform empowering delivery partners to earn up to ₹75,000 monthly.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="w-5 h-5"/>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="w-5 h-5"/>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="w-5 h-5"/>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                <Linkedin className="w-5 h-5"/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={handleNavClick('home')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('about')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('vehicles')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  Vehicles
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('pricing')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('battery-stations')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  Battery Stations
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('contact')} className="text-gray-400 hover:text-red-500 transition-colors text-left">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={handleNavClick('blog')} className="text-gray-400 hover:text-red-500 transition-colors text-lg text-left">
                  📰 Blog
                </button>
              </li>
              <li>
                <button onClick={handleNavClick('careers')} className="text-gray-400 hover:text-red-500 transition-colors text-lg text-left">
                  💼 Careers
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-1"/>
                <p className="text-gray-400">
                  Sector 112, Noida, Uttar Pradesh
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0"/>
                <p className="text-gray-400">+91 9289484832</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0"/>
                <p className="text-gray-400">contact@kwick.in</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} KWICK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>);
};
