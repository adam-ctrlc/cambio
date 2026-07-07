import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X } from '@phosphor-icons/react';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { useHistoricalRates } from '@/features/currency/api';
import { getLastNDays } from '@/utils/date';
import { Select } from '@/components/ui/Select';

const COLORS = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24'];
const MAX_SERIES = 4;

export function ComparisonChart() {
    const { currencies, baseCurrency } = useCurrencyContext();
    const [selected, setSelected] = useState<string[]>(['USD', 'GBP', 'JPY']);
    const [days, setDays] = useState(90);

    const { start, end } = getLastNDays(days);
    const symbols = selected.join(',');
    const { data, isLoading } = useHistoricalRates(
        selected.length ? start : null,
        selected.length ? end : null,
        baseCurrency,
        symbols || null,
    );

    const chartData = useMemo(() => {
        if (!data?.rates) return [];
        const dates = Object.keys(data.rates).sort();
        const baseline: Record<string, number> = {};
        for (const code of selected) {
            for (const d of dates) {
                const v = data.rates[d][code];
                if (v != null) { baseline[code] = v; break; }
            }
        }
        return dates.map((d) => {
            const row: Record<string, number | string> = { date: d };
            for (const code of selected) {
                const v = data.rates[d][code];
                if (v != null && baseline[code]) row[code] = (v / baseline[code]) * 100;
            }
            return row;
        });
    }, [data, selected]);

    const addable = Object.keys(currencies).filter((c) => c !== baseCurrency && !selected.includes(c));

    const addCurrency = (code: string) => {
        if (code && selected.length < MAX_SERIES && !selected.includes(code)) {
            setSelected([...selected, code]);
        }
    };
    const removeCurrency = (code: string) => setSelected(selected.filter((c) => c !== code));

    return (
        <div className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex flex-wrap gap-2">
                    {selected.map((code, i) => (
                        <span
                            key={code}
                            className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-lg text-sm font-medium text-white"
                            style={{ backgroundColor: `${COLORS[i % COLORS.length]}22`, border: `1px solid ${COLORS[i % COLORS.length]}55` }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span translate="no">{code}</span>
                            <button type="button" onClick={() => removeCurrency(code)} aria-label={`Remove ${code}`} className="p-0.5 text-white/70 hover:text-white">
                                <X className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                        </span>
                    ))}
                </div>

                {selected.length < MAX_SERIES && addable.length > 0 && (
                    <Select value="" onChange={(e) => addCurrency(e.target.value)} aria-label="Add currency to compare" className="w-[160px]">
                        <option value="" disabled>Add currency…</option>
                        {addable.map((code) => (
                            <option key={code} value={code}>{code} - {currencies[code]}</option>
                        ))}
                    </Select>
                )}

                <div className="flex gap-2 ml-auto" role="group" aria-label="Chart range">
                    {[30, 90, 180].map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDays(d)}
                            aria-pressed={days === d}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${days === d
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                        >
                            {d}D
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">Indexed to 100 at the start of the range so trends are comparable.</p>

            <div className="w-full min-w-0 h-[360px]">
                {isLoading ? (
                    <div className="skeleton h-full w-full rounded-xl" aria-busy="true" aria-label="Loading comparison…" />
                ) : chartData.length > 0 && selected.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis
                                orientation="right"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(v: number) => v.toFixed(0)}
                                axisLine={false}
                                tickLine={false}
                                width={44}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{ background: '#0d1424', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, color: '#e6edf6' }}
                                labelFormatter={(label) => new Date(label as string).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : String(value ?? ''))}
                            />
                            <Legend />
                            {selected.map((code, i) => (
                                <Line key={code} type="monotone" dataKey={code} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} animationDuration={800} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Add a currency to start comparing.
                    </div>
                )}
            </div>
        </div>
    );
}
