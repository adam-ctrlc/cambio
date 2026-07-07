import type { Icon } from '@phosphor-icons/react';
import {
    SquaresFour,
    Wallet,
    ArrowsLeftRight,
    ChartLine,
    Scales,
    Star,
    ClockCounterClockwise,
    Airplane,
} from '@phosphor-icons/react';

export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: Icon;
}

export const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: SquaresFour },
    { id: 'rates', label: 'Rates', path: '/rates', icon: Wallet },
    { id: 'converter', label: 'Converter', path: '/converter', icon: ArrowsLeftRight },
    { id: 'charts', label: 'Charts', path: '/charts', icon: ChartLine },
    { id: 'compare', label: 'Compare', path: '/compare', icon: Scales },
    { id: 'watchlist', label: 'Watchlist', path: '/watchlist', icon: Star },
    { id: 'time-machine', label: 'Time Machine', path: '/time-machine', icon: ClockCounterClockwise },
    { id: 'travel', label: 'Travel', path: '/travel', icon: Airplane },
];
