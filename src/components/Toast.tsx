import { create } from 'zustand';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (type: ToastType, message: string) => void;
  remove: (id: number) => void;
}

let id = 0;
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (type, message) => {
    const tid = ++id;
    set((s) => ({ toasts: [...s.toasts, { id: tid, type, message }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== tid) })), 4000);
  },
  remove: (tid) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== tid) })),
}));

export const toast = {
  success: (m: string) => useToastStore.getState().push('success', m),
  error: (m: string) => useToastStore.getState().push('error', m),
  info: (m: string) => useToastStore.getState().push('info', m),
};

const config: Record<ToastType, { icon: typeof CheckCircle2; ring: string }> = {
  success: { icon: CheckCircle2, ring: 'text-emerald-500' },
  error: { icon: AlertCircle, ring: 'text-red-500' },
  info: { icon: Info, ring: 'text-sky-500' },
};

function ToastRow({ t }: { t: ToastItem }) {
  const remove = useToastStore((s) => s.remove);
  const { icon: Icon, ring } = config[t.type];
  return (
    <div className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-elevated animate-slide-in-right dark:border-slate-700 dark:bg-slate-900">
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', ring)} />
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{t.message}</p>
      <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <ToastRow key={t.id} t={t} />
      ))}
    </div>
  );
}
