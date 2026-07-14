export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  username: string;
  image: string;
  status: 'active' | 'inactive' | 'lead';
  company?: string;
  country?: string;
}

export interface CustomerListResponse {
  users: Customer[];
  total: number;
  skip: number;
  limit: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface KpiData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: 'revenue' | 'customers' | 'orders' | 'conversion';
}

export interface Activity {
  id: number;
  type: 'order' | 'customer' | 'payment' | 'system';
  message: string;
  time: string;
  actor: string;
}

export interface WeatherCurrent {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  conditionCode: number;
  icon: string;
  isDay: boolean;
  time: string;
}

export interface WeatherForecastDay {
  date: string;
  condition: string;
  conditionCode: number;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windMax: number;
}

export interface User {
  email: string;
  name: string;
}

export type Theme = 'light' | 'dark';
