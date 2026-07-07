import { useEffect, useState } from 'react';
import { Globe, TrendUp, TrendDown, ChartBar } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import CurrencyBarChart from '@/features/currency/components/CurrencyBarChart';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';

interface AnimatedStats {
    total: number;
    highest: number;
    lowest: number;
    average: number;
}

interface Stat {
    label: string;
    value: number;
    format: (val: number) => string;
    icon: Icon;
    color: string;
    bg: string;
    description: string;
}

export default function Statistics() {
    const { rates, baseCurrency } = useCurrencyContext();
    const [animatedStats, setAnimatedStats] = useState<AnimatedStats>({
        total: 0,
        highest: 0,
        lowest: 0,
        average: 0
    });

    useEffect(() => {
        if (!rates || Object.keys(rates).length === 0) return;

        const values = Object.values(rates);
        const total = values.length;
        const highest = Math.max(...values);
        const lowest = Math.min(...values);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;

        const duration = 1000;
        const steps = 30;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;

            setAnimatedStats({
                total: Math.round(total * progress),
                highest: highest * progress,
                lowest: lowest * progress,
                average: average * progress
            });

            if (step >= steps) {
                clearInterval(timer);
                setAnimatedStats({ total, highest, lowest, average });
            }
        }, interval);

        return () => clearInterval(timer);
    }, [rates]);

    const stats: Stat[] = [
        {
            label: 'Total Currencies',
            value: animatedStats.total,
            format: (val) => val.toString(),
            icon: Globe,
            color: 'text-blue-400',
            bg: 'bg-blue-500/15',
            description: `Available currencies`
        },
        {
            label: `Strongest Currency`,
            value: animatedStats.highest,
            format: (val) => val.toLocaleString(undefined, { maximumFractionDigits: 4 }),
            icon: TrendUp,
            color: 'text-green-400',
            bg: 'bg-green-500/15',
            description: `Highest rate vs 1 ${baseCurrency}`
        },
        {
            label: `Weakest Currency`,
            value: animatedStats.lowest,
            format: (val) => val.toLocaleString(undefined, { maximumFractionDigits: 4 }),
            icon: TrendDown,
            color: 'text-orange-400',
            bg: 'bg-orange-500/15',
            description: `Lowest rate vs 1 ${baseCurrency}`
        },
        {
            label: `Average Rate`,
            value: animatedStats.average,
            format: (val) => val.toLocaleString(undefined, { maximumFractionDigits: 4 }),
            icon: ChartBar,
            color: 'text-purple-400',
            bg: 'bg-purple-500/15',
            description: `Mean exchange rate`
        }
    ];

    return (
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`glass card-hover rounded-2xl p-4 sm:p-5 animate-scale-in stagger-${index + 1}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-gray-300 mb-1 truncate">{stat.label}</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white nums truncate">
                                        {stat.format(stat.value)}
                                    </p>
                                    <p className="text-[11px] text-gray-500 mt-1 truncate">{stat.description}</p>
                                </div>
                                <div className={`${stat.bg} p-2.5 rounded-xl backdrop-blur-sm shrink-0 self-start`}>
                                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <CurrencyBarChart rates={rates} />
        </div>
    );
}
