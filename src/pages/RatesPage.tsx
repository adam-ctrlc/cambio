import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { MagnifyingGlass, Wallet } from '@phosphor-icons/react';
import ExchangeRates from '@/features/currency/components/ExchangeRates';
import { PageHeader } from '@/components/layout/PageHeader';

export default function RatesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const searchId = useId();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Exchange Rates"
                subtitle="Every currency against your base"
                icon={<Wallet className="w-6 h-6" aria-hidden="true" />}
            >
                <div className="relative w-full sm:w-64">
                    <label htmlFor={searchId} className="sr-only">Search currencies</label>
                    <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                    <input
                        id={searchId}
                        type="search"
                        inputMode="search"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="Search currencies…"
                        value={searchTerm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 placeholder-gray-500 hover:border-white/20"
                    />
                </div>
            </PageHeader>
            <ExchangeRates searchTerm={searchTerm} />
        </div>
    );
}
