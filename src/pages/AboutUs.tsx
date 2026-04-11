import React from 'react';
import { Users, Globe, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">About Zimbo Tunnel</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We are dedicated to providing fast, secure, and reliable internet access to everyone in Zimbabwe and beyond.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">To break down digital barriers and ensure unrestricted, high-speed internet access is available to all our users, regardless of their location or network restrictions.</p>
            </div>
            
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600">To become the leading provider of secure tunneling solutions in Africa, recognized for our reliability, cutting-edge technology, and exceptional customer support.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4 shadow-sm border border-gray-100">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">High Performance</h4>
              <p className="text-sm text-gray-500">Premium servers optimized for speed and low latency.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4 shadow-sm border border-gray-100">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Enhanced Security</h4>
              <p className="text-sm text-gray-500">Military-grade encryption to protect your online privacy.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-gray-900 mb-4 shadow-sm border border-gray-100">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-500">Dedicated team ready to assist you anytime you need help.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
