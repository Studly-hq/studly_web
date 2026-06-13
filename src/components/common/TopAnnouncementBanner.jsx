import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Sparkles, ArrowRight } from 'lucide-react';

const TopAnnouncementBanner = () => {
  const { setShowUpgradeModal } = useUI();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem('pro_banner_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    localStorage.setItem('pro_banner_dismissed', 'true');
    setIsVisible(false);
  };

  const handleUpgradeClick = (e) => {
    e.stopPropagation();
    setShowUpgradeModal(true);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-reddit-orange to-yellow-500 text-white w-full h-[32px] flex items-center justify-between px-3 shrink-0 z-[100]">
      
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
    </div>
  );
};

export default TopAnnouncementBanner;
