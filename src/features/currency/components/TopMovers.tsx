import type { ReactNode } from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { DeltaPill } from '@/features/currency/components/DeltaPill';
import type { Currencies } from '@/features/currency/types';

interface MoverCardProps {
    title: string;
    icon: ReactNode;
    accent: string;
    items: Array<[string, number]>;
    currencies: Currencies;
}

function MoverCard({ title, icon, accent, items, currencies }: MoverCardProps) {
    return (
        <div className="glass rounded-2xl p-5">
            <h3 className={`flex items-center gap-2 text-sm font-semibold mb-4 ${accent}`}>
                {icon}
                {title}
            </h3>
            <ul className="space-y-3">
                {items.map(([code, value]) => (
                    <li key={code} className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex items-baseline gap-2">
                            <span className="font-bold text-white text-sm" translate="no">{code}</span>
                            <span className="text-xs text-gray-500 truncate">{currencies[code]}</span>
                        </div>
                        <DeltaPill value={value} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function TopMovers() {
    const { changes, currencies } = useCurrencyContext();

    const entries = Object.entries(changes).filter(([, v]) => isFinite(v) && v !== 0);
    if (entries.length < 2) return null;

    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <MoverCard
                title="Top Gainers"
                accent="text-green-400"
                icon={<TrendUp className="w-4 h-4" aria-hidden="true" />}
                items={gainers}
                currencies={currencies}
            />
            <MoverCard
                title="Top Losers"
                accent="text-red-400"
                icon={<TrendDown className="w-4 h-4" aria-hidden="true" />}
                items={losers}
                currencies={currencies}
            />
        </div>
    );
}
