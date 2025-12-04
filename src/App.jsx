import { useState, useEffect } from 'react';
import Header from './components/Header';
import Statistics from './components/Statistics';
import ExchangeRates from './components/ExchangeRates';
import Converter from './components/Converter';
import HistoricalChart from './components/HistoricalChart';
import Footer from './components/Footer';
import CurrencyTicker from './components/CurrencyTicker';
import Features from './components/Features';
import TravelBudget from './components/TravelBudget';
import { useLatestRates, useCurrencies } from './utils/api';
import Navbar from './components/Navbar';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState('EUR');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch currencies
  const { currencies, isLoading: currenciesLoading } = useCurrencies();

  // Fetch rates
  const { rates, date: lastUpdate, isLoading: ratesLoading, error } = useLatestRates(baseCurrency);

  const loading = currenciesLoading || ratesLoading;

  if (loading && !rates) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-6 text-blue-500 animate-spin" />
          <p className="text-white/80 text-xl font-light tracking-wider animate-pulse">Initializing Financial Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass p-12 rounded-3xl">
          <div className="text-5xl mb-6">⚠️</div>
          <p className="text-white text-2xl mb-3 font-bold">Connection Error</p>
          <p className="text-gray-400">{error.message || 'Failed to load data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <Navbar />
      
      <div className="pt-20"> {/* Offset for fixed navbar */}
        <CurrencyTicker rates={rates} baseCurrency={baseCurrency} />

        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          lastUpdate={lastUpdate}
        />

        <main className="flex-grow space-y-20 pb-20">
          <section id="dashboard" className="scroll-mt-24">
            <Statistics
              rates={rates}
              baseCurrency={baseCurrency}
            />
          </section>

          <section id="rates" className="scroll-mt-24">
            <ExchangeRates
              rates={rates}
              baseCurrency={baseCurrency}
              currencies={currencies}
              searchTerm={searchTerm}
              onBaseCurrencyChange={setBaseCurrency}
            />
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section id="converter" className="scroll-mt-24">
              <Converter
                currencies={currencies}
                baseCurrency={baseCurrency}
              />
            </section>
            <section id="charts" className="scroll-mt-24">
              <HistoricalChart
                baseCurrency={baseCurrency}
                currencies={currencies}
              />
            </section>
          </div>

          <section id="travel" className="scroll-mt-24">
            <TravelBudget currencies={currencies} />
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
} 