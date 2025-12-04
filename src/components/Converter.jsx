import { useState, useEffect, useId } from 'react';
import { convertCurrency } from '../utils/api';

export default function Converter({ currencies, baseCurrency }) {
    const [fromCurrency, setFromCurrency] = useState(baseCurrency);
    const [toCurrency, setToCurrency] = useState('USD');
    const [amount, setAmount] = useState('100');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const amountId = useId();
    const fromCurrencyId = useId();
    const toCurrencyId = useId();

    useEffect(() => {
        setFromCurrency(baseCurrency);
    }, [baseCurrency]);

    useEffect(() => {
        const performConversion = async () => {
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                setResult(null);
                return;
            }

            setLoading(true);
            try {
                const converted = await convertCurrency(fromCurrency, toCurrency, parseFloat(amount));
                setResult(converted);
            } catch (error) {
                console.error('Conversion error:', error);
                setResult(null);
            } finally {
                setLoading(false);
            }
        };

        performConversion();
    }, [amount, fromCurrency, toCurrency]);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const currencyOptions = Object.keys(currencies);

    return (
        <div className="h-full">
            <div className="glass rounded-2xl p-8 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6">Currency Converter</h2>

                <div className="flex flex-col gap-6 flex-grow">
                    {/* From */}
                    <div>
                        <label htmlFor={amountId} className="block text-sm text-gray-400 mb-2">From</label>
                        <div className="flex gap-2">
                            <input
                                id={amountId}
                                name="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                placeholder="Amount"
                            />
                            <select
                                id={fromCurrencyId}
                                name="fromCurrency"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="min-w-[100px] bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                                aria-label="From currency"
                            >
                                {currencyOptions.map((code) => (
                                    <option key={code} value={code} className="bg-[#1a1a1a]">
                                        {code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{currencies[fromCurrency]}</p>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-2 relative z-10">
                        <button
                            onClick={handleSwap}
                            className="bg-blue-600/20 border border-blue-500/30 text-blue-400 w-14 h-14 flex items-center justify-center rounded-full hover:bg-blue-600/30 hover:border-blue-500/50 transition-all shadow-lg backdrop-blur-md"
                        >
                            <span className="text-xl">⇄</span>
                        </button>
                    </div>

                    {/* To */}
                    <div>
                        <label htmlFor={toCurrencyId} className="block text-sm text-gray-400 mb-2">To</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl flex items-center">
                                <span className="text-2xl font-bold text-blue-400">
                                    {loading ? '...' : result || '0.00'}
                                </span>
                            </div>
                            <select
                                id={toCurrencyId}
                                name="toCurrency"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                            >
                                {currencyOptions.map((code) => (
                                    <option key={code} value={code} className="bg-[#1a1a1a]">
                                        {code}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{currencies[toCurrency]}</p>
                    </div>
                </div>

                {/* Conversion Rate */}
                {result && !loading && (
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-400 text-center">
                            1 {fromCurrency} = {(parseFloat(result) / parseFloat(amount)).toFixed(6)} {toCurrency}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
