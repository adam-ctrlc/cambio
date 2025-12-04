import { useState, useId, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHistoricalRates, getLastNDays } from '../utils/api';

export default function HistoricalChart({ baseCurrency, currencies }) {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [days, setDays] = useState(30);
    const currencySelectId = useId();

    const { start, end } = useMemo(() => getLastNDays(days), [days]);
    const { data, isLoading: loading } = useHistoricalRates(start, end, baseCurrency, selectedCurrency);

    const chartData = useMemo(() => {
        if (data && data.rates) {
            return Object.entries(data.rates)
                .map(([date, rates]) => ({
                    date,
                    value: rates[selectedCurrency]
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return [];
    }, [data, selectedCurrency]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#111111] border border-blue-500/30 rounded-lg px-4 py-3 shadow-xl backdrop-blur-md">
                    <p className="text-xs text-gray-400 mb-1">{new Date(label).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    <p className="text-lg font-bold text-blue-400">
                        {payload[0].value.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">
                        1 {baseCurrency} = {payload[0].value.toFixed(4)} {selectedCurrency}
                    </p>
                </div>
            );
        }
        return null;
    };

    const getStats = () => {
        if (!chartData.length) return { high: 0, low: 0, current: 0 };
        const values = chartData.map(d => d.value);
        return {
            high: Math.max(...values),
            low: Math.min(...values),
            current: values[values.length - 1]
        };
    };

    const stats = getStats();

    return (
        <div className="h-full">
            <div className="glass rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Historical Rates</h2>
                    <div className="flex gap-2">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${days === d
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                {d}D
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor={currencySelectId} className="block text-sm text-gray-400 mb-2">Select Currency</label>
                    <select
                        id={currencySelectId}
                        name="historicalCurrency"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                    >
                        {Object.keys(currencies).map((code) => (
                            <option key={code} value={code} className="bg-[#1a1a1a]">
                                {code} - {currencies[code]}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                        {baseCurrency} to {selectedCurrency} over the last {days} days
                    </p>
                </div>

                <div className="w-full min-w-0 h-[300px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                            <p className="text-gray-400 mt-4">Loading chart data...</p>
                        </div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    hide
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    orientation="right"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(val) => val.toFixed(4)}
                                    axisLine={false}
                                    tickLine={false}
                                    width={60}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                            <p className="text-gray-400 text-lg font-medium">No Data Available</p>
                        </div>
                    )}
                </div>

                {chartData.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-sm text-gray-400 mb-1">High</p>
                            <p className="text-2xl font-bold text-green-400">{stats.high.toFixed(4)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-sm text-gray-400 mb-1">Current</p>
                            <p className="text-2xl font-bold text-blue-400">{stats.current.toFixed(4)}</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-sm text-gray-400 mb-1">Low</p>
                            <p className="text-2xl font-bold text-red-400">{stats.low.toFixed(4)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
