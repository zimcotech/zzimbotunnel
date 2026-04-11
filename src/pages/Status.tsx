import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { Link } from 'react-router-dom';

export function Status() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">System Status</h1>
            <p className="text-gray-500 mt-1">Real-time status of Zimbo Tunnel servers and services.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-8 p-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">All Systems Operational</h3>
                <p className="text-sm text-green-700 font-medium">Last updated: Just now</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'South Africa (Johannesburg)', status: 'operational', uptime: '99.99%' },
                { name: 'United Kingdom (London)', status: 'operational', uptime: '99.98%' },
                { name: 'United States (New York)', status: 'operational', uptime: '99.99%' },
                { name: 'Germany (Frankfurt)', status: 'operational', uptime: '99.95%' },
                { name: 'Singapore', status: 'operational', uptime: '99.99%' },
                { name: 'EcoCash Payment Gateway', status: 'operational', uptime: '100%' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-gray-900">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-500 hidden sm:inline-block">{service.uptime} uptime</span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-md border border-green-100">
                      Operational
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
