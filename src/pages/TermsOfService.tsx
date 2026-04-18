import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#fcfdf2] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-brand-green/5 border border-brand-yellow/10">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/20">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
          </div>
          
          <div className="prose prose-green max-w-none text-gray-600">
            <p className="lead text-lg text-gray-400 font-bold uppercase tracking-widest mb-10 pb-6 border-b border-gray-100">Last updated: {new Date().toLocaleDateString('en-GB')}</p>
            
            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-yellow-light text-brand-yellow-dark flex items-center justify-center text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="mb-6 leading-relaxed font-medium">By accessing and using Zimbo Tunnel services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            
            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-yellow-light text-brand-yellow-dark flex items-center justify-center text-sm">2</span>
              Acceptable Use
            </h2>
            <p className="mb-6 leading-relaxed font-medium">You agree not to use our services for any unlawful or prohibited activities, including but not limited to:</p>
            <ul className="list-none pl-0 mb-8 space-y-3">
              {['Distributing malware or engaging in hacking activities.', 'Participating in DDoS attacks or network abuse.', 'Violating intellectual property rights.', 'Transmitting illegal or highly objectionable content.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle2 className="h-3 w-3" /></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-yellow-light text-brand-yellow-dark flex items-center justify-center text-sm">3</span>
              Account Responsibilities
            </h2>
            <p className="mb-6 leading-relaxed font-medium">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
            
            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-5 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-yellow-light text-brand-yellow-dark flex items-center justify-center text-sm">4</span>
              Service Availability
            </h2>
            <p className="mb-6 leading-relaxed font-medium">While we strive to provide uninterrupted service, we do not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue any part of the service without notice.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
