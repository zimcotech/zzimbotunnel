import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Copy, CheckCircle2, Trash2, Server, Clock, AlertCircle, Send, Facebook, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { supabase } from '../lib/supabase';

export function ServerDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchServer();
    }
  }, [id, user]);

  const fetchServer = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setServer(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch server details');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this server?')) return;
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to delete server');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center text-red-600">{error}</div>
    </div>
  );
  
  if (!server) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center">Server not found</div>
    </div>
  );

  const isExpired = new Date(server.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-5xl mx-auto w-full">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{server.location}</h1>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">{server.protocol}</span>
                    {isExpired ? (
                      <span className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">Expired</span>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-100">Active</span>
                    )}
                  </div>
                </div>
                <button onClick={handleDelete} className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Host', value: server.host },
                  { label: 'Port', value: server.port },
                  { label: 'Username', value: server.username },
                  { label: 'Password', value: server.password },
                  { label: 'UUID', value: server.uuid },
                ].map(item => item.value && (
                  <div key={item.label} className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.label}</label>
                    <div className="flex items-center gap-3 bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-colors">
                      <span className="font-mono text-sm text-gray-900 font-medium flex-1 truncate">{item.value}</span>
                      <button onClick={() => copyToClipboard(item.value, item.label)} className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-200">
                        {copied === item.label ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Configuration</h3>
              <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-gray-100 overflow-x-auto border border-gray-800 shadow-inner">
                {server.config}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Minimal Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4 shrink-0 pb-8">
          <p className="text-sm text-gray-500 font-medium">© 2026 Zimbo Tunnel. All rights reserved.</p>
          <Link to="/privacy-policy" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</Link>
          <div className="flex items-center gap-6 mt-2">
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp"><WhatsAppIcon className="h-4 w-4" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="Telegram"><Send className="h-4 w-4" /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" title="YouTube"><Youtube className="h-4 w-4" /></a>
          </div>
        </footer>
      </main>
    </div>
  );
}
