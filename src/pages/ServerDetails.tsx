import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Copy, CheckCircle2, Trash2, Server, Clock, AlertCircle, Send, Facebook, Youtube, ChevronDown, Download, X } from 'lucide-react';
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
  const [showConnect, setShowConnect] = useState(false);

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
      navigate('/dashboard?tab=servers');
    } catch (err: any) {
      alert(err.message || 'Failed to delete server');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center text-red-600">{error}</div>
    </div>
  );
  
  if (!server) return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Topbar />
      <div className="flex-1 p-8 flex items-center justify-center">Server not found</div>
    </div>
  );

  const isExpired = new Date(server.expires_at) < new Date();
  const initials = server.location ? server.location.substring(0, 2).toUpperCase() : 'SV';

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-on-surface">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface hover:bg-surface-container-high transition-colors rounded-[2.5rem] border border-brand-yellow/10 p-6 md:p-10 shadow-2xl shadow-md relative overflow-hidden">
            {/* Corner Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-light/50 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>

            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-10 relative z-10">
              <div className="w-24 h-24 rounded-full bg-surface-variant flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl border-4 border-white">
                {initials}
              </div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Tunnel Connection</h1>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">{server.location || 'Server'}</span>
                {isExpired ? (
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100">Expired</span>
                ) : (
                  <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200/50 flex items-center gap-2 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-on-surface-variant/80 bg-surface-container px-4 py-2 rounded-full border border-surface-container-highest">
                <Clock className="h-4 w-4" />
                <span>Expires: {new Date(server.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Ports Card */}
            <div className="bg-primary text-white rounded-3xl p-6 mb-8 font-mono text-[10px] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Server className="h-12 w-12" />
              </div>
              <div className="space-y-2 relative z-10">
                <div className="flex gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/50 uppercase tracking-widest font-bold">Port TLS</span>
                  <span className="flex-1">: 443, 8443</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-white/50 uppercase tracking-widest font-bold">Port nTLS</span>
                  <span className="flex-1">: 80, 8080, 8880</span>
                </div>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-4 mb-8">
              {[
                { label: 'Username', value: server.username, copyable: true },
                { label: 'Password', value: server.password, copyable: true },
                { label: 'Protocol', value: server.protocol, copyable: false },
                { label: 'Hostname', value: server.host, copyable: true },
                { label: 'Expiration', value: new Date(server.expires_at).toLocaleDateString('en-GB'), copyable: false },
                { label: 'Config', value: server.config, copyable: true },
              ].map(item => item.value && (
                <div key={item.label}>
                  <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mb-2 ml-1">{item.label}</label>
                  <div className="flex items-center gap-3 bg-surface-container p-3.5 rounded-3xl border border-surface-container-highest group">
                    <span className="font-mono text-xs text-on-surface-variant flex-1 truncate">{item.value}</span>
                    {item.copyable && (
                      <button 
                        onClick={() => copyToClipboard(item.value, item.label)} 
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface hover:bg-surface-container-high transition-colors shadow-sm border border-surface-container-highest text-primary hover:scale-110 transition-transform"
                      >
                        {copied === item.label ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/dashboard?tab=servers')} 
                className="py-4 bg-surface hover:bg-surface-container-high transition-colors text-on-surface-variant rounded-3xl font-bold text-[10px] uppercase tracking-widest border border-surface-variant hover:bg-surface-container transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button 
                onClick={handleDelete} 
                className="py-4 bg-red-50 text-red-600 rounded-3xl font-bold text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
