import {
  BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

const data = [
  { month: 'Jan', new: 120, total: 1240 },
  { month: 'Feb', new: 145, total: 1385 },
  { month: 'Mar', new: 132, total: 1517 },
  { month: 'Apr', new: 178, total: 1695 },
  { month: 'May', new: 205, total: 1900 },
  { month: 'Jun', new: 240, total: 2140 },
  { month: 'Jul', new: 268, total: 2408 },
  { month: 'Aug', new: 232, total: 2640 },
  { month: 'Sep', new: 295, total: 2935 },
  { month: 'Oct', new: 340, total: 3275 },
  { month: 'Nov', new: 388, total: 3663 },
  { month: 'Dec', new: 421, total: 4084 },
];

export function CustomerGrowthChart() {
  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>
      <CardHeader>
        <div>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>New customers per month</CardDescription>
        </div>
        <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          +12.8%
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                cursor={{ fill: '#6366f110' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  boxShadow: '0 4px 16px -2px rgb(0 0 0 / 0.08)',
                }}
                formatter={(v) => [`${v} customers`, 'New']}
              />
              <Bar dataKey="new" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
