import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  // Ensure we don't have double slashes if BASE_URL ends with one
  const baseUrl = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL;
  const logoUrl = `${baseUrl}/logo.png`;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img 
        src={logoUrl} 
        alt="Zimbo Tunnel Logo" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
