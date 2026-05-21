import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, CreditCard, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ManagePlanModal = () => {
  const { showManagePlanModal, setShowManagePlanModal } = useUI();
  const { updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  if (!showManagePlanModal) return null;

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await axios.post('/billing/subscription/cancel', {}, { withCredentials: true });
      
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
        className="relative bg-reddit-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-reddit-border animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-reddit-border flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ShieldCheck className="text-indigo-400" size={24} />
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
          <div className="bg-reddit-bg rounded-xl p-4 border border-reddit-border/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-reddit-textMuted text-xs uppercase font-bold tracking-wider mb-1">Current Plan</p>
                <h3 className="text-white text-xl font-bold">Pro Subscription</h3>
              </div>
              <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Active</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-reddit-text text-sm">
                <CreditCard size={16} className="text-reddit-textMuted" />
                <span>₦1,500 / month</span>
              </div>
              <div className="flex items-center gap-2 text-reddit-text text-sm">
                <Calendar size={16} className="text-reddit-textMuted" />
                <span>Next billing date: In 30 days</span>
              </div>
            </div>
          </div>

          {!showConfirmCancel ? (
            <div className="space-y-4">
              <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/20 flex gap-3">
                <AlertCircle className="text-amber-500 flex-shrink-0" size={20} />
                <p className="text-reddit-text text-xs leading-relaxed">
                  Canceling will stop your recurring payments. You'll keep your premium access until the end of the current billing cycle.
                </p>
              </div>
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition-colors text-sm"
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <p className="text-white font-bold text-center">Are you absolutely sure?</p>
              <p className="text-reddit-textMuted text-center text-sm px-4">
                You will lose access to all premium study tools once your period ends.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-reddit-bg text-white font-bold hover:bg-reddit-card transition-colors text-sm"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
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
