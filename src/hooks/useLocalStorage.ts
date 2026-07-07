import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });

    const set = (next: T | ((prev: T) => T)) => {
        setValue((prev) => {
            const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
            try {
                localStorage.setItem(key, JSON.stringify(resolved));
            } catch {
                // ignore write failures (private mode / quota)
            }
            return resolved;
        });
    };

    return [value, set] as const;
}
