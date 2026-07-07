import { useEffect, useState } from 'react';

const fetchJson = async <T>(url: string, signal: AbortSignal): Promise<T> => {
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error('An error occurred while fetching the data.');
    }
    return response.json() as Promise<T>;
};

interface FetchOptions {
    refreshInterval?: number;
    keepPreviousData?: boolean;
}

interface FetchState<T> {
    data: T | undefined;
    error: Error | undefined;
    isLoading: boolean;
}

export function useFetch<T>(
    url: string | null,
    { refreshInterval = 0, keepPreviousData = false }: FetchOptions = {},
): FetchState<T> {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(url));

    useEffect(() => {
        if (!url) return;

        let active = true;
        const controller = new AbortController();

        const load = async () => {
            if (!keepPreviousData) {
                setIsLoading(true);
            }
            try {
                const json = await fetchJson<T>(url, controller.signal);
                if (!active) return;
                setData(json);
                setError(undefined);
            } catch (err) {
                if (!active || (err instanceof Error && err.name === 'AbortError')) return;
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                if (active) setIsLoading(false);
            }
        };

        load();

        const interval = refreshInterval ? setInterval(load, refreshInterval) : null;

        return () => {
            active = false;
            controller.abort();
            if (interval) clearInterval(interval);
        };
    }, [url, refreshInterval, keepPreviousData]);

    if (!url) {
        return { data: undefined, error: undefined, isLoading: false };
    }

    return { data, error, isLoading };
}
