import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../utils/cn';
import { formatPercent } from '../utils/format';

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: LucideIcon;
  index?: number;
}

export function KpiCard({ label, value, change, trend, icon: Icon, index = 0 }: KpiCardProps) {
  const up = trend === 'up';
  return (
    <Card hover className="p-5 animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {formatPercent(change)}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
      </div>
    </Card>
  );
}
