import { useState, useEffect, useCallback, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';
import { getStudyToken } from '../api/profile';
import client, { setAuthToken } from '../api/client';

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
    const { openPaywall, setIsLucidDetailedMode } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });
    const [activeToken, setActiveToken] = useState(null);
    const iframeRef = useRef(null);
    const [isLucidReady, setIsLucidReady] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);

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

    /**
     * Give the Lucid iframe the current Supabase access token so it can call
     * studly_server's aura endpoints directly (Bearer auth). The session is
     * refreshed first when `forceRefresh` is set, since Lucid only asks when
     * its copy is missing or was rejected as expired.
     */
    const supplySupabaseToken = useCallback(async (forceRefresh = false) => {
        if (!isAuthenticated) return;

        let token = localStorage.getItem('token');
        if (forceRefresh || !token) {
            try {
                const cachedRefreshToken = localStorage.getItem('refresh_token');
                const body = cachedRefreshToken ? { refresh_token: cachedRefreshToken } : {};
                const response = await client.post("/auth/refresh-token", body);
                if (response.data?.token) {
                    localStorage.setItem('token', response.data.token);
                    if (response.data.refresh_token) {
                        localStorage.setItem('refresh_token', response.data.refresh_token);
                    }
                    setAuthToken(response.data.token);
                    token = response.data.token;
                }
            } catch {
                // Refresh unavailable — fall through with whatever token we hold
            }
        }

        if (token && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'SUPABASE_TOKEN', token },
                LUCID_ORIGIN
            );
        }
    }, [isAuthenticated]);

    // Token rotated anywhere in the app (auto-refresh interceptor) — push the
    // fresh copy into the iframe immediately.
    useEffect(() => {
        const handleTokenRotated = (event) => {
            const token = event.detail;
            if (token && iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    { type: 'SUPABASE_TOKEN', token },
                    LUCID_ORIGIN
                );
            }
        };
        window.addEventListener('auth:token', handleTokenRotated);
        return () => window.removeEventListener('auth:token', handleTokenRotated);
    }, []);

    // Listen for messages from Lucid
    useEffect(() => {
        const handleMessage = (event) => {
            // Reject untrusted origins
            if (!ALLOWED_ORIGINS.has(event.origin)) return;

            if (event.data?.type === 'LUCID_READY') {
                setIsLucidReady(true);
            } else if (event.data?.type === 'QUOTA_EXCEEDED') {
                openPaywall(event.data?.reason || 'upload', event.data?.message || null);
            } else if (event.data?.type === 'PRO_FEATURE_REQUIRED') {
                openPaywall('feature');
            } else if (event.data?.type === 'DETAILED_MODE_CHANGE') {
                setIsLucidDetailedMode(event.data.isDetailedMode);
            } else if (event.data?.type === 'REQUEST_SUPABASE_TOKEN') {
            // Lucid needs the current Supabase access token (expired, rotated,
            // or never received). Refresh the session quietly and hand it over.
            supplySupabaseToken(true);
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
    }, [openPaywall, setIsLucidDetailedMode, setTheme, supplySupabaseToken]);

    /**
     * Entitlement changed (payment verified, voucher redeemed, plan expired).
     * Lucid caches plan state in its session cookie, so the only reliable way
     * to hand it fresh entitlements is a new short lived study token, which
     * means a fresh iframe mount.
     */
    useEffect(() => {
        const handlePlanUpdated = () => {
            setCachedStudyToken({ token: null, timestamp: 0 });
            setActiveToken(null);
            setIsLucidReady(false);
            setFetchError(false);
            setIframeKey((key) => key + 1);
        };

        window.addEventListener('plan:updated', handlePlanUpdated);
        return () => window.removeEventListener('plan:updated', handlePlanUpdated);
    }, []);

    // Send token to Lucid via postMessage when both are ready
    useEffect(() => {
        if (isLucidReady && activeToken && iframeRef.current) {
            // Send auth token + theme in one batched message
            iframeRef.current.contentWindow?.postMessage(
                { type: 'AUTH_TOKEN', token: activeToken, theme },
                LUCID_ORIGIN
            );

            // Relay the live Supabase access token so Lucid can call the
            // aura endpoints directly ( Lucid has no Supabase session of its own).
            const supabaseToken = localStorage.getItem('token');
            if (supabaseToken) {
                iframeRef.current.contentWindow?.postMessage(
                    { type: 'SUPABASE_TOKEN', token: supabaseToken },
                    LUCID_ORIGIN
                );
            }

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
                key={iframeKey}
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
