import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading exchange data…">
            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass rounded-2xl p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-36" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                                <Skeleton className="w-12 h-12 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Rates grid */}
                <div className="mt-14 space-y-6">
                    <Skeleton className="h-8 w-52" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="glass rounded-2xl p-6 space-y-4">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-9 w-28 mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
