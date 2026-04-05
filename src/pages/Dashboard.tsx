import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Server, Plus, Clock, Copy, CheckCircle2, AlertCircle, Wallet, History, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { user, token, updateBalance, logout } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'servers' | 'create' | 'topup'>('servers');
  
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.username}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white mb-8 shadow-md">
            <p className="text-blue-100 text-sm mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold">{user.balance.toFixed(2)} <span className="text-base font-normal opacity-80">Credits</span></h2>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('servers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'servers' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Server className="h-5 w-5" />
              My Servers
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'create' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Plus className="h-5 w-5" />
              Create Server
            </button>
            <button 
              onClick={() => setActiveTab('topup')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'topup' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Wallet className="h-5 w-5" />
              Top Up
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <User className="h-5 w-5" />
              Profile
            </button>
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-200 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'servers' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Servers</h1>
              <button 
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                New Server
              </button>
            </div>

            {servers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Server className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active servers</h3>
                <p className="text-gray-500 mb-6">You haven't created any tunneling servers yet.</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  Create your first server
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {servers.map(server => {
                  const isExpired = new Date(server.expires_at) < new Date();
                  return (
                    <div key={server.id} className={`bg-white rounded-xl border ${isExpired ? 'border-red-200' : 'border-gray-200'} p-6 shadow-sm`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
                              {server.protocol}
                            </span>
                            {isExpired ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold uppercase tracking-wide">Expired</span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wide">Active</span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{server.location}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                            <Clock className="h-4 w-4" />
                            {server.duration} Days
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Expires: {new Date(server.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100 relative group">
                        <p className="text-sm font-mono text-gray-600 break-all pr-10 line-clamp-2">
                          {server.config}
                        </p>
                        <button 
                          onClick={() => copyToClipboard(server.config, server.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Copy Config"
                        >
                          {copiedId === server.id ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Server</h1>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              {createError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{createError}</p>
                </div>
              )}

              <form onSubmit={handleCreateServer} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protocol</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['V2Ray', 'SSH WebSocket', 'Slow DNS', 'OpenVPN', 'WireGuard'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProtocol(p)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${protocol === p ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  >
                    <option value="South Africa">🇿🇦 South Africa (Johannesburg)</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom (London)</option>
                    <option value="United States">🇺🇸 United States (New York)</option>
                    <option value="Germany">🇩🇪 Germany (Frankfurt)</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[1, 3, 7, 14, 30, 360].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${duration === d ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center border border-gray-100">
                  <span className="text-gray-600 font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-gray-900">{(duration * 0.5).toFixed(2)} <span className="text-sm font-normal text-gray-500">Credits</span></span>
                </div>

                <button 
                  type="submit"
                  disabled={isCreating || user.balance < (duration * 0.5)}
                  className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating...
                    </span>
                  ) : user.balance < (duration * 0.5) ? 'Insufficient Balance' : 'Create Server'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'topup' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Top Up Balance</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  EcoCash Payment
                </h2>
                
                {topupMessage && (
                  <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${topupMessage.includes('successful') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{topupMessage}</p>
                  </div>
                )}

                <form onSubmit={handleTopup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EcoCash Number</label>
                    <input 
                      type="text" 
                      placeholder="077X XXX XXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                    <input 
                      type="number" 
                      min="1"
                      step="1"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isToppingUp}
                    className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex justify-center items-center mt-2"
                  >
                    {isToppingUp ? 'Processing...' : 'Pay with EcoCash'}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    1 USD = 1 Credit. A prompt will be sent to your phone to confirm the payment.
                  </p>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" />
                  Recent Transactions
                </h2>
                
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No transactions yet.</p>
                ) : (
                  <div className="space-y-4">
                    {transactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Top Up</p>
                          <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{tx.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{tx.status}</p>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Balance</label>
                  <p className="text-gray-900 font-medium">{user.balance.toFixed(2)} Credits</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-gray-900 font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
