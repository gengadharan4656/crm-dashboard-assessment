import { Menu, Sun, Moon, Bell, Search, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/Avatar';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/customers': 'Customers',
  '/orders': 'Orders',
  '/weather': 'Weather',
  '/settings': 'Settings',
};

export function Navbar() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { theme, toggle } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const name = user?.name ?? 'User';
  const [first, ...rest] = name.split(' ');
  const last = rest.join(' ');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        onClick={toggleSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {titles[location.pathname] ?? 'Nimbus'}
      </h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search…"
            className="h-9 w-48 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>

        <button
          onClick={toggle}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn('flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800', menuOpen && 'bg-slate-100 dark:bg-slate-800')}
          >
            <Avatar first={first} last={last} size="sm" />
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">{name}</span>
              <span className="block text-[11px] leading-tight text-slate-400">{user?.email}</span>
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 w-52 animate-scale-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated dark:border-slate-800 dark:bg-slate-900">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
