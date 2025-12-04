import React, { useState } from 'react';

/**
 * CurrencyBarChart displays a horizontal bar chart of currency exchange rates.
 * It expects a `rates` object where keys are currency codes and values are numbers.
 * The chart is sorted descending by rate and each bar's width is proportional to the max rate.
 */
export default function CurrencyBarChart({ rates }) {
    if (!rates || Object.keys(rates).length === 0) return null;

    const entries = Object.entries(rates)
        .map(([code, value]) => ({ code, value }))
        .sort((a, b) => b.value - a.value);
    const [showAll, setShowAll] = useState(false);
    const displayedEntries = showAll ? entries : entries.slice(0, 10);

    const maxRate = entries[0].value;

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Currency Rates Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedEntries.map((item) => (
                    <div key={item.code} className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors">
                        <span className="w-12 font-bold text-white">{item.code}</span>
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(item.value / maxRate) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-mono text-blue-300 min-w-[80px] text-right">
                            {item.value.toFixed(4)}
                        </span>
                    </div>
                ))}
            </div>
            {entries.length > 10 && (
                <div className="flex justify-center mt-8">
                    <button
                        className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all font-medium backdrop-blur-sm text-sm"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : `Show More (${entries.length - 10} more)`}
                    </button>
                </div>
            )}
        </div>
    );
}
