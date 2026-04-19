import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Star, Info, Activity, LayoutDashboard, LogOut, Headset, Bot } from 'lucide-react';
import { Logo } from './Logo';

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side / Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <Logo size={28} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 whitespace-nowrap">Zimbo Tunnel</span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-brand-yellow-light text-brand-yellow-dark text-[10px] sm:text-xs font-bold whitespace-nowrap border border-brand-yellow/10">1.0</span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-sm font-bold text-gray-500 hover:text-brand-green transition-colors">Features</Link>
            <Link to="/#how-it-works" className="text-sm font-bold text-gray-500 hover:text-brand-green transition-colors">How it Works</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center relative">
            {user ? (
              <button onClick={() => setShowUserDetails(!showUserDetails)} className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20 hover:scale-105 transition-all">
                <User className="h-5 w-5" />
              </button>
            ) : (
              <Link to="/login" className="px-5 py-2.5 rounded-full bg-brand-green text-white text-sm font-bold hover:bg-brand-green-dark transition-all shadow-md shadow-brand-green/20 flex items-center gap-2">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
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
                        className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl transition-colors text-sm ${location.pathname === '/dashboard' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowUserDetails(false)}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl transition-colors text-sm ${location.pathname === '/profile' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => { handleLogout(); setShowUserDetails(false); }} 
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors border border-gray-100 text-sm"
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
          <>
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-[101] md:hidden flex flex-col animate-in slide-in-from-left duration-300">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-yellow-light/30">
                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo size={28} />
                  <span className="font-black text-xl tracking-tight text-gray-900">Zimbo <span className="text-brand-yellow">Tunnel</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-5 px-4 space-y-2">
                <Link to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light transition-colors">
                    <Info className="h-4 w-4" />
                  </div>
                  How it Works
                </Link>
                <Link to="/status" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-xl transition-all ${location.pathname === '/status' ? 'bg-brand-green text-white shadow-md shadow-brand-green/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/status' ? 'bg-white/20 text-white' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light'}`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  Status
                </Link>
                <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light transition-colors">
                    <Headset className="h-4 w-4" />
                  </div>
                  Support
                </a>
                <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light transition-colors">
                    <Bot className="h-4 w-4" />
                  </div>
                  Zimbo Tunnel Bot
                </a>
                
                {user && (
                  <>
                    <div className="my-4 border-t border-gray-100"></div>
                    <div className="px-3 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Account</div>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-brand-green text-white shadow-md shadow-brand-green/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/dashboard' ? 'bg-white/20 text-white' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light'}`}>
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-brand-green text-white shadow-md shadow-brand-green/20' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/profile' ? 'bg-white/20 text-white' : 'bg-white border border-gray-200 text-gray-400 group-hover:border-brand-green/20 group-hover:text-brand-green group-hover:bg-brand-green-light'}`}>
                        <User className="h-4 w-4" />
                      </div>
                      Profile
                    </Link>
                  </>
                )}
              </div>
              
              {user ? (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user.username}</p>
                      <p className="text-xs text-gray-500 font-medium">{user.balance.toFixed(2)} Coins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-sm">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
