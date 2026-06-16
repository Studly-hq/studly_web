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
    const { setShowAuthModal, setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage, setIsLeftSidebarCollapsed, setIsRightSidebarCollapsed } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
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
        } catch (error) {
            console.error('Failed to get study token:', error);
            setFetchError(true);
            // Don't retry immediately on 429 — it will just consume more rate-limit quota
            // and cause a cascade of failures. Let the user try again manually.
            if (error.response?.status !== 429) {
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
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [setShowUpgradeModal, setUpgradeReason, setCustomUpgradeMessage]);

    // Send token to Lucid via postMessage when both are ready
    useEffect(() => {
        if (isLucidReady && activeToken && iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(
                { type: 'AUTH_TOKEN', token: activeToken },
                '*'
            );
        }
    }, [isLucidReady, activeToken]);

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
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
                <div className="bg-reddit-card p-8 rounded-2xl border border-reddit-border max-w-md w-full">
                    <h2 className="text-xl font-bold text-white mb-2">Connection Issue</h2>
                    <p className="text-reddit-textMuted mb-6">
                        We couldn't connect to the Study Hub servers. The server might be temporarily overloaded.
                    </p>
                    <button
                        onClick={() => {
                            setFetchError(false);
                            fetchTokenAndStart();
                        }}
                        className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Try Again
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
        <div className="w-full h-full bg-reddit-bg overflow-hidden flex flex-col relative">
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
