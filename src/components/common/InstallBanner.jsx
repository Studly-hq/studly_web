import { useState, useEffect } from 'react';
import { Download, X, Loader2, Share } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(window.deferredPwaPrompt);
    const [dismissed, setDismissed] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        // 1. Check if already installed
        const standalone = window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
        setIsStandalone(standalone);

        // 2. Check if dismissed this session
        const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed');
        if (wasDismissed) setDismissed(true);

        // 3. Detect Safari
        const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        setIsSafari(isSafariBrowser);

        // 4. Listen for the global prompt update
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

    // ONLY hide if already installed, dismissed
    // For non-Safari, also hide if no native prompt is available
    if (isStandalone || dismissed) return null;

    // If not Safari and no native prompt, hide
    if (!isSafari && !deferredPrompt) return null;

    // If Safari but no native prompt (expected), we show the banner with instructions
    const showSafariHint = isSafari && !deferredPrompt;

    return (
        <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]
                 w-[calc(100%-1.5rem)] max-w-md
                 bg-reddit-card border border-reddit-border
                 rounded-2xl
                 px-4 py-3.5 flex items-center gap-3
                 animate-slide-down transition-all duration-300"
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-reddit-orange flex items-center justify-center">
                <Download size={22} className="text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-white leading-tight">Install Studly</p>
                <p className="text-[13px] text-reddit-textMuted leading-tight mt-1 font-medium">Add to home screen for the best experience</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {showSafariHint ? (
                    <div className="flex flex-col items-center justify-center bg-white/5 border border-reddit-border rounded-xl px-2.5 py-1.5 min-w-[100px]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-reddit-textMuted font-semibold">Tap</span>
                            <Share size={14} className="text-blue-400" />
                        </div>
                        <div className="text-[11px] text-reddit-orange font-bold whitespace-nowrap">"Add to Home Screen"</div>
                    </div>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInstall}
                        disabled={installing}
                        className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-bold
                           bg-reddit-orange text-white flex items-center justify-center min-w-[85px]
                           hover:brightness-110
                           active:scale-95 transition-all duration-150
                           disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation cursor-pointer"
                    >
                        {installing ? <Loader2 size={18} className="animate-spin text-white" /> : 'Install'}
                    </motion.button>
                )}

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1.5 rounded-xl text-reddit-textMuted hover:text-white
                       hover:bg-white/5 transition-all touch-manipulation cursor-pointer"
                    aria-label="Dismiss install banner"
                >
                    <X size={18} />
                </motion.button>
            </div>
        </div>
    );
}
