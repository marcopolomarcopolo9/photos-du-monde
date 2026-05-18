'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Filter {
  value: string;
  label: string;
}

interface Props {
  filters: Filter[];
  active: string;
  onChange: (value: string) => void;
}

export default function GalleryFilters({ filters, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            'relative text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-200',
            active === f.value
              ? 'text-noir'
              : 'text-creme/50 border border-white/10 hover:border-white/30 hover:text-creme'
          )}
        >
          {active === f.value && (
            <motion.div
              layoutId="filter-pill"
              className="absolute inset-0 bg-or"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          <span className="relative z-10">{f.label}</span>
        </button>
      ))}
    </div>
  );
}
