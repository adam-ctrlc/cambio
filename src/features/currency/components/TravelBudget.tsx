import { useState, useId } from 'react';
import type { ChangeEvent } from 'react';
import { Airplane, ForkKnife, Bed, Bus } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { Select } from '@/components/ui/Select';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';

interface BreakdownItem {
    icon: Icon;
    label: string;
    value: number;
    color: string;
    bg: string;
}

export default function TravelBudget() {
    const { currencies, convert } = useCurrencyContext();
    const [budget, setBudget] = useState('1000');
    const [homeCurrency, setHomeCurrency] = useState('USD');
    const [destCurrency, setDestCurrency] = useState('EUR');
    const [duration, setDuration] = useState('7');

    const budgetId = useId();
    const homeCurrencyId = useId();
    const destCurrencyId = useId();
    const durationId = useId();

    const numericBudget = parseFloat(budget);
    const convertedBudget = (Boolean(budget) && !isNaN(numericBudget) && numericBudget > 0)
        ? convert(homeCurrency, destCurrency, numericBudget)
        : null;
    const days = parseInt(duration);

    const currencyOptions = Object.keys(currencies);

    const breakdown: BreakdownItem[] = convertedBudget ? [
        { icon: Bed, label: 'Accommodation (40%)', value: convertedBudget * 0.4, color: 'text-purple-300', bg: 'bg-purple-500/15' },
        { icon: ForkKnife, label: 'Food & Dining (30%)', value: convertedBudget * 0.3, color: 'text-orange-300', bg: 'bg-orange-500/15' },
        { icon: Airplane, label: 'Activities (20%)', value: convertedBudget * 0.2, color: 'text-blue-300', bg: 'bg-blue-500/15' },
        { icon: Bus, label: 'Transport (10%)', value: convertedBudget * 0.1, color: 'text-green-300', bg: 'bg-green-500/15' },
    ] : [];

    return (
        <div className="glass rounded-3xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <label htmlFor={budgetId} className="block text-sm text-gray-400 mb-2">Total Budget</label>
                            <div className="relative">
                                <input
                                    id={budgetId}
                                    type="number"
                                    inputMode="decimal"
                                    autoComplete="off"
                                    value={budget}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBudget(e.target.value)}
                                    className="w-full nums bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={homeCurrencyId} className="block text-sm text-gray-400 mb-2">Home Currency</label>
                                <Select
                                    id={homeCurrencyId}
                                    value={homeCurrency}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setHomeCurrency(e.target.value)}
                                >
                                    {currencyOptions.map(code => (
                                        <option key={code} value={code}>{code}</option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <label htmlFor={destCurrencyId} className="block text-sm text-gray-400 mb-2">Destination</label>
                                <Select
                                    id={destCurrencyId}
                                    value={destCurrency}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setDestCurrency(e.target.value)}
                                >
                                    {currencyOptions.map(code => (
                                        <option key={code} value={code}>{code}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor={durationId} className="block text-sm text-gray-400 mb-2">Trip Duration (Days)</label>
                            <input
                                id={durationId}
                                type="number"
                                inputMode="numeric"
                                autoComplete="off"
                                value={duration}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                                className="w-full nums bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
                                placeholder="7"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                        {convertedBudget ? (
                            <div className="h-full flex flex-col">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <p className="text-sm text-gray-400 mb-1">Total in {destCurrency}</p>
                                        <p className="text-3xl font-bold text-white nums">{convertedBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">{destCurrency}</span></p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <p className="text-sm text-gray-400 mb-1">Daily Budget</p>
                                        <p className="text-3xl font-bold text-blue-400 nums">{days > 0 ? (convertedBudget / days).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'} <span className="text-sm font-normal text-gray-500">{destCurrency}/day</span></p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-4">Suggested Breakdown</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {breakdown.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                                <div className={`${item.bg} p-3 rounded-lg`}>
                                                    <Icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-400 truncate">{item.label}</p>
                                                    <p className="text-xl font-bold text-white nums">{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {destCurrency}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Enter your budget details to see the breakdown
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
}
