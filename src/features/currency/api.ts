import { useFetch } from '@/hooks/useFetch';
import type {
    Currencies,
    HistoricalRatesResponse,
    LatestRatesResponse,
} from '@/features/currency/types';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export function useLatestRates(base = 'EUR') {
    const { data, error, isLoading } = useFetch<LatestRatesResponse>(
        `${BASE_URL}/latest?base=${base}`,
        { refreshInterval: 60000, keepPreviousData: true },
    );

    return {
        rates: data?.rates,
        date: data?.date,
        isLoading,
        error,
    };
}

export function useCurrencies() {
    const { data, error, isLoading } = useFetch<Currencies>(`${BASE_URL}/currencies`);

    return {
        currencies: data ?? {},
        isLoading,
        error,
    };
}

export function useHistoricalRates(
    startDate: string | null,
    endDate: string | null,
    base = 'EUR',
    symbols: string | null = null,
) {
    const url = startDate && endDate
        ? `${BASE_URL}/${startDate}..${endDate}?base=${base}${symbols ? `&symbols=${symbols}` : ''}`
        : null;

    const { data, error, isLoading } = useFetch<HistoricalRatesResponse>(url);

    return {
        data,
        isLoading,
        error,
    };
}

export function useRatesOnDate(date: string | null, base = 'EUR', symbols: string | null = null) {
    const url = date
        ? `${BASE_URL}/${date}?base=${base}${symbols ? `&symbols=${symbols}` : ''}`
        : null;

    const { data, error, isLoading } = useFetch<LatestRatesResponse>(url);

    return {
        data,
        isLoading,
        error,
    };
}

export async function convertCurrency(from: string, to: string, amount: number): Promise<string> {
    try {
        const response = await fetch(`${BASE_URL}/latest?base=${from}&symbols=${to}`);
        if (!response.ok) throw new Error('Failed to convert currency');
        const data = await response.json() as LatestRatesResponse;
        return (amount * data.rates[to]).toFixed(2);
    } catch (error) {
        console.error('Error converting currency:', error);
        throw error;
    }
}
