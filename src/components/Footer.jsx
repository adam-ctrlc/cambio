import { TrendingUp, ExternalLink, Check } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 mt-20 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/20">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xl font-bold text-white">Exchange Rates</span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Real-time currency exchange rates powered by institutional sources.
                        </p>
                    </div>

                    {/* Data Source */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Data Source</h3>
                        <a
                            href="https://frankfurter.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
                        >
                            <span>Frankfurter API</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <p className="text-xs text-gray-500">
                            Free, open-source currency data API tracking reference exchange rates from the European Central Bank.
                        </p>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Information</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Check className="w-4 h-4 inline-block mr-1 text-blue-500" /> Real-time exchange rates</li>
                            <li><Check className="w-4 h-4 inline-block mr-1 text-blue-500" /> Historical data & charts</li>
                            <li><Check className="w-4 h-4 inline-block mr-1 text-blue-500" /> Currency converter</li>
                            <li><Check className="w-4 h-4 inline-block mr-1 text-blue-500" /> 30+ currencies supported</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-sm text-gray-400 text-center">
                        © {currentYear} Exchange Rates. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
