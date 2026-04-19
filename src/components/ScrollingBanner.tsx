import React from 'react';
import { motion } from 'motion/react';

interface ScrollingBannerProps {
  items: React.ReactNode[];
  direction?: 'left' | 'right';
  className?: string;
  speed?: number;
}

export function ScrollingBanner({ items, direction = 'left', className = '', speed = 20 }: ScrollingBannerProps) {
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap py-4 flex ${className}`}
      style={{ 
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}
    >
      <motion.div
        className="flex gap-8 inline-flex items-center"
        animate={{
          x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
