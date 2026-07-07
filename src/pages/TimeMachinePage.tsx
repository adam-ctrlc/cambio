import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { useRatesOnDate } from '@/features/currency/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeltaPill } from '@/features/currency/components/DeltaPill';
import { Skeleton } from '@/components/ui/Skeleton';

function toISODate(d: Date): string {
    return d.toISOString().split('T')[0];
}

export default function TimeMachinePage() {
    const { rates: todayRates, currencies, baseCurrency } = useCurrencyContext();
    const dateId = useId();
    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        return toISODate(d);
    });

    const { data, isLoading } = useRatesOnDate(date, baseCurrency);
    const pastRates = data?.rates;
    const actualDate = data?.date;
    const maxDate = toISODate(new Date());

    const rows = pastRates
        ? Object.keys(pastRates)
              .filter((code) => todayRates?.[code] !== undefined)
              .sort()
              .map((code) => {
                  const past = pastRates[code];
                  const now = todayRates![code];
                  const pct = past ? ((now - past) / past) * 100 : undefined;
                  return { code, past, now, pct };
              })
        : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Time Machine"
                subtitle={`A past date vs today, in ${baseCurrency}`}
                icon={<ClockCounterClockwise className="w-6 h-6" aria-hidden="true" />}
            >
                <label htmlFor={dateId} className="sr-only">Pick a date</label>
                <input
                    id={dateId}
                    type="date"
                    max={maxDate}
                    value={date}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                    className="nums bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 hover:border-white/20"
                />
            </PageHeader>

            {actualDate && actualDate !== date && (
                <p className="text-sm text-gray-400 mb-4">
                    Nearest trading day: <span className="text-white nums">{actualDate}</span>
                </p>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} className="h-[76px] rounded-xl" />
                    ))}
                </div>
            ) : rows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                    {rows.map(({ code, past, now, pct }) => (
                        <div key={code} className="glass card-hover rounded-xl px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <span className="font-bold text-white" translate="no">{code}</span>
                                    <p className="text-xs text-gray-400 truncate">{currencies[code]}</p>
                                </div>
                                <DeltaPill value={pct} />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2 text-sm">
                                <span className="text-gray-500 nums">{past.toFixed(4)}</span>
                                <span className="text-gray-600">to</span>
                                <span className="text-blue-400 font-bold nums">{now.toFixed(4)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-2xl p-10 text-center text-gray-400">
                    No data available for that date.
                </div>
            )}
        </div>
    );
}
