import { useState, useMemo, useId } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function ExchangeRates({ rates, baseCurrency, currencies, searchTerm, onBaseCurrencyChange }) {
    const [sortBy, setSortBy] = useState('code'); // 'code' or 'rate'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [showAll, setShowAll] = useState(false);
    const baseCurrencyId = useId();

    const filteredAndSortedRates = useMemo(() => {
        if (!rates) return [];

        let ratesArray = Object.entries(rates).map(([code, rate]) => ({
            code,
            name: currencies[code] || code,
            rate
        }));

        // Filter by search term
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            ratesArray = ratesArray.filter(
                ({ code, name }) =>
                    code.toLowerCase().includes(search) ||
                    name.toLowerCase().includes(search)
            );
        }

        // Sort
        ratesArray.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'code') {
                comparison = a.code.localeCompare(b.code);
            } else {
                comparison = a.rate - b.rate;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return ratesArray;
    }, [rates, currencies, searchTerm, sortBy, sortOrder]);

    const toggleSort = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const displayedRates = showAll ? filteredAndSortedRates : filteredAndSortedRates.slice(0, 10);
    const hasMore = filteredAndSortedRates.length > 10;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 animate-fade-in">
                <h2 className="text-3xl font-bold text-white mb-6">
                    All Currencies
                    <span className="text-base text-gray-400 ml-4 font-normal">
                        {filteredAndSortedRates.length} {filteredAndSortedRates.length === 1 ? 'currency' : 'currencies'}
                    </span>
                </h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <label htmlFor={baseCurrencyId} className="text-sm text-gray-400 whitespace-nowrap">Base Currency:</label>
                        <select
                            id={baseCurrencyId}
                            name="baseCurrency"
                            value={baseCurrency}
                            onChange={(e) => onBaseCurrencyChange(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl font-medium focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all hover:border-white/20"
                        >
                            {Object.keys(currencies).map((code) => (
                                <option key={code} value={code} className="bg-[#1a1a1a]">
                                    {code}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => toggleSort('code')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${sortBy === 'code'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            Code
                            {sortBy === 'code' ? (
                                sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                            ) : (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={() => toggleSort('rate')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${sortBy === 'rate'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:bg-white/10'
                                }`}
                        >
                            Rate
                            {sortBy === 'rate' ? (
                                sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                            ) : (
                                <ArrowUpDown className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedRates.map(({ code, name, rate }, index) => (
                    <div
                        key={code}
                        className="glass rounded-2xl p-6 hover:bg-white/5 transition-all animate-fade-in cursor-pointer group"
                        style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {code}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{name}</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="text-3xl font-bold text-blue-400">{rate.toFixed(4)}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                1 {baseCurrency} = {rate.toFixed(4)} {code}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all font-medium backdrop-blur-sm"
                    >
                        {showAll ? 'Show Less' : `Show More (${filteredAndSortedRates.length - 10} more)`}
                    </button>
                </div>
            )}

            {filteredAndSortedRates.length === 0 && (
                <div className="text-center py-20 animate-fade-in">
                    <p className="text-gray-400 text-lg">
                        No currencies found matching "{searchTerm}"
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Try adjusting your search term
                    </p>
                </div>
            )}
        </div>
    );
}
