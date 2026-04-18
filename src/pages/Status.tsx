import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { Link } from 'react-router-dom';

export function Status() {
  return (
    <div className="min-h-screen bg-[#fcfdf2] flex flex-col font-sans">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-green mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">System Status</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Real-time health of <span className="text-brand-green font-bold">Zimbo</span> <span className="text-brand-yellow-dark font-bold">Tunnel</span> infrastructure.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_2px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-10 p-5 bg-brand-green-dark rounded-2xl border border-white/10 shadow-lg text-white">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">All Systems Operational</h3>
                <p className="text-sm text-brand-yellow font-black uppercase tracking-widest opacity-80 mt-0.5">Live Status: Updated seconds ago</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Johannesburg, South Africa', status: 'operational', uptime: '99.99%' },
                { name: 'London, United Kingdom', status: 'operational', uptime: '99.98%' },
                { name: 'New York, United States', status: 'operational', uptime: '99.99%' },
                { name: 'Frankfurt, Germany', status: 'operational', uptime: '99.95%' },
                { name: 'Singapore Central', status: 'operational', uptime: '99.99%' },
                { name: 'EcoCash Pay Gateway (ZWG)', status: 'operational', uptime: '100%' },
              ].map((service, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:bg-brand-yellow-light/20 transition-all hover:scale-[1.01] group">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-3 h-3 rounded-full bg-brand-green animate-pulse shadow-[0_0_12px_rgba(22,163,74,0.5)]"></div>
                    <span className="font-black text-gray-900 tracking-tight group-hover:text-brand-green-dark transition-colors">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{service.uptime} uptime</span>
                    <span className="px-4 py-1.5 bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-green/20">
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
