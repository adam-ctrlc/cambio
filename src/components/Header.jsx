import { useId } from 'react';
import { Search, TrendingUp } from 'lucide-react';

export default function Header({ searchTerm, onSearchChange, lastUpdate }) {
    const searchId = useId();

    return (
        <header className="glass z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 animate-fade-in">
                        <div className="bg-blue-600/20 p-3 rounded-2xl backdrop-blur-md border border-blue-500/20">
                            <TrendingUp className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Exchange Rates</h1>
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {lastUpdate ? new Date(lastUpdate).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                }) : 'Connecting to live feed...'}
                            </p>
                        </div>
                    </div>

                    <div className="relative animate-slide-in w-full md:w-96">
                        <label htmlFor={searchId} className="sr-only">Search currencies</label>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            id={searchId}
                            type="text"
                            placeholder="Search currencies..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-gray-500 hover:border-white/20"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
