import React, { useEffect } from 'react';
import Feed from '../components/feed/Feed';
import { useFeed } from '../context/FeedContext';
import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';
import FeedComposer from '../components/feed/FeedComposer';
import logo from '../assets/logo.png';

const PostsPage = () => {
    const { fetchFeedPosts } = useFeed();
    const { isAuthenticated, isAuthLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeedPosts({ forceLoading: true, isPersonalized: false }); // Public posts
    }, [fetchFeedPosts]);

    // Automatically redirect to /feed if user logs in while on this page
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            navigate('/posts', { replace: true });
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    return (
        <div>
            {/* Mobile Header */}
            <div className="xl:hidden sticky top-0 z-40 bg-reddit-bg/95 backdrop-blur-sm border-b border-reddit-border px-4 py-3 flex items-center gap-1.5">
                <img src={logo} alt="Studly" className="w-8 h-8 object-contain" />
                <span className="text-reddit-text text-xl font-righteous tracking-wide">
                    Studly
                </span>
            </div>

            <FeedComposer />

            <Feed />
        </div>
    );
};

export default PostsPage;
