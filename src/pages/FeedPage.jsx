import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Feed from '../components/feed/Feed';
import FeedComposer from '../components/feed/FeedComposer';
import { useFeed } from '../context/FeedContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// Skeleton loader for feed
const FeedSkeleton = () => (
    <div className="space-y-4 p-4">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-reddit-card rounded-lg p-4 border border-reddit-border animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-reddit-border" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-reddit-border rounded" />
                        <div className="h-3 w-24 bg-reddit-border rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-reddit-border rounded" />
                    <div className="h-4 w-3/4 bg-reddit-border rounded" />
                </div>
            </div>
        ))}
    </div>
);

const FeedPage = () => {
    const navigate = useNavigate();
    const { initializeFeed, loadingState } = useFeed();
    const { isAuthLoading } = useAuth();

    useEffect(() => {
        // Wait for auth state to resolve before initializing
        if (isAuthLoading) {
            return;
        }

        // Only initialize if we haven't started yet
        if (loadingState === 'idle') {
            initializeFeed();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoading, loadingState]); // initializeFeed is stable via useCallback, but including it causes re-renders

    // Loading gate: Show skeleton until auth AND feed are ready
    if (isAuthLoading || loadingState === 'idle' || loadingState === 'loading') {
        return (
            <div>
                {/* Mobile Header */}
                <div className="xl:hidden sticky top-0 z-40 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <img src={logo} alt="Studly" className="w-8 h-8 object-contain" />
                    </div>
                    <button
                        onClick={() => navigate('/explore')}
                        className="p-2 rounded-full hover:bg-reddit-cardHover transition-colors text-reddit-textMuted hover:text-reddit-orange"
                    >
                        <Compass size={22} />
                    </button>
                </div>
                <FeedSkeleton />
            </div>
        );
    }

    return (
        <div>
            {/* Mobile Header */}
            <div className="xl:hidden sticky top-0 z-40 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <img src={logo} alt="Studly" className="w-8 h-8 object-contain" />
                </div>
                <button
                    onClick={() => navigate('/explore')}
                    className="p-2 rounded-full hover:bg-reddit-cardHover transition-colors text-reddit-textMuted hover:text-reddit-orange"
                >
                    <Compass size={22} />
                </button>
            </div>

            <FeedComposer />
            <Feed />
        </div>
    );
};

export default FeedPage;
