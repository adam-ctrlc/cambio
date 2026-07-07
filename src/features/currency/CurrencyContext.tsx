import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { useCurrencies, useLatestRates, useHistoricalRates } from '@/features/currency/api';
import { getLastNDays } from '@/utils/date';
import { CurrencyContext } from '@/features/currency/useCurrencyContext';
import type { CurrencyContextValue } from '@/features/currency/useCurrencyContext';
import type { HistoricalRatesResponse } from '@/features/currency/types';

function deriveSeries(data: HistoricalRatesResponse | undefined) {
    const changes: Record<string, number> = {};
    const history: Record<string, number[]> = {};
    if (!data?.rates) return { changes, history };

    // Frankfurter returns trading days only; sort present dates ascending.
    const dates = Object.keys(data.rates).sort();
    for (const day of dates) {
        const dayRates = data.rates[day];
        for (const code in dayRates) {
            (history[code] ??= []).push(dayRates[code]);
        }
    }

    for (const code in history) {
        const series = history[code];
        if (series.length >= 2) {
            const prev = series[series.length - 2];
            const last = series[series.length - 1];
            if (prev) changes[code] = ((last - prev) / prev) * 100;
        }
    }

    return { changes, history };
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const baseCurrency = searchParams.get('base') ?? 'EUR';

    const setBaseCurrency = (code: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('base', code);
            return next;
        }, { replace: true });
    };

    const { currencies, isLoading: currenciesLoading } = useCurrencies();
    const { rates, date, isLoading: ratesLoading, error } = useLatestRates(baseCurrency);

    // One shared short range (all currencies) powers deltas + sparklines.
    const { start, end } = getLastNDays(8);
    const { data: rangeData } = useHistoricalRates(start, end, baseCurrency);
    const { changes, history } = deriveSeries(rangeData);

    const convert = (from: string, to: string, amount: number): number | null => {
        if (!rates) return null;
        const fromRate = from === baseCurrency ? 1 : rates[from];
        const toRate = to === baseCurrency ? 1 : rates[to];
        if (!fromRate || !toRate) return null;
        return amount * (toRate / fromRate);
    };

    const value: CurrencyContextValue = {
        currencies,
        rates,
        date,
        baseCurrency,
        setBaseCurrency,
        isLoading: currenciesLoading || ratesLoading,
        error,
        convert,
        changes,
        history,
    };

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
