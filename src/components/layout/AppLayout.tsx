import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { List, MagnifyingGlass } from '@phosphor-icons/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ErrorState } from '@/components/layout/ErrorState';
import { CommandPalette } from '@/components/CommandPalette';
import { RouteSkeleton } from '@/components/layout/RouteSkeleton';
import Footer from '@/components/Footer';
import { Select } from '@/components/ui/Select';
import { useCurrencyContext } from '@/features/currency/useCurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouteFocus } from '@/hooks/useRouteFocus';

export default function AppLayout() {
    const { currencies, baseCurrency, setBaseCurrency, date, isLoading, rates, error } = useCurrencyContext();
    const [collapsed, setCollapsed] = useLocalStorage('cambio:sidebar-collapsed', false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const mainRef = useRouteFocus<HTMLElement>();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setPaletteOpen((o) => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (error && !rates) {
        return <ErrorState message={error.message} />;
    }

    const hasCurrencies = Object.keys(currencies).length > 0;
    const loadingFirst = isLoading && !rates;

    return (
        <div className="min-h-screen flex">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white"
            >
                Skip to content
            </a>

            <Sidebar
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed((v) => !v)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className={`flex-1 min-w-0 flex flex-col transition-[margin] duration-300 ${collapsed ? 'md:ml-[76px]' : 'md:ml-64'}`}>
                <header className="sticky top-0 z-40 flex items-center gap-3 h-16 px-4 sm:px-6 border-b border-white/10 bg-[#080b16]/70 backdrop-blur-xl">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                        aria-controls="mobile-nav"
                        aria-expanded={mobileOpen}
                        className="md:hidden p-2 -ml-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                        <List className="w-6 h-6" aria-hidden="true" />
                    </button>

                    <div className="flex-1 min-w-0 flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px] shadow-green-500/60 animate-pulse shrink-0" aria-hidden="true"></span>
                        {date
                            ? <span className="truncate nums">Updated {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            : <span className="truncate">Connecting to live feed…</span>}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPaletteOpen(true)}
                        aria-label="Search pages and currencies (Ctrl K)"
                        className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg shrink-0"
                    >
                        <MagnifyingGlass className="w-5 h-5" aria-hidden="true" />
                    </button>

                    {hasCurrencies && (
                        <Select
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value)}
                            aria-label="Base currency"
                            className="w-[116px] shrink-0"
                        >
                            {Object.keys(currencies).map((code) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </Select>
                    )}
                </header>

                <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
                    {loadingFirst ? <RouteSkeleton /> : <Outlet />}
                </main>

                <Footer />
            </div>

            {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
        </div>
    );
}
