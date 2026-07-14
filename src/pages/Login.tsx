import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../components/Toast';
import { sleep } from '../utils/format';
import { cn } from '../utils/cn';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useThemeStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  });

  const remember = watch('remember');
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await sleep(800);
      const name = data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      login({ email: data.email, name }, data.remember ?? false);
      toast.success('Welcome back to Nimbus.');
      navigate(from, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'demo@nimbus.app', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/30" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/20" />
      </div>

      <button
        onClick={toggle}
        className="absolute right-4 top-4 z-10 rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-500 backdrop-blur transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
            <Zap className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Sign in to your CRM workspace</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                error={!!errors.email}
                leftIcon={<Mail className="h-4 w-4" />}
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Forgot?</button>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={!!errors.password}
                leftIcon={<Lock className="h-4 w-4" />}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setValue('remember', !remember)}
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-md border transition-all',
                  remember ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 dark:border-slate-600'
                )}
              >
                {remember && <Check className="h-3.5 w-3.5" />}
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
            </label>

            <Button type="submit" className="w-full" size="lg" loading={submitting} rightIcon={!submitting ? <ArrowRight className="h-4 w-4" /> : undefined}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demo access —{' '}
              <button onClick={fillDemo} className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">
                Fill credentials
              </button>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">© 2026 Dharan CRM. Crafted for the internship assessment.</p>
      </div>
    </div>
  );
}
