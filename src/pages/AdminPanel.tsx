import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Settings, Users, CreditCard, Bell, FileText, Tag, Banknote, Search, CheckCircle, XCircle, ChevronRight, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('payments');

  if (user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'payments': return <PaymentsTab />;
      case 'users': return <UsersTab />;
      case 'notifications': return <NotificationsTab />;
      case 'blogs': return <BlogsTab />;
      case 'coupons': return <CouponsTab />;
      case 'coins': return <CoinsTab />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-green transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center text-brand-green">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Admin Console</h2>
                <p className="text-xs text-gray-500 font-medium">Manage your platform</p>
              </div>
            </div>
            <nav className="space-y-1.5">
              {[
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'users', label: 'Manage Users', icon: Users },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'blogs', label: 'Blogs', icon: FileText },
                { id: 'coupons', label: 'Coupons', icon: Tag },
                { id: 'coins', label: 'Add Coins', icon: Banknote },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                      isActive
                        ? 'text-brand-green bg-brand-green-light/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-brand-green-light" 
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <tab.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-green' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      {tab.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-brand-green relative z-10 opacity-50" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 min-h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function PaymentsTab() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('transactions').select('*, profiles(username, email)').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Recent Payments</h3>
          <p className="text-sm text-gray-500 font-medium">View and monitor transaction history.</p>
        </div>
        <button onClick={fetchPayments} className="flex items-center gap-2 text-sm font-bold text-brand-green bg-brand-green-light px-4 py-2.5 rounded-xl hover:bg-brand-green/10 transition-colors">
          <Settings className="w-4 h-4" /> Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100 font-bold tracking-wider">
              <tr>
                <th className="px-5 py-4">Date & Time</th>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-medium whitespace-nowrap text-gray-900">
                    {new Date(p.created_at).toLocaleDateString()} <span className="text-gray-400 ml-1">{new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">{p.profiles?.username || p.user_id}</td>
                  <td className="px-5 py-4 font-extrabold text-brand-green">${p.amount.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold leading-none ${p.status === 'completed' || p.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500 font-medium">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(100);
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (userId: string, currentStatus: boolean) => {
    const is_banned = !currentStatus;
    const { error } = await supabase.from('profiles').update({ is_banned }).eq('id', userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, is_banned } : u));
    }
  };

  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Manage Users</h3>
        <p className="text-sm text-gray-500 font-medium">Search and manage platform users.</p>
      </div>
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by username or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100 font-bold tracking-wider">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Balance</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                        {u.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{u.username}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold capitalize">
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">${(u.balance || 0).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => handleBanToggle(u.id, !!u.is_banned)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 ${u.is_banned ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
                    >
                      {u.is_banned ? 'Unban User' : 'Ban User'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500 font-medium">No users found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NotificationsTab() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    try {
      const { error } = await supabase.from('notifications').insert([{ title, message, type: 'global', created_at: new Date().toISOString() }]);
      if (error) throw error;
      setStatus('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Send Global Notification</h3>
        <p className="text-sm text-gray-500 font-medium">Broadcast a message to all users on the platform.</p>
      </div>
      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Notification Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
            required
            placeholder="e.g., System Maintenance"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green h-32 resize-none transition-all"
            required
            placeholder="Enter your message here..."
          />
        </div>
        <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
          Send Notification
        </button>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-lg text-sm font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
            <div className="flex items-center gap-2">
              {status.includes('Error') ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {status}
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}

function BlogsTab() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const { error } = await supabase.from('blogs').insert([{ title, content, created_at: new Date().toISOString() }]);
      if (error) throw error;
      setStatus('Blog added successfully!');
      setTitle('');
      setContent('');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Add New Blog</h3>
        <p className="text-sm text-gray-500 font-medium">Publish a new article to the site blog.</p>
      </div>
      <form onSubmit={handleAdd} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Blog Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
            required
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Content</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green h-64 resize-y transition-all"
            required
            placeholder="Write your blog post here..."
          />
        </div>
        <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
          Publish Blog
        </button>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-lg text-sm font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
            <div className="flex items-center gap-2">
              {status.includes('Error') ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {status}
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}

function CouponsTab() {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [status, setStatus] = useState('');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return;
    try {
      const { error } = await supabase.from('coupons').insert([{ 
        code: code.toUpperCase(), 
        discount_percent: parseInt(discount), 
        max_uses: parseInt(maxUses) || 100,
        uses: 0,
        created_at: new Date().toISOString() 
      }]);
      if (error) throw error;
      setStatus('Coupon created successfully!');
      setCode('');
      setDiscount('');
      setMaxUses('');
      fetchCoupons(); // Refresh the list
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      if (err.code === '23505') {
        setStatus('Error: Coupon code already exists.');
      } else {
        setStatus(`Error: ${err.message}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      setCoupons(coupons.filter(c => c.id !== id));
      setStatus('Coupon deleted successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus(`Error deleting coupon: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Manage Coupons</h3>
        <p className="text-sm text-gray-500 font-medium">Generate and manage discount codes.</p>
      </div>
      
      {/* Create form */}
      <div className="mb-12 max-w-xl">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Coupon Code</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green uppercase transition-all"
                placeholder="e.g. SUMMER20"
                required
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500 font-medium">Use alphanumeric characters. Will be converted to uppercase.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Discount (%)</label>
              <input 
                type="number" 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
                placeholder="20"
                min="1"
                max="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Max Uses</label>
              <input 
                type="number" 
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
                placeholder="100"
                min="1"
              />
            </div>
          </div>
          <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
            Create Coupon
          </button>
          {status && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-lg text-sm font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              <div className="flex items-center gap-2">
                {status.includes('Error') ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                {status}
              </div>
            </motion.div>
          )}
        </form>
      </div>

      {/* List of Coupons */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4">Active & Used Coupons</h4>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100 font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Discount</th>
                  <th className="px-5 py-4">Usage</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-brand-green bg-brand-green-light px-2.5 py-1 rounded-md">{c.code}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">{c.discount_percent}%</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[80px]">
                          <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${Math.min((c.uses / c.max_uses) * 100, 100)}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{c.uses}/{c.max_uses}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-medium whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500 font-medium">No coupons have been created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CoinsTab() {
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleAddCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !amount) return;
    setStatus('Processing...');
    
    try {
      // Find user by username or email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, balance, username, email')
        .or(`username.eq.${identifier},email.eq.${identifier}`);
      
      if (userError) throw userError;

      if (!users || users.length === 0) {
        throw new Error('User not found. If this is an older account, try searching by their exact username instead of email, or ask them to login again.');
      }

      if (users.length > 1) {
        throw new Error('Multiple users found with that username. Please use their exact email address to be safe.');
      }

      const user = users[0];
      
      const newBalance = (user.balance || 0) + parseFloat(amount);
      
      // Update balance
      const { error: updateError } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Record transaction
      await supabase.from('transactions').insert([{
        user_id: user.id,
        amount: parseFloat(amount),
        status: 'completed',
        type: 'admin_topup',
        created_at: new Date().toISOString()
      }]);
      
      setStatus(`Successfully added $${amount} to ${user.username || identifier}`);
      setIdentifier('');
      setAmount('');
      setTimeout(() => setStatus(''), 4000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Add Coins to User</h3>
        <p className="text-sm text-gray-500 font-medium">Manually credit coins to a user's balance.</p>
      </div>
      <form onSubmit={handleAddCoins} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Username or Email</label>
          <input 
            type="text" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
            placeholder="johndoe or user@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Amount to Add ($)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green transition-all"
            placeholder="10.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-brand-green text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 hover:-translate-y-0.5 hover:shadow-xl transition-all">
          Add Coins
        </button>
        {status && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-3 rounded-lg text-sm font-medium border ${status.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : (status.includes('Processing') ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100')}`}>
            {status}
          </motion.div>
        )}
      </form>
    </div>
  );
}
