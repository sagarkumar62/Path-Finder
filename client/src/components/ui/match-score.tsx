import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MatchScoreProps {
  score: number; // e.g. 87
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function MatchScore({ score, size = 'md', showLabel = true, className }: MatchScoreProps) {
  const dimensions = {
    sm: { circle: 44, stroke: 4, font: 'text-xs font-bold' },
    md: { circle: 64, stroke: 5, font: 'text-sm font-extrabold' },
    lg: { circle: 88, stroke: 7, font: 'text-xl font-black' }
  };

  const { circle, stroke, font } = dimensions[size];
  const radius = (circle - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color logic based on score
  const strokeColor = score >= 80 ? '#10b981' : score >= 65 ? '#6366f1' : '#f59e0b';
  const textColor = score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-indigo-600' : 'text-amber-600';

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div className="relative inline-flex items-center justify-center" style={{ width: circle, height: circle }}>
        <svg className="transform -rotate-90" width={circle} height={circle}>
          {/* Track circle */}
          <circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className={cn('absolute text-slate-900', font)}>
          {score}%
        </span>
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={cn('font-semibold text-xs uppercase tracking-wider', textColor)}>
            {score >= 80 ? 'High Match' : score >= 65 ? 'Good Match' : 'Moderate Match'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">AI Career Fit</span>
        </div>
      )}
    </div>
  );
}
