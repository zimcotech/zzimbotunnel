import React from 'react';
import logoImage from '../assets/logo.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img 
        src={logoImage} 
        alt="Zimbo Tunnel Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
