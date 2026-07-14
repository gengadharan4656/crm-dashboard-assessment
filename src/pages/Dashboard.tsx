import { DollarSign, Users, ShoppingCart, Percent, ArrowUpRight, UserPlus, CreditCard, Package } from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { CustomerGrowthChart } from '../components/charts/CustomerGrowthChart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/Avatar';
import { formatRelativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const activities = [
  { id: 1, type: 'order', message: 'New order #1048 placed by Sarah Chen', actor: 'Sarah Chen', time: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, type: 'customer', message: 'James Wilson signed up as a new customer', actor: 'James Wilson', time: new Date(Date.now() - 32 * 60000).toISOString() },
  { id: 3, type: 'payment', message: 'Payment of $1,240 received from Acme Inc', actor: 'Acme Inc', time: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 4, type: 'order', message: 'Order #1042 was marked as delivered', actor: 'System', time: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 5, type: 'customer', message: 'Maria Garcia upgraded to Pro plan', actor: 'Maria Garcia', time: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: 6, type: 'system', message: 'Monthly revenue report generated', actor: 'System', time: new Date(Date.now() - 24 * 3600000).toISOString() },
];

const activityIcon = {
  order: { icon: Package, wrap: 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-300' },
  customer: { icon: UserPlus, wrap: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-300' },
  payment: { icon: CreditCard, wrap: 'bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-300' },
  system: { icon: ArrowUpRight, wrap: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Good morning, Alex</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard index={0} label="Total Revenue" value="$1.28M" change={24.6} trend="up" icon={DollarSign} />
        <KpiCard index={1} label="Customers" value="4,084" change={12.8} trend="up" icon={Users} />
        <KpiCard index={2} label="Orders" value="12,492" change={8.2} trend="up" icon={ShoppingCart} />
        <KpiCard index={3} label="Conversion" value="3.4%" change={-1.2} trend="down" icon={Percent} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <CustomerGrowthChart />
        </div>
      </div>

      <Card className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
        <CardHeader>
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events across your workspace</CardDescription>
          </div>
          <button className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">View all</button>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {activities.map((a) => {
              const { icon: Icon, wrap } = activityIcon[a.type as keyof typeof activityIcon];
              return (
                <li key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', wrap)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-700 dark:text-slate-200">{a.message}</p>
                    <p className="text-xs text-slate-400">{formatRelativeTime(a.time)}</p>
                  </div>
                  <Avatar first={a.actor.split(' ')[0]} last={a.actor.split(' ')[1]} size="xs" />
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
