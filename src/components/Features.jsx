import { Zap, Globe, Shield, Smartphone } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: Zap,
            title: "Real-Time Data",
            description: "Live exchange rates updated every minute from reliable institutional sources."
        },
        {
            icon: Globe,
            title: "Global Coverage",
            description: "Support for over 30 major currencies and exchange rates worldwide."
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Bank-grade data accuracy ensuring your conversions are always precise."
        },
        {
            icon: Smartphone,
            title: "Mobile First",
            description: "Responsive design that works perfectly on desktop, tablet, and mobile devices."
        }
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={feature.title}
                            className={`glass p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 animate-fade-in`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
