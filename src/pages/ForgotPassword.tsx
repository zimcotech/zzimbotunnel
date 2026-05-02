import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom Validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
          <Logo size={48} className="drop-shadow-md group-hover:scale-105 transition-transform" />
          <span className="font-bold text-3xl tracking-tight text-on-surface text-shadow-sm">Zimbo <span className="text-primary">Tunnel</span></span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-bold text-on-surface tracking-tight">
          Reset your password
        </h2>
        <p className="mt-3 text-center text-base text-on-surface-variant font-medium">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface hover:bg-surface-container-high transition-colors py-10 px-6 shadow-2xl shadow-md sm:rounded-[2rem] sm:px-12 border border-brand-yellow/10"
        >
          {isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Check your email</h3>
              <p className="text-on-surface-variant font-medium mb-8">
                We've sent a password reset link to <span className="font-bold text-on-surface">{email}</span>.
              </p>
              <Link 
                to="/login"
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-3xl shadow-md shadow-md text-[10px] font-bold uppercase tracking-widest text-white bg-surface-variant hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mb-3 ml-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-on-surface-variant/80" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="block w-full pl-11 pr-4 py-4 border border-surface-container-highest rounded-3xl bg-surface-container/50 focus:bg-surface hover:bg-surface-container-high transition-colors focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-on-surface outline-none placeholder:text-on-surface-variant/80"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-3xl shadow-xl shadow-md text-[10px] font-bold uppercase tracking-widest text-white bg-surface-variant hover:scale-[1.02] active:scale-[0.98] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </span>
                    ) : 'Send reset link'}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-10 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
          <p className="mt-10 text-center text-[10px] text-on-surface-variant/80 font-bold leading-relaxed uppercase tracking-tighter">
            Protected by reCAPTCHA and subject to our{' '}
            <Link to="/privacy-policy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms-of-service" className="text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
