import { TrendUp, TrendDown } from '@phosphor-icons/react';

interface DeltaPillProps {
    value: number | undefined;
    className?: string;
}

export function DeltaPill({ value, className = '' }: DeltaPillProps) {
    if (value === undefined || !isFinite(value)) return null;

    const up = value > 0;
    const down = value < 0;
    const color = up ? 'text-green-400' : down ? 'text-red-400' : 'text-gray-400';

    return (
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium nums ${color} ${className}`}>
            {up && <TrendUp className="w-3 h-3" aria-hidden="true" />}
            {down && <TrendDown className="w-3 h-3" aria-hidden="true" />}
            {up ? '+' : ''}{value.toFixed(2)}%
        </span>
    );
}
