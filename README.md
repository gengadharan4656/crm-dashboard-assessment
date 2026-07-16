# CRM Dashboard

A premium SaaS CRM dashboard and weather application built as an internship assessment project. Inspired by the design language of Linear, Stripe, Vercel, and Notion.

## Features

### Project 1 — CRM Dashboard

- **Login** — Zod validation, password visibility toggle, Remember Me, demo credential fill
- **Dashboard** — 4 animated KPI cards, revenue area chart, customer growth bar chart, recent activity feed
- **Customers** — debounced search, sort by field/order, status filter, server pagination, avatars, status badges, loading skeletons, empty state
- **Orders** — search, status filter, inline dropdown status editing, delete confirmation modal, toast notifications
- **Settings** — profile form with Zod validation, avatar upload placeholder, light/dark theme switcher, notification toggles, Save & Reset

### Project 2 — Weather App

- City search with autocomplete (Open-Meteo geocoding API)
- Current weather with humidity, wind, pressure, and visibility metrics
- 5-day forecast with weather icons
- Loading skeletons and error handling with retry
- Last searched city persisted to Local Storage

## Tech Stack

- React 18 + Vite
- TypeScript (strict mode)
- Tailwind CSS (custom design system)
- React Router (lazy-loaded routes)
- Zustand (auth, theme, UI state with persistence)
- Axios (with interceptors)
- React Hook Form + Zod (form validation)
- Recharts (data visualization)
- Lucide React (icons)

## Architecture

```
src/
├── components/      # Reusable UI primitives & feature components
│   ├── ui/          # Button, Card, Input, Select, Badge, Skeleton, Spinner
│   └── charts/      # RevenueChart, CustomerGrowthChart
├── layouts/         # DashboardLayout, Sidebar, Navbar
├── pages/           # Login, Dashboard, Customers, Orders, Settings, Weather
├── hooks/           # useDebounce, usePagination, useMediaQuery, useTheme
├── services/        # API layer (axios instances, customer/order/weather services)
├── store/           # Zustand stores (auth, theme, ui)
├── types/           # TypeScript interfaces
└── utils/           # cn, format, weatherCodes
```

## Getting Started

```bash
npm install
npm run dev
```

The app runs on the local dev server. Sign in with any email and a password of 6+ characters, or click "Fill credentials" on the login page.

## Build

```bash
npm run build      # production build
npm run typecheck   # TypeScript type checking
```
