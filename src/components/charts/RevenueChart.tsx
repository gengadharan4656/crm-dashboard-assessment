import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

const data = [
  { month: 'Jan', revenue: 42000, orders: 240 },
  { month: 'Feb', revenue: 51000, orders: 290 },
  { month: 'Mar', revenue: 48000, orders: 270 },
  { month: 'Apr', revenue: 67000, orders: 360 },
  { month: 'May', revenue: 72000, orders: 410 },
  { month: 'Jun', revenue: 89000, orders: 480 },
  { month: 'Jul', revenue: 96000, orders: 530 },
  { month: 'Aug', revenue: 84000, orders: 470 },
  { month: 'Sep', revenue: 102000, orders: 560 },
  { month: 'Oct', revenue: 118000, orders: 640 },
  { month: 'Nov', revenue: 132000, orders: 720 },
  { month: 'Dec', revenue: 148000, orders: 810 },
];

export function RevenueChart() {
  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
      <CardHeader>
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the past year</CardDescription>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          +24.6%
        </span>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  boxShadow: '0 4px 16px -2px rgb(0 0 0 / 0.08)',
                }}
                formatter={(v) => [`${Number(v).toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#rev)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
