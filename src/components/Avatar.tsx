import { useState } from 'react';
import { cn } from '../utils/cn';
import { initials } from '../utils/format';

interface AvatarProps {
  src?: string;
  first?: string;
  last?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ src, first, last, size = 'md', className }: AvatarProps) {
  const [error, setError] = useState(false);
  const show = src && !error;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-500/15 dark:text-brand-300',
        sizeMap[size],
        className
      )}
    >
      {show ? (
        <img src={src} alt={`${first} ${last}`} className="h-full w-full object-cover" onError={() => setError(true)} loading="lazy" />
      ) : (
        initials(first, last)
      )}
    </span>
  );
}
