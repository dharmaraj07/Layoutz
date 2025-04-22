
import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const Marquee = ({ text, className, speed = 'normal' }: MarqueeProps) => {
  const speedClass = {
    slow: 'animate-[marquee_30s_linear_infinite]',
    normal: 'animate-[marquee_20s_linear_infinite]',
    fast: 'animate-[marquee_10s_linear_infinite]',
  };

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground py-1 overflow-hidden", className)}>
      <div className="flex whitespace-nowrap">
        <div className={cn("flex gap-4", speedClass[speed])}>
          {Array(8).fill(0).map((_, i) => (
            <span key={i} className="inline-block">
              {text}
              <span className="mx-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;