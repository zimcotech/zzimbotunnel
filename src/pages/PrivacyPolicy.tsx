import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>
          
          <div className="prose prose-blue max-w-none text-gray-600">
            <p className="lead text-lg text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your email address, username, and payment information.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. No Logging Policy</h2>
            <p className="mb-4">We strictly adhere to a no-logging policy for your internet traffic. We do not monitor, record, or store your browsing history, DNS queries, or data content accessed through our tunneling servers.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us through our support channels.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
