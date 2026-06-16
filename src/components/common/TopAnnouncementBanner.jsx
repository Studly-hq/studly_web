import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopAnnouncementBanner = () => {
  const { setShowUpgradeModal, setShowAuthModal, setShowManagePlanModal, setPendingAction, setIsUpgradeBannerVisible } = useUI();
  const { isAuthenticated, currentUser } = useAuth();
  const isPro = currentUser?.planType === 'pro';
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const lastShownDate = localStorage.getItem('last_banner_date');
    const today = new Date().toDateString();

    if (isPro) {
      setIsVisible(false);
      setIsUpgradeBannerVisible(false);
      return;
    }

    if (lastShownDate === today) {
      setIsVisible(false);
      setIsUpgradeBannerVisible(false);
    } else {
      localStorage.setItem('last_banner_date', today);
      setIsUpgradeBannerVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsUpgradeBannerVisible(false);
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [setIsUpgradeBannerVisible, isPro]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsUpgradeBannerVisible(false);
  };

  const handleUpgradeClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setPendingAction({ type: 'SHOW_UPGRADE_MODAL' });
      setShowAuthModal(true);
    } else if (isPro) {
      setShowManagePlanModal(true);
    } else {
      setShowUpgradeModal(true);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 32, opacity: 1 }}
          animate={{ height: 32, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-gradient-to-r from-reddit-orange to-yellow-500 text-white w-full flex items-center justify-between px-3 shrink-0 z-[100] overflow-hidden"
        >
          {/* Mobile layout */}
          <div className="flex sm:hidden items-center gap-2 flex-1 min-w-0">
            <span className="text-[11px] font-semibold truncate">Upgrade to Pro</span>
            <button
              onClick={handleUpgradeClick}
              className="flex items-center gap-0.5 bg-white/20 hover:bg-white/30 transition-colors text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            >
              Upgrade <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Desktop layout */}
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-center min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[13px] font-medium truncate">
              Upgrade to pro for just ₦500 and access unlimited studying power
            </span>
            <button
              onClick={handleUpgradeClick}
              className="font-bold text-[13px] underline decoration-white/50 underline-offset-2 shrink-0 hover:decoration-white transition-all"
            >
              Upgrade now
            </button>
          </div>

          {/* Dismiss button — both layouts */}
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 rounded hover:bg-white/20 transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopAnnouncementBanner;
