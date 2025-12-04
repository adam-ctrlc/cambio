import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function CurrencyTicker({ rates, baseCurrency }) {
    if (!rates) return null;

    // Select top currencies to display
    const topCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'];
    const tickerItems = topCurrencies
        .filter(curr => curr !== baseCurrency && rates[curr])
        .map(curr => ({
            code: curr,
            rate: rates[curr],
            change: (Math.random() * 2 - 1).toFixed(2) // Simulated change for demo
        }));

    return (
        <div className="w-full bg-black/20 border-b border-white/5 overflow-hidden backdrop-blur-sm">
            <div className="flex whitespace-nowrap animate-scroll py-2">
                {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
                    <div key={`${item.code}-${index}`} className="flex items-center mx-6 space-x-2">
                        <span className="font-bold text-white/90">{item.code}</span>
                        <span className="text-white/70">{item.rate.toFixed(4)}</span>
                        <span className={`flex items-center text-xs ${Number(item.change) > 0 ? 'text-green-400' :
                                Number(item.change) < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {Number(item.change) > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> :
                                Number(item.change) < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> :
                                    <Minus className="w-3 h-3 mr-1" />}
                            {Math.abs(item.change)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
