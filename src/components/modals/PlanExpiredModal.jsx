import React from 'react';
import { useUI } from '../../context/UIContext';
import { X, ArrowRight, ShieldAlert } from 'lucide-react';

const PlanExpiredModal = () => {
  const { showPlanExpiredModal, setShowPlanExpiredModal, openUpgradeModal } = useUI();

  if (!showPlanExpiredModal) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div 
        className="relative bg-reddit-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-reddit-border animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/10 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={() => setShowPlanExpiredModal(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-reddit-bg text-reddit-textMuted hover:text-white hover:bg-reddit-cardHover transition-all"
        >
          <X size={18} />
        </button>

        <div className="relative p-8 text-center pt-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center animate-pulse">
              <ShieldAlert className="text-amber-500 w-10 h-10" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">Your Pro Access Expired</h2>
          <p className="text-reddit-textMuted text-sm leading-relaxed mb-8 px-2">
            Your 30 days of Studly Premium have come to an end. Upgrade again to regain access to limitless uploads, smart quizzes, and your personalized AI study tutor.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setShowPlanExpiredModal(false);
                openUpgradeModal();
              }}
              className="w-full py-4 bg-gradient-to-r from-reddit-orange to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-reddit-orange/20 transition-all flex items-center justify-center gap-2 group"
            >
              Renew Premium Access
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setShowPlanExpiredModal(false)}
              className="w-full py-3 text-reddit-textMuted hover:text-white text-sm font-medium transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiredModal;
