import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Facebook, Youtube, Send, Phone, Mail, Star } from 'lucide-react';

import { Logo } from './Logo';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const PaymentBadge = ({ children, className = "bg-[#e5e5e5]" }: { children: React.ReactNode, className?: string }) => (
  <div className={`h-8 px-2.5 rounded-lg flex items-center justify-center select-none transition-all duration-300 cursor-default ${className}`}>
    {children}
  </div>
);

export function Footer() {
  return (
    <footer className="bg-surface-container border-t border-surface-variant pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={40} className="drop-shadow-sm" />
              <span className="font-bold text-xl tracking-tight text-on-surface">Zimbo Tunnel</span>
            </div>
            <p className="text-on-surface-variant max-w-sm mb-6">
              Your Reliable Partner for Digital Services and Stable Tunneling. Experience unrestricted access with our premium servers.
            </p>
            <div className="flex space-x-4">
              <a href="https://whatsapp.com/channel/0029VbCn5uAIiRovjBrSbx44" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/80 hover:text-primary transition-colors" title="WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a href="https://t.me/zimbotunnel" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/80 hover:text-primary transition-colors" title="Telegram">
                <Send className="h-5 w-5" />
              </a>
              <a href="#" className="text-on-surface-variant/80 hover:text-primary transition-colors" title="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-on-surface-variant/80 hover:text-primary transition-colors" title="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-on-surface mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">V2Ray Servers</a></li>
                <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">SSH WebSocket</a></li>
                <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Slow DNS</a></li>
                <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors">OpenVPN</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-on-surface mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about-us" className="text-on-surface-variant hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/terms-of-service" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy-policy" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><a href="https://www.trustpilot.com/review/zimbotunnel.co.zw" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">Rate us on Trustpilot</a></li>
                <li><a href="https://status.zimbotunnel.co.zw/" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors">System Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-on-surface mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                    <Send className="h-4 w-4 text-on-surface-variant/80 group-hover:text-primary transition-colors" /> Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                    <WhatsAppIcon className="h-4 w-4 text-on-surface-variant/80 group-hover:text-primary transition-colors" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href="tel:+263710452725" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 text-on-surface-variant/80 group-hover:text-primary transition-colors" /> Call Us
                  </a>
                </li>
                <li>
                  <a href="mailto:support@zimbotunnel.co.zw" className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                    <Mail className="h-4 w-4 text-on-surface-variant/80 group-hover:text-primary transition-colors" /> Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-surface-variant pt-8 flex flex-col xl:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant/80 text-sm whitespace-nowrap">
            &copy; {new Date().getFullYear()} Zimbo Tunnel. All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-center">
            <span className="text-sm text-on-surface-variant font-medium whitespace-nowrap">Accepted Payments:</span>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <PaymentBadge>
                <span className="font-bold text-xs tracking-tight"><span className="text-[#005b9f]">Eco</span><span className="text-[#e3182d]">Cash</span></span>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex items-center gap-1.5">
                  <div className="grid grid-cols-2 gap-[1.5px]">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#eeb715]"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-[#8b529d]"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-[#46b788]"></div>
                    <div className="w-[5px] h-[5px] rounded-full bg-[#d91e27]"></div>
                  </div>
                  <span className="font-bold text-[#0b214a] text-xs tracking-tight">InnBucks<sup className="text-[6px] font-normal">®</sup></span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <span className="font-bold text-xs tracking-tight"><span className="text-[#e31837]">tele</span><span className="text-black">cash</span></span>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex flex-col items-center justify-center leading-none gap-0.5 mt-0.5">
                  <div className="w-3.5 h-3.5 rounded-full border-[2px] border-[#4cb848]"></div>
                  <span className="font-medium text-[#203c89] text-[7.5px] mb-0.5">O'mari</span>
                </div>
              </PaymentBadge>

              <PaymentBadge>
                <div className="flex flex-col items-center justify-center leading-none mt-0.5">
                  <span className="font-extrabold italic text-xs leading-none text-black">1</span>
                  <div className="flex font-bold italic text-[6.5px] tracking-tighter mt-[1px]">
                    <span className="text-black">M</span><span className="text-[#e31837]">O</span><span className="text-black">NEY</span>
                  </div>
                </div>
              </PaymentBadge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-on-surface-variant/80 whitespace-nowrap">
            <span>Supported by <a href="https://zigssh.com" target="_blank" rel="noopener noreferrer" className="hover:text-on-surface-variant hover:underline transition-colors font-medium">ZiG SSH</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
