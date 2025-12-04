import { useEffect, useState } from 'react';
import { Globe, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import CurrencyBarChart from './CurrencyBarChart';

export default function Statistics({ rates, baseCurrency }) {
    const [animatedStats, setAnimatedStats] = useState({
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

    const stats = [
        {
            label: 'Total Currencies',
            value: animatedStats.total,
            format: (val) => val.toString(),
            icon: Globe,
            color: 'text-blue-400',
            bg: 'bg-blue-500',
            description: `Available currencies`
        },
        {
            label: `Strongest Currency`,
            value: animatedStats.highest,
            format: (val) => val.toFixed(4),
            icon: TrendingUp,
            color: 'text-green-400',
            bg: 'bg-green-500',
            description: `Highest rate vs 1 ${baseCurrency}`
        },
        {
            label: `Weakest Currency`,
            value: animatedStats.lowest,
            format: (val) => val.toFixed(4),
            icon: TrendingDown,
            color: 'text-orange-400',
            bg: 'bg-orange-500',
            description: `Lowest rate vs 1 ${baseCurrency}`
        },
        {
            label: `Average Rate`,
            value: animatedStats.average,
            format: (val) => val.toFixed(4),
            icon: BarChart3,
            color: 'text-purple-400',
            bg: 'bg-purple-500',
            description: `Mean exchange rate`
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`glass rounded-2xl p-6 hover:bg-white/5 transition-all animate-scale-in stagger-${index + 1}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-white mb-1">{stat.label}</p>
                                    <p className="text-xs text-gray-200 mb-2">{stat.description}</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stat.format(stat.value)}
                                    </p>
                                </div>
                                <div className={`${stat.bg} bg-opacity-20 p-3 rounded-xl backdrop-blur-sm`}>
                                    <Icon className="w-6 h-6 text-white" />
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
