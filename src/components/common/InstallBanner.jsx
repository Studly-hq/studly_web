import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        const installedHandler = () => {
            setVisible(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installedHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        setInstalling(true);
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setVisible(false);
        }
        setDeferredPrompt(null);
        setInstalling(false);
    };

    const handleDismiss = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
                 w-[calc(100%-2rem)] max-w-md
                 bg-reddit-card/95 backdrop-blur-lg border border-reddit-border
                 rounded-2xl shadow-2xl shadow-black/40
                 px-4 py-3 flex items-center gap-3
                 animate-slide-down"
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Download size={20} className="text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-reddit-text leading-tight">Install Studly</p>
                <p className="text-xs text-reddit-textMuted leading-tight mt-0.5">Add to your home screen for quick access</p>
            </div>

            {/* Actions */}
            <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
                   bg-gradient-to-r from-blue-500 to-purple-600 text-white
                   hover:from-blue-400 hover:to-purple-500
                   active:scale-95 transition-all duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {installing ? '...' : 'Install'}
            </button>

            <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-full text-reddit-textMuted hover:text-reddit-text
                   hover:bg-reddit-cardHover transition-colors"
                aria-label="Dismiss install banner"
            >
                <X size={16} />
            </button>
        </div>
    );
}
