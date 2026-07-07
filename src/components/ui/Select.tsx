import type { SelectHTMLAttributes } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    /** Classes for the wrapper (use for width/layout). */
    className?: string;
}

export function Select({ className, children, ...props }: SelectProps) {
    return (
        <div className={twMerge('relative w-full', className)}>
            <select
                {...props}
                className="w-full appearance-none cursor-pointer bg-white/5 border border-white/10 text-white pl-4 pr-10 py-3 rounded-xl font-medium focus:outline-none focus:border-blue-500/50 focus:bg-white/10 hover:border-white/20"
            >
                {children}
            </select>
            <CaretDown
                weight="bold"
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
        </div>
    );
}
