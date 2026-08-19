import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(val: number): string {
  return `${Math.round(val)}%`;
}

export function formatTimeEstimate(weeks: number): string {
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.round((weeks / 4) * 10) / 10;
  return `${months} months`;
}

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
