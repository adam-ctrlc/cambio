import { NavLink } from 'react-router';
import { Wallet, X, CaretLeft } from '@phosphor-icons/react';
import { navItems } from '@/components/layout/navItems';
import type { NavItem } from '@/components/layout/navItems';

interface SidebarLinkProps {
    item: NavItem;
    collapsed: boolean;
    onClick?: () => void;
}

function SidebarLink({ item, collapsed, onClick }: SidebarLinkProps) {
    const Icon = item.icon;
    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${
                    isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
            }
        >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
    );
}

function Brand({ compact }: { compact?: boolean }) {
    return (
        <span className="flex items-center gap-2.5">
            <span className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 shrink-0">
                <Wallet className="w-5 h-5 text-white" aria-hidden="true" />
            </span>
            {!compact && (
                <span className="text-lg font-bold text-white tracking-tight" translate="no">
                    Cam<span className="text-blue-400">bio</span>
                </span>
            )}
        </span>
    );
}

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
    return (
        <>
            {/* Desktop rail */}
            <aside
                className={`hidden md:flex flex-col fixed top-0 left-0 z-30 h-screen border-r border-white/10 bg-[#0a0e1c]/80 backdrop-blur-xl transition-[width] duration-300 ${
                    collapsed ? 'w-[76px]' : 'w-64'
                }`}
            >
                <div className={`flex items-center h-16 px-4 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
                    <Brand compact={collapsed} />
                </div>
                <nav aria-label="Primary" className="flex-1 overflow-y-auto p-3 space-y-1">
                    {navItems.map((item) => (
                        <SidebarLink key={item.id} item={item} collapsed={collapsed} />
                    ))}
                </nav>
                <div className="p-3 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`}
                    >
                        <CaretLeft className={`w-5 h-5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`} aria-hidden="true" />
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile drawer */}
            <div
                className={`md:hidden fixed inset-0 z-[95] bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onCloseMobile}
                aria-hidden="true"
            />
            <aside
                id="mobile-nav"
                aria-label="Primary"
                aria-hidden={!mobileOpen}
                className={`md:hidden fixed inset-y-0 left-0 z-[96] w-72 max-w-[82%] flex flex-col bg-[#0a0e1c] border-r border-white/10 transition-transform duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                    <Brand />
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        aria-label="Close menu"
                        className="p-2 -mr-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {navItems.map((item) => (
                        <SidebarLink key={item.id} item={item} collapsed={false} onClick={onCloseMobile} />
                    ))}
                </nav>
            </aside>
        </>
    );
}
