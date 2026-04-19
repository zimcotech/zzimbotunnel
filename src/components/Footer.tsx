import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Youtube, Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

import { Logo } from './Logo';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const PaymentBadge = ({ children, className = "bg-white border-gray-200" }: { children: React.ReactNode, className?: string }) => (
  <div className={`h-7 px-2 border rounded flex items-center justify-center shadow-sm select-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-default ${className}`}>
    {children}
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-12 font-sans overflow-hidden border-t border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-8">
        
        {/* Top Logo Area */}
        <div className="flex flex-col gap-5 mb-14">
          <div className="flex items-center gap-3">
             <Logo size={48} className="drop-shadow-sm" />
             <span className="font-bold text-3xl tracking-tight text-gray-900">Zimbo Tunnel</span>
          </div>
          <p className="text-gray-600 max-w-xl leading-relaxed text-[15px]">
            Your Reliable Partner for Digital Services and Stable Tunneling. Experience unrestricted access with our premium servers.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Left Column: Get In Touch */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col">
             <h3 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h3>
             <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div className="flex flex-col text-gray-600 text-[15px] leading-relaxed">
                    <span>123 Main Street, CBD</span>
                    <span>Harare, Zimbabwe</span>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-brand-green shrink-0" />
                  <a href="mailto:support@zimbotunnel.co.zw" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">support@zimbotunnel.co.zw</a>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-brand-green shrink-0" />
                  <a href="tel:+263771234567" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">+263 77 123 4567</a>
                </li>
             </ul>

             <div className="mt-8 flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-lg py-2.5 px-4 w-fit hover:shadow-md transition-shadow">
                <div className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-green/50 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-brand-green/20 animate-pulse"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green border-[1px] border-white/80 shadow-[0_0_8px_rgba(22,163,74,0.8)]"></span>
                </div>
                <span className="text-gray-700 font-medium text-sm">All services are online</span>
             </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-bold text-[15px] mb-6 flex items-center border-l-2 border-brand-green pl-3 leading-none h-4">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/about-us" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">About Us</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Platform</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Blog</a></li>
                <li><a href="/#faq" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">FAQs</a></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-900 font-bold text-[15px] mb-6 flex items-center border-l-2 border-brand-green pl-3 leading-none h-4">Products</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">V2Ray Servers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">SSH WebSocket</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Slow DNS</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">OpenVPN</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Mikhmon Hosting</a></li>
              </ul>
            </div>

            <div className="flex flex-col">
               <h3 className="text-gray-900 font-bold text-[15px] mb-6 flex items-center border-l-2 border-brand-green pl-3 leading-none h-4">Use Cases</h3>
               <ul className="space-y-4">
                 <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Gaming VPN</a></li>
                 <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Remote Access</a></li>
                 <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Bypass Restrictions</a></li>
                 <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Secure Browsing</a></li>
                 <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Router Management</a></li>
               </ul>
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-900 font-bold text-[15px] mb-6 flex items-center border-l-2 border-brand-green pl-3 leading-none h-4">Legal</h3>
              <ul className="space-y-4">
                <li><Link to="/terms-of-service" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Privacy Policy</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Refund Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-brand-green transition-colors text-[15px]">Law Enforcement</a></li>
              </ul>
            </div>

          </div>
        </div>
        
        {/* Bottom Section: Social Media & Copyright & Payments */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-8 border-t border-gray-200">
           
           <div className="flex flex-row items-center gap-4 sm:gap-6">
              <span className="text-gray-900 font-bold text-[14px] sm:text-[15px] whitespace-nowrap flex items-center border-l-2 border-brand-green pl-3 leading-none h-4">Social Media</span>
              <div className="flex flex-wrap gap-2">
                 <a href="#" className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-green hover:border-brand-green/40 transition-all">
                    <Youtube className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-green hover:border-brand-green/40 transition-all">
                    <Facebook className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-green hover:border-brand-green/40 transition-all">
                    <WhatsAppIcon className="w-5 h-5" />
                 </a>
                 <a href="#" className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-green hover:border-brand-green/40 transition-all">
                    <Send className="w-5 h-5" />
                 </a>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
             <div className="flex flex-wrap justify-center items-center gap-2">
               <PaymentBadge>
                 <span className="font-bold text-xs tracking-tight"><span className="text-[#005b9f]">Eco</span><span className="text-[#e3182d]">Cash</span></span>
               </PaymentBadge>

               <PaymentBadge>
                 <div className="flex items-center gap-1">
                   <div className="grid grid-cols-2 gap-[1.5px]">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#eeb715]"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#8b529d]"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#46b788]"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#d91e27]"></div>
                   </div>
                   <span className="font-bold text-[#0b214a] text-xs tracking-tight">InnBucks</span>
                 </div>
               </PaymentBadge>

               <PaymentBadge>
                 <span className="font-bold text-xs tracking-tight"><span className="text-[#e31837]">tele</span><span className="text-black">cash</span></span>
               </PaymentBadge>

               <PaymentBadge>
                 <div className="flex flex-col items-center justify-center leading-none gap-0.5">
                   <div className="w-3 h-3 rounded-full border-[2px] border-[#4cb848]"></div>
                   <span className="font-medium text-[#203c89] text-[7px]">O'mari</span>
                 </div>
               </PaymentBadge>
             </div>
           </div>

           <div className="text-gray-500 text-sm whitespace-nowrap text-center lg:text-right">
             <span>&copy; {new Date().getFullYear()} Zimbo Tunnel.<br className="sm:hidden" /> Supported by <a href="https://zigssh.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-green text-gray-700 transition-colors">ZiG SSH</a></span>
           </div>

        </div>
      </div>
    </footer>
  );
}
