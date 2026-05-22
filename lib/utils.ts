import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Optimize any Cloudinary URL with f_auto,q_auto
export function cloudinaryOptimize(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Already optimized
  if (url.includes('f_auto') || url.includes('q_auto')) return url;
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}
