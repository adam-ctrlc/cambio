import { Scales } from '@phosphor-icons/react';
import { ComparisonChart } from '@/features/currency/components/ComparisonChart';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ComparePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Compare"
                subtitle="Overlay currencies, indexed to 100"
                icon={<Scales className="w-6 h-6" aria-hidden="true" />}
            />
            <ComparisonChart />
        </div>
    );
}
