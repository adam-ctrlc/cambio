import { SquaresFour } from '@phosphor-icons/react';
import CurrencyTicker from '@/features/currency/components/CurrencyTicker';
import Statistics from '@/features/currency/components/Statistics';
import { TopMovers } from '@/features/currency/components/TopMovers';
import { PageHeader } from '@/components/layout/PageHeader';

export default function DashboardPage() {
    return (
        <>
            <CurrencyTicker />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader
                    title="Dashboard"
                    subtitle="Live market overview"
                    icon={<SquaresFour className="w-6 h-6" aria-hidden="true" />}
                />
                <Statistics />
                <TopMovers />
            </div>
        </>
    );
}
