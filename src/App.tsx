import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import { CurrencyProvider } from '@/features/currency/CurrencyContext'
import DashboardPage from '@/pages/DashboardPage'
import RatesPage from '@/pages/RatesPage'
import ConverterPage from '@/pages/ConverterPage'
import TravelPage from '@/pages/TravelPage'
import WatchlistPage from '@/pages/WatchlistPage'
import TimeMachinePage from '@/pages/TimeMachinePage'

const ChartsPage = lazy(() => import('@/pages/ChartsPage'))
const ComparePage = lazy(() => import('@/pages/ComparePage'))

const chartFallback = (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="skeleton h-[440px] rounded-2xl" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="rates" element={<RatesPage />} />
            <Route path="converter" element={<ConverterPage />} />
            <Route path="charts" element={<Suspense fallback={chartFallback}><ChartsPage /></Suspense>} />
            <Route path="compare" element={<Suspense fallback={chartFallback}><ComparePage /></Suspense>} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="time-machine" element={<TimeMachinePage />} />
            <Route path="travel" element={<TravelPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </CurrencyProvider>
    </BrowserRouter>
  )
}
