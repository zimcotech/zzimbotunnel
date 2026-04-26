import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Server, Plus, Clock, Copy, CheckCircle2, AlertCircle, Wallet, History, LogOut, User, LayoutDashboard, Facebook, Send, Youtube, Filter, ArrowUpDown, Coins, DollarSign, Bitcoin, Briefcase, Smartphone, Infinity, ArrowRightLeft, Info, X, ChevronDown, Bell, ExternalLink, RefreshCw, Loader2, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { supabase } from '../lib/supabase';
import { createPaymentOrder, checkPaymentStatus } from '../lib/payment';

export function Dashboard() {
  const { user, token, updateBalance, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [servers, setServers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [verifiedTxs, setVerifiedTxs] = useState<Record<string, boolean>>({});
  
  const tabParam = searchParams.get('tab') as 'overview' | 'servers' | 'create' | 'billing' | null;
  const activeTab = tabParam || 'overview';
  
  const setActiveTab = (tab: 'overview' | 'servers' | 'create' | 'billing') => {
    setSearchParams({ tab });
  };
  
  // Create Server Form State
  const [protocol, setProtocol] = useState('V2Ray');
  const [location, setLocation] = useState('United Kingdom UK1');
  const [duration, setDuration] = useState(30);
  const [serverUsername, setServerUsername] = useState('');
  const [serverPassword, setServerPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [showProtocolGuide, setShowProtocolGuide] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const LOCATION_OPTIONS = [
    { value: 'United Kingdom UK1', label: '🇬🇧 United Kingdom UK1' },
    { value: 'Canada CND1', label: '🇨🇦 Canada CND1' },
    { value: 'United States USA1', label: '🇺🇸 United States USA1' },
    { value: 'Netherlands NTH1', label: '🇳🇱 Netherlands NTH1' },
    { value: 'Germany GMY1', label: '🇩🇪 Germany GMY1' },
    { value: 'Zimbabwe ZW1', label: '🇿🇼 Zimbabwe ZW1' }
  ];

  // Server List Filters & Sorting
  const [filterProtocols, setFilterProtocols] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('created_desc');
  
  const [isProtocolDropdownOpen, setIsProtocolDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const sortOptions = [
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' },
    { value: 'expires_asc', label: 'Expires Soonest' },
    { value: 'expires_desc', label: 'Expires Latest' },
    { value: 'location_asc', label: 'Location (A-Z)' },
    { value: 'location_desc', label: 'Location (Z-A)' },
  ];

  // Billing & Topup State
  const PACKAGES = [
    { id: 'pkg_30', coins: 30, price: 0.01, icon: Coins },
    { id: 'pkg_50', coins: 50, price: 0.02, icon: Coins },
    { id: 'pkg_100', coins: 100, price: 0.03, icon: Coins },
    { id: 'pkg_250', coins: 250, price: 0.08, icon: Coins },
    { id: 'pkg_500', coins: 500, price: 0.17, icon: Coins },
  ];

  const [showTopUpForm, setShowTopUpForm] = useState(() => sessionStorage.getItem('dischub_showTopUpForm') === 'true');
  const [selectedPackageId, setSelectedPackageId] = useState('pkg_30');
  const [paymentMethod, setPaymentMethod] = useState('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [verifyingTxId, setVerifyingTxId] = useState<string | null>(null);
  const [topupMessage, setTopupMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(() => sessionStorage.getItem('dischub_paymentOrderId'));
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>(() => (sessionStorage.getItem('dischub_paymentStatus') as any) || 'idle');
  const [showPaymentModal, setShowPaymentModal] = useState(() => sessionStorage.getItem('dischub_showPaymentModal') === 'true');

  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const [globalNotification, setGlobalNotification] = useState<any>(null);

  useEffect(() => {
    sessionStorage.setItem('dischub_showTopUpForm', showTopUpForm.toString());
  }, [showTopUpForm]);

  useEffect(() => {
    if (paymentOrderId) sessionStorage.setItem('dischub_paymentOrderId', paymentOrderId);
    else sessionStorage.removeItem('dischub_paymentOrderId');
  }, [paymentOrderId]);

  useEffect(() => {
    sessionStorage.setItem('dischub_showPaymentModal', showPaymentModal.toString());
  }, [showPaymentModal]);

  useEffect(() => {
    sessionStorage.setItem('dischub_paymentStatus', paymentStatus);
  }, [paymentStatus]);

  useEffect(() => {
    if (user) {
      fetchServers();
      fetchTransactions();
      fetchGlobalNotification();
    }
  }, [user]);

  const fetchGlobalNotification = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'global')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) {
        const dismissed = localStorage.getItem(`dismissed_notification_${data.id}`);
        if (!dismissed) {
          setGlobalNotification(data);
        }
      }
    } catch (error) {
      // It's ok if no notification is found
    }
  };

  const handleDismissNotification = () => {
    if (globalNotification) {
      localStorage.setItem(`dismissed_notification_${globalNotification.id}`, 'true');
      setGlobalNotification(null);
    }
  };

  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setServers(data);
    } catch (error) {
      console.error('Failed to fetch servers', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        // Deduplicate: if an ord:id has a 'completed' or 'failed' status, use that instead of pending
        const grouped = data.reduce((acc: Record<string, any>, tx: any) => {
          const match = tx.phone_number?.match(/\|ord:(.+)$/);
          const key = match ? match[1] : tx.id;
          
          if (!acc[key]) {
            acc[key] = tx;
          } else {
            // Prioritize completed/failed over pending
            if (acc[key].status === 'pending' && tx.status !== 'pending') {
              acc[key] = tx;
            }
          }
          return acc;
        }, {});
        
        const deduplicated = Object.values(grouped).sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setTransactions(deduplicated);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  const filteredAndSortedServers = React.useMemo(() => {
    let result = [...servers];

    if (filterProtocols.length > 0) {
      result = result.filter(s => filterProtocols.includes(s.protocol));
    }

    if (filterStatuses.length > 0) {
      const now = new Date();
      result = result.filter(s => {
        const isActive = new Date(s.expires_at) > now;
        const status = isActive ? 'Active' : 'Expired';
        return filterStatuses.includes(status);
      });
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'expires_asc':
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        case 'expires_desc':
          return new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime();
        case 'location_asc':
          return a.location.localeCompare(b.location);
        case 'location_desc':
          return b.location.localeCompare(a.location);
        default:
          return 0;
      }
    });

    return result;
  }, [servers, filterProtocols, filterStatuses, sortBy]);

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const cost = duration * 1;
      if (!user || user.balance < cost) {
        throw new Error('Insufficient balance');
      }

      const host = `${location.toLowerCase().replace(/\s+/g, '')}.zimbotunnel.com`;
      const port = 443;
      const username = `zigssh.com-${serverUsername}` || `user_${Math.random().toString(36).substring(2, 8)}`;
      const password = serverPassword || Math.random().toString(36).substring(2, 12);
      const uuid = Math.random().toString(36).substring(2, 15);

      let config = '';
      if (['V2Ray', 'WireGuard'].includes(protocol)) {
        config = `${protocol}://${uuid}@${host}:${port}?security=tls&type=ws&sni=${host}#${username}`;
      } else {
        config = `${protocol}://${username}:${password}@${host}:${port}`;
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(duration.toString()));

      // 1. Deduct balance
      const newBalance = user.balance - cost;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);
        
      if (updateError) throw updateError;

      // 2. Create server
      const { error: insertError } = await supabase
        .from('servers')
        .insert([{
          user_id: user.id,
          protocol,
          location,
          duration,
          config,
          expires_at: expiresAt.toISOString(),
          host,
          port,
          username,
          password,
          uuid
        }]);

      if (insertError) throw insertError;

      // Refresh data
      fetchServers();
      updateBalance(newBalance);
      setServerUsername('');
      setServerPassword('');
      setActiveTab('servers');
      setCreateSuccess('Server created successfully!');
      setTimeout(() => setCreateSuccess(''), 5000); // Clear success message after 5 seconds
    } catch (error: any) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTopup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsToppingUp(true);
    setTopupMessage('');
    setPaymentStatus('pending');

    try {
      const selectedPkg = PACKAGES.find(p => p.id === selectedPackageId);
      if (!selectedPkg) throw new Error('Invalid package selected');

      if ((paymentMethod === 'ecocash' || paymentMethod === 'innbucks') && !phoneNumber) {
        throw new Error(`Please enter your ${paymentMethod === 'ecocash' ? 'EcoCash' : 'Innbucks'} number`);
      }

      const orderId = Date.now().toString();
      
      let finalPrice = selectedPkg.price;
      if (isCouponApplied) {
        finalPrice = selectedPkg.price * (1 - couponDiscountPercent / 100);
      }
      
      let formattedPhone = phoneNumber || '+263780070488';
      if (phoneNumber) {
        // Strip out non-digits just in case
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (digitsOnly.startsWith('0')) {
          formattedPhone = '+263' + digitsOnly.substring(1);
        } else if (digitsOnly.startsWith('263')) {
          formattedPhone = '+' + digitsOnly;
        } else {
          formattedPhone = '+263' + digitsOnly;
        }
      }

      // Create Payment Order
      const currency = paymentMethod === 'innbucks' ? 'USD' : 'ZWG';
      const returnUrl = window.location.origin + window.location.pathname + '?tab=billing';
      const response = await createPaymentOrder(orderId, finalPrice, formattedPhone, currency, returnUrl);
      
      if (response.status === 'success') {
        setPaymentOrderId(orderId);
        
        // Record pending transaction immediately
        const txPhoneNumber = `${paymentMethod}:${phoneNumber || 'N/A'}|pkg:${selectedPkg.id}|ord:${orderId}`;
        const { error: txError } = await supabase
          .from('transactions')
          .insert([{
            user_id: user?.id,
            amount: finalPrice,
            phone_number: txPhoneNumber,
            status: 'pending'
          }]);
        if (!txError) fetchTransactions();
        
        sessionStorage.setItem('dischub_paymentOrderId', orderId);
        sessionStorage.setItem('dischub_showPaymentModal', 'true');
        sessionStorage.setItem('dischub_paymentStatus', 'pending');
        sessionStorage.setItem('dischub_showTopUpForm', 'true');

        window.location.href = `https://dischub.co.zw/api/make/payment/to/${orderId}`;
      } else {
        throw new Error(response.message || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setTopupMessage(err.message || 'An error occurred');
      setPaymentStatus('failed');
    } finally {
      setIsToppingUp(false);
    }
  };

  const handleCheckStatus = async (txObj?: any) => {
    let activeOrderId = paymentOrderId;
    let expectedCoinsToAdd = 0;
    let isHistoryVerify = false;
    let currentTxId = null;

    if (txObj && typeof txObj === 'object' && txObj.id) {
      isHistoryVerify = true;
      currentTxId = txObj.id;
      
      const ordMatch = txObj.phone_number?.match(/\|ord:(.+)$/);
      if (ordMatch) activeOrderId = ordMatch[1];
      
      const pkgMatch = txObj.phone_number?.match(/\|pkg:([^|]+)/);
      if (pkgMatch) {
         const pkgInfo = PACKAGES.find(p => p.id === pkgMatch[1]);
         expectedCoinsToAdd = pkgInfo?.coins || Math.floor(txObj.amount * 3000);
      } else {
         expectedCoinsToAdd = Math.floor(txObj.amount * 3000); 
      }
    } else {
      const pkgInfo = PACKAGES.find(p => p.id === selectedPackageId);
      expectedCoinsToAdd = pkgInfo?.coins || 0;
      if (couponCode && couponCode.toUpperCase() === 'BONUS10') {
        expectedCoinsToAdd += 10;
      }
    }

    if (!activeOrderId) return;
    
    if (isHistoryVerify && currentTxId) {
      setVerifyingTxId(currentTxId);
    } else {
      setIsToppingUp(true);
    }
    if (!isHistoryVerify) setTopupMessage('');
    else setSnackbarMessage('Verifying payment status...');
    
    try {
      // Check if transaction exists and its status
      let existingTx = null;
      if (currentTxId) {
        const { data } = await supabase.from('transactions').select('*').eq('id', currentTxId).single();
        existingTx = data;
      } else {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .like('phone_number', `%|ord:${activeOrderId}`)
          .order('created_at', { ascending: false })
          .limit(1);
        if (data && data.length > 0) {
          existingTx = data[0];
        }
      }

      // STRICT PROTECTION against double crediting: check if ANY transaction with this ordId is completed
      const { data: anyCompleted } = await supabase
        .from('transactions')
        .select('*')
        .like('phone_number', `%|ord:${activeOrderId}`)
        .eq('status', 'completed')
        .limit(1);

      if (anyCompleted && anyCompleted.length > 0) {
        if (!isHistoryVerify) {
          setPaymentStatus('success');
          setTopupMessage('Payment already processed. Coins added.');
          setTimeout(() => {
            setPaymentOrderId(null);
            setShowPaymentModal(false);
            setShowTopUpForm(false);
            setPaymentStatus('idle');
          }, 4000);
        } else {
          setSnackbarMessage('Payment already completed.');
        }
        if (isHistoryVerify) setVerifyingTxId(null);
        else setIsToppingUp(false);
        return;
      }
      
      // fallback case if we didn't find the exact one in early check but the existing is completed
      if (existingTx && existingTx.status === 'completed') {
        if (!isHistoryVerify) {
          setPaymentStatus('success');
          setTopupMessage('Payment already processed. Coins added.');
          setTimeout(() => {
            setPaymentOrderId(null);
            setShowPaymentModal(false);
            setShowTopUpForm(false);
            setPaymentStatus('idle');
          }, 4000);
        } else {
          setSnackbarMessage('Payment already completed.');
        }
        if (isHistoryVerify) setVerifyingTxId(null);
        else setIsToppingUp(false);
        return;
      }

      const response = await checkPaymentStatus(activeOrderId);
      const respStatus = (response.status || '').toLowerCase().trim();
      
      if (['success', 'paid', 'completed'].includes(respStatus)) {
        if (!isHistoryVerify) setPaymentStatus('success');
        
        const newBalance = (user?.balance || 0) + expectedCoinsToAdd;

        // 1. Update balance
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('id', user?.id);

        if (updateError) throw updateError;

        // 2. Output and Update transaction to completed
        let updatedSuccess = false;
        if (existingTx) {
          const { data: updatedData, error: txError } = await supabase
            .from('transactions')
            .update({ status: 'completed' })
            .eq('id', existingTx.id)
            .select();
            
          if (txError) throw txError;
          if (updatedData && updatedData.length > 0) {
            updatedSuccess = true;
          }
        }
        
        if (!updatedSuccess) {
          // Fallback if not found or RLS prevented update
          const finalPrice = existingTx?.amount || 0;
          const fallbackPkgId = selectedPackageId;
          const txPhoneNumber = `${paymentMethod}:${phoneNumber || 'N/A'}|pkg:${fallbackPkgId}|ord:${activeOrderId}`;
          const { error: txError } = await supabase
            .from('transactions')
            .insert([{
              user_id: user?.id,
              amount: finalPrice,
              phone_number: txPhoneNumber,
              status: 'completed'
            }]);
          if (txError) throw txError;
        }

        updateBalance(newBalance);
        await fetchTransactions();
        
        if (!isHistoryVerify) {
          setTopupMessage('Payment successful! Coins added.');
          setTimeout(() => {
            setPaymentOrderId(null);
            setShowPaymentModal(false);
            setShowTopUpForm(false);
            setPaymentStatus('idle');
          }, 4000);
        } else {
          setSnackbarMessage('Payment verified successfully! Coins added.');
          setTimeout(() => setSnackbarMessage(''), 3000);
        }
      } else if (respStatus === 'pending') {
        if (!isHistoryVerify) setTopupMessage('Payment is still pending. Please complete it or try again later.');
        else {
          setSnackbarMessage('Payment is still pending on DiscHub.');
          setTimeout(() => setSnackbarMessage(''), 3000);
        }
      } else {
        if (!isHistoryVerify) {
          setPaymentStatus('failed');
          setTopupMessage('Payment failed. Please try again.');
        } else {
          setSnackbarMessage('Payment failed or cancelled.');
          setTimeout(() => setSnackbarMessage(''), 3000);
          
          if (existingTx) {
             const { data: updatedData, error: updateError } = await supabase.from('transactions').update({ status: 'failed' }).eq('id', existingTx.id).select();
             if (!updatedData || updatedData.length === 0) {
                // RLS blocked update, let's insert failed
                const finalPrice = existingTx?.amount || 0;
                await supabase.from('transactions').insert([{
                  user_id: user?.id,
                  amount: finalPrice,
                  phone_number: `${existingTx.phone_number}`,
                  status: 'failed'
                }]);
             }
             await fetchTransactions();
          }
        }
      }

      if (existingTx && existingTx.id) {
        setVerifiedTxs(prev => ({ ...prev, [existingTx.id]: true }));
      }
    } catch (err: any) {
      if (!isHistoryVerify) setTopupMessage(err.message || 'Failed to check status');
      else {
        setSnackbarMessage(err.message || 'Error checking payment status.');
        setTimeout(() => setSnackbarMessage(''), 3000);
      }
    } finally {
      if (isHistoryVerify) setVerifyingTxId(null);
      else setIsToppingUp(false);
    }
  };

  const handleApplyCoupon = async () => {
    setIsCouponApplied(false);
    setCouponDiscountPercent(0);
    setCouponError('');

    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const code = couponCode.toUpperCase();
    
    try {
      // First check predefined coupons
      const coupons: { [key: string]: number } = {
        'ZIMBO5': 5,
        'SAVE10': 10,
        'TUNNEL20': 20,
        'BONUS10': 0, // Bonus coins logic remains separate
      };

      if (coupons.hasOwnProperty(code)) {
        setIsCouponApplied(true);
        setCouponDiscountPercent(coupons[code]);
        setSnackbarMessage(`Coupon "${code}" applied successfully!`);
        setTimeout(() => setSnackbarMessage(''), 3000);
        return;
      }

      // Check database
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        if (data.uses >= data.max_uses) {
          setCouponError('This coupon usage limit has been reached');
          return;
        }
        setIsCouponApplied(true);
        setCouponDiscountPercent(data.discount_percent);
        setSnackbarMessage(`Coupon "${code}" applied successfully!`);
        setTimeout(() => setSnackbarMessage(''), 3000);
      } else {
        setCouponError('Invalid or expired coupon code');
      }
    } catch (err) {
      console.error(err);
      setCouponError('Error validating coupon. Please try again.');
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfdf2] flex flex-col font-sans">
      {snackbarMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm bg-brand-green-dark border border-white/20 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Info className="h-4 w-4 text-brand-yellow" />
          </div>
          <p className="flex-1">{snackbarMessage}</p>
        </div>
      )}
      <Topbar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white border-r border-brand-yellow/10 flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8 p-2 rounded-2xl hover:bg-brand-yellow-light/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{user.username}</h3>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-brand-gradient rounded-2xl p-5 text-white mb-8 shadow-lg border border-white/10 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-brand-yellow/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <p className="text-white/80 text-[10px] font-black tracking-widest uppercase mb-1 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" /> Available Balance
                </p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-3xl font-black tracking-tight">{user.balance.toFixed(0)}</h2>
                  <span className="text-xs font-black text-brand-yellow uppercase tracking-tight">Coins</span>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'servers', icon: Server, label: 'My Servers' },
                { id: 'create', icon: Plus, label: 'Create Server' },
                { id: 'billing', icon: Wallet, label: 'Billing & Coins' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-brand-green text-white shadow-md shadow-brand-green/20 scale-[1.02]' 
                      : 'text-gray-500 hover:bg-brand-yellow-light hover:text-brand-green-dark'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col">
          {globalNotification && (
            <div className="mb-6 bg-brand-green/10 border-l-4 border-brand-green p-5 rounded-2xl relative overflow-hidden flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="absolute right-0 top-0 w-40 h-40 bg-brand-green opacity-[0.03] blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute left-0 bottom-0 w-20 h-20 bg-brand-green opacity-[0.05] blur-xl rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/10 relative z-10 backdrop-blur-sm">
                <Bell className="w-6 h-6 text-brand-green" />
              </div>
              <div className="flex-1 pt-1 relative z-10">
                <h4 className="font-extrabold text-[17px] tracking-tight text-brand-green mb-1.5">{globalNotification.title}</h4>
                <p className="text-[14px] text-gray-700 leading-relaxed font-medium">{globalNotification.message}</p>
              </div>
              <button 
                onClick={handleDismissNotification} 
                className="p-2 text-gray-400 hover:text-brand-green hover:bg-brand-green/10 rounded-xl transition-all relative z-10"
                aria-label="Dismiss notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="flex-1">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mb-8">Welcome back, here's what's happening with your account today.</p>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:border-brand-green/20 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-brand-green/10"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-green/5 flex items-center justify-center text-brand-green shadow-inner border border-brand-green/10 transition-transform duration-300 group-hover:scale-110">
                      <Server className="h-7 w-7" />
                    </div>
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wider rounded-full border border-green-200/50 flex items-center gap-2 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      {servers.filter(s => new Date(s.expires_at) > new Date()).length} Active
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Active Servers</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-gray-900 tracking-tight">{servers.filter(s => new Date(s.expires_at) > new Date()).length}</p>
                      <p className="text-sm text-gray-400 font-bold uppercase">/ {servers.length} Total</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-xl hover:border-brand-yellow/20 relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl transition-all duration-500 group-hover:bg-brand-yellow/10"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-yellow-light flex items-center justify-center text-brand-yellow-dark shadow-inner border border-brand-yellow/10 transition-transform duration-300 group-hover:scale-110">
                      <Clock className="h-7 w-7" />
                    </div>
                    <span className="px-4 py-1.5 bg-brand-yellow/5 text-brand-yellow-dark text-xs font-black uppercase tracking-wider rounded-full border border-brand-yellow/10 shadow-sm">
                      {servers.filter(s => new Date(s.expires_at) < new Date()).length} Expired
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Expired Servers</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-gray-900 tracking-tight">{servers.filter(s => new Date(s.expires_at) < new Date()).length}</p>
                      <p className="text-sm text-gray-400 font-bold uppercase">/ {servers.length} Total</p>
                    </div>
                  </div>
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
                className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green/90 transition-colors shadow-sm flex items-center gap-2 w-fit"
              >
                <Plus className="h-4 w-4" />
                New Server
              </button>
            </div>

            {createSuccess && (
              <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3 text-green-700">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{createSuccess}</p>
              </div>
            )}

            {servers.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Filter className="h-4 w-4" /> Filters:
                  </div>
                  
                  {/* Protocol Multi-select */}
                  <div 
                    className="relative outline-none" 
                    tabIndex={-1}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsProtocolDropdownOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsProtocolDropdownOpen(!isProtocolDropdownOpen)}
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-brand-yellow hover:bg-gray-50 focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green flex items-center justify-between px-4 py-2.5 outline-none min-w-[150px] transition-all shadow-sm"
                    >
                      <span className="truncate mr-2 font-semibold">
                        {filterProtocols.length === 0 ? 'All Protocols' : `${filterProtocols.length} Selected`}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProtocolDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isProtocolDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 left-0 animate-in fade-in zoom-in-95 duration-200">
                        {['V2Ray', 'SSH WebSocket', 'Slow DNS', 'OpenVPN', 'WireGuard'].map(p => (
                          <label key={p} className={`flex items-center px-4 py-2.5 hover:bg-brand-green-light/30 cursor-pointer transition-colors ${filterProtocols.includes(p) ? 'bg-brand-green-light/20' : ''}`}>
                            <input
                              type="checkbox"
                              checked={filterProtocols.includes(p)}
                              onChange={() => {
                                if (filterProtocols.includes(p)) {
                                  setFilterProtocols(filterProtocols.filter(item => item !== p));
                                } else {
                                  setFilterProtocols([...filterProtocols, p]);
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-brand-green cursor-pointer mr-3"
                            />
                            <span className={`text-sm font-medium ${filterProtocols.includes(p) ? 'text-brand-green' : 'text-gray-700'}`}>{p}</span>
                          </label>
                        ))}
                        {filterProtocols.length > 0 && (
                          <div className="px-4 pt-3 mt-2 border-t border-gray-100">
                            <button 
                              onClick={() => setFilterProtocols([])}
                              className="text-xs text-brand-green font-bold hover:text-brand-green/80 flex items-center gap-1"
                            >
                              <X className="h-3 w-3" /> Clear Selection
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Multi-select */}
                  <div 
                    className="relative outline-none" 
                    tabIndex={-1}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsStatusDropdownOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-brand-yellow hover:bg-gray-50 focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green flex items-center justify-between px-4 py-2.5 outline-none min-w-[140px] transition-all shadow-sm"
                    >
                      <span className="truncate mr-2 font-semibold">
                        {filterStatuses.length === 0 ? 'All Statuses' : `${filterStatuses.length} Selected`}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isStatusDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 left-0 animate-in fade-in zoom-in-95 duration-200">
                        {['Active', 'Expired'].map(s => (
                          <label key={s} className={`flex items-center px-4 py-2.5 hover:bg-brand-green-light/30 cursor-pointer transition-colors ${filterStatuses.includes(s) ? 'bg-brand-green-light/20' : ''}`}>
                            <input
                              type="checkbox"
                              checked={filterStatuses.includes(s)}
                              onChange={() => {
                                if (filterStatuses.includes(s)) {
                                  setFilterStatuses(filterStatuses.filter(item => item !== s));
                                } else {
                                  setFilterStatuses([...filterStatuses, s]);
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 accent-brand-green cursor-pointer mr-3"
                            />
                            <span className={`text-sm font-medium ${filterStatuses.includes(s) ? 'text-brand-green' : 'text-gray-700'}`}>{s}</span>
                          </label>
                        ))}
                        {filterStatuses.length > 0 && (
                          <div className="px-4 pt-3 mt-2 border-t border-gray-100">
                            <button 
                              onClick={() => setFilterStatuses([])}
                              className="text-xs text-brand-green font-bold hover:text-brand-green/80 flex items-center gap-1"
                            >
                              <X className="h-3 w-3" /> Clear Selection
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <ArrowUpDown className="h-4 w-4" /> Sort by:
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div 
                    className="relative outline-none w-full md:w-auto" 
                    tabIndex={-1}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsSortDropdownOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl hover:border-brand-yellow hover:bg-gray-50 focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green flex items-center justify-between px-4 py-2.5 outline-none min-w-[170px] w-full md:w-auto transition-all shadow-sm"
                    >
                      <span className="truncate mr-2 font-semibold">
                        {sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort By'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSortDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full md:w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 right-0 animate-in fade-in zoom-in-95 duration-200">
                        {sortOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left flex items-center px-4 py-2.5 hover:bg-brand-green-light/30 cursor-pointer transition-colors ${
                              sortBy === opt.value ? 'bg-brand-green-light/20' : ''
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                              sortBy === opt.value ? 'border-brand-green bg-brand-green-light' : 'border-gray-300'
                            }`}>
                              {sortBy === opt.value && <div className="w-2 h-2 rounded-full bg-brand-green" />}
                            </div>
                            <span className={`text-sm font-medium ${sortBy === opt.value ? 'text-brand-green' : 'text-gray-700'}`}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {servers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Server className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active servers</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't created any tunneling servers yet. Create one now to get started.</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="px-8 py-4 bg-brand-green text-white rounded-xl font-bold hover:bg-brand-green/90 transition-all shadow-[0_4px_14px_0_rgba(22,163,74,0.3)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.2)] hover:-translate-y-0.5 inline-flex items-center gap-2 text-base"
                >
                  <Plus className="h-5 w-5" />
                  Create your first server
                </button>
              </div>
            ) : filteredAndSortedServers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No servers match your filters</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Try adjusting your protocol or status filters to see your servers.</p>
                <button 
                  onClick={() => { setFilterProtocols([]); setFilterStatuses([]); }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all inline-flex items-center gap-2 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedServers.map(server => {
                  const isExpired = new Date(server.expires_at) < new Date();
                  return (
                    <div 
                      key={server.id} 
                      onClick={() => navigate(`/server/${server.id}`)}
                      className={`group bg-white rounded-2xl border ${isExpired ? 'border-red-100' : 'border-gray-100'} p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] cursor-pointer transition-all duration-300 relative overflow-hidden`}
                    >
                      {/* Subtle gradient background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-green-light/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
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
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span> Active
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
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-gray-400 hover:text-brand-green hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-gray-200 transition-all"
                            title="Copy Config"
                          >
                            {copiedId === server.id ? <CheckCircle2 className="h-4 w-4 text-brand-green" /> : <Copy className="h-4 w-4" />}
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
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-gray-900">Protocol</label>
                    <button 
                      type="button" 
                      onClick={() => setShowProtocolGuide(!showProtocolGuide)}
                      className="text-gray-400 hover:text-brand-green transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Info className="h-4 w-4" />
                      {showProtocolGuide ? 'Hide Guide' : 'What are these?'}
                    </button>
                  </div>
                  
                  {showProtocolGuide && (
                    <div className="mb-4 p-4 bg-brand-green-light border border-brand-green/20 rounded-xl text-sm text-brand-green space-y-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-brand-green">Protocol Guide</h4>
                        <button type="button" onClick={() => setShowProtocolGuide(false)} className="text-brand-green/40 hover:text-brand-green">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <ul className="space-y-1.5 list-disc list-inside text-brand-green/80">
                        <li><strong className="text-brand-green">V2Ray:</strong> Best for bypassing strict firewalls and deep packet inspection.</li>
                        <li><strong className="text-brand-green">SSH WebSocket:</strong> Good balance of speed and stealth, works well on most networks.</li>
                        <li><strong className="text-brand-green">Slow DNS:</strong> Extremely stealthy, works when other protocols are blocked, but very slow.</li>
                        <li><strong className="text-brand-green">OpenVPN:</strong> Industry standard, highly secure, but easier to detect and block.</li>
                        <li><strong className="text-brand-green">WireGuard:</strong> Modern, fast, and lightweight, excellent for general use.</li>
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['V2Ray', 'SSH WebSocket', 'Slow DNS', 'OpenVPN', 'WireGuard'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProtocol(p)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          protocol === p 
                            ? 'border-brand-green bg-brand-green-light text-brand-green ring-1 ring-brand-green' 
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
                  <div 
                    className="relative outline-none"
                    tabIndex={-1}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsLocationDropdownOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl hover:border-brand-yellow focus:ring-4 focus:ring-brand-green/10 focus:border-brand-green flex items-center justify-between px-4 py-3.5 outline-none transition-all shadow-sm"
                    >
                      <span className="truncate mr-2 font-semibold">
                        {LOCATION_OPTIONS.find(opt => opt.value === location)?.label || 'Select Location'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isLocationDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl py-3 left-0 animate-in fade-in zoom-in-95 duration-200">
                        {LOCATION_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setLocation(opt.value);
                              setIsLocationDropdownOpen(false);
                            }}
                            className={`w-full text-left flex items-center px-4 py-3 hover:bg-brand-green-light/30 cursor-pointer transition-colors ${
                              location === opt.value ? 'bg-brand-green-light/20' : ''
                            }`}
                          >
                            <span className={`text-sm font-medium ${location === opt.value ? 'text-brand-green font-bold' : 'text-gray-700'}`}>
                              {opt.label}
                            </span>
                            {location === opt.value && (
                              <div className="ml-auto text-brand-green">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Username</label>
                  <div className="flex rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all overflow-hidden shadow-sm">
                    <div className="flex items-center px-4 bg-gray-50 border-r border-gray-200 select-none">
                      <span className="text-gray-400 text-sm font-semibold tracking-tight">zimbotunnel-</span>
                    </div>
                    <input 
                      type="text" 
                      value={serverUsername}
                      onChange={(e) => setServerUsername(e.target.value)}
                      className="w-full py-3 px-4 bg-transparent outline-none text-gray-600 text-sm font-medium tracking-tight placeholder:text-gray-400"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                {!['V2Ray', 'WireGuard'].includes(protocol) && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">Password</label>
                    <div className="flex rounded-xl border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all overflow-hidden shadow-sm">
                      <input 
                        type="text" 
                        value={serverPassword}
                        onChange={(e) => setServerPassword(e.target.value)}
                        className="w-full py-3 px-4 bg-transparent outline-none text-gray-600 text-sm font-medium tracking-tight placeholder:text-gray-400"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Duration</label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[1, 3, 7, 14, 30, 360].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          duration === d 
                            ? 'border-brand-green bg-brand-green-light text-brand-green ring-1 ring-brand-green' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {d} {d === 360 ? 'Year' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-5 flex justify-between items-center border border-gray-200/60">
                    <span className="text-gray-600 font-semibold">Total Cost</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-gray-900 tracking-tight">{duration * 1}</span>
                      <span className="text-sm font-bold text-gray-500 ml-1">Coins</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isCreating || user.balance < (duration * 1)}
                  className="w-full bg-brand-green text-white font-bold py-4 px-4 rounded-xl hover:bg-brand-green/90 transition-all shadow-lg shadow-brand-green/20 hover:shadow-brand-green/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center text-base"
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Deploying Server...
                    </span>
                  ) : user.balance < (duration * 1) ? 'Insufficient Coins' : 'Deploy Server'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            {!showTopUpForm ? (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Billing & Coins</h1>
                    <p className="text-gray-500 mt-1">Manage your coins and view transaction history.</p>
                  </div>
                  <button 
                    onClick={() => setShowTopUpForm(true)}
                    className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-brand-green/90 transition-colors shadow-sm flex items-center gap-2 w-fit"
                  >
                    <Plus className="h-4 w-4" />
                    Top Up Coins
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-green-light flex items-center justify-center text-brand-green">
                      <History className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
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
                        <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100/50">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {tx.phone_number?.includes('innbucks') ? 'Top Up via Innbucks' : 'Top Up via EcoCash'}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(tx.created_at).toLocaleDateString()} • Paid ZWG {tx.amount.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-green-600">+{(tx.amount * 3000).toFixed(0)} Coins</p>
                            
                            <div className="flex flex-col items-end gap-2 mt-2 relative z-10">
                              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                                tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                tx.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                'bg-red-100 text-red-700'
                              }`}>
                                {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                {tx.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                                {tx.status}
                              </span>
                              
                              {['pending', 'failed'].includes(tx.status) && (
                                <div className="flex gap-2 mt-0.5">
                                  {(tx.status === 'failed' || (tx.status === 'pending' && verifiedTxs[tx.id])) && (
                                    <button
                                      onClick={() => {
                                        const matchOpts = tx.phone_number?.match(/\|ord:(.+)$/);
                                        if (matchOpts && matchOpts[1]) {
                                          window.open(`https://dischub.co.zw/api/make/payment/to/${matchOpts[1]}`, '_blank');
                                        }
                                      }}
                                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95 ${
                                        tx.status === 'failed' 
                                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                      }`}
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      {tx.status === 'failed' ? 'Try Again' : 'Proceed'}
                                    </button>
                                  )}

                                  {tx.status === 'pending' && (
                                    <button
                                      onClick={() => handleCheckStatus(tx)}
                                      disabled={isToppingUp}
                                      className={`text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:cursor-not-allowed ${isToppingUp && verifyingTxId !== tx.id ? 'opacity-40 grayscale' : 'opacity-100'}`}
                                    >
                                      {verifyingTxId === tx.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                      Verify
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="max-w-3xl mx-auto">
                  <div className="mb-8 flex items-center gap-4">
                    <button 
                      onClick={() => setShowTopUpForm(false)}
                      className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Top Up</h1>
                    </div>
                  </div>

                  {topupMessage && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                      topupMessage.includes('successful') 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : topupMessage.includes('Please complete') || paymentStatus === 'pending'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{topupMessage}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Coin Package */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Coin Package</h2>
                      <div className="space-y-3">
                        {PACKAGES.map(pkg => (
                          <div 
                            key={pkg.id}
                            onClick={() => setSelectedPackageId(pkg.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPackageId === pkg.id ? 'border-brand-green bg-brand-green-light' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPackageId === pkg.id ? 'border-brand-green' : 'border-gray-300'}`}>
                                {selectedPackageId === pkg.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-green"></div>}
                              </div>
                              <div className="w-10 h-10 rounded-lg bg-brand-green-light flex items-center justify-center text-brand-green">
                                <pkg.icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{pkg.coins} Coins</p>
                                <p className="text-xs text-gray-500 font-medium">ZWG {pkg.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="text-lg font-black text-brand-green">
                              ZWG {pkg.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          onClick={() => setPaymentMethod('ecocash')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${paymentMethod === 'ecocash' ? 'border-brand-green bg-brand-green-light' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div className="w-12 h-12 mx-auto rounded-xl bg-green-100 flex items-center justify-center text-brand-green mb-3 font-bold">
                            <Smartphone className="h-6 w-6" />
                          </div>
                          <h3 className="font-bold text-gray-900">EcoCash</h3>
                          <p className="text-xs text-gray-500 mt-1">Mobile Money</p>
                        </div>
                        <div 
                          onClick={() => setPaymentMethod('innbucks')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${paymentMethod === 'innbucks' ? 'border-brand-green bg-brand-green-light' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                          <div className="w-12 h-12 mx-auto rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
                            <Wallet className="h-6 w-6" />
                          </div>
                          <h3 className="font-bold text-gray-900">Innbucks</h3>
                          <p className="text-xs text-gray-500 mt-1">Mobile Wallet</p>
                        </div>
                      </div>

                      {(paymentMethod === 'ecocash' || paymentMethod === 'innbucks') && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <label className="block text-sm font-bold text-gray-900 mb-2">{paymentMethod === 'ecocash' ? 'EcoCash Number' : 'Innbucks Number'}</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm font-medium">+263</span>
                            </div>
                            <input 
                              type="text" 
                              placeholder={paymentMethod === 'ecocash' ? "77X XXX XXX" : "71X XXX XXX"}
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-3.5 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green outline-none transition-all font-medium text-gray-900"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Coupon Code */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Coupon Code</h2>
                        {isCouponApplied && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md">Applied</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 min-w-0">
                          <input 
                            type="text" 
                            placeholder="ENTER CODE"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value);
                              if (isCouponApplied) {
                                setIsCouponApplied(false);
                                setCouponDiscountPercent(0);
                              }
                            }}
                            className={`w-full border rounded-xl px-4 py-3.5 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green outline-none transition-all font-medium text-gray-900 uppercase ${couponError ? 'border-red-300' : 'border-gray-200'}`}
                          />
                          {couponError && <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1">{couponError}</p>}
                          {isCouponApplied && <p className="text-[10px] text-green-600 font-bold mt-1.5 ml-1">You're saving {couponDiscountPercent}% with this code!</p>}
                        </div>
                        <button 
                          onClick={handleApplyCoupon}
                          className="shrink-0 h-[50px] px-5 sm:px-6 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green/90 transition-colors flex items-center justify-center gap-2"
                        >
                          {isCouponApplied ? <CheckCircle2 className="h-4 w-4" /> : 'Apply'}
                        </button>
                      </div>
                    </div>

                    {/* Proceed to Payment */}
                    <div>
                      <button 
                        onClick={handleTopup}
                        disabled={isToppingUp || ((paymentMethod === 'ecocash' || paymentMethod === 'innbucks') && !phoneNumber)}
                        className="w-full bg-brand-green text-white font-bold py-4 px-4 rounded-xl hover:bg-brand-green/90 transition-all shadow-lg shadow-brand-green/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-base gap-2"
                      >
                        {isToppingUp ? 'Processing...' : <><Wallet className="h-5 w-5" /> Proceed to Payment</>}
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center mt-3 font-medium">
                        You will be redirected to Dischub to process the payment securely
                      </p>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h2>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Original Price</span>
                          <span className="font-bold text-gray-900">ZWG {PACKAGES.find(p => p.id === selectedPackageId)?.price.toFixed(2)}</span>
                        </div>
                        {isCouponApplied && couponDiscountPercent > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600 font-bold">Discount ({couponDiscountPercent}%)</span>
                            <span className="font-bold text-green-600">-ZWG {((PACKAGES.find(p => p.id === selectedPackageId)?.price || 0) * (couponDiscountPercent / 100)).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Payment Fee</span>
                          <span className="font-bold text-red-500">+ZWG 0.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-yellow-600 font-bold">Bonus Coins</span>
                          <span className="font-bold text-gray-900">+{(couponCode.toUpperCase() === 'BONUS10') ? 10 : 0}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-xl font-black text-brand-green">
                            ZWG {((PACKAGES.find(p => p.id === selectedPackageId)?.price || 0) * (1 - (isCouponApplied ? couponDiscountPercent / 100 : 0))).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing Info</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                          <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><Coins className="h-3 w-3" /></div>
                          ZWG 0.01 = 30 Coins
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                          <div className="w-6 h-6 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center"><Infinity className="h-3 w-3" /></div>
                          Coins never expire
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                          <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><ArrowRightLeft className="h-3 w-3" /></div>
                          Can be transferred to others
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
          </div>
          
          {/* Minimal Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4 shrink-0 pb-8">
            <p className="text-sm text-gray-500 font-medium">© {new Date().getFullYear()} Zimbo Tunnel. All rights reserved.</p>
            <Link to="/privacy-policy" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm font-medium text-gray-500 hover:text-brand-green transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-6 mt-2">
              <a href="https://whatsapp.com/channel/0029VbCn5uAIiRovjBrSbx44" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-green transition-colors" title="WhatsApp"><WhatsAppIcon className="h-4 w-4" /></a>
              <a href="https://t.me/zimbotunnel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-green transition-colors" title="Telegram"><Send className="h-4 w-4" /></a>
              <a href="#" className="text-gray-400 hover:text-brand-green transition-colors" title="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="text-gray-400 hover:text-brand-green transition-colors" title="YouTube"><Youtube className="h-4 w-4" /></a>
            </div>
          </footer>
        </main>
      </div>

      {/* Payment Waiting Modal */}
      {paymentOrderId && showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-center flex-1">Order Status</h3>
              <button onClick={() => { setPaymentOrderId(null); setShowPaymentModal(false); setPaymentStatus('idle'); }} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors absolute right-4">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center">
              <p className="text-sm text-gray-500 font-medium mb-6">Order #{paymentOrderId}</p>
              
              {paymentStatus === 'success' ? (
                <>
                  <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-brand-green" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                  <p className="text-sm text-gray-600 mb-8 font-medium">Your coins have been added.</p>
                </>
              ) : paymentStatus === 'failed' ? (
                <>
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                  <p className="text-sm text-gray-600 mb-8 font-medium">{topupMessage || 'Your payment was not successful.'}</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-10 h-10 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Waiting for Payment</h2>
                  <p className="text-sm text-gray-600 mb-8 font-medium">{topupMessage || 'Complete payment in the DiscHub tab'}</p>
                </>
              )}
              
              <div className="w-full bg-gray-50/80 rounded-2xl p-4 text-left space-y-3 mb-6 border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Service:</span>
                  <span className="font-bold text-gray-900">Coins Top Up</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Quantity:</span>
                  <span className="font-bold text-gray-900">{(selectedPackageId ? PACKAGES.find(p => p.id === selectedPackageId)?.coins : 0) || 0} Coins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Amount:</span>
                  <span className="font-bold text-gray-900">ZWG {((PACKAGES.find(p => p.id === selectedPackageId)?.price || 0) * (1 - (isCouponApplied ? couponDiscountPercent / 100 : 0))).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckStatus}
                disabled={isToppingUp}
                className="w-full bg-white border-2 border-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex justify-center items-center text-sm gap-2"
              >
                {isToppingUp ? <Loader2 className="w-5 h-5 animate-spin text-brand-green" /> : <RefreshCw className="w-5 h-5 text-gray-500" />}
                {isToppingUp ? 'Checking...' : 'Check Payment Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
