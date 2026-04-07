import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Copy, CheckCircle2, Trash2, Server, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function ServerDetails() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchServer();
  }, [id, token]);

  const fetchServer = async () => {
    try {
      const res = await fetch(`/api/servers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch server details');
      const data = await res.json();
      setServer(data);
    } catch (err: any) {
      setError(err.message);
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
      const res = await fetch(`/api/servers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete server');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!server) return <div className="p-8">Server not found</div>;

  const isExpired = new Date(server.expires_at) < new Date();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{server.location}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">{server.protocol}</span>
              {isExpired ? (
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wide">Expired</span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wide">Active</span>
              )}
            </div>
          </div>
          <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <div key={item.label}>
              <label className="block text-sm font-medium text-gray-500 mb-1">{item.label}</label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-mono text-sm text-gray-900 flex-1">{item.value}</span>
                <button onClick={() => copyToClipboard(item.value, item.label)} className="text-gray-400 hover:text-blue-600">
                  {copied === item.label ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
          {server.config}
        </div>
      </div>
    </motion.div>
  );
}
