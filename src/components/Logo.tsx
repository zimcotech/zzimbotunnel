import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
      <img 
        src="/logo.png" 
        alt="Zimbo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // If the image fails to load, we can at least show a placeholder or hide the broken icon
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}
