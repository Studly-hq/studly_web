import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdPromotionWidget = ({ onDismiss, hasActiveCampaigns = false }) => {
  const navigate = useNavigate();

  if (hasActiveCampaigns) {
    // Show performance widget for existing advertisers
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#16181c] rounded-2xl overflow-hidden border border-[#2f3336] relative"
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
        >
          <X size={18} />
        </button>

        <div className="p-4">
          <div className="mb-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-500" />
            </div>
          </div>

          <h3 className="text-white font-bold text-xl mb-2">
            Track Your Performance
          </h3>

          <p className="text-gray-400 text-[15px] leading-relaxed mb-4">
            See how your ads are performing and manage your active campaigns.
          </p>

          <button
            onClick={() => navigate('/ads/dashboard')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-full transition-colors text-[15px]"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  // Show promotion widget for new users
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#16181c] rounded-2xl overflow-hidden border border-[#2f3336] relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
      >
        <X size={18} />
      </button>

      <div className="p-4">
        <div className="mb-3">
          <div className="w-12 h-12 bg-reddit-orange/10 rounded-full flex items-center justify-center">
            <Megaphone size={24} className="text-reddit-orange" />
          </div>
        </div>

        <h3 className="text-white font-bold text-xl mb-2">
          Create ads from ₦500/day
        </h3>

        <p className="text-gray-400 text-[15px] leading-relaxed mb-4">
          Reach potential new students with an ad that lets people discover your content and grow your audience.
        </p>

        <button
          onClick={() => navigate('/ads/create')}
          className="w-full bg-reddit-orange hover:bg-reddit-orange/90 text-white font-bold py-2.5 rounded-full transition-colors text-[15px]"
        >
          Get started
        </button>
      </div>
    </motion.div>
  );
};

export default AdPromotionWidget;
