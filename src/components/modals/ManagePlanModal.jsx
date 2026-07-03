import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, CreditCard, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import client from '../../api/client';

const ManagePlanModal = () => {
  const { showManagePlanModal, setShowManagePlanModal } = useUI();
  const { updateUser, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (!showManagePlanModal) return null;

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await client.post('/billing/subscription/cancel');
      
      // Update local state
      if (updateUser) {
        await updateUser({ plan_type: 'free' });
      }
      
      toast.success("Subscription canceled successfully.");
      setShowManagePlanModal(false);
      setShowConfirmCancel(false);
    } catch (error) {
      toast.error("Failed to cancel subscription. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="relative bg-reddit-card w-full max-w-md rounded-2xl border border-reddit-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-reddit-border flex justify-between items-center bg-reddit-orange/5">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ShieldCheck className="text-reddit-orange" size={24} />
            Manage Subscription
          </div>
          <button
            onClick={() => setShowManagePlanModal(false)}
            className="text-reddit-textMuted hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Info Card */}
          <div className="bg-reddit-bg rounded-xl p-5 border border-reddit-border/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-reddit-textMuted text-xs uppercase font-bold tracking-wider mb-1">Current Plan</p>
                <h3 className="text-white text-xl font-bold tracking-tight">Pro Subscription</h3>
              </div>
              <span className="bg-reddit-orange/10 text-reddit-orange text-[10px] font-bold px-2 py-1 rounded-full uppercase">Active</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-reddit-text text-sm">
                <CreditCard size={16} className="text-reddit-textMuted" />
                <span>₦1,500 / month</span>
              </div>
              <div className="flex items-center gap-2 text-reddit-text text-sm">
                <Calendar size={16} className="text-reddit-textMuted" />
                <span>Next billing date: {currentUser?.currentPeriodEnd ? new Date(currentUser.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          {!showConfirmCancel ? (
            <div className="space-y-4">
              <div className="bg-reddit-bg rounded-xl p-4 border border-reddit-border flex gap-3">
                <AlertCircle className="text-reddit-orange flex-shrink-0" size={20} />
                <p className="text-reddit-text text-xs leading-relaxed">
                  Canceling will stop your recurring payments. You'll keep your premium access until the end of the current billing cycle.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="w-full py-3 rounded-xl border border-reddit-border text-reddit-text hover:bg-reddit-cardHover hover:text-red-400 transition-colors text-sm font-medium"
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-white font-bold text-center">Are you absolutely sure?</p>
              <p className="text-reddit-textMuted text-center text-sm px-4">
                You will lose access to all premium study tools once your period ends.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl border border-reddit-border text-reddit-text font-medium hover:bg-reddit-cardHover transition-colors text-sm"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-reddit-orange text-white font-medium hover:bg-reddit-orange/90 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Yes, Cancel"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-reddit-bg/50 text-center">
            <p className="text-reddit-textMuted text-[10px]">
                Subscription managed via Studly & Paystack Secured Payments.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ManagePlanModal;
