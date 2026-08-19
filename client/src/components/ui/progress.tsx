import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  barColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Progress({ value, barColor = 'bg-indigo-600', size = 'md', className, ...props }: ProgressProps) {
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-slate-100', sizes[size], className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-500 ease-out rounded-full', barColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
