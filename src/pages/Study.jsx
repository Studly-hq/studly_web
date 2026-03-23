import { useState, useEffect, useCallback } from 'react';
import { Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getStudyToken } from '../api/profile';
import SEO from '../components/common/SEO';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';

const Study = () => {
    const { isAuthenticated } = useAuth();
    const { setShowAuthModal } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });
    const [activeToken, setActiveToken] = useState(null);

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
            try {
                const freshToken = await getStudyToken();
                setActiveToken(freshToken);
            } catch (innerError) {
                console.error('Final attempt failed:', innerError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, cachedStudyToken, setShowAuthModal]);

    // Automatically start studying when authenticated and component mounts
    useEffect(() => {
        if (isAuthenticated && !activeToken && !isLoading) {
            fetchTokenAndStart();
        }
    }, [isAuthenticated, activeToken, isLoading, fetchTokenAndStart]);

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

    if (isLoading || !activeToken) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
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
            {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-reddit-bg z-10">
                    <Loader2 className="animate-spin text-reddit-orange" size={48} />
                </div>
            )}
            <iframe 
                src={`${LUCID_URL}?token=${activeToken}`}
                className={`w-full flex-1 border-none transition-opacity duration-300 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                title="Study App"
                allow="clipboard-read; clipboard-write"
                onLoad={() => setIframeLoading(false)}
            />
        </div>
    );
};

export default Study;
