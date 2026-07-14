import { weatherApi, forecastApi } from './api';
import { weatherInfo } from '../utils/weatherCodes';
import type { WeatherCurrent, WeatherForecastDay } from '../types';

interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const res = await weatherApi.get('/search', { params: { name: query.trim(), count: 8, language: 'en', format: 'json' }, signal });
  return res.data?.results ?? [];
}

export async function getWeather(lat: number, lon: number, name: string, country: string): Promise<{ current: WeatherCurrent; forecast: WeatherForecastDay[] }> {
  const res = await forecastApi.get('/forecast', {
    params: {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,pressure_msl,visibility,uv_index',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: 5,
    },
  });

  const c = res.data.current;
  const d = res.data.daily;
  const info = weatherInfo(c.weather_code);

  const current: WeatherCurrent = {
    city: name,
    country,
    temperature: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: c.relative_humidity_2m,
    windSpeed: Math.round(c.wind_speed_10m),
    pressure: Math.round(c.pressure_msl),
    visibility: Math.round((c.visibility ?? 10000) / 1000),
    uvIndex: c.uv_index ?? 0,
    condition: info.label,
    conditionCode: c.weather_code,
    icon: info.icon,
    isDay: c.is_day === 1,
    time: c.time,
  };

  const forecast: WeatherForecastDay[] = d.time.map((t: string, i: number) => {
    const fi = weatherInfo(d.weather_code[i]);
    return {
      date: t,
      condition: fi.label,
      conditionCode: d.weather_code[i],
      icon: fi.icon,
      tempMax: Math.round(d.temperature_2m_max[i]),
      tempMin: Math.round(d.temperature_2m_min[i]),
      precipitation: d.precipitation_probability_max[i] ?? 0,
      windMax: Math.round(d.wind_speed_10m_max[i]),
    };
  });

  return { current, forecast };
}

export async function getWeatherByCity(city: string): Promise<{ current: WeatherCurrent; forecast: WeatherForecastDay[] }> {
  const results = await searchCities(city);
  if (!results.length) throw new Error(`No location found for "${city}"`);
  const r = results[0];
  return getWeather(r.latitude, r.longitude, r.name, r.country);
}
