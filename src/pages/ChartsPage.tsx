import { ChartLine } from '@phosphor-icons/react';
import HistoricalChart from '@/features/currency/components/HistoricalChart';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ChartsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Historical Rates"
                subtitle="Track a currency's trend over time"
                icon={<ChartLine className="w-6 h-6" aria-hidden="true" />}
            />
            <HistoricalChart />
        </div>
    );
}
