import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Lock, Server, Download, Users, ArrowRight, CheckCircle2, ChevronDown, Gamepad2, ShieldCheck } from 'lucide-react';
import { ScrollingBanner } from '../components/ScrollingBanner';
import { FlagIcons } from '../assets/flags';

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <div className="bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-primary font-bold text-sm">?</span>
        </div>
        <h3 className="font-semibold text-on-surface text-lg leading-snug">{question}</h3>
      </div>
      <p className="text-on-surface-variant leading-relaxed max-w-none pl-12 flex-grow">
        {answer}
      </p>
    </div>
  );
};

export function LandingPage() {
  useEffect(() => {
    // Inject Tawk.to Script
    if (!window.Tawk_API) {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/69d40f572bcfb31c3daa2b10/1jli5ns9h';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    } else if (window.Tawk_API && window.Tawk_API.showWidget) {
      window.Tawk_API.showWidget();
    }

    return () => {
      // Hide the widget when navigating away from the Landing Page
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  const locations = [
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.ZA} className="w-4 h-4 rounded-sm object-cover" alt="ZA" /> South Africa</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.SE} className="w-4 h-4 rounded-sm object-cover" alt="SE" /> Sweden</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.UK} className="w-4 h-4 rounded-sm object-cover" alt="UK" /> United Kingdom</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.ES} className="w-4 h-4 rounded-sm object-cover" alt="ES" /> Spain</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.SG} className="w-4 h-4 rounded-sm object-cover" alt="SG" /> Singapore</span>,
    <span className="flex items-center gap-1.5 px-3 py-1 bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-on-surface font-semibold text-[11px] whitespace-nowrap"><img src={FlagIcons.US} className="w-4 h-4 rounded-sm object-cover" alt="US" /> United States</span>,
  ];

  const protocols = [
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">Vmess</span>,
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">Xray</span>,
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">Vless</span>,
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">TrojanVPN</span>,
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">OpenVPN</span>,
    <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary-dark rounded-full font-semibold text-[11px] whitespace-nowrap">WireGuard</span>,
  ];

  const cdns = [
    <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-900 rounded-full font-semibold text-[11px] whitespace-nowrap">Cloudflare</span>,
    <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-900 rounded-full font-semibold text-[11px] whitespace-nowrap">Sucuri</span>,
    <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-900 rounded-full font-semibold text-[11px] whitespace-nowrap">Cloudfront</span>,
    <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-900 rounded-full font-semibold text-[11px] whitespace-nowrap">Fastly</span>,
    <span className="px-3 py-1 bg-orange-50 border border-orange-100 text-orange-900 rounded-full font-semibold text-[11px] whitespace-nowrap">Akamai</span>,
  ];

  return (
    <div className="min-h-screen bg-surface hover:bg-surface-container-high transition-colors selection:bg-secondary/20 selection:text-primary-dark">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-44 pb-24 overflow-hidden flex flex-col items-center">
        {/* Background Gradients & Pattern */}
        <div className="absolute inset-0 -z-10 bg-surface hover:bg-surface-container-high transition-colors bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-yellow-light/60 via-brand-green-light/20 to-transparent"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-secondary-light/50 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-primary-container/50 rounded-full blur-3xl"></div>
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
                className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 bg-secondary-light border border-brand-yellow/20 rounded-full shadow-sm"
              >
                {/* Shimmer effect */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12"
                />
                <Zap className="w-4 h-4 text-secondary relative z-10" />
                <span className="font-semibold text-secondary-dark text-sm tracking-wide uppercase relative z-10">
                  Fast Tunneling Servers
                </span>
              </motion.div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-on-surface tracking-tighter mb-6 leading-[1.1]"
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
              className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Built for speed, reliability, and total online privacy. Bypass restrictions and enjoy high-speed internet instantly.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group hover:-translate-y-0.5">
                Get Started
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
              <a href="https://play.google.com/store/apps/details?id=com.zigtunnel" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface border border-surface-container-highest text-on-surface font-semibold text-lg hover:bg-surface-container-high transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 group hover:-translate-y-0.5">
                <Download className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                <span>Download Zimbo Tunnel Apk</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-row items-center justify-center gap-4 sm:gap-6 pt-4 mx-auto max-w-fit w-full overflow-hidden"
            >
              {/* Trustpilot */}
              <a href="https://www.trustpilot.com/review/zimbotunnel.co.zw" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-1 justify-center shrink-0 hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-1.5 h-5">
                  <svg className="w-5 h-5 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.2 8.7l-7.3-.6L12 1.3 10 8.1l-7.3.6 5.5 4.7-1.6 7.1L12 16.5l5.5 3.9-1.6-7.1z"/>
                  </svg>
                  <span className="font-bold text-on-surface text-sm sm:text-base tracking-tight leading-none mt-0.5">Trustpilot</span>
                </div>
                <div className="flex gap-[1px]">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#00b67a] p-[2px] shadow-sm rounded-[1px]">
                      <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                  ))}
                  <div className="bg-[#00b67a] p-[2px] relative overflow-hidden shadow-sm rounded-[1px]">
                     <div className="absolute inset-0 bg-[#00b67a]/40 w-1/2 left-1/2"></div>
                     <svg className="w-3 h-3 text-white fill-current relative z-10" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                </div>
              </a>

              {/* Vertical Divider 1 */}
              <div className="w-[1px] h-7 bg-surface-container-highest/80 shrink-0"></div>
              
              {/* G2 */}
              <div className="flex flex-col items-start gap-1 justify-center shrink-0">
                <div className="flex items-center gap-1.5 h-5">
                  <div className="w-5 h-5 rounded-full bg-[#ff492c] flex items-center justify-center text-white font-bold text-[10px] relative shadow-sm leading-none shrink-0">
                    G<span className="text-[7px] font-bold absolute top-[3px] right-[2.5px]">2</span>
                  </div>
                  <span className="font-bold text-on-surface text-sm sm:text-base tracking-tight leading-none mt-0.5">G2</span>
                </div>
                <div className="flex text-[#ff492c] gap-0.5">
                  {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                  <svg className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] text-[#ff492c]" viewBox="0 0 20 20">
                     <defs>
                        <linearGradient id="halfG2Star2">
                           <stop offset="50%" stopColor="#ff492c" />
                           <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                     </defs>
                     <path stroke="currentColor" strokeWidth="1" fill="url(#halfG2Star2)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>

              {/* Vertical Divider 2 */}
              <div className="w-[1px] h-7 bg-surface-container-highest/80 shrink-0"></div>

              {/* Capterra */}
              <div className="flex flex-col items-start gap-1 justify-center shrink-0">
                <div className="flex items-center gap-1.5 h-5">
                   <svg viewBox="0 0 100 100" fill="none" className="rotate-[-10deg] w-5 h-5">
                     <path d="M10 30 L50 50 L50 100 Z" fill="#E84855" />
                     <path d="M10 30 L50 50 L90 10 Z" fill="#F9A436" />
                     <path d="M90 10 L50 50 L50 100 Z" fill="#024D7B" />
                     <path d="M90 10 L50 50 L90 50 Z" fill="#50B4DD" />
                   </svg>
                   <span className="font-bold text-on-surface text-sm sm:text-base tracking-tight leading-none mt-0.5">Capterra</span>
                </div>
                <div className="flex gap-0.5 text-[#F49C1E]">
                  {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                  <svg className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] text-[#F49C1E]" viewBox="0 0 20 20">
                     <defs>
                        <linearGradient id="halfCapterraStar">
                           <stop offset="50%" stopColor="#F49C1E" />
                           <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                     </defs>
                     <path stroke="currentColor" strokeWidth="1" fill="url(#halfCapterraStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
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

          {/* Services Section (Replacing Stats) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-6xl mx-auto w-full mt-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 text-left">
              <div className="lg:col-span-2 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-6">Zimbo Tunnel <span className="text-primary">Services</span></h2>
                <p className="text-on-surface-variant mb-6 leading-relaxed text-lg">
                  We provide a variety of high-quality tunneling services for your network needs. With the latest technology and 24/7 support, we're committed to providing the best experience for accessing devices and routers from anywhere.
                </p>
                <p className="text-on-surface-variant leading-relaxed text-lg">
                  With reliable server infrastructure and a stable network, we guarantee the best connection quality for every service. Enjoy easy access and optimal performance for your networking needs.
                </p>
              </div>
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-3xl p-6 flex gap-4 sm:gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary-container w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gamepad2 className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">VPN Game</h3>
                    <p className="text-on-surface-variant leading-relaxed">L2TP/IPSec VPN service routing to game servers for better gaming experience.</p>
                  </div>
                </div>
                <div className="bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-3xl p-6 flex gap-4 sm:gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-secondary-light w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-6 h-6 text-secondary-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">VPN Remote</h3>
                    <p className="text-on-surface-variant leading-relaxed">VPN service (SSTP or L2TP) to access your devices and routers anywhere anytime.</p>
                  </div>
                </div>
                <div className="bg-surface hover:bg-surface-container-high transition-colors border border-surface-container-highest rounded-3xl p-6 flex gap-4 sm:gap-6 items-start shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Server className="w-6 h-6 text-orange-500" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-2">Mikhmon Online</h3>
                    <p className="text-on-surface-variant leading-relaxed">Mikhmon Online Hosting Service for monitoring and printing vouchers anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-on-surface mb-4"
            >
              Why Choose Zimbo Tunnel?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-on-surface-variant max-w-2xl mx-auto"
            >
              Experience the best digital services with enterprise-grade infrastructure and top-notch security.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "High-speed servers optimized for low latency and maximum throughput." },
              { icon: Lock, title: "Bank-Grade Security", desc: "Military-grade encryption keeps your data safe from prying eyes." },
              { icon: Globe, title: "Global Network", desc: "Access servers from multiple locations worldwide with 99.9% uptime." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-surface hover:bg-surface-container-high transition-colors p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-surface-container-highest hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-6 text-primary transform transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-3">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-surface hover:bg-surface-container-high transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-on-surface mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-on-surface-variant max-w-2xl mx-auto"
            >
              Get connected in three simple steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-surface-container-high -z-10 overflow-hidden rounded-full">
              <motion.div 
                initial={{ x: "-100%" }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                className="w-full h-full bg-primary/30"
              />
            </div>

            {[
              { step: "01", title: "Create Account", desc: "Sign up for free and get access to our dashboard." },
              { step: "02", title: "Top Up Balance", desc: "Add funds easily using EcoCash or other local methods." },
              { step: "03", title: "Generate Config", desc: "Select your preferred protocol and create your server instantly." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="text-center relative bg-surface hover:bg-surface-container-high transition-colors group cursor-default"
              >
                <div className="w-24 h-24 mx-auto bg-surface hover:bg-surface-container-high transition-colors border-4 border-surface-container-highest group-hover:border-primary-light rounded-full flex items-center justify-center mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:shadow-[0_8px_24px_rgba(0,b6,122,0.15)] transition-all duration-300">
                  <span className="text-2xl font-bold text-on-surface-variant/80 group-hover:text-primary transition-colors duration-300">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <p className="text-on-surface-variant">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-surface-container border-t border-surface-container-highest relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary-container/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-96 h-96 bg-secondary-light/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold text-xs tracking-widest uppercase mb-4"
            >
              Support & Answers
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-6 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Everything you need to know about Zimbo Tunnel, our services, and how we keep your connection secure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <FaqItem 
              question="What makes Zimbo Tunnel different from other VPNs?" 
              answer="We offer highly optimized, enterprise-grade servers specifically tailored for low latency and stability. Our focus is on providing reliable tunneling protocols like V2Ray and OpenVPN with military-grade encryption." 
            />
            <FaqItem 
              question="Which payment methods do you accept?" 
              answer="For your convenience, we support local payment solutions including EcoCash, InnBucks, Telecash, O'mari, and One Money, meaning you don't need international credit cards to top up." 
            />
            <FaqItem 
              question="Can I use my configuration on multiple devices?" 
              answer="Yes, but not at the exact same time using the same configuration. You will need to generate unique configs for each device to maintain a stable, high-quality connection." 
            />
            <FaqItem 
              question="Are my browsing activities logged?" 
              answer="No. Your privacy is our priority. We maintain a strict no-logs policy, meaning we do not track, store, or share your browsing history or data." 
            />
            <FaqItem 
              question="How long does it take for my deposit to reflect?" 
              answer="Deposits made via our supported mobile money platforms are typically processed instantly and reflect in your dashboard balance within a few seconds." 
            />
            <FaqItem 
              question="Do you offer customer support if I run into issues?" 
              answer="Absolutely. Our dedicated support team is available 24/7 via WhatsApp and Telegram to help you configure your devices or troubleshoot any connection problems you might face." 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-variant opacity-100"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-surface hover:bg-surface-container-high transition-colors/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-surface hover:bg-surface-container-high transition-colors/5 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="text-white text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-none">Ready to experience <br /> <span className="text-secondary">true freedom?</span></h2>
              <p className="text-white/80 text-xl font-medium max-w-xl">Join thousands of users enjoying unrestricted, military-grade internet access today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link to="/register" className="px-10 py-5 rounded-3xl bg-secondary text-primary-dark font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-2 group">
                Get Started Now
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#" className="px-10 py-5 rounded-3xl bg-surface hover:bg-surface-container-high transition-colors/10 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-surface hover:bg-surface-container-high transition-colors/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md">
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
