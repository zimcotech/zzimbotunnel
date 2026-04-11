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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* Cover Photo / Gradient Banner */}
            <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="px-6 sm:px-10 pb-10 relative">
              {/* Floating Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 sm:-mt-16 mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-xl relative z-10">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 font-black text-4xl sm:text-5xl border border-blue-100/50">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{user.username}</h2>
                  <p className="text-gray-500 font-medium mt-1">{user.email}</p>
                </div>
                <div className="pb-3">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider shadow-sm">
                    {user.role} Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available Coins</label>
                  <p className="text-gray-900 font-black text-2xl">{user.balance.toFixed(0)} <span className="text-sm font-bold text-gray-400">Coins</span></p>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Server className="h-5 w-5" />
                  </div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Servers</label>
                  <p className="text-gray-900 font-black text-2xl">{servers.filter(s => new Date(s.expires_at) > new Date()).length}</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-5 w-5" />
                  </div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Member Since</label>
                  <p className="text-gray-900 font-bold text-lg mt-1">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                <button className="px-6 py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 border border-gray-200 transition-colors">
                  Change Password
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Minimal Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4 shrink-0 pb-8">
          <p className="text-sm text-gray-500 font-medium">© 2026 Zimbo Tunnel. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
