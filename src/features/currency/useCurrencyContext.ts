import { createContext, useContext } from 'react';
import type { Currencies, Rates } from '@/features/currency/types';

export interface CurrencyContextValue {
    currencies: Currencies;
    rates: Rates | undefined;
    date: string | undefined;
    baseCurrency: string;
    setBaseCurrency: (code: string) => void;
    isLoading: boolean;
    error: Error | undefined;
    /** Pure cross-rate using the shared latest rates (no network). */
    convert: (from: string, to: string, amount: number) => number | null;
    /** Day-over-day percentage change per currency code. */
    changes: Record<string, number>;
    /** Ascending short price history per currency code (for sparklines). */
    history: Record<string, number[]>;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function useCurrencyContext(): CurrencyContextValue {
    const ctx = useContext(CurrencyContext);
    if (!ctx) {
        throw new Error('useCurrencyContext must be used within a CurrencyProvider');
    }
    return ctx;
}
