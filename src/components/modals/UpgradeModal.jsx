import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Sparkles, Check, Loader2 } from 'lucide-react';
import { initializePayment } from '../../api/billing';
import { toast } from 'sonner';

const UpgradeModal = () => {
  const { showUpgradeModal, closeUpgradeModal, upgradeReason } = useUI();
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
    "Upload Notes (PDF, PPTX, Images, Audio)",
    "Personalized AI Study Tutor Chat",
    "Generate Smart Quizzes & Exercises",
    "Create Dynamic Study Flashcards",
    "Discover Topic-Based YouTube Videos",
    "Detailed AI Explanations & Deep Dives"
  ];

  const isLimitReached = upgradeReason === 'limit_reached';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative bg-reddit-card w-full max-w-2xl rounded-2xl overflow-hidden border border-reddit-border animate-in fade-in zoom-in duration-300 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background - Simplified */}
        <div className="absolute top-0 left-0 w-full h-24 bg-reddit-orange/5 border-b border-reddit-orange/10" />
        
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-reddit-bg text-reddit-textMuted hover:text-white hover:bg-reddit-dark transition-all"
        >
          <X size={18} />
        </button>

        <div className="relative p-6 sm:p-10 pt-12 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-reddit-orange to-orange-500 rounded-2xl flex items-center justify-center transform rotate-3">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white px-4">
              {isLimitReached ? "Daily Limit Reached" : "Upgrade to Premium"}
            </h2>
            <p className="text-reddit-textMuted text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
              {isLimitReached 
                ? "You've hit your free daily limit! Upgrade now to get 10 uploads per day and limitless AI power."
                : "Unlock limitless study power and accelerate your learning with Studly Premium."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Pricing */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-reddit-bg rounded-xl p-6 border border-reddit-border/50 relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold flex items-center gap-2">
                    Monthly Plan 
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-reddit-orange/20 text-reddit-orange px-2 py-0.5 rounded">Most Popular</span>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-white">₦500</span>
                  <span className="text-reddit-textMuted text-sm">/ 1st month</span>
                </div>
                <p className="text-reddit-textMuted text-xs mt-2 italic">Then ₦1500/month after</p>
                
                <div className="mt-8 pt-6 border-t border-reddit-border/50">
                   <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-reddit-orange to-orange-500 hover:from-orange-500 hover:to-reddit-orange text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" /> Processing...
                      </span>
                    ) : (
                      "Join Premium Now"
                    )}
                  </button>
                  <p className="text-center text-[10px] text-reddit-textMuted mt-3 opacity-60">
                    Secure checkout by Paystack
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Features */}
            <div className="lg:col-span-7">
              <div className="bg-reddit-bg/30 rounded-xl p-6 border border-reddit-border/30 h-full">
                <p className="text-sm font-semibold text-white mb-6 uppercase tracking-wider opacity-80">Premium Benefits:</p>
                <div className="grid grid-cols-1 gap-y-5">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 text-reddit-text text-sm sm:text-[15px]">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={14} className="text-green-500" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
