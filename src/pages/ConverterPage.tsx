import { ArrowsLeftRight } from '@phosphor-icons/react';
import Converter from '@/features/currency/components/Converter';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ConverterPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader
                title="Converter"
                subtitle="Convert between any two currencies"
                icon={<ArrowsLeftRight className="w-6 h-6" aria-hidden="true" />}
            />
            <div className="max-w-lg">
                <Converter />
            </div>
        </div>
    );
}
