import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { navItems } from '@/components/layout/navItems';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';

interface CommandItem {
    id: string;
    title: string;
    subtitle: string;
    hint: string;
    onSelect: () => void;
}

interface CommandPaletteProps {
    onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
    const navigate = useNavigate();
    const { currencies, setBaseCurrency } = useCurrencyContext();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const items = useMemo<CommandItem[]>(() => {
        const routes = navItems.map((n) => ({
            id: `route:${n.id}`,
            title: n.label,
            subtitle: n.path,
            hint: 'Page',
            onSelect: () => { navigate(n.path); onClose(); },
        }));
        const curs = Object.entries(currencies).map(([code, name]) => ({
            id: `cur:${code}`,
            title: code,
            subtitle: name,
            hint: 'Set base',
            onSelect: () => { setBaseCurrency(code); navigate('/rates'); onClose(); },
        }));
        return [...routes, ...curs];
    }, [currencies, navigate, setBaseCurrency, onClose]);

    const q = query.trim().toLowerCase();
    const filtered = (q
        ? items.filter((it) => it.title.toLowerCase().includes(q) || it.subtitle.toLowerCase().includes(q))
        : items
    ).slice(0, 40);

    const activeItem = filtered[Math.min(active, filtered.length - 1)];

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                activeItem?.onSelect();
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className="relative w-full max-w-lg glass rounded-2xl shadow-2xl border border-white/10 p-2"
            >
                <div className="flex items-center gap-2 px-3 rounded-xl bg-white/5 border border-white/10">
                    <MagnifyingGlass className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        type="text"
                        autoComplete="off"
                        spellCheck={false}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                        onKeyDown={onKeyDown}
                        placeholder="Jump to a page or currency…"
                        aria-label="Search pages and currencies"
                        className="flex-1 bg-transparent text-white py-3 focus:outline-none placeholder-gray-500"
                    />
                </div>

                <div role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto mt-2">
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-8">No matches.</p>
                    ) : (
                        filtered.map((it, i) => (
                            <button
                                key={it.id}
                                type="button"
                                role="option"
                                aria-selected={i === active}
                                onClick={it.onSelect}
                                onMouseEnter={() => setActive(i)}
                                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left ${
                                    i === active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5'
                                }`}
                            >
                                <span className="flex items-baseline gap-2 min-w-0">
                                    <span className="font-medium" translate="no">{it.title}</span>
                                    <span className={`text-xs truncate ${i === active ? 'text-white/70' : 'text-gray-500'}`}>{it.subtitle}</span>
                                </span>
                                <span className={`text-[11px] shrink-0 px-1.5 py-0.5 rounded ${i === active ? 'bg-white/20' : 'bg-white/5 text-gray-400'}`}>{it.hint}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
