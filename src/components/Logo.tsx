import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="14.6%" y1="85.4%" x2="85.4%" y2="14.6%">
          <stop offset="0%" stopColor="#22c55e" /> {/* Green */}
          <stop offset="50%" stopColor="#84cc16" /> {/* Lime */}
          <stop offset="100%" stopColor="#eab308" /> {/* Yellow */}
        </linearGradient>
      </defs>
      
      {/* Outer Ring */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500ZM250 422C344.993 422 422 344.993 422 250C422 155.007 344.993 78 250 78C155.007 78 78 155.007 78 250C78 344.993 155.007 422 250 422Z" 
        fill="url(#logo-gradient)" 
      />
      
      {/* Middle Ring */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M250 380C321.797 380 380 321.797 380 250C380 178.203 321.797 120 250 120C178.203 120 120 178.203 120 250C120 321.797 178.203 380 250 380ZM250 320C288.66 320 320 288.66 320 250C320 211.34 288.66 180 250 180C211.34 180 180 211.34 180 250C180 288.66 211.34 320 250 320Z" 
        fill="url(#logo-gradient)" 
        fillOpacity="0.85"
      />
      
      {/* Inner Circle */}
      <circle 
        cx="250" 
        cy="250" 
        r="35" 
        fill="url(#logo-gradient)" 
        fillOpacity="0.7"
      />
    </svg>
  );
}
