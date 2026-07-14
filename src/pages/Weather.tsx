import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Wind, Droplets, Eye, Gauge, CloudSun, CloudRain, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { WeatherIcon } from '../components/WeatherIcon';
import { useDebounce } from '../hooks/useDebounce';
import { searchCities, getWeather } from '../services/weatherService';
import type { WeatherCurrent, WeatherForecastDay } from '../types';

const STORAGE_KEY = 'nimbus-weather-city';

interface CityResult { name: string; country: string; latitude: number; longitude: number; admin1?: string; }

export default function Weather() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 350);
  const [results, setResults] = useState<CityResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [current, setCurrent] = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string>('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return; }
    let cancelled = false;
    setLoading(true);
    searchCities(debounced)
      .then((r) => { if (!cancelled) { setResults(r); setShowResults(true); } })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debounced]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowResults(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const loadWeather = useCallback(async (city: string, lat?: number, lon?: number, country?: string) => {
    setLoadingWeather(true);
    setError(null);
    try {
      let r;
      if (lat != null && lon != null) { r = await getWeather(lat, lon, city, country ?? ''); }
      else {
        const cities = await searchCities(city);
        if (!cities.length) throw new Error(`No location found for "${city}"`);
        const c = cities[0];
        r = await getWeather(c.latitude, c.longitude, c.name, c.country);
        city = c.name;
      }
      setCurrent(r.current);
      setForecast(r.forecast);
      setActiveCity(`${r.current.city}, ${r.current.country}`);
      localStorage.setItem(STORAGE_KEY, r.current.city);
      setShowResults(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load weather');
      setCurrent(null);
      setForecast([]);
    } finally { setLoadingWeather(false); }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) loadWeather(saved);
    else loadWeather('San Francisco');
  }, [loadWeather]);

  const selectCity = (c: CityResult) => { setQuery(''); setResults([]); loadWeather(c.name, c.latitude, c.longitude, c.country); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Weather</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Check current conditions and 5-day forecasts worldwide.</p>
      </div>

      <div className="relative max-w-xl" ref={boxRef}>
        <Input placeholder="Search for a city…" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => results.length && setShowResults(true)} leftIcon={<Search className="h-4 w-4" />} rightSlot={query ? (<button onClick={() => { setQuery(''); setResults([]); }} className="hover:text-slate-600" aria-label="Clear search"><X className="h-4 w-4" /></button>) : undefined} aria-label="Search city" />
        {showResults && (results.length > 0 || loading) && (
          <div className="absolute z-20 mt-2 w-full animate-scale-in overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <div className="space-y-2 p-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
            ) : (
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((c, i) => (
                  <li key={`${c.name}-${c.latitude}-${i}`}>
                    <button onClick={() => selectCity(c)} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="flex-1"><span className="block font-medium text-slate-800 dark:text-slate-100">{c.name}</span><span className="block text-xs text-slate-400">{[c.admin1, c.country].filter(Boolean).join(', ')}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => activeCity ? loadWeather(activeCity.split(',')[0]) : loadWeather('San Francisco')} />
      ) : loadingWeather ? (
        <WeatherSkeleton />
      ) : current ? (
        <div className="space-y-6 animate-fade-in-up">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 p-6 sm:p-8 text-white">
                <div className="pointer-events-none absolute inset-0 opacity-20"><div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white blur-3xl" /></div>
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-white/80"><MapPin className="h-4 w-4" />{current.city}, {current.country}</div>
                    <div className="mt-2 flex items-end gap-3"><span className="text-6xl font-bold tracking-tighter sm:text-7xl">{current.temperature}°</span><span className="mb-2 text-lg font-medium text-white/90">{current.condition}</span></div>
                    <p className="mt-1 text-sm text-white/70">Feels like {current.feelsLike}°C</p>
                  </div>
                  <WeatherIcon name={current.icon} isDay={current.isDay} className="h-24 w-24 sm:h-28 sm:w-28" />
                </div>
                <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
                  <Metric icon={Wind} label="Wind" value={`${current.windSpeed} km/h`} />
                  <Metric icon={Gauge} label="Pressure" value={`${current.pressure} hPa`} />
                  <Metric icon={Eye} label="Visibility" value={`${current.visibility} km`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">5-Day Forecast</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {forecast.map((f, i) => (
                <Card key={f.date} hover className="p-4 text-center animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <p className="text-xs font-medium text-slate-400">{formatDay(f.date)}</p>
                  <div className="my-3 flex justify-center"><WeatherIcon name={f.icon} className="h-10 w-10" /></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{f.condition}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm"><span className="font-semibold text-slate-900 dark:text-slate-100">{f.tempMax}°</span><span className="text-slate-400">{f.tempMin}°</span></div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-sky-500"><CloudRain className="h-3 w-3" /> {f.precipitation}%</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState icon={CloudSun} title="Search for a city" description="Enter a city name to see current weather and forecasts." />
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Wind; label: string; value: string }) {
  return (<div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm"><div className="flex items-center gap-1.5 text-xs text-white/70"><Icon className="h-3.5 w-3.5" /> {label}</div><p className="mt-1 text-sm font-semibold">{value}</p></div>);
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
}

function WeatherSkeleton() {
  return (<div className="space-y-6"><Skeleton className="h-56 w-full rounded-2xl" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div></div>);
}
