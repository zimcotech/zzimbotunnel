import React from 'react';
import { Users, Globe, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-[#fcfdf2] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-brand-green/5 border border-brand-yellow/10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6 underline decoration-brand-yellow decoration-4 underline-offset-8">About <span className="text-brand-green">Zimbo</span> <span className="text-brand-yellow-dark">Tunnel</span></h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">"Empowering Zimbabwe through unrestricted digital connectivity and secure tunneling solutions."</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-brand-green-dark rounded-3xl p-8 border border-white/10 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                <Globe className="h-20 w-20" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/30">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Our Mission</h3>
              <p className="text-white/80 leading-relaxed font-medium">To break down digital barriers and ensure unrestricted, high-speed internet access is available to all our users across Zimbabwe and beyond.</p>
            </div>
            
            <div className="bg-brand-yellow rounded-3xl p-8 border border-brand-yellow/20 shadow-xl text-brand-green-dark relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-brand-green-dark">
                <Shield className="h-20 w-20" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark mb-6 border border-brand-green-dark/10">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Our Vision</h3>
              <p className="text-brand-green-dark/80 leading-relaxed font-bold">To become Africa's premier provider of secure digital solutions, recognized for reliability, innovation, and elite support.</p>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-10 text-center tracking-tight uppercase">Why Trust Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'High Octane', desc: 'Elite servers optimized for minimum latency.' },
                { icon: Shield, title: 'Iron Clad', desc: 'Military-grade encryption for total privacy.' },
                { icon: Users, title: 'Always On', desc: 'Dedicated 24/7 support for our community.' }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center text-gray-900 mb-5 shadow-sm border border-gray-100 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className="font-black text-gray-900 mb-2 tracking-tight uppercase text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
