import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // Don't show if already installed as PWA
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        setIsStandalone(standalone);

        // Don't show if user previously dismissed
        const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
        if (wasDismissed) setDismissed(true);

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const installedHandler = () => {
            setDismissed(true);
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
        // If native prompt is available, use it
        if (deferredPrompt) {
            setInstalling(true);
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDismissed(true);
            }
            setDeferredPrompt(null);
            setInstalling(false);
            return;
        }

        // Otherwise show manual instructions based on platform
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isIOS || isSafari) {
            alert('To install Studly:\n\n1. Tap the Share button (📤)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
        } else {
            alert('To install Studly:\n\n1. Tap the browser menu (⋮)\n2. Tap "Install app" or "Add to Home Screen"\n3. Confirm the installation');
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('pwa-banner-dismissed', 'true');
    };

    // Don't show if already installed or dismissed
    if (isStandalone || dismissed) return null;

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
