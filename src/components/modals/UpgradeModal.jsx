import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, Check, Loader2, Tag, CheckCircle2 } from 'lucide-react';
import { initializePayment, redeemVoucher } from '../../api/billing';
import { toast } from 'sonner';

const UpgradeModal = () => {
  const { showUpgradeModal, closeUpgradeModal, upgradeReason } = useUI();
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const [isRedeemed, setIsRedeemed] = useState(false);

  if (!showUpgradeModal) return null;

  const handleUpgrade = async () => {
    // If a voucher has been applied, redeem it instead of paying
    if (voucherApplied) {
      try {
        setIsLoading(true);
        const result = await redeemVoucher(voucherCode);
        if (result?.success) {
          setIsRedeemed(true);
          toast.success(result.message || "Welcome to Premium! 🎉");
          if (refetchUser) {
            try { await refetchUser(); } catch (e) {}
          }
          setTimeout(() => {
            closeUpgradeModal();
            setVoucherCode('');
            setVoucherApplied(false);
            setIsRedeemed(false);
          }, 2500);
        }
      } catch (error) {
        const msg = error?.response?.data?.error || "Failed to redeem voucher.";
        toast.error(msg);
        setVoucherApplied(false);
        setVoucherError(msg);
      } finally {
        setIsLoading(false);
      }
      return;
    }

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

  const handleApplyVoucher = async () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) {
      setVoucherError('Please enter a voucher code');
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherError('');

    // We validate on the frontend lightly then let the backend do the real check on redeem
    // For UX, we just mark it as "applied" and show the 0.00 price
    // The real validation happens when they click the button
    try {
      // Quick check: just validate format (6 uppercase letters)
      if (!/^[A-Z]{6}$/.test(code)) {
        setVoucherError('Invalid code format');
        setIsApplyingVoucher(false);
        return;
      }
      setVoucherApplied(true);
      setVoucherError('');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherApplied(false);
    setVoucherCode('');
    setVoucherError('');
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

  // Success state after redeeming
  if (isRedeemed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative bg-reddit-card w-full max-w-md rounded-2xl overflow-hidden border border-reddit-border animate-in fade-in zoom-in duration-300 p-10 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome to Premium!</h2>
            <p className="text-reddit-textMuted">Your voucher has been redeemed successfully. Enjoy 30 days of premium access! 🎉</p>
          </div>
        </div>
      </div>
    );
  }

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

                {/* Price display */}
                <div className="flex items-baseline gap-2 mt-4">
                  {voucherApplied ? (
                    <>
                      <span className="text-4xl font-bold text-green-400">₦0.00</span>
                      <span className="text-reddit-textMuted text-sm line-through">₦500</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-white">₦500</span>
                      <span className="text-reddit-textMuted text-sm">/ 1st month</span>
                    </>
                  )}
                </div>
                {voucherApplied ? (
                  <p className="text-green-400/80 text-xs mt-2 italic flex items-center gap-1">
                    <Check size={12} /> 100% discount applied via voucher
                  </p>
                ) : (
                  <p className="text-reddit-textMuted text-xs mt-2 italic">Then ₦1500/month after</p>
                )}

                {/* Voucher Code Input */}
                <div className="mt-6 pt-5 border-t border-reddit-border/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-reddit-textMuted" />
                    <span className="text-xs text-reddit-textMuted font-medium uppercase tracking-wider">Discount Code</span>
                  </div>
                  
                  {voucherApplied ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-400" />
                        <span className="text-green-400 font-mono font-semibold text-sm">{voucherCode.toUpperCase()}</span>
                      </div>
                      <button
                        onClick={handleRemoveVoucher}
                        className="text-reddit-textMuted hover:text-red-400 transition-colors text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => {
                          setVoucherCode(e.target.value.toUpperCase());
                          setVoucherError('');
                        }}
                        placeholder="Enter code"
                        maxLength={6}
                        className="flex-1 bg-reddit-dark border border-reddit-border/50 rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder:text-reddit-textMuted/50 focus:outline-none focus:border-reddit-orange/50 focus:ring-1 focus:ring-reddit-orange/20 transition-all uppercase tracking-widest"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        disabled={isApplyingVoucher || !voucherCode.trim()}
                        className="px-4 py-2.5 bg-reddit-dark border border-reddit-border/50 rounded-lg text-reddit-textMuted hover:text-white hover:border-reddit-orange/50 transition-all text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isApplyingVoucher ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply"}
                      </button>
                    </div>
                  )}

                  {voucherError && (
                    <p className="text-red-400 text-xs mt-2">{voucherError}</p>
                  )}
                </div>
                
                <div className="mt-6 pt-5 border-t border-reddit-border/50">
                   <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className={`w-full font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
                      voucherApplied
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white'
                        : 'bg-gradient-to-r from-reddit-orange to-orange-500 hover:from-orange-500 hover:to-reddit-orange text-white'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" /> Processing...
                      </span>
                    ) : voucherApplied ? (
                      "Activate Premium — ₦0.00"
                    ) : (
                      "Join Premium Now"
                    )}
                  </button>
                  <p className="text-center text-[10px] text-reddit-textMuted mt-3 opacity-60">
                    {voucherApplied ? "No payment required with voucher" : "Secure checkout by Paystack"}
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
