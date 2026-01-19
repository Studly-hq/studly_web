import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within UIProvider");
    }
    return context;
};

export const UIProvider = ({ children }) => {
    // Modal States
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Loading Bar Logic
    const [loadingProgress, setLoadingProgress] = useState(0);
    const loadingInterval = useRef(null);

    const startLoading = useCallback(() => {
        setLoadingProgress(30);
        if (loadingInterval.current) clearInterval(loadingInterval.current);
        loadingInterval.current = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 500);
    }, []);

    const finishLoading = useCallback(() => {
        if (loadingInterval.current) clearInterval(loadingInterval.current);
        setLoadingProgress(100);
        setTimeout(() => {
            setLoadingProgress(0);
        }, 500);
    }, []);

    // Action Replay/Persistence for Auth
    const [pendingAction, setPendingAction] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const value = React.useMemo(() => ({
        showAuthModal,
        setShowAuthModal,
        showCreatePostModal,
        setShowCreatePostModal,
        showComments,
        setShowComments,
        selectedPost,
        setSelectedPost,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        loadingProgress,
        setLoadingProgress,
        startLoading,
        finishLoading,
        pendingAction,
        setPendingAction,
        scrollPosition,
        setScrollPosition
    }), [
        showAuthModal,
        showCreatePostModal,
        showComments,
        selectedPost,
        isMobileMenuOpen,
        loadingProgress,
        startLoading,
        finishLoading,
        pendingAction,
        scrollPosition
    ]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
