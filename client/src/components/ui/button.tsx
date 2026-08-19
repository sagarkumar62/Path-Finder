import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer';

    const variants = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-200 border border-indigo-700/20',
      secondary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-200',
      outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-400',
      ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
      destructive: 'bg-rose-600 hover:bg-rose-700 text-white',
      ai: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white shadow-glow-indigo hover:opacity-95'
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-lg'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
