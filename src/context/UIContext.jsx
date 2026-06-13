import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

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

    // Modal States — declared BEFORE any effect that references them
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState(null);
    const [showManagePlanModal, setShowManagePlanModal] = useState(false);
    const [showComments, setShowComments] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isUpgradeBannerVisible, setIsUpgradeBannerVisible] = useState(false);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Update localStorage when sidebar states change
    useEffect(() => {
        localStorage.setItem('isLeftSidebarCollapsed', JSON.stringify(isLeftSidebarCollapsed));
    }, [isLeftSidebarCollapsed]);

    useEffect(() => {
        localStorage.setItem('isRightSidebarCollapsed', JSON.stringify(isRightSidebarCollapsed));
    }, [isRightSidebarCollapsed]);

    // Listen for the plan:expired event fired by AuthContext when a
    // subscription_expired WebSocket event is received. Using a DOM event
    // avoids a circular context dependency between AuthContext and UIContext.
    useEffect(() => {
        const handlePlanExpired = () => {
            setUpgradeReason('plan_expired');
            setShowUpgradeModal(true);
        };

        window.addEventListener('plan:expired', handlePlanExpired);
        return () => window.removeEventListener('plan:expired', handlePlanExpired);
    }, []); // stable: setters from useState never change identity

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
        setIsRightSidebarCollapsed,
        isUpgradeBannerVisible,
        setIsUpgradeBannerVisible
    }), [
        showAuthModal,
        showCreatePostModal,
        showUpgradeModal,
        upgradeReason,
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
        isRightSidebarCollapsed,
        isUpgradeBannerVisible
    ]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
