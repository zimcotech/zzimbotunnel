import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Star, Info, Activity, LayoutDashboard, LogOut, Headset, Bot, Settings, HelpCircle } from 'lucide-react';
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
    <header className="bg-surface hover:bg-surface-container-high transition-colors border-b border-surface-variant sticky top-0 z-50 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Left side) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
              <Logo size={32} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-bold text-lg sm:text-xl tracking-tight text-on-surface whitespace-nowrap hidden sm:block">Zimbo Tunnel</span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-secondary-light text-secondary-dark text-[10px] sm:text-xs font-bold whitespace-nowrap border border-brand-yellow/10 hidden sm:block">1.0</span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1 pl-8">
            <Link to="/#features" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Features</Link>
            <Link to="/#how-it-works" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">How it Works</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 relative">
            <Link to="/#support" className="text-on-surface-variant hover:text-primary transition-colors">
              <HelpCircle className="w-[26px] h-[26px] stroke-[2px]" />
            </Link>

            {user ? (
              <button onClick={() => setShowUserDetails(!showUserDetails)} className="relative w-[42px] h-[42px] rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm hover:scale-105 transition-all outline-none border border-primary/20 hover:bg-primary/30">
                {user.username ? (user.username.includes(' ') ? user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : user.username.substring(0, 2).toUpperCase()) : 'U'}
                <div className="absolute 0 -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-green-500 rounded-full flex items-center justify-center shadow-sm border-2 border-surface">
                </div>
              </button>
            ) : (
              <Link to="/login" className="px-5 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md flex items-center gap-2">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-primary hover:text-primary/80 focus:outline-none transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-[28px] w-[28px] stroke-[2.5]" /> : <Menu className="h-[28px] w-[28px] stroke-[2.5]" />}
              </button>
            </div>

            {/* User Details Dropdown */}
            {showUserDetails && user && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setShowUserDetails(false)}></div>
                <div className="absolute top-full right-0 mt-3 w-64 sm:w-72 bg-surface hover:bg-surface-container-high transition-colors rounded-3xl shadow-xl border border-surface-container-highest overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                  <div className="bg-surface-variant p-5 text-white text-center relative">
                    <div className="w-14 h-14 rounded-full bg-surface hover:bg-surface-container-high transition-colors/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold border border-white/30 mx-auto mb-3 shadow-md">
                      {user.username ? (user.username.includes(' ') ? user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : user.username.substring(0, 2).toUpperCase()) : 'U'}
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">{user.username}</h2>
                    <p className="text-white/80 text-xs font-medium truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-4">
                    <div className="bg-secondary-light rounded-full p-3 border border-brand-yellow/10 mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-secondary-dark uppercase tracking-wider mb-0.5">Balance</p>
                        <p className="text-lg font-bold text-primary-dark">{user.balance.toFixed(0)} <span className="text-xs font-bold text-secondary-dark">Coins</span></p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserDetails(false)}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-full transition-colors text-sm ${location.pathname === '/dashboard' ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        onClick={() => setShowUserDetails(false)}
                        className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-full transition-colors text-sm ${location.pathname === '/profile' ? 'bg-primary-container text-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                      >
                        Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserDetails(false)}
                          className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-full transition-colors text-sm ${location.pathname === '/admin' ? 'bg-surface-container-highest text-white' : 'bg-surface-container-highest text-white hover:bg-surface-container-highest'}`}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => { handleLogout(); setShowUserDetails(false); }} 
                        className="w-full flex items-center justify-center gap-2 bg-surface-container text-red-600 font-bold py-2.5 rounded-full hover:bg-red-50 transition-colors border border-surface-container-highest text-sm"
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
            <div className="fixed inset-0 bg-surface-container-highest/50 backdrop-blur-sm z-[100] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-surface hover:bg-surface-container-high transition-colors shadow-2xl z-[101] md:hidden flex flex-col animate-in slide-in-from-left duration-300">
              <div className="p-5 border-b border-surface-container-highest flex items-center justify-between bg-secondary-light/30">
                <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <Logo size={28} />
                  <span className="font-bold text-xl tracking-tight text-on-surface">Zimbo <span className="text-secondary">Tunnel</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-on-surface-variant/80 hover:text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-5 px-4 space-y-2">
                <Link to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full transition-all">
                  <div className="w-9 h-9 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant flex items-center justify-center text-on-surface-variant/80 shadow-sm group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container transition-colors">
                    <Info className="h-4 w-4" />
                  </div>
                  How it Works
                </Link>
                <Link to="/status" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-full transition-all ${location.pathname === '/status' ? 'bg-primary text-white shadow-md shadow-md' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/status' ? 'bg-surface hover:bg-surface-container-high transition-colors/20 text-white' : 'bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-on-surface-variant/80 group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container'}`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  Status
                </Link>
                <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full transition-all">
                  <div className="w-9 h-9 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant flex items-center justify-center text-on-surface-variant/80 shadow-sm group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container transition-colors">
                    <Headset className="h-4 w-4" />
                  </div>
                  Support
                </a>
                <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center gap-3.5 px-3 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-full transition-all">
                  <div className="w-9 h-9 rounded-lg bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant flex items-center justify-center text-on-surface-variant/80 shadow-sm group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container transition-colors">
                    <Bot className="h-4 w-4" />
                  </div>
                  Zimbo Tunnel Bot
                </a>
                
                {user && (
                  <>
                    <div className="my-4 border-t border-surface-container-highest"></div>
                    <div className="px-3 mb-2 text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Account</div>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-full transition-all ${location.pathname === '/dashboard' ? 'bg-primary text-white shadow-md shadow-md' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/dashboard' ? 'bg-surface hover:bg-surface-container-high transition-colors/20 text-white' : 'bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-on-surface-variant/80 group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container'}`}>
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-full transition-all ${location.pathname === '/profile' ? 'bg-primary text-white shadow-md shadow-md' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/profile' ? 'bg-surface hover:bg-surface-container-high transition-colors/20 text-white' : 'bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-on-surface-variant/80 group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary-container'}`}>
                        <User className="h-4 w-4" />
                      </div>
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`group flex items-center gap-3.5 px-3 py-3 text-sm font-bold rounded-full transition-all ${location.pathname === '/admin' ? 'bg-surface-container-highest text-white shadow-md shadow-gray-900/20' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors ${location.pathname === '/admin' ? 'bg-surface hover:bg-surface-container-high transition-colors/20 text-white' : 'bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-on-surface-variant/80 group-hover:border-gray-900/20 group-hover:text-on-surface group-hover:bg-surface-container-high'}`}>
                          <Settings className="h-4 w-4" />
                        </div>
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </div>
              
              {user ? (
                <div className="p-4 border-t border-surface-container-highest bg-surface-container">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm">{user.username}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{user.balance.toFixed(2)} Coins</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-red-600 font-bold py-2.5 rounded-full hover:bg-red-50 transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-surface-container-highest bg-surface-container space-y-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface-container-high transition-colors border border-surface-variant text-on-surface-variant font-bold py-2.5 rounded-full hover:bg-surface-container-high transition-colors text-sm">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 rounded-full hover:bg-blue-700 transition-colors text-sm shadow-sm">
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
