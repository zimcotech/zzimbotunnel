import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '' });
  const [error, setError] = useState('');

  const calculateStrength = (pwd: string) => {
    if (pwd.length === 0) return { score: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score === 4) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 0. Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Username is already taken. Please choose another one.');
      }

      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create the user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: authData.user.id, username, email, balance: 0, role: 'user' }
          ]);

        if (profileError && profileError.code !== '23505') {
          console.error('Profile creation error:', profileError);
          throw new Error('Account created, but profile setup failed. Please contact support.');
        }

        // 3. Login context will be updated by onAuthStateChange in AuthContext
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand-green/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <Logo size={48} className="drop-shadow-lg group-hover:scale-105 transition-transform" />
          <span className="font-black text-3xl tracking-tight text-gray-900 text-shadow-sm">Zimbo <span className="text-brand-yellow">Tunnel</span></span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-black text-gray-900 tracking-tight">
          Create an Account
        </h2>
        <p className="mt-3 text-center text-base text-gray-500 font-medium">
          Join <span className="text-brand-green font-bold text-sm">Zimbo</span> <span className="text-brand-yellow font-bold text-sm">Tunnel</span> today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-12 border border-gray-100"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    setPasswordStrength(calculateStrength(val));
                    if (error) setError('');
                  }}
                  className="block w-full pl-11 pr-11 py-3.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-brand-green/10 focus:border-brand-green transition-all font-medium text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-green/20 text-base font-bold text-white bg-brand-gradient hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500 font-medium leading-relaxed">
            By signing up, you agree to our{' '}
            <Link to="/terms-of-service" className="font-bold text-brand-green hover:text-brand-yellow-dark transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="font-bold text-brand-green hover:text-brand-yellow-dark transition-colors">
              Privacy Policy
            </Link>.
          </p>

          <p className="mt-8 text-center text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-green hover:text-brand-yellow-dark transition-colors">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
