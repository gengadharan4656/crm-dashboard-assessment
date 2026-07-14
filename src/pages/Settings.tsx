import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Building2, Globe, Sun, Moon, Check, RotateCcw, Bell, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/Avatar';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { toast } from '../components/Toast';
import { sleep } from '../utils/format';
import { cn } from '../utils/cn';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  company: z.string().min(1, 'Company is required'),
  website: z.string().url('Enter a valid URL').or(z.literal('')),
  bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
});

type FormData = z.infer<typeof schema>;

export default function Settings() {
  const { user, login } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const defaultName = user?.name ?? 'Alex Morgan';
  const [first, ...rest] = defaultName.split(' ');

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: defaultName, email: user?.email ?? 'alex@nimbus.app', phone: '+1 (555) 014-2280', company: 'Nimbus Inc', website: 'https://nimbus.app', bio: 'Product leader building delightful SaaS experiences.' },
  });

  const bio = watch('bio') ?? '';

  const onSubmit = async (data: FormData) => {
    await sleep(700);
    login({ email: data.email, name: data.fullName }, true);
    toast.success('Profile saved successfully.');
  };

  const onReset = () => { reset(); toast.info('Form reset to original values.'); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your profile and workspace preferences.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><div><CardTitle>Profile</CardTitle><CardDescription>Update your personal information</CardDescription></div></CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Avatar first={first} last={rest.join(' ')} size="lg" />
                <div><Button variant="outline" size="sm">Change photo</Button><p className="mt-1.5 text-xs text-slate-400">JPG, PNG or GIF. Max 2MB.</p></div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.fullName?.message}><Input error={!!errors.fullName} leftIcon={<User className="h-4 w-4" />} {...register('fullName')} /></Field>
                  <Field label="Email" error={errors.email?.message}><Input type="email" error={!!errors.email} leftIcon={<Mail className="h-4 w-4" />} {...register('email')} /></Field>
                  <Field label="Phone" error={errors.phone?.message}><Input error={!!errors.phone} leftIcon={<Phone className="h-4 w-4" />} {...register('phone')} /></Field>
                  <Field label="Company" error={errors.company?.message}><Input error={!!errors.company} leftIcon={<Building2 className="h-4 w-4" />} {...register('company')} /></Field>
                  <Field label="Website" error={errors.website?.message}><Input placeholder="https://" error={!!errors.website} leftIcon={<Globe className="h-4 w-4" />} {...register('website')} /></Field>
                </div>
                <Field label="Bio" error={errors.bio?.message}>
                  <textarea {...register('bio')} rows={3} className={cn('w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors', 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20', 'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700', errors.bio && 'border-red-400 focus:ring-red-500/20')} maxLength={160} />
                  <p className="mt-1 text-right text-xs text-slate-400">{bio.length}/160</p>
                </Field>
                <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Button type="submit" loading={isSubmitting} leftIcon={<Check className="h-4 w-4" />}>Save changes</Button>
                  <Button type="button" variant="outline" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" />}>Reset</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><div><CardTitle>Appearance</CardTitle><CardDescription>Customize your theme</CardDescription></div></CardHeader>
            <CardContent className="space-y-2">
              <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={Sun} label="Light" desc="Bright and crisp" />
              <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={Moon} label="Dark" desc="Easy on the eyes" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><div><CardTitle>Notifications</CardTitle><CardDescription>Stay in the loop</CardDescription></div></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow icon={Bell} label="Email notifications" defaultOn />
              <ToggleRow icon={Shield} label="Security alerts" defaultOn />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>{children}{error && <p className="text-xs text-red-500">{error}</p>}</div>);
}

function ThemeOption({ active, onClick, icon: Icon, label, desc }: { active: boolean; onClick: () => void; icon: typeof Sun; label: string; desc: string }) {
  return (
    <button onClick={onClick} className={cn('flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all', active ? 'border-brand-300 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800')}>
      <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}><Icon className="h-4 w-4" /></span>
      <div className="flex-1"><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
      {active && <Check className="h-4 w-4 text-brand-600 dark:text-brand-400" />}
    </button>
  );
}

function ToggleRow({ icon: Icon, label, defaultOn }: { icon: typeof Bell; label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><Icon className="h-4 w-4 text-slate-400" /> {label}</span>
      <button role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 rounded-full transition-colors', on ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform', on ? 'translate-x-[22px]' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}
