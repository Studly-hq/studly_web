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
    // Sidebar Collapse States (with persistence)
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('isLeftSidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('isRightSidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Update localStorage when states change
    React.useEffect(() => {
        localStorage.setItem('isLeftSidebarCollapsed', JSON.stringify(isLeftSidebarCollapsed));
    }, [isLeftSidebarCollapsed]);

    React.useEffect(() => {
        localStorage.setItem('isRightSidebarCollapsed', JSON.stringify(isRightSidebarCollapsed));
    }, [isRightSidebarCollapsed]);

    // Modal States
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState(null); // 'limit_reached', 'manual', etc.
    const [showManagePlanModal, setShowManagePlanModal] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    const openUpgradeModal = useCallback((reason = 'manual') => {
        setUpgradeReason(reason);
        setShowUpgradeModal(true);
    }, []);

    const closeUpgradeModal = useCallback(() => {
        setShowUpgradeModal(false);
        setTimeout(() => setUpgradeReason(null), 300); // Clear after animation
    }, []);

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
        showUpgradeModal,
        setShowUpgradeModal,
        upgradeReason,
        setUpgradeReason,
        openUpgradeModal,
        closeUpgradeModal,
        showManagePlanModal,
        setShowManagePlanModal,
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
        setScrollPosition,
        isLeftSidebarCollapsed,
        setIsLeftSidebarCollapsed,
        isRightSidebarCollapsed,
        setIsRightSidebarCollapsed
    }), [
        showAuthModal,
        showCreatePostModal,
        showUpgradeModal,
        upgradeReason,
        openUpgradeModal,
        closeUpgradeModal,
        showManagePlanModal,
        showComments,
        selectedPost,
        isMobileMenuOpen,
        loadingProgress,
        startLoading,
        finishLoading,
        pendingAction,
        scrollPosition,
        isLeftSidebarCollapsed,
        isRightSidebarCollapsed
    ]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
