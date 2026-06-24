import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, GraduationCap, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getStudyToken } from '../api/profile';
import SEO from '../components/common/SEO';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';

const Study = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const { setShowAuthModal, setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage, setIsLeftSidebarCollapsed, setIsRightSidebarCollapsed, setIsLucidDetailedMode } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [retryAfter, setRetryAfter] = useState(null);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });
    const [activeToken, setActiveToken] = useState(null);
    const iframeRef = useRef(null);
    const [isLucidReady, setIsLucidReady] = useState(false);

    const fetchTokenAndStart = useCallback(async () => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

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
            setRetryAfter(null);
        } catch (error) {
            console.error('Failed to get study token:', error);
            setFetchError(true);

            // Extract rate-limit wait time from server response
            if (error.response?.status === 429) {
                const waitSeconds = error.response?.data?.retry_after
                    || parseInt(error.response?.headers?.['retry-after'], 10)
                    || 60;
                setRetryAfter(waitSeconds);
                setRetryCountdown(waitSeconds);
            } else {
                setRetryAfter(null);
                // Don't retry immediately on 429 — it will just consume more rate-limit quota
                // and cause a cascade of failures. Let the user try again manually.
                try {
                    const freshToken = await getStudyToken();
                    setActiveToken(freshToken);
                    setFetchError(false);
                } catch (innerError) {
                    console.error('Final attempt failed:', innerError);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, cachedStudyToken, setShowAuthModal]);

    // Countdown timer for rate-limited state
    useEffect(() => {
        if (retryCountdown <= 0) return;
        const interval = setInterval(() => {
            setRetryCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [retryCountdown]);

    // Auto-minimize sidebars when entering Study Hub (particularly on desktop)
    useEffect(() => {
        if (setIsLeftSidebarCollapsed && setIsRightSidebarCollapsed) {
            setIsLeftSidebarCollapsed(true);
            setIsRightSidebarCollapsed(true);
        }
    }, [setIsLeftSidebarCollapsed, setIsRightSidebarCollapsed]);

    // 30-second upsell timer for free plan users (Once per day)
    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;

        if (currentUser.planType !== 'pro') {
            const lastShownDate = localStorage.getItem('last_upsell_date');
            const today = new Date().toDateString();

            if (lastShownDate !== today) {
                const timer = setTimeout(() => {
                    localStorage.setItem('last_upsell_date', today);
                    setUpgradeReason('study_upsell');
                    setShowUpgradeModal(true);
                }, 30000);

                return () => clearTimeout(timer);
            }
        }
    }, [isAuthenticated, currentUser, setUpgradeReason, setShowUpgradeModal]);

    // Automatically start studying when authenticated and component mounts
    useEffect(() => {
        if (isAuthenticated && !activeToken && !isLoading && !fetchError) {
            fetchTokenAndStart();
        }
    }, [isAuthenticated, activeToken, isLoading, fetchError, fetchTokenAndStart]);

    // Listen for Messages from Lucid
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'LUCID_READY') {
                setIsLucidReady(true);
            } else if (event.data?.type === 'QUOTA_EXCEEDED') {
                setUpgradeReason('limit_reached');
                if (event.data?.message) {
                    setCustomUpgradeMessage(event.data.message);
                } else {
                    setCustomUpgradeMessage(null);
                }
                setShowUpgradeModal(true);
            } else if (event.data?.type === 'PRO_FEATURE_REQUIRED') {
                setUpgradeReason('study_upsell');
                setCustomUpgradeMessage(null);
                setShowUpgradeModal(true);
            } else if (event.data?.type === 'DETAILED_MODE_CHANGE') {
                setIsLucidDetailedMode(event.data.isDetailedMode);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage, setIsLucidDetailedMode]);

    // Send token to Lucid via postMessage when both are ready
    useEffect(() => {
        if (isLucidReady && activeToken && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
                { type: 'AUTH_TOKEN', token: activeToken },
                '*'
            );
        }
    }, [isLucidReady, activeToken]);

    // Reset detailed mode state when unmounting the study page
    useEffect(() => {
        return () => {
            setIsLucidDetailedMode(false);
        };
    }, [setIsLucidDetailedMode]);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                <div className="max-w-md w-full space-y-8">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-reddit-orange/10 rounded-full flex items-center justify-center text-reddit-orange">
                            <GraduationCap size={40} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-reddit-text">Please Log In to Study</h1>
                        <p className="text-reddit-textMuted leading-relaxed">You need to be authenticated to access your personalized study engine.</p>
                    </div>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Log In / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    if (fetchError && !activeToken) {
        const isRateLimited = retryAfter !== null;
        const minutes = Math.floor(retryCountdown / 60);
        const seconds = retryCountdown % 60;

        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                <div className="bg-reddit-card p-8 rounded-2xl border border-reddit-border max-w-md w-full">
                    <h2 className="text-xl font-bold text-white mb-2">
                        {isRateLimited ? 'Too Many Requests' : 'Connection Issue'}
                    </h2>
                    <p className="text-reddit-textMuted mb-4">
                        {isRateLimited
                            ? "You've made too many requests. Please wait a moment before trying again."
                            : "We couldn't connect to the Study Hub servers. The server might be temporarily overloaded."
                        }
                    </p>
                    {isRateLimited && retryCountdown > 0 && (
                        <div className="mb-4 py-3 px-4 bg-reddit-orange/10 border border-reddit-orange/20 rounded-xl">
                            <p className="text-reddit-orange text-sm font-semibold">
                                Try again in {minutes > 0 ? `${minutes}m ` : ''}{seconds.toString().padStart(2, '0')}s
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setFetchError(false);
                            setRetryAfter(null);
                            fetchTokenAndStart();
                        }}
                        disabled={isRateLimited && retryCountdown > 0}
                        className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                            isRateLimited && retryCountdown > 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-200 text-black'
                        }`}
                    >
                        <RefreshCw size={18} />
                        {isRateLimited && retryCountdown > 0 ? 'Please Wait...' : 'Try Again'}
                    </button>
                </div>
            </div>
        );
    }

    // Block loading until we have a valid token to prevent redirect loops in production
    if (isLoading || !activeToken) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-reddit-bg z-10">
                <Loader2 className="animate-spin text-reddit-orange" size={48} />
            </div>
        );
    }
    return (
        <div className="w-full flex-1 bg-reddit-bg overflow-hidden flex flex-col relative">
            <SEO 
                title="Lucid" 
                description="Enter your personalized study focus mode with Studly's AI-powered learning engine."
                canonical="/study"
            />
            <iframe 
                ref={iframeRef}
                src={`${LUCID_URL}?token=${activeToken}`}
                className="w-full flex-1 border-none"
                title="Study App"
                allow="clipboard-read; clipboard-write"
            />
        </div>
    );
};

export default Study;
