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
  const initials = server.location ? server.location.substring(0, 2).toUpperCase() : 'SV';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex-1">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg shadow-brand-green/20">
                {initials}
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{server.location || 'Server'}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-brand-green-light text-brand-green text-xs font-bold uppercase tracking-wider border border-brand-green/10">France</span>
                <span className="px-3 py-1 rounded-full bg-brand-yellow-light text-brand-yellow text-xs font-bold uppercase tracking-wider border border-brand-yellow/10">Gravelines</span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date(server.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="mt-2 text-sm font-bold text-gray-900">
                Quota: <span className="text-gray-500 font-medium">Unlimited</span>
              </div>
            </div>

            {/* Ports Card */}
            <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 mb-8 font-mono text-sm shadow-inner border border-gray-800">
              <div className="flex gap-4">
                <span className="text-gray-500">Port TLS</span>
                <span className="flex-1">: 443, 8443</span>
              </div>
              <div className="flex gap-4 mt-1">
                <span className="text-gray-500">Port nTLS</span>
                <span className="flex-1">: 80, 8080, 8880</span>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-4 mb-8">
              {[
                { label: 'Username', value: server.username, copyable: true },
                { label: 'Password', value: server.password, copyable: true },
                { label: 'Protocol', value: server.protocol, copyable: false },
                { label: 'Hostname', value: server.host, copyable: true },
                { label: 'Host', value: server.ip_address, copyable: true },
                { label: 'Server Datacenter', value: server.location, copyable: false },
                { label: 'Expiration Date', value: new Date(server.expires_at).toLocaleDateString('en-GB'), copyable: false },
                { label: 'Duration', value: `${Math.ceil((new Date(server.expires_at).getTime() - new Date(server.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`, copyable: false },
                { label: 'Max Login', value: '1 Device (Multi-login not supported)', copyable: false },
                { label: 'WebSocket Payload', value: server.config, copyable: true },
              ].map(item => item.value && (
                <div key={item.label}>
                  <label className="block text-sm font-bold text-gray-900 mb-2">{item.label}</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    {item.label === 'WebSocket Payload' ? (
                      <div className="font-mono text-xs text-gray-600 flex-1 overflow-x-auto whitespace-nowrap">
                        {item.value}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-gray-600 flex-1 truncate">{item.value}</span>
                    )}
                    {item.copyable && (
                      <button 
                        onClick={() => copyToClipboard(item.value, item.label)} 
                        className="flex items-center gap-1 text-xs font-bold text-brand-green hover:text-brand-green/80 transition-colors p-1.5 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-200"
                      >
                        {copied === item.label ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* How to Connect Section */}
            <div className="mb-8">
              <button 
                onClick={() => setShowConnect(!showConnect)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl font-bold text-gray-900 hover:bg-gray-100 transition-colors"
              >
                How to Connect
                <ChevronDown className={`h-5 w-5 transition-transform ${showConnect ? 'rotate-180' : ''}`} />
              </button>
              {showConnect && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-4 bg-white border border-gray-100 rounded-xl shadow-sm text-sm text-gray-600 space-y-4">
                  <p>1. Copy your configuration from the field above.</p>
                  <p>2. Download a VPN client for your platform:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="https://v2ray.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"><Download className="h-4 w-4" /> Windows</a>
                    <a href="https://v2ray.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"><Download className="h-4 w-4" /> macOS</a>
                    <a href="https://play.google.com/store/apps/details?id=com.v2ray.ang" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"><Download className="h-4 w-4" /> Android</a>
                    <a href="https://apps.apple.com/us/app/shadowrocket/id932747118" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100"><Download className="h-4 w-4" /> iOS</a>
                  </div>
                  <p>3. Open the app, click "Import from Clipboard" or "Add Config", and connect!</p>
                </motion.div>
              )}
            </div>

            {/* Watch Video Button */}
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-brand-green transition-all mb-6">
              <Youtube className="h-5 w-5" /> Watch video
            </button>

            {/* Footer Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 py-3 px-4 bg-white text-gray-700 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-sm shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" /> Close
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 hover:text-red-700 transition-all flex items-center justify-center gap-2 border border-red-100 hover:border-red-200 text-sm shadow-sm whitespace-nowrap"
              >
                <Trash2 className="h-4 w-4" /> Destroy Server
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
