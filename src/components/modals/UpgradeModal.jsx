import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, Check, Loader2 } from 'lucide-react';
import { initializePayment } from '../../api/billing';
import { toast } from 'sonner';

const UpgradeModal = () => {
  const { showUpgradeModal, setShowUpgradeModal, upgradeReason } = useUI();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!showUpgradeModal) return null;

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const data = await initializePayment();
      
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error("Failed to generate payment link.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred while initializing payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Unlimited Note Uploads (PDF, PPTX, Images, Audio)",
    "Personalized AI Study Tutor Chat",
    "Generate Smart Quizzes & Exercises",
    "Create Dynamic Study Flashcards",
    "Discover Topic-Based YouTube Videos",
    "Detailed AI Explanations & Deep Dives"
  ];

  const hasHadSubscription = !!currentUser?.subscriptionStatus;
  const isLimitHit = upgradeReason === 'limit_reached';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setShowUpgradeModal(false)}
    >
      <div
        className="relative bg-reddit-card w-full max-w-2xl rounded-2xl shadow-2xl border border-reddit-border animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-br from-reddit-orange/20 to-reddit-orange/5 opacity-50 pointer-events-none rounded-t-2xl" />

        {/* Close Button */}
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-reddit-bg/80 text-reddit-textMuted hover:text-white hover:bg-reddit-dark hover:rotate-90 transition-all"
        >
          <X size={18} />
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto flex-1 p-6 sm:p-10 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-reddit-orange to-orange-400 rounded-2xl shadow-lg shadow-reddit-orange/30 flex items-center justify-center transform rotate-3">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2 mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Upgrade to Premium
            </h2>
            <p className="text-reddit-textMuted text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              {isLimitHit 
                ? "You've used your 2 free notes. Upgrade to Premium to upload unlimited notes and unlock the full AI study experience." 
                : "Upgrade to Premium to upload unlimited notes and unlock the full AI study experience."}
            </p>
          </div>

          {/* Grid: pricing | features on desktop, stacked on mobile */}
          {/* Mobile order: pricing → button → features */}
          {/* Desktop order: [pricing | features] then button full-width below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
            {/* Pricing Box — always first */}
            <div className="order-1 bg-reddit-bg rounded-xl p-5 border border-reddit-border/50">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-white font-semibold">Monthly Plan</span>
              </div>
              
              {hasHadSubscription ? (
                <>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold text-white">₦1500</span>
                    <span className="text-reddit-textMuted text-sm">/month</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold text-white">₦500</span>
                    <span className="text-reddit-textMuted text-sm">for the first month</span>
                  </div>
                  <p className="text-reddit-textMuted text-xs mt-2 italic">Then ₦1500/month after</p>
                </>
              )}

              {/* Mini divider */}
              <div className="border-t border-reddit-border/30 my-4" />

              <p className="text-xs text-reddit-textMuted leading-relaxed">
                Cancel anytime. No hidden fees. Billed monthly.
              </p>
            </div>

            {/* CTA Button — second on mobile, third (full-width) on desktop */}
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="order-2 md:order-3 md:col-span-2 w-full bg-gradient-to-r from-reddit-orange to-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" /> Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Join Premium Now
                </span>
              )}
            </button>

            {/* Features — third on mobile, second on desktop */}
            <div className="order-3 md:order-2 flex flex-col justify-center">
              <p className="text-sm font-semibold text-white mb-3">Everything you get:</p>
              <div className="space-y-2.5">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-reddit-text text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-green-500" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-reddit-textMuted mt-2 opacity-70">
            Secure checkout powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
