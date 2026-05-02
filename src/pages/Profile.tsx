import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Clock, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { supabase } from '../lib/supabase';

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchServers();
    }
  }, [user]);

  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      if (data) setServers(data);
    } catch (error) {
      console.error('Failed to fetch servers', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Topbar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">My Profile</h1>
            <p className="text-on-surface-variant mt-1">Manage your account settings and preferences.</p>
          </div>
          
          <div className="bg-surface hover:bg-surface-container-high transition-colors rounded-3xl border border-surface-container-highest shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Cover Photo / Gradient Banner */}
            <div className="h-32 sm:h-48 bg-surface-variant relative">
              <div className="absolute inset-0 bg-surface hover:bg-surface-container-high transition-colors/5 backdrop-blur-[1px]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="px-6 sm:px-10 pb-10 relative">
              {/* Floating Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 sm:-mt-16 mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-surface hover:bg-surface-container-high transition-colors p-1.5 shadow-xl relative z-10">
                  <div className="w-full h-full rounded-full bg-surface-variant flex items-center justify-center text-white font-bold text-4xl sm:text-5xl border-4 border-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">{user.username}</h2>
                  <p className="text-on-surface-variant font-medium mt-1 uppercase tracking-wider text-xs">{user.email}</p>
                </div>
                <div className="pb-3 text-right">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-secondary-light text-secondary-dark border border-brand-yellow/20 uppercase tracking-widest shadow-sm">
                    {user.role} Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface-container rounded-3xl p-6 border border-surface-container-highest hover:border-primary/20 hover:shadow-md transition-all group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1">Available Coins</label>
                  <p className="text-on-surface font-bold text-2xl tracking-tight">{user.balance.toFixed(0)} <span className="text-xs font-bold text-on-surface-variant/80">Coins</span></p>
                </div>
                
                <div className="bg-surface-container rounded-3xl p-6 border border-surface-container-highest hover:border-secondary/20 hover:shadow-md transition-all group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Server className="h-5 w-5" />
                  </div>
                  <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1">Active Servers</label>
                  <p className="text-on-surface font-bold text-2xl tracking-tight">{servers.filter(s => new Date(s.expires_at) > new Date()).length}</p>
                </div>

                <div className="bg-surface-container rounded-3xl p-6 border border-surface-container-highest hover:border-primary/20 hover:shadow-md transition-all group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                    <Clock className="h-5 w-5" />
                  </div>
                  <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mb-1">Member Since</label>
                  <p className="text-on-surface font-bold text-base mt-1 tracking-tight">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-surface-container-highest flex justify-end gap-3">
                <button className="px-5 py-2.5 bg-surface hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-widest hover:bg-surface-container border border-surface-variant transition-colors shadow-sm">
                  Change Password
                </button>
                <button className="px-5 py-2.5 bg-surface-variant text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Minimal Footer */}
        <footer className="mt-12 pt-8 border-t border-surface-variant flex flex-col items-center gap-4 shrink-0 pb-8">
          <p className="text-sm text-on-surface-variant font-medium">© 2026 Zimbo Tunnel. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
