import { useMemo, useState } from 'react';
import { ArrowsDownUp, ArrowUp, ArrowDown, Star } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { useWatchlist } from '@/features/currency/useWatchlist';
import { DeltaPill } from '@/features/currency/components/DeltaPill';

type SortBy = 'code' | 'rate';
type SortOrder = 'asc' | 'desc';

interface ExchangeRatesProps {
    searchTerm: string;
}

export default function ExchangeRates({ searchTerm }: ExchangeRatesProps) {
    const { rates, currencies, changes } = useCurrencyContext();
    const { has, toggle } = useWatchlist();
    const [sortBy, setSortBy] = useState<SortBy>('code');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const filteredAndSortedRates = useMemo(() => {
        if (!rates) return [];

        let ratesArray = Object.entries(rates).map(([code, rate]) => ({
            code,
            name: currencies[code] || code,
            rate
        }));

        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            ratesArray = ratesArray.filter(
                ({ code, name }) =>
                    code.toLowerCase().includes(search) ||
                    name.toLowerCase().includes(search)
            );
        }

        ratesArray.sort((a, b) => {
            const comparison = sortBy === 'code'
                ? a.code.localeCompare(b.code)
                : a.rate - b.rate;
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return ratesArray;
    }, [rates, currencies, searchTerm, sortBy, sortOrder]);

    const toggleSort = (newSortBy: SortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const sortIcon = (key: SortBy) =>
        sortBy === key
            ? (sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" aria-hidden="true" /> : <ArrowDown className="w-4 h-4" aria-hidden="true" />)
            : <ArrowsDownUp className="w-4 h-4 opacity-60" aria-hidden="true" />;

    const sortButtonClass = (active: boolean) =>
        `flex items-center gap-2 px-3.5 py-3 rounded-xl text-sm font-medium border ${active
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10'
        }`;

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-400 nums">{filteredAndSortedRates.length} currencies</p>
                <div className="flex gap-2" role="group" aria-label="Sort currencies">
                        <button type="button" onClick={() => toggleSort('code')} aria-pressed={sortBy === 'code'} className={sortButtonClass(sortBy === 'code')}>
                            Code {sortIcon('code')}
                        </button>
                        <button type="button" onClick={() => toggleSort('rate')} aria-pressed={sortBy === 'rate'} className={sortButtonClass(sortBy === 'rate')}>
                            Rate {sortIcon('rate')}
                        </button>
                    </div>
            </div>

            {filteredAndSortedRates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                    {filteredAndSortedRates.map(({ code, name, rate }) => (
                        <div
                            key={code}
                            className="glass card-hover rounded-xl pl-2.5 pr-4 py-3 flex items-center gap-2"
                        >
                            <button
                                type="button"
                                onClick={() => toggle(code)}
                                aria-pressed={has(code)}
                                aria-label={has(code) ? `Remove ${code} from watchlist` : `Add ${code} to watchlist`}
                                className="p-1 rounded-lg text-gray-500 hover:text-yellow-400 shrink-0"
                            >
                                <Star weight={has(code) ? 'fill' : 'regular'} className={`w-4 h-4 ${has(code) ? 'text-yellow-400' : ''}`} aria-hidden="true" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <span className="font-bold text-white" translate="no">{code}</span>
                                <p className="text-xs text-gray-400 truncate">{name}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-blue-400 nums leading-tight">{rate.toFixed(4)}</p>
                                <DeltaPill value={changes[code]} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 animate-fade-in">
                    <p className="text-gray-300 text-lg">
                        No currencies match &ldquo;{searchTerm}&rdquo;
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Try a different code or name.
                    </p>
                </div>
            )}
        </div>
    );
}
