import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Plus, Clock, Copy, CheckCircle2, AlertCircle, Wallet, History, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { user, token, updateBalance, logout } = useAuth();
  const navigate = useNavigate();
  const [servers, setServers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'create' | 'topup' | 'profile'>('overview');
  
  // Create Server Form State
  const [protocol, setProtocol] = useState('V2Ray');
  const [location, setLocation] = useState('South Africa');
  const [duration, setDuration] = useState(30);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Topup Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [topupMessage, setTopupMessage] = useState('');

  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      fetchServers();
      fetchTransactions();
    }
  }, [token]);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/servers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServers(data);
      }
    } catch (error) {
      console.error('Failed to fetch servers', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');

    try {
      const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ protocol, location, duration })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create server');
      }

      // Refresh data
      fetchServers();
      // Update balance locally (cost is duration * 0.5)
      updateBalance(user!.balance - (duration * 0.5));
      setActiveTab('servers');
    } catch (error: any) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsToppingUp(true);
    setTopupMessage('');

    try {
      const res = await fetch('/api/topup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumber, amount: parseFloat(amount) })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Top-up failed');
      }

      updateBalance(data.newBalance);
      fetchTransactions();
      setTopupMessage('Top-up successful!');
      setAmount('');
      setPhoneNumber('');
    } catch (error: any) {
      setTopupMessage(error.message);
    } finally {
      setIsToppingUp(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row pt-20 md:pt-0 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 shadow-inner border border-blue-100/50">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{user.username}</h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 text-white mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-blue-500/20 group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <p className="text-blue-100/80 text-xs font-medium tracking-wide uppercase mb-1 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5" /> Available Balance
              </p>
              <div className="flex items-baseline gap-1">
                <h2 className="text-3xl font-black tracking-tight">{user.balance.toFixed(2)}</h2>
                <span className="text-sm font-medium text-blue-200">USD</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'servers', icon: Server, label: 'My Servers' },
              { id: 'create', icon: Plus, label: 'Create Server' },
              { id: 'topup', icon: Wallet, label: 'Top Up' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600/10' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-100 mt-auto bg-gray-50/50">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mb-8">Welcome back, here's what's happening with your account today.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Server className="h-6 w-6" />
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">Live</span>
                </div>
                <h3 className="text-gray-500 font-medium mb-1">Active Servers</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-gray-900 tracking-tight">{servers.filter(s => new Date(s.expires_at) > new Date()).length}</p>
                  <p className="text-sm text-gray-400 font-medium">/ {servers.length} total</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <History className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  <button onClick={() => setActiveTab('topup')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No recent transactions.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map(tx => (
                      <div key={tx.id} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Account Top Up</p>
                            <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100 group-hover:bg-green-100 transition-colors">
                          +${tx.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'servers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Servers</h1>
                <p className="text-gray-500 mt-1">Manage your active tunneling connections.</p>
              </div>
              <button 
                onClick={() => setActiveTab('create')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 w-fit"
              >
                <Plus className="h-4 w-4" />
                New Server
              </button>
            </div>

            {servers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Server className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active servers</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't created any tunneling servers yet. Create one now to get started.</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create your first server
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servers.map(server => {
                  const isExpired = new Date(server.expires_at) < new Date();
                  return (
                    <div 
                      key={server.id} 
                      onClick={() => navigate(`/server/${server.id}`)}
                      className={`group bg-white rounded-2xl border ${isExpired ? 'border-red-100' : 'border-gray-100'} p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* Subtle gradient background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                                {server.protocol}
                              </span>
                              {isExpired ? (
                                <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Expired
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 border border-green-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{server.location}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 justify-end bg-gray-50 px-3 py-1.5 rounded-lg">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {server.duration} Days
                            </p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">
                              Expires: {new Date(server.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 bg-gray-50/80 rounded-xl p-3.5 border border-gray-100/80 relative group/config">
                          <p className="text-sm font-mono text-gray-500 break-all pr-12 line-clamp-2 leading-relaxed">
                            {server.config}
                          </p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(server.config, server.id); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all"
                            title="Copy Config"
                          >
                            {copiedId === server.id ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Create New Server</h1>
              <p className="text-gray-500 mt-1">Deploy a new high-speed tunneling server instantly.</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
              {createError && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{createError}</p>
                </div>
              )}

              <form onSubmit={handleCreateServer} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Protocol</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['V2Ray', 'SSH WebSocket', 'Slow DNS', 'OpenVPN', 'WireGuard'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProtocol(p)}
                        className={`px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                          protocol === p 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Location</label>
                  <div className="relative">
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                    >
                      <option value="South Africa">🇿🇦 South Africa (Johannesburg)</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom (London)</option>
                      <option value="United States">🇺🇸 United States (New York)</option>
                      <option value="Germany">🇩🇪 Germany (Frankfurt)</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Duration (Days)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[1, 3, 7, 14, 30, 360].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                          duration === d 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-[0_0_0_2px_rgba(37,99,235,0.1)]' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 flex justify-between items-center border border-gray-200/60">
                    <span className="text-gray-600 font-semibold">Total Cost</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">{(duration * 0.5).toFixed(2)}</span>
                      <span className="text-sm font-bold text-gray-500 ml-1">USD</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isCreating || user.balance < (duration * 0.5)}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center text-base"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Deploying Server...
                    </span>
                  ) : user.balance < (duration * 0.5) ? 'Insufficient Balance' : 'Deploy Server'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'topup' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Top Up Balance</h1>
              <p className="text-gray-500 mt-1">Add funds to your account to deploy more servers.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">EcoCash Payment</h2>
                    <p className="text-sm text-gray-500">Instant mobile money transfer</p>
                  </div>
                </div>
                
                {topupMessage && (
                  <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 ${topupMessage.includes('successful') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{topupMessage}</p>
                  </div>
                )}

                <form onSubmit={handleTopup} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">EcoCash Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm font-medium">+263</span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="77X XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-3.5 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Amount (USD)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                      {[1, 5, 10, 20].map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmount(preset.toString())}
                          className={`px-3 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 ${
                            amount === preset.toString() 
                              ? 'border-green-600 bg-green-50 text-green-700 shadow-[0_0_0_2px_rgba(22,163,74,0.1)]' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm font-medium">$</span>
                      </div>
                      <input 
                        type="number" 
                        min="1"
                        step="1"
                        placeholder="Custom amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3.5 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-gray-900"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isToppingUp}
                      className="w-full bg-[#005b9f] text-white font-bold py-4 px-4 rounded-xl hover:bg-[#004a82] transition-all shadow-[0_4px_14px_0_rgba(0,91,159,0.39)] hover:shadow-[0_6px_20px_rgba(0,91,159,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center text-base"
                    >
                      {isToppingUp ? 'Processing Payment...' : 'Pay with EcoCash'}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-4 font-medium">
                      1 USD = 1 Credit. A prompt will be sent to your phone to confirm the payment.
                    </p>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <History className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Recent History</h2>
                </div>
                
                {transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                      <History className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100/50">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Top Up</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-green-600">+${tx.amount.toFixed(2)}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
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
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available Balance</label>
                    <p className="text-gray-900 font-black text-2xl">{user.balance.toFixed(2)} <span className="text-sm font-bold text-gray-400">USD</span></p>
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
        )}
      </main>
    </div>
  );
}
