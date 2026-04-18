import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  const [error, setError] = React.useState(false);

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden shrink-0 rounded-xl transition-all ${className}`} 
      style={{ width: size, height: size }}
    >
      {!error ? (
        <img 
          src="/logo.png" 
          alt="Zimbo" 
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-brand-green flex items-center justify-center text-white font-black">
          <span style={{ fontSize: size * 0.6 }}>Z</span>
        </div>
      )}
    </div>
  );
}
