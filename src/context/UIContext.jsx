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
    // Modal States — declared BEFORE any effect that references them
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    // Paywall state. Kept under the original `upgrade` names so existing call
    // sites keep working, but the modal itself is now a small, reason aware
    // interstitial whose only job is to route people to /billing.
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState(null);
    const [customUpgradeMessage, setCustomUpgradeMessage] = useState(null);
    // Giveaway Win Modal
    const [showGiveawayWinModal, setShowGiveawayWinModal] = useState(false);
    const [giveawayWinData, setGiveawayWinData] = useState(null);
    const [showComments, setShowComments] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isUpgradeBannerVisible, setIsUpgradeBannerVisible] = useState(false);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lucid State
    const [isLucidDetailedMode, setIsLucidDetailedMode] = useState(false);

    /**
     * Single entry point for every "you need Pro" moment.
     * `reason` is forwarded to /billing so the page can explain itself.
     */
    const openPaywall = useCallback((reason = 'generic', message = null) => {
        setUpgradeReason(reason);
        setCustomUpgradeMessage(message);
        setShowUpgradeModal(true);
    }, []);

    const closePaywall = useCallback(() => {
        setShowUpgradeModal(false);
    }, []);

    // Giveaway Win Modal
    const openGiveawayWinModal = useCallback((data) => {
        setGiveawayWinData(data);
        setShowGiveawayWinModal(true);
    }, []);

    const closeGiveawayWinModal = useCallback(() => {
        setShowGiveawayWinModal(false);
        setGiveawayWinData(null);
    }, []);

    // Listen for giveaway win event
    useEffect(() => {
        const handleGiveawayWin = (event) => {
            const { ticket_number, login_position, message } = event.detail || {};
            if (ticket_number) {
                openGiveawayWinModal({ ticket_number, login_position, message });
            }
        };

        window.addEventListener('giveaway:win', handleGiveawayWin);
        return () => window.removeEventListener('giveaway:win', handleGiveawayWin);
    }, [openGiveawayWinModal]);

    // Listen for the plan:expired event fired by AuthContext when a
    // subscription_expired WebSocket event is received. Using a DOM event
    // avoids a circular context dependency between AuthContext and UIContext.
    useEffect(() => {
        const handlePlanExpired = () => {
            openPaywall('plan_expired');
        };

        window.addEventListener('plan:expired', handlePlanExpired);
        return () => window.removeEventListener('plan:expired', handlePlanExpired);
    }, [openPaywall]);

    // Listen for custom paywall triggers (e.g., from StreakLostModal)
    useEffect(() => {
        const handleOpenPaywall = (event) => {
            const { reason, message } = event.detail || {};
            openPaywall(reason || 'generic', message);
        };

        window.addEventListener('open-paywall', handleOpenPaywall);
        return () => window.removeEventListener('open-paywall', handleOpenPaywall);
    }, [openPaywall]);

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
        openPaywall,
        closePaywall,
        upgradeReason,
        setUpgradeReason,
        customUpgradeMessage,
        setCustomUpgradeMessage,
        // Giveaway Win Modal
        showGiveawayWinModal,
        setShowGiveawayWinModal,
        openGiveawayWinModal,
        closeGiveawayWinModal,
        giveawayWinData,
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
        isUpgradeBannerVisible,
        setIsUpgradeBannerVisible,
        isLucidDetailedMode,
        setIsLucidDetailedMode
    }), [
        showAuthModal,
        showCreatePostModal,
        showUpgradeModal,
        openPaywall,
        closePaywall,
        upgradeReason,
        customUpgradeMessage,
        // Giveaway Win Modal
        showGiveawayWinModal,
        openGiveawayWinModal,
        closeGiveawayWinModal,
        giveawayWinData,
        showComments,
        selectedPost,
        isMobileMenuOpen,
        loadingProgress,
        startLoading,
        finishLoading,
        pendingAction,
        scrollPosition,
        isUpgradeBannerVisible,
        isLucidDetailedMode
    ]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
