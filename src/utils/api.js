import useSWR from 'swr';

const BASE_URL = 'https://api.frankfurter.dev/v1';

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return response.json();
};

export function useLatestRates(base = 'EUR') {
    const { data, error, isLoading } = useSWR(
        `${BASE_URL}/latest?base=${base}`,
        fetcher,
        {
            refreshInterval: 60000, // Refresh every minute
            revalidateOnFocus: false,
            keepPreviousData: true,
        }
    );

    return {
        rates: data?.rates,
        date: data?.date,
        isLoading,
        error,
    };
}

export function useCurrencies() {
    const { data, error, isLoading } = useSWR(
        `${BASE_URL}/currencies`,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 3600000, // Cache for 1 hour
        }
    );

    return {
        currencies: data || {},
        isLoading,
        error,
    };
}

export function useHistoricalRates(startDate, endDate, base = 'EUR', symbols = null) {
    const url = startDate && endDate
        ? `${BASE_URL}/${startDate}..${endDate}?base=${base}${symbols ? `&symbols=${symbols}` : ''}`
        : null;

    const { data, error, isLoading } = useSWR(url, fetcher);

    return {
        data,
        isLoading,
        error,
    };
}

export async function convertCurrency(from, to, amount) {
    try {
        const response = await fetch(`${BASE_URL}/latest?base=${from}&symbols=${to}`);
        if (!response.ok) throw new Error('Failed to convert currency');
        const data = await response.json();
        return (amount * data.rates[to]).toFixed(2);
    } catch (error) {
        console.error('Error converting currency:', error);
        throw error;
    }
}

export function getLastNDays(days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
    };
}
