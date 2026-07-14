import {
  Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog, type LucideIcon,
} from 'lucide-react';
import { cn } from '../utils/cn';

const MAP: Record<string, LucideIcon> = {
  'sun': Sun,
  'cloud': Cloud,
  'cloud-sun': CloudSun,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
  'cloud-fog': CloudFog,
};

export function WeatherIcon({ name, className, isDay = true }: { name: string; className?: string; isDay?: boolean }) {
  const Icon = MAP[name] ?? Cloud;
  return <Icon className={cn(className)} style={{ color: isDay ? '#f59e0b' : '#94a3b8' }} />;
}
