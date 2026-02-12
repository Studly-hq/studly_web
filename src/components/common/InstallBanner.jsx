import { useState, useEffect } from 'react';
import { Download, X, Loader2 } from 'lucide-react';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(window.deferredPwaPrompt);
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        setIsStandalone(standalone);

        // 2. Check if dismissed this session
        const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
        if (wasDismissed) setDismissed(true);

        // 3. Listen for the global prompt update
        const handlePromptReady = () => {
            setDeferredPrompt(window.deferredPwaPrompt);
        };

        // Also add direct listener in case index.html script didn't run or missed it
        const handler = (e) => {
            e.preventDefault();
            window.deferredPwaPrompt = e;
            setDeferredPrompt(e);
        };

        const installedHandler = () => {
            setDismissed(true);
            setDeferredPrompt(null);
            window.deferredPwaPrompt = null;
        };

        window.addEventListener('pwa-prompt-ready', handlePromptReady);
        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', installedHandler);

        return () => {
            window.removeEventListener('pwa-prompt-ready', handlePromptReady);
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', installedHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        setInstalling(true);
        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDismissed(true);
            }
        } catch (err) {
            console.error('Install prompt failed:', err);
        } finally {
            setDeferredPrompt(null);
            window.deferredPwaPrompt = null;
            setInstalling(false);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('pwa-banner-dismissed', 'true');
    };

    // ONLY hide if already installed, dismissed, or the browser definitely won't fire the prompt
    // We keep it hidden until deferredPrompt exists to avoid a button that does nothing
    if (isStandalone || dismissed || !deferredPrompt) return null;

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
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-reddit-orange flex items-center justify-center">
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
                   bg-reddit-orange text-white flex items-center justify-center min-w-[80px]
                   hover:brightness-110
                   active:scale-95 transition-all duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {installing ? <Loader2 size={18} className="animate-spin text-white" /> : 'Install'}
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
