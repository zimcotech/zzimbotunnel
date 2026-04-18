import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-green-light flex items-center justify-center text-brand-green">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
          </div>
          
          <div className="prose prose-green max-w-none text-gray-600">
            <p className="lead text-lg text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">By accessing and using Zimbo Tunnel services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Acceptable Use</h2>
            <p className="mb-4">You agree not to use our services for any unlawful or prohibited activities, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Distributing malware or engaging in hacking activities.</li>
              <li>Participating in DDoS attacks or network abuse.</li>
              <li>Violating intellectual property rights.</li>
              <li>Transmitting illegal or highly objectionable content.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Account Responsibilities</h2>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Service Availability</h2>
            <p className="mb-4">While we strive to provide uninterrupted service, we do not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue any part of the service without notice.</p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Refunds</h2>
            <p className="mb-4">All purchases are final. Refunds may be granted at our sole discretion in exceptional circumstances, such as prolonged service outages.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
