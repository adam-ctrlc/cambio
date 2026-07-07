import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
                {icon && (
                    <span className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-400 shrink-0">
                        {icon}
                    </span>
                )}
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">{title}</h1>
                    {subtitle && <p className="text-sm text-gray-400 mt-0.5 truncate">{subtitle}</p>}
                </div>
            </div>
            {children && <div className="flex flex-wrap items-center gap-3 shrink-0">{children}</div>}
        </div>
    );
}
