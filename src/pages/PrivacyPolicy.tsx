import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface hover:bg-surface-container-high transition-colors rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-md border border-brand-yellow/10">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-14 h-14 rounded-3xl bg-surface-variant flex items-center justify-center text-white shadow-md border border-white/20">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-green max-w-none text-on-surface-variant">
            <p className="lead text-lg text-on-surface-variant/80 font-bold uppercase tracking-widest mb-10 pb-6 border-b border-surface-container-highest">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
            
            <h2 className="text-2xl font-bold text-on-surface mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary-light text-secondary-dark flex items-center justify-center text-sm">1</span>
              Information We Collect
            </h2>
            <p className="mb-6 leading-relaxed font-medium">We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your email address, username, and payment information.</p>
            
            <h2 className="text-2xl font-bold text-on-surface mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary-light text-secondary-dark flex items-center justify-center text-sm">2</span>
              How We Use Your Information
            </h2>
            <p className="mb-6 leading-relaxed font-medium">We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
            
            <h2 className="text-2xl font-bold text-on-surface mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary-light text-secondary-dark flex items-center justify-center text-sm">3</span>
              Data Security
            </h2>
            <p className="mb-6 leading-relaxed font-medium">We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
            
            <h2 className="text-2xl font-bold text-on-surface mt-10 mb-5 flex items-center gap-3 border-l-4 border-primary pl-4 bg-primary-container/20 py-4 rounded-r-xl">
              <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-sm">4</span>
              No Logging Policy
            </h2>
            <p className="mb-6 leading-relaxed font-bold text-on-surface">We strictly adhere to a no-logging policy for your internet traffic. We do not monitor, record, or store your browsing history, DNS queries, or data content accessed through our tunneling servers.</p>
            
            <h2 className="text-2xl font-bold text-on-surface mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-secondary-light text-secondary-dark flex items-center justify-center text-sm">5</span>
              Contact Us
            </h2>
            <p className="mb-6 leading-relaxed font-medium">If you have any questions about this Privacy Policy, please contact us through our official support channels on WhatsApp or Telegram.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
