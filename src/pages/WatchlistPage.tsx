import { Star } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { useWatchlist } from '@/features/currency/useWatchlist';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeltaPill } from '@/features/currency/components/DeltaPill';
import { Sparkline } from '@/components/ui/Sparkline';

export default function WatchlistPage() {
    const { rates, currencies, changes, history, baseCurrency } = useCurrencyContext();
    const { codes, toggle } = useWatchlist();

    const items = codes.filter((code) => rates?.[code] !== undefined);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Watchlist"
                subtitle={`${items.length} saved ${items.length === 1 ? 'currency' : 'currencies'} vs ${baseCurrency}`}
                icon={<Star weight="fill" className="w-6 h-6" aria-hidden="true" />}
            />

            {items.length === 0 ? (
                <div className="glass rounded-2xl p-10 sm:p-14 text-center">
                    <Star className="w-10 h-10 mx-auto text-gray-500 mb-3" aria-hidden="true" />
                    <p className="text-gray-200 text-lg">No currencies saved yet</p>
                    <p className="text-gray-500 text-sm mt-1">Tap the star on any currency in Rates to pin it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((code) => {
                        const rate = rates![code];
                        const series = history[code] ?? [];
                        const change = changes[code];
                        return (
                            <div key={code} className="glass card-hover rounded-2xl p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className="text-lg font-bold text-white" translate="no">{code}</span>
                                        <p className="text-xs text-gray-400 truncate">{currencies[code]}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => toggle(code)}
                                        aria-label={`Remove ${code} from watchlist`}
                                        className="p-1 text-yellow-400 hover:text-yellow-300 shrink-0"
                                    >
                                        <Star weight="fill" className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-4 flex items-end justify-between gap-3">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-400 nums leading-tight">{rate.toFixed(4)}</p>
                                        <DeltaPill value={change} className="mt-1" />
                                    </div>
                                    {series.length >= 2 && (
                                        <Sparkline
                                            data={series}
                                            positive={change === undefined ? undefined : change >= 0}
                                            className="w-24 h-9"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
