import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Lock, Server, Download, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollingBanner } from '../components/ScrollingBanner';
import { FlagIcons } from '../assets/flags';

const AnimatedStatCard = ({ label, endValue, suffix, className = "" }: { label: string, endValue: number, suffix: string, className?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const duration = 1500; // 1.5s
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * endValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [endValue, isVisible]);

  return (
    <div ref={ref} className={`bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center ${className}`}>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">{count}{suffix}</p>
      <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wider uppercase m-0">{label}</h3>
    </div>
  );
};

export function LandingPage() {
  const locations = [
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.ZA} className="w-4 h-4 rounded-sm object-cover" alt="ZA" /> South Africa</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.SE} className="w-4 h-4 rounded-sm object-cover" alt="SE" /> Sweden</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.UK} className="w-4 h-4 rounded-sm object-cover" alt="UK" /> United Kingdom</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.ES} className="w-4 h-4 rounded-sm object-cover" alt="ES" /> Spain</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.SG} className="w-4 h-4 rounded-sm object-cover" alt="SG" /> Singapore</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-none text-gray-700 font-semibold text-[10px] whitespace-nowrap"><img src={FlagIcons.US} className="w-4 h-4 rounded-sm object-cover" alt="US" /> United States</span>,
  ];

  const protocols = [
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Vmess</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Xray</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Vless</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">TrojanVPN</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">OpenVPN</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">WireGuard</span>,
  ];

  const cdns = [
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Cloudflare</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Sucuri</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Cloudfront</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Fastly</span>,
    <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-none font-semibold text-[10px] whitespace-nowrap">Akamai</span>,
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-brand-yellow/20 selection:text-brand-green-dark">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-44 pb-24 overflow-hidden flex flex-col items-center">
        {/* Background Gradients & Pattern */}
        <div className="absolute inset-0 -z-10 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-yellow-light/60 via-brand-green-light/20 to-transparent"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-brand-yellow-light/50 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-brand-green-light/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow-light border border-brand-yellow/20 rounded-full shadow-sm"
              >
                {/* Shimmer effect */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12"
                />
                <Zap className="w-4 h-4 text-brand-yellow relative z-10" />
                <span className="font-semibold text-brand-yellow-dark text-sm tracking-wide uppercase relative z-10">
                  Fast Tunneling Servers
                </span>
              </motion.div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-6 leading-[1.1]"
            >
              Experience seamless & stable <br className="hidden md:block" />
              <span className="text-brand-gradient">
                tunneling technology.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Built for speed, reliability, and total online privacy. Bypass restrictions and enjoy high-speed internet instantly.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-green text-white font-semibold text-lg hover:bg-brand-green-dark transition-all shadow-lg hover:shadow-xl shadow-brand-green/20 hover:shadow-brand-green/30 flex items-center justify-center gap-2 group">
                Get Started
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
              <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-brand-yellow/20 text-gray-700 font-semibold text-lg hover:bg-brand-yellow-light hover:border-brand-yellow/40 transition-all shadow-sm flex items-center justify-center gap-2">
                Explore Features
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">+</div>
              </div>
              <div className="text-sm text-gray-600 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-yellow-400 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                Trusted by <span className="font-semibold text-gray-900">700+</span> active users
              </div>
            </motion.div>
          </div>

          {/* Scrolling Banners Below CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-5xl mx-auto mb-16 flex flex-col gap-4"
          >
            <ScrollingBanner items={locations} direction="left" speed={25} />
            <ScrollingBanner items={protocols} direction="right" speed={30} />
            <ScrollingBanner items={cdns} direction="left" speed={25} />
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto w-full px-2 sm:px-0"
          >
            <AnimatedStatCard label="Supported Protocols" endValue={6} suffix="+" className="w-full" />
            <AnimatedStatCard label="Server Speed" endValue={10} suffix=" Gbps" className="w-full" />
            <div className="col-span-2 md:col-span-1 flex justify-center md:block">
              <AnimatedStatCard label="Active Users" endValue={700} suffix="+" className="w-full sm:w-[calc(50%-0.5rem)] md:w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Zimbo Tunnel?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Experience the best digital services with enterprise-grade infrastructure and top-notch security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "High-speed servers optimized for low latency and maximum throughput." },
              { icon: Lock, title: "Bank-Grade Security", desc: "Military-grade encryption keeps your data safe from prying eyes." },
              { icon: Globe, title: "Global Network", desc: "Access servers from multiple locations worldwide with 99.9% uptime." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-green-light flex items-center justify-center mb-6 text-brand-green">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Get connected in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10"></div>

            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and get access to our dashboard." },
              { step: "02", title: "Top Up Balance", desc: "Add funds easily using EcoCash or other local methods." },
              { step: "03", title: "Generate Config", desc: "Select your preferred protocol and create your server instantly." }
            ].map((item, idx) => (
              <div key={idx} className="text-center relative bg-white">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-brand-green-light rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-brand-green">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-green relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient opacity-100"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="text-white text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none">Ready to experience <br /> <span className="text-brand-yellow">true freedom?</span></h2>
              <p className="text-white/80 text-xl font-medium max-w-xl">Join thousands of users enjoying unrestricted, military-grade internet access today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link to="/register" className="px-10 py-5 rounded-2xl bg-brand-yellow text-brand-green-dark font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-2 group">
                Get Started Now
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#" className="px-10 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                <Users className="h-4 w-4" />
                Our Community
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
