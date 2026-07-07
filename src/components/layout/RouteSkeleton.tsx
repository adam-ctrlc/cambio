import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Skeleton } from '@/components/ui/Skeleton';

function Container({ children, max = 'max-w-7xl' }: { children: ReactNode; max?: string }) {
    return <div className={`${max} mx-auto px-4 sm:px-6 lg:px-8 py-8`} aria-busy="true" aria-label="Loading…">{children}</div>;
}

function HeaderSkel({ action }: { action?: ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <Skeleton className="hidden sm:block w-11 h-11 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-3.5 w-56" />
                </div>
            </div>
            {action}
        </div>
    );
}

function RowGrid({ count }: { count: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="h-[70px] rounded-xl" />
            ))}
        </div>
    );
}

function CardGrid({ count, height }: { count: number; height: string }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className={`${height} rounded-2xl`} />
            ))}
        </div>
    );
}

export function RouteSkeleton() {
    const { pathname } = useLocation();

    switch (pathname) {
        case '/converter':
            return (
                <Container>
                    <HeaderSkel />
                    <div className="max-w-lg">
                        <Skeleton className="h-[420px] rounded-2xl" />
                    </div>
                </Container>
            );

        case '/charts':
        case '/compare':
            return (
                <Container>
                    <HeaderSkel />
                    <Skeleton className="h-[460px] rounded-2xl" />
                </Container>
            );

        case '/travel':
            return (
                <Container>
                    <HeaderSkel />
                    <Skeleton className="h-[520px] rounded-3xl" />
                </Container>
            );

        case '/watchlist':
            return (
                <Container>
                    <HeaderSkel />
                    <CardGrid count={6} height="h-36" />
                </Container>
            );

        case '/time-machine':
            return (
                <Container>
                    <HeaderSkel action={<Skeleton className="h-11 w-44 rounded-xl" />} />
                    <RowGrid count={12} />
                </Container>
            );

        case '/rates':
            return (
                <Container>
                    <HeaderSkel action={<Skeleton className="h-11 w-full sm:w-64 rounded-xl" />} />
                    <div className="mb-4 flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-11 w-40 rounded-xl" />
                    </div>
                    <RowGrid count={16} />
                </Container>
            );

        default:
            // Dashboard and any fallback
            return (
                <Container>
                    <HeaderSkel />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-[104px] rounded-2xl" />
                        ))}
                    </div>
                    <CardGrid count={2} height="h-52" />
                </Container>
            );
    }
}
