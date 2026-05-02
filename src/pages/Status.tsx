import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Topbar } from '../components/Topbar';
import { Link } from 'react-router-dom';

export function Status() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Topbar />
      
      <main className="flex-1 p-6 md:p-8 flex flex-col max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80 hover:text-primary mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">System Status</h1>
            <p className="text-on-surface-variant mt-1 font-medium italic">Real-time health of <span className="text-primary font-bold">Zimbo</span> <span className="text-secondary-dark font-bold">Tunnel</span> infrastructure.</p>
          </div>
          
          <div className="bg-surface hover:bg-surface-container-high transition-colors rounded-3xl border border-surface-container-highest p-6 md:p-8 shadow-[0_2px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-10 p-5 bg-primary rounded-3xl border border-white/10 shadow-md text-white">
              <div className="w-14 h-14 rounded-full bg-surface hover:bg-surface-container-high transition-colors/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">All Systems Operational</h3>
                <p className="text-sm text-secondary font-bold uppercase tracking-widest opacity-80 mt-0.5">Live Status: Updated seconds ago</p>
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
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border border-surface-container-highest hover:bg-secondary-light/20 transition-all hover:scale-[1.01] group">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(22,163,74,0.5)]"></div>
                    <span className="font-bold text-on-surface tracking-tight group-hover:text-primary-dark transition-colors">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest">{service.uptime} uptime</span>
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
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
