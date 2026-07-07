import { useState, useId } from 'react';
import type { ChangeEvent } from 'react';
import { ArrowsDownUp, LinkSimple, Check } from '@phosphor-icons/react';
import { useSearchParams } from 'react-router';
import { Select } from '@/components/ui/Select';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';

export default function Converter() {
    const { currencies, baseCurrency, convert } = useCurrencyContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const [fromCurrency, setFromCurrency] = useState(() => searchParams.get('from') ?? baseCurrency);
    const [toCurrency, setToCurrency] = useState(() => searchParams.get('to') ?? 'USD');
    const [amount, setAmount] = useState(() => searchParams.get('amount') ?? '100');
    const [copied, setCopied] = useState(false);

    const amountId = useId();
    const fromCurrencyId = useId();
    const toCurrencyId = useId();

    const syncUrl = (next: { from?: string; to?: string; amount?: string }) => {
        setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            if (next.from !== undefined) p.set('from', next.from);
            if (next.to !== undefined) p.set('to', next.to);
            if (next.amount !== undefined) p.set('amount', next.amount);
            return p;
        }, { replace: true });
    };

    const updateAmount = (v: string) => { setAmount(v); syncUrl({ amount: v }); };
    const updateFrom = (v: string) => { setFromCurrency(v); syncUrl({ from: v }); };
    const updateTo = (v: string) => { setToCurrency(v); syncUrl({ to: v }); };
    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        syncUrl({ from: toCurrency, to: fromCurrency });
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    const numericAmount = parseFloat(amount);
    const validAmount = Boolean(amount) && !isNaN(numericAmount) && numericAmount > 0;
    const converted = validAmount ? convert(fromCurrency, toCurrency, numericAmount) : null;
    const result = converted != null ? converted.toFixed(2) : null;
    const unitRate = converted != null ? convert(fromCurrency, toCurrency, 1) : null;

    const currencyOptions = Object.keys(currencies);

    return (
        <div className="h-full">
            <div className="glass rounded-2xl p-5 sm:p-8 h-full flex flex-col">
                <div className="flex justify-end mb-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5"
                    >
                        {copied
                            ? <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                            : <LinkSimple className="w-4 h-4" aria-hidden="true" />}
                        {copied ? 'Copied' : 'Copy link'}
                    </button>
                </div>

                <div className="flex flex-col gap-6 flex-grow">
                    {/* From */}
                    <div>
                        <label htmlFor={amountId} className="block text-sm text-gray-400 mb-2">From</label>
                        <div className="flex gap-2">
                            <input
                                id={amountId}
                                name="amount"
                                type="number"
                                inputMode="decimal"
                                autoComplete="off"
                                value={amount}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => updateAmount(e.target.value)}
                                className="flex-1 min-w-0 nums bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
                                placeholder="0.00"
                            />
                            <Select
                                id={fromCurrencyId}
                                name="fromCurrency"
                                value={fromCurrency}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateFrom(e.target.value)}
                                className="w-[118px] shrink-0"
                                aria-label="From currency"
                            >
                                {currencyOptions.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{currencies[fromCurrency]}</p>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <button
                            type="button"
                            onClick={handleSwap}
                            aria-label="Swap From and To currencies"
                            className="bg-blue-600/20 border border-blue-500/30 text-blue-400 w-14 h-14 flex items-center justify-center rounded-full hover:bg-blue-600/30 hover:border-blue-500/50 hover:rotate-180 shadow-lg backdrop-blur-md"
                        >
                            <ArrowsDownUp className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* To */}
                    <div>
                        <label htmlFor={toCurrencyId} className="block text-sm text-gray-400 mb-2">To</label>
                        <div className="flex gap-2">
                            <div className="flex-1 min-h-[3.25rem] bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl flex items-center">
                                <span className="text-2xl font-bold text-blue-400 nums" aria-live="polite">
                                    {result ?? '0.00'}
                                </span>
                            </div>
                            <Select
                                id={toCurrencyId}
                                name="toCurrency"
                                value={toCurrency}
                                aria-label="To currency"
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateTo(e.target.value)}
                                className="w-[118px] shrink-0"
                            >
                                {currencyOptions.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{currencies[toCurrency]}</p>
                    </div>
                </div>

                {/* Conversion Rate */}
                {unitRate != null && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-400 text-center nums">
                            1 {fromCurrency} = {unitRate.toFixed(6)} {toCurrency}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
