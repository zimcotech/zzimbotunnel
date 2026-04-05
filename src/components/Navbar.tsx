import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shield } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-4 py-3">
      <div className="flex justify-between items-center relative">
        {/* Left side / Mobile menu button */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 whitespace-nowrap">Zimbo Tunnel</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold">1.0</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          ) : (
            <Link to="/login" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-4 space-y-2">
            <Link to="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors">Features</Link>
            <Link to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors">How it Works</Link>
            
            {user ? (
              <>
                <div className="px-4 py-3 text-base font-medium text-gray-700 border-t border-gray-100 mt-2">
                  Balance: <span className="text-blue-600 font-bold">{user.balance.toFixed(2)}</span>
                </div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors">Dashboard</Link>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-xl transition-colors">Log in</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
