import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { getStudyToken } from '../api/profile';

// Lucid app URL - update this when deploying
const LUCID_URL = import.meta.env.VITE_LUCID_URL || 'https://lucid.usestudly.com';

const Study = () => {
    const { isAuthenticated } = useAuth();
    const { setShowAuthModal } = useUI();
    const [isLoading, setIsLoading] = useState(false);
    const [cachedStudyToken, setCachedStudyToken] = useState({ token: null, timestamp: 0 });
    const [isStarted, setIsStarted] = useState(false);
    const [activeToken, setActiveToken] = useState(null);

    // ... (prefetch logic remains the same)
    useEffect(() => {
        const prefetchToken = async () => {
            if (!isAuthenticated || (cachedStudyToken.token && Date.now() - cachedStudyToken.timestamp < 45000)) return;
            try {
                const token = await getStudyToken();
                setCachedStudyToken({ token, timestamp: Date.now() });
            } catch (error) {
                console.error('Study token prefetch failed:', error);
            }
        };

        if (isAuthenticated) {
            prefetchToken();
        }
    }, [isAuthenticated, cachedStudyToken]);

    const handleStartStudying = async () => {
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
            }

            setActiveToken(token);
            setIsStarted(true);
        } catch (error) {
            console.error('Failed to get study token:', error);
            try {
                const freshToken = await getStudyToken();
                setActiveToken(freshToken);
                setIsStarted(true);
            } catch (innerError) {
                console.error('Final attempt failed:', innerError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isStarted && activeToken) {
        return (
            <div className="w-full h-full bg-reddit-bg overflow-hidden flex flex-col">
                <iframe 
                    src={`${LUCID_URL}?token=${activeToken}`}
                    className="w-full flex-1 border-none shadow-premium"
                    title="Study App"
                    allow="clipboard-read; clipboard-write"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-reddit-orange/10 rounded-full flex items-center justify-center text-reddit-orange">
                        <GraduationCap size={40} />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-reddit-text">
                        Notes that teach back
                    </h1>
                    <p className="text-reddit-textMuted text-lg leading-relaxed">
                        Get topic-by-topic explanations, quizzes and flashcards, with instant video support all in one continuous flow.
                    </p>
                </div>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartStudying}
                    disabled={isLoading}
                    className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            <span>Starting Engine...</span>
                        </>
                    ) : (
                        <span>Start Studying</span>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Study;
