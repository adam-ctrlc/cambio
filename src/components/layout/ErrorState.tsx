import { Warning } from '@phosphor-icons/react';

interface ErrorStateProps {
    message?: string;
}

export function ErrorState({ message }: ErrorStateProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center glass p-10 sm:p-12 rounded-3xl max-w-md" role="alert" aria-live="assertive">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                    <Warning className="w-8 h-8 text-red-400" aria-hidden="true" />
                </div>
                <h1 className="text-white text-2xl mb-2 font-bold">Something Went Wrong</h1>
                <p className="text-gray-400">{message || "We couldn't reach the exchange feed. Check your connection and try again."}</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl font-medium"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
