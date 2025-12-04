import { useState, useEffect, useId } from 'react';
import { Calculator, Plane, Utensils, Bed, Bus } from 'lucide-react';
import { convertCurrency } from '../utils/api';

export default function TravelBudget({ currencies }) {
    const [budget, setBudget] = useState('1000');
    const [homeCurrency, setHomeCurrency] = useState('USD');
    const [destCurrency, setDestCurrency] = useState('EUR');
    const [duration, setDuration] = useState('7');
    const [convertedBudget, setConvertedBudget] = useState(null);
    const [loading, setLoading] = useState(false);

    const budgetId = useId();
    const homeCurrencyId = useId();
    const destCurrencyId = useId();
    const durationId = useId();

    useEffect(() => {
        const calculateBudget = async () => {
            if (!budget || !duration || isNaN(budget) || isNaN(duration)) return;

            setLoading(true);
            try {
                const result = await convertCurrency(homeCurrency, destCurrency, parseFloat(budget));
                setConvertedBudget(parseFloat(result));
            } catch (error) {
                console.error('Error calculating budget:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(calculateBudget, 500);
        return () => clearTimeout(timeout);
    }, [budget, homeCurrency, destCurrency, duration]);

    const currencyOptions = Object.keys(currencies);

    const breakdown = convertedBudget ? [
        { icon: Bed, label: 'Accommodation (40%)', value: convertedBudget * 0.4, color: 'text-white', bg: 'bg-purple-500' },
        { icon: Utensils, label: 'Food & Dining (30%)', value: convertedBudget * 0.3, color: 'text-white', bg: 'bg-orange-500' },
        { icon: Plane, label: 'Activities (20%)', value: convertedBudget * 0.2, color: 'text-white', bg: 'bg-blue-500' },
        { icon: Bus, label: 'Transport (10%)', value: convertedBudget * 0.1, color: 'text-white', bg: 'bg-green-500' },
    ] : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="glass rounded-3xl p-6 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600/20 p-3 rounded-2xl backdrop-blur-md border border-blue-500/20">
                        <Calculator className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Travel Budget Calculator</h2>
                        <p className="text-gray-400 mt-1">Plan your trip expenses in local currency</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <label htmlFor={budgetId} className="block text-sm text-gray-400 mb-2">Total Budget</label>
                            <div className="relative">
                                <input
                                    id={budgetId}
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor={homeCurrencyId} className="block text-sm text-gray-400 mb-2">Home Currency</label>
                                <select
                                    id={homeCurrencyId}
                                    value={homeCurrency}
                                    onChange={(e) => setHomeCurrency(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                >
                                    {currencyOptions.map(code => (
                                        <option key={code} value={code} className="bg-[#1a1a1a]">{code}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor={destCurrencyId} className="block text-sm text-gray-400 mb-2">Destination</label>
                                <select
                                    id={destCurrencyId}
                                    value={destCurrency}
                                    onChange={(e) => setDestCurrency(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                >
                                    {currencyOptions.map(code => (
                                        <option key={code} value={code} className="bg-[#1a1a1a]">{code}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor={durationId} className="block text-sm text-gray-400 mb-2">Trip Duration (Days)</label>
                            <input
                                id={durationId}
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                placeholder="Number of days"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-pulse text-blue-400">Calculating budget...</div>
                            </div>
                        ) : convertedBudget ? (
                            <div className="h-full flex flex-col">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <p className="text-sm text-gray-400 mb-1">Total in {destCurrency}</p>
                                        <p className="text-3xl font-bold text-white">{convertedBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">{destCurrency}</span></p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <p className="text-sm text-gray-400 mb-1">Daily Budget</p>
                                        <p className="text-3xl font-bold text-blue-400">{(convertedBudget / parseInt(duration)).toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">{destCurrency}/day</span></p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-4">Suggested Breakdown</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {breakdown.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                                <div className={`${item.bg} bg-opacity-20 p-3 rounded-lg`}>
                                                    <Icon className={`w-6 h-6 ${item.color}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">{item.label}</p>
                                                    <p className="text-xl font-bold text-white">{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })} {destCurrency}</p>
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
        </div>
    );
}
