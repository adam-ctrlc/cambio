import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useWatchlist() {
    const [codes, setCodes] = useLocalStorage<string[]>('cambio:watchlist', []);

    const toggle = (code: string) => {
        setCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    };

    const has = (code: string) => codes.includes(code);

    return { codes, toggle, has };
}
