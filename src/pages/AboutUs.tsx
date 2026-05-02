import React from 'react';
import { Users, Globe, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface hover:bg-surface-container-high transition-colors rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-md border border-brand-yellow/10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-on-surface tracking-tighter mb-6 underline decoration-brand-yellow decoration-4 underline-offset-8">About <span className="text-primary">Zimbo</span> <span className="text-secondary-dark">Tunnel</span></h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed italic">"Empowering Zimbabwe through unrestricted digital connectivity and secure tunneling solutions."</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-primary rounded-3xl p-8 border border-white/10 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                <Globe className="h-20 w-20" />
              </div>
              <div className="w-14 h-14 rounded-3xl bg-surface hover:bg-surface-container-high transition-colors/20 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/30">
                <Globe className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Our Mission</h3>
              <p className="text-white/80 leading-relaxed font-medium">To break down digital barriers and ensure unrestricted, high-speed internet access is available to all our users across Zimbabwe and beyond.</p>
            </div>
            
            <div className="bg-secondary rounded-3xl p-8 border border-brand-yellow/20 shadow-xl text-primary-dark relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform text-primary-dark">
                <Shield className="h-20 w-20" />
              </div>
              <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary-dark mb-6 border border-primary-dark/10">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">Our Vision</h3>
              <p className="text-primary-dark/80 leading-relaxed font-bold">To become Africa's premier provider of secure digital solutions, recognized for reliability, innovation, and elite support.</p>
            </div>
          </div>
          
          <div className="pt-10 border-t border-surface-container-highest">
            <h2 className="text-2xl font-bold text-on-surface mb-10 text-center tracking-tight uppercase">Why Trust Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'High Octane', desc: 'Elite servers optimized for minimum latency.' },
                { icon: Shield, title: 'Iron Clad', desc: 'Military-grade encryption for total privacy.' },
                { icon: Users, title: 'Always On', desc: 'Dedicated 24/7 support for our community.' }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-surface-container flex items-center justify-center text-on-surface mb-5 shadow-sm border border-surface-container-highest group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-on-surface mb-2 tracking-tight uppercase text-sm">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant font-bold leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
