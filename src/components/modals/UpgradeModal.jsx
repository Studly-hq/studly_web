import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { X, Sparkles, Check, Loader2 } from 'lucide-react';
import { initializePayment } from '../../api/billing';
import { toast } from 'sonner';

const UpgradeModal = () => {
  const { showUpgradeModal, setShowUpgradeModal } = useUI();
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative bg-reddit-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-reddit-border animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-reddit-orange/20 to-reddit-orange/5 opacity-50" />
        
        {/* Close Button */}
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-reddit-bg/80 text-reddit-textMuted hover:text-white hover:bg-reddit-dark hover:rotate-90 transition-all"
        >
          <X size={18} />
        </button>

        <div className="relative p-8 px-6 sm:px-10 pt-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-reddit-orange to-orange-400 rounded-2xl shadow-lg shadow-reddit-orange/30 flex items-center justify-center transform rotate-3">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </div>

          <div className="text-center space-y-3 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              Upgrade to Premium
            </h2>
            <p className="text-reddit-textMuted text-sm sm:text-base leading-relaxed px-2">
              You've hit your free trial limit! Unlock limitless study power and accelerate your learning with Premium.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-reddit-bg rounded-xl p-5 mb-8 border border-reddit-border/50 relative overflow-hidden group">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-semibold flex items-center gap-2">
                Monthly Plan 
                <span className="text-[10px] uppercase font-bold bg-reddit-orange/20 text-reddit-orange px-2 py-0.5 rounded flex-shrink-0">Most Popular</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white">₦500</span>
              <span className="text-reddit-textMuted text-sm">for the first month</span>
            </div>
            <p className="text-reddit-textMuted text-xs mt-1 italic">Then ₦1500/month after</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm font-semibold text-white mb-2">Everything you get:</p>
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-reddit-text text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-green-500" />
                </div>
                {feature}
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full relative overflow-hidden group bg-gradient-to-r from-reddit-orange to-orange-500 hover:from-orange-500 hover:to-reddit-orange text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
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
            {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
          </button>
          
          <p className="text-center text-xs text-reddit-textMuted mt-4 opacity-70">
            Secure checkout powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
