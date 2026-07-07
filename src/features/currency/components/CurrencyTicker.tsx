import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';

export default function CurrencyTicker() {
    const { rates, baseCurrency, changes } = useCurrencyContext();
    if (!rates) return null;

    const topCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'];
    const tickerItems = topCurrencies
        .filter((curr) => curr !== baseCurrency && rates[curr])
        .map((curr) => ({
            code: curr,
            rate: rates[curr],
            change: changes[curr] ?? 0,
        }));

    if (tickerItems.length === 0) return null;

    return (
        <div className="w-full bg-black/20 border-b border-white/5 overflow-hidden backdrop-blur-sm" aria-hidden="true">
            <div className="flex whitespace-nowrap animate-scroll py-2">
                {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
                    <div key={`${item.code}-${index}`} className="flex items-center mx-6 space-x-2">
                        <span className="font-bold text-white/90" translate="no">{item.code}</span>
                        <span className="text-white/70 nums">{item.rate.toFixed(4)}</span>
                        <span className={`flex items-center text-xs ${item.change > 0 ? 'text-green-400' :
                                item.change < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {item.change > 0 ? <TrendUp className="w-3 h-3 mr-1" /> :
                                item.change < 0 ? <TrendDown className="w-3 h-3 mr-1" /> :
                                    <Minus className="w-3 h-3 mr-1" />}
                            {Math.abs(item.change).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
