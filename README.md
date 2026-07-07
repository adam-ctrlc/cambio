# Cambio

Live currency exchange rates, converter, charts, and trip planning in one fast, keyboard-friendly dashboard. Built on the European Central Bank reference rates via the [Frankfurter API](https://frankfurter.dev).

![React](https://img.shields.io/badge/React-19-149ECA)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8)
![License](https://img.shields.io/badge/License-Apache_2.0-blue)

## Features

- **Dashboard** with summary statistics, a live ticker, and Top Movers (biggest daily gainers and losers).
- **Rates** for every supported currency against your base, with search, sorting, and real day-over-day change indicators.
- **Converter** with instant, offline conversion (rates are fetched once and cross-rates computed locally). Every conversion is shareable via URL, with a one-click copy link.
- **Charts** showing a currency's historical trend over 7, 30, or 90 days.
- **Compare** up to four currencies on a single chart, indexed to 100 so trends line up regardless of scale.
- **Watchlist** to star currencies (saved in your browser) with rate, daily change, and a 7-day sparkline.
- **Time Machine** to look up rates on any past date and see how they differ from today.
- **Travel Budget** planner that breaks a trip budget into local-currency categories.
- **Command palette** (Cmd/Ctrl+K) to jump to any page or currency.
- Responsive collapsible sidebar, dark theme, tuned for accessibility (keyboard navigation, focus management, reduced-motion, semantic landmarks) and older browsers.

## Tech stack

- [React 19](https://react.dev) with the React Compiler
- [TypeScript](https://www.typescriptlang.org) (strict)
- [Vite 8](https://vite.dev) with `@vitejs/plugin-legacy` for older-browser support
- [React Router](https://reactrouter.com) (declarative)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org) for charts
- [Phosphor Icons](https://phosphoricons.com)
- [Bun](https://bun.sh) as the package manager

## Getting started

### Prerequisites

- [Bun](https://bun.sh) 1.3 or newer

### Install

```bash
bun install
```

### Develop

```bash
bun run dev
```

Then open http://localhost:5173.

### Build and preview

```bash
bun run build
bun run preview
```

### Lint

```bash
bun run lint
```

## Project structure

```
src/
  App.tsx                     # Router + providers
  main.tsx                    # Entry point
  components/
    layout/                   # AppLayout, Sidebar, PageHeader, navItems
    ui/                       # Select, Skeleton, Sparkline
    CommandPalette.tsx
  features/currency/
    api.ts                    # Frankfurter data hooks
    CurrencyContext.tsx       # Shared rates/currencies provider
    useCurrencyContext.ts     # Context hook
    useWatchlist.ts
    components/               # Feature components (Converter, charts, etc.)
    types.ts
  pages/                      # One component per route
  hooks/                      # useFetch, useLocalStorage, useRouteFocus
  utils/                      # date helpers
```

## Data source

Exchange rates come from the [Frankfurter API](https://frankfurter.dev), a free, open-source service that tracks reference exchange rates published by the European Central Bank. Rates update on trading days only.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

## Acknowledgments

- [Frankfurter](https://frankfurter.dev) and the European Central Bank for the exchange-rate data.
