import React from 'react';
import { Shield, Facebook, Youtube, Send, Phone, Mail, Star } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const PaymentBadge = ({ children, className = "bg-white" }: { children: React.ReactNode, className?: string }) => (
  <div className={`h-7 px-2 border border-gray-200 rounded flex items-center justify-center shadow-sm select-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-default ${className}`}>
    {children}
  </div>
);

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900">Zimbo Tunnel</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-6">
              Fast, secure, and reliable internet tunneling services in Zimbabwe. Experience unrestricted access with our premium servers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" title="Telegram">
                <Send className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" title="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">V2Ray Servers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">SSH WebSocket</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Slow DNS</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">OpenVPN</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                  <Send className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" /> Telegram
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                  <WhatsAppIcon className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" /> Call Us
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col xl:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm whitespace-nowrap">
            &copy; {new Date().getFullYear()} Zimbo Tunnel. All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-center">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Accepted Payments:</span>
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
                  <span className="font-bold text-[#0b214a] text-xs tracking-tight">InnBucks<sup className="text-[6px] font-normal">®</sup></span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex flex-col items-center justify-center leading-none gap-0.5">
                  <div className="w-3 h-3 rounded-full border-[2px] border-[#4cb848]"></div>
                  <span className="font-medium text-[#203c89] text-[7px]">O'mari</span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="font-black italic text-xs leading-none">1</span>
                  <div className="flex font-black italic text-[6px] tracking-tighter mt-0.5">
                    <span className="text-black">M</span><span className="text-[#f38b22]">O</span><span className="text-black">NEY</span>
                  </div>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <span className="font-bold text-xs tracking-tight"><span className="text-[#e31837]">tele</span><span className="text-black">cash</span></span>
              </PaymentBadge>

              <PaymentBadge className="bg-[#fff200]">
                <div className="flex flex-col items-center justify-center leading-none font-bold text-[7px] tracking-widest text-black">
                  <span>ZIM</span>
                  <span>SWITCH</span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <span className="font-bold italic text-[#142184] text-sm tracking-tighter">VISA</span>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex flex-col items-center justify-center leading-none gap-0.5">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#eb001b] opacity-90 mix-blend-multiply"></div>
                    <div className="w-3 h-3 rounded-full bg-[#f79e1b] opacity-90 mix-blend-multiply"></div>
                  </div>
                  <span className="text-[6px] font-medium text-black">mastercard</span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <span className="font-bold italic text-[#003087] text-xs">Pay<span className="text-[#0079c1]">Pal</span></span>
              </PaymentBadge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-400 whitespace-nowrap">
            <span>Supported by <a href="https://zigssh.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 hover:underline transition-colors font-medium">ZiG SSH</a></span>
            
            <a href="https://www.trustpilot.com/review/yourdomain.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#00b67a]/40 transition-all group">
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1 group-hover:text-gray-700 transition-colors">Review us on</span>
                <div className="flex items-center gap-1 leading-none">
                  <div className="w-3.5 h-3.5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                    <Star className="h-2.5 w-2.5 fill-white text-white" />
                  </div>
                  <span className="font-bold text-sm text-gray-900 tracking-tight leading-none">Trustpilot</span>
                </div>
              </div>
              <div className="flex gap-0.5 border-l border-gray-100 pl-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                    <Star className="h-3.5 w-3.5 fill-white text-white" />
                  </div>
                ))}
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
