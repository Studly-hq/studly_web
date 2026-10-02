import { useState, useEffect, useCallback, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';
import { getStudyToken } from '../api/profile';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';
const LUCID_ORIGIN = new URL(LUCID_URL).origin;

/** Allowed origins for cross-frame messages — prevents spoofed events */
const ALLOWED_ORIGINS = new Set([
    LUCID_ORIGIN,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]);

/**
 * v3 Home — the Lucid iframe as the primary dashboard surface.
 * Token flow: studly_server issue → URL param + postMessage on LUCID_READY.
 * Listens back for quota/upsell/detailed-mode events.
 */
const Home = () => {
    const { isAuthenticated } = useAuth();
    const { theme, setTheme } = useTheme();
    const { setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage, setIsLucidDetailedMode } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });
    const [activeToken, setActiveToken] = useState(null);
    const iframeRef = useRef(null);
    const [isLucidReady, setIsLucidReady] = useState(false);

    const fetchTokenAndStart = useCallback(async () => {
        if (!isAuthenticated) return;

        const isTokenFresh = cachedStudyToken.token && (Date.now() - cachedStudyToken.timestamp < 55000);

        try {
            setIsLoading(true);
            let token = cachedStudyToken.token;

            if (!isTokenFresh) {
                token = await getStudyToken();
                setCachedStudyToken({ token, timestamp: Date.now() });
            }

            setActiveToken(token);
            setFetchError(false);
        } catch (error) {
            console.error('Failed to get study token:', error);
            setFetchError(true);
            try {
                const freshToken = await getStudyToken();
                setActiveToken(freshToken);
                setFetchError(false);
            } catch (innerError) {
                console.error('Final attempt failed:', innerError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, cachedStudyToken]);

    useEffect(() => {
        if (isAuthenticated && !activeToken && !isLoading && !fetchError) {
            fetchTokenAndStart();
        }
    }, [isAuthenticated, activeToken, isLoading, fetchError, fetchTokenAndStart]);

    // Listen for messages from Lucid
    useEffect(() => {
        const handleMessage = (event) => {
            // Reject untrusted origins
            if (!ALLOWED_ORIGINS.has(event.origin)) return;

            if (event.data?.type === 'LUCID_READY') {
                setIsLucidReady(true);
            } else if (event.data?.type === 'QUOTA_EXCEEDED') {
                setUpgradeReason('limit_reached');
                setCustomUpgradeMessage(event.data?.message || null);
                setShowUpgradeModal(true);
            } else if (event.data?.type === 'PRO_FEATURE_REQUIRED') {
                setUpgradeReason('study_upsell');
                setCustomUpgradeMessage(null);
                setShowUpgradeModal(true);
            } else if (event.data?.type === 'DETAILED_MODE_CHANGE') {
                setIsLucidDetailedMode(event.data.isDetailedMode);
            } else if (event.data?.type === 'LUCID_THEME') {
                // User changed theme inside Lucid — sync it back to studly_web
                if (event.data.theme) {
                    localStorage.setItem('studly_theme', event.data.theme);
                    setTheme(event.data.theme);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage, setIsLucidDetailedMode]);

    // Send token to Lucid via postMessage when both are ready
    useEffect(() => {
        if (isLucidReady && activeToken && iframeRef.current) {
            // Send auth token + theme in one batched message
            iframeRef.current.contentWindow?.postMessage(
                { type: 'AUTH_TOKEN', token: activeToken, theme },
                LUCID_ORIGIN
            );
            // Also send standalone THEME_UPDATE for subsequent theme changes
            iframeRef.current.contentWindow?.postMessage(
                { type: 'THEME_UPDATE', theme },
                LUCID_ORIGIN
            );
        }
    }, [isLucidReady, activeToken, theme]);

    // Reset detailed mode state when leaving Home
    useEffect(() => {
        return () => {
            setIsLucidDetailedMode(false);
        };
    }, [setIsLucidDetailedMode]);

    if (!isAuthenticated) return null;

    return (
        <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-background">
            {(!activeToken || !isLucidReady) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
                    <HugeiconsIcon icon={Loading03Icon} size={40} strokeWidth={2} className="animate-spin text-reddit-orange" />
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={`${LUCID_URL}?token=${activeToken || ''}`}
                className={`h-full w-full flex-1 border-none transition-opacity duration-300 ${(!activeToken || !isLucidReady) ? 'opacity-0' : 'opacity-100'}`}
                title="Study App"
                allow="clipboard-read; clipboard-write"
            />
        </div>
    );
};

export default Home;
