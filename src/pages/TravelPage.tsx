import { Airplane } from '@phosphor-icons/react';
import TravelBudget from '@/features/currency/components/TravelBudget';
import { PageHeader } from '@/components/layout/PageHeader';

export default function TravelPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Travel Budget"
                subtitle="Plan trip expenses in your destination's currency"
                icon={<Airplane className="w-6 h-6" aria-hidden="true" />}
            />
            <TravelBudget />
        </div>
    );
}
