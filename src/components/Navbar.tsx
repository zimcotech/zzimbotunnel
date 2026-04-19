import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Logo } from './Logo';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDashboard = location.pathname === '/dashboard';

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
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <Logo size={28} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 whitespace-nowrap">Zimbo Tunnel</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-brand-yellow-light text-brand-yellow-dark text-[10px] sm:text-xs font-bold whitespace-nowrap border border-brand-yellow/10">1.0</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center relative">
          {user ? (
            isDashboard ? (
              <button onClick={() => setShowUserDetails(!showUserDetails)} className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20 hover:scale-105 transition-all">
                <User className="h-5 w-5" />
              </button>
            ) : (
              <Link to="/dashboard" className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20 hover:scale-105 transition-all">
                <User className="h-5 w-5" />
              </Link>
            )
          ) : (
            <Link to="/login" className="px-5 py-2.5 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green-dark transition-all shadow-md shadow-brand-green/20 flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}

          {/* User Details Dropdown */}
          {showUserDetails && user && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowUserDetails(false)}></div>
              <div className="absolute top-full right-0 mt-3 w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                <div className="bg-brand-gradient p-5 text-white text-center relative">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold border border-white/30 mx-auto mb-3 shadow-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-black tracking-tight">{user.username}</h2>
                  <p className="text-white/80 text-xs font-medium truncate">{user.email}</p>
                </div>
                
                <div className="p-4">
                  <div className="bg-brand-yellow-light rounded-xl p-3 border border-brand-yellow/10 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-brand-yellow-dark uppercase tracking-wider mb-0.5">Balance</p>
                      <p className="text-lg font-black text-brand-green-dark">{user.balance.toFixed(0)} <span className="text-xs font-bold text-brand-yellow-dark">Coins</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to="/dashboard" 
                      onClick={() => setShowUserDetails(false)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-2.5 rounded-xl hover:bg-brand-green-dark transition-all text-sm shadow-sm"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setShowUserDetails(false); }} 
                      className="w-full flex items-center justify-center gap-2 bg-white text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors border border-gray-100 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-4 space-y-2">
            <Link to="/#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50 rounded-xl transition-colors">Features</Link>
            <Link to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50 rounded-xl transition-colors">How it Works</Link>
            
            {user ? (
              <>
                <div className="px-4 py-3 text-base font-medium text-gray-700 border-t border-gray-100 mt-2">
                  Balance: <span className="text-brand-green font-bold">{user.balance.toFixed(2)}</span>
                </div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50 rounded-xl transition-colors">Dashboard</Link>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-brand-green hover:bg-gray-50 rounded-xl transition-colors">Log in</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-brand-green hover:bg-brand-green-light rounded-xl transition-colors">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
